"""Email Updates Agent for Tailspin Toys.

Fetches PR details via GitHub MCP, generates an engineering
team report, and drafts an email with an inline image placeholder.

Usage:
    # From a PR URL:
    python email_updates_agent.py https://github.com/owner/repo/pull/42

    # From a PR number (uses GITHUB_REPO env or defaults to current repo):
    python email_updates_agent.py 42

    # Attach an image to the most recent draft afterwards:
    python .github/skills/email/email_tool.py attach-image \
      --draft-id <ID> --image-path screenshot.png --content-id pr_overview

Requires:
    - github-copilot-sdk  (pip install github-copilot-sdk)
    - msal, requests      (for email drafting via email_tool.py)
    - GITHUB_PERSONAL_ACCESS_TOKEN env var
"""

from __future__ import annotations

import argparse
import asyncio
import atexit
import os
import re
import signal
import sys

from copilot import CopilotClient
from copilot.generated.session_events import SessionEvent, SessionEventType

# Track client for cleanup on unexpected exit
_active_client: CopilotClient | None = None


def _cleanup():
    """Kill any lingering MCP server processes."""
    import subprocess
    # Kill any orphaned npx/node processes from MCP servers
    subprocess.run(
        ["pkill", "-f", "@github/mcp-server"],
        capture_output=True,
    )


atexit.register(_cleanup)
signal.signal(signal.SIGINT, lambda *_: (sys.exit(0)))
signal.signal(signal.SIGTERM, lambda *_: (sys.exit(0)))

SYSTEM_PROMPT = """You are the Tailspin Toys Engineering Update Agent.

Your job: given a GitHub PR number and repo, fetch its details (title, body,
changed files, commits) using the GitHub MCP tools, then produce a concise
HTML email report for the engineering team.

REPORT FORMAT (HTML):
1. A greeting: "Hi Tailspin Toys Engineering,"
2. A heading with the PR title and number.
3. Immediately after the heading, include EXACTLY ONE image placeholder:
   <img src="cid:pr_overview" alt="PR Overview" width="600" />
   This is where the screenshot will appear once attached. Do NOT add any
   other image tags anywhere else in the report. Only ONE <img> tag total.
4. A "High-Level Summary" section (2-4 bullet points of what changed and why).
5. A "Technical Details" section (key files changed, notable implementation
   choices, any breaking changes or migrations).
6. A sign-off: "Best,\nMarlene Mhangami"

CRITICAL: The entire HTML body must contain exactly ONE <img> tag total — the
hidden placeholder under the heading. No other images anywhere.

Keep the tone professional but warm. No fluff — the audience is engineers.

EMAIL DRAFTING:
You have access to an email skill that can draft emails. Use it to create the
draft with the HTML report as the body. The subject should follow the pattern:
"🧸 PR Update: <PR title> (#<number>)"
Do NOT pass image_cid — the placeholder is already in the HTML body.

After drafting, respond with a SHORT summary (2-3 lines) confirming the draft
was created and remind the user they can attach a screenshot with:
  python .github/skills/email/email_tool.py attach-image --draft-id <ID> --image-path <path> --content-id pr_overview
"""


# ── Event handler ────────────────────────────────────────────────────────

def _handle_event(event: SessionEvent) -> None:
    """Log tool calls to stdout."""
    try:
        if event.type == SessionEventType.TOOL_EXECUTION_START:
            name = _tool_name(event.data)
            if name:
                print(f"  [tool] calling {name} …")
        elif event.type == SessionEventType.TOOL_EXECUTION_COMPLETE:
            name = _tool_name(event.data)
            if name:
                print(f"  [tool] {name} done")
        elif event.type == SessionEventType.SESSION_ERROR:
            msg = getattr(event.data, "message", "unknown") if event.data else "unknown"
            print(f"  [error] {msg}", file=sys.stderr)
    except Exception:
        pass


def _tool_name(data) -> str | None:
    if not data:
        return None
    return (
        getattr(data, "mcp_tool_name", None)
        or getattr(data, "tool_name", None)
        or getattr(data, "name", None)
    )


# ── Parse PR input ──────────────────────────────────────────────────────

def parse_pr_input(pr_input: str) -> tuple[str, str]:
    """Return (owner/repo, pr_number) from a URL or bare number."""
    # Match GitHub PR URL: https://github.com/owner/repo/pull/123
    url_match = re.match(
        r"https?://github\.com/([^/]+/[^/]+)/pull/(\d+)", pr_input
    )
    if url_match:
        return url_match.group(1), url_match.group(2)

    # Bare number — use GITHUB_REPO env or fail.
    if pr_input.isdigit():
        repo = os.getenv("GITHUB_REPO", "")
        if not repo:
            print(
                "Error: pass a full PR URL or set GITHUB_REPO=owner/repo",
                file=sys.stderr,
            )
            sys.exit(1)
        return repo, pr_input

    print(f"Error: could not parse PR input: {pr_input}", file=sys.stderr)
    sys.exit(1)


# ── Agent flow ───────────────────────────────────────────────────────────

async def run_agent(pr_input: str, to_email: str) -> str:
    """Fetch PR details and draft an email report."""
    repo, pr_number = parse_pr_input(pr_input)
    print(f"📋  PR #{pr_number} on {repo}")
    print(f"📧  Will draft to: {to_email}")

    github_token = (
        os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")
        or os.getenv("GITHUB_TOKEN")
    )
    mcp_env = {"GITHUB_PERSONAL_ACCESS_TOKEN": github_token} if github_token else {}

    # ── Start the Copilot SDK client ─────────────────────────────────

    client = CopilotClient()
    await client.start()

    session = await client.create_session({
        "model": "gpt-4.1",
        "system_message": {"mode": "append", "content": SYSTEM_PROMPT},
        "mcp_servers": {
            "github": {
                "type": "stdio",
                "command": "npx",
                "args": ["-y", "@github/mcp-server"],
                "env": mcp_env,
                "tools": [
                    "get_pull_request",
                    "get_pull_request_files",
                    "list_commits",
                    "get_file_contents",
                ],
            },
        },
    })
    session.on(_handle_event)
    print("✅  Agent session started\n")

    prompt = (
        f"Fetch PR #{pr_number} from the repo {repo}. "
        f"Build the HTML report and draft the email{f' to {to_email}' if to_email else ' with no recipient (leave the To field empty)'}."
    )

    try:
        response = await session.send_and_wait({"prompt": prompt}, timeout=120)
        result = ""
        if response and response.data and response.data.content:
            result = response.data.content
        return result
    finally:
        await client.stop()


# ── CLI ──────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Fetch a PR and draft an engineering update email."
    )
    parser.add_argument(
        "pr",
        help="PR URL (https://github.com/owner/repo/pull/N) or number",
    )
    parser.add_argument(
        "--to",
        default="",
        help="Recipient email address (optional — leave empty to draft without a recipient)",
    )
    args = parser.parse_args()

    summary = asyncio.run(run_agent(args.pr, args.to))
    print(f"\n{summary}")


if __name__ == "__main__":
    main()
