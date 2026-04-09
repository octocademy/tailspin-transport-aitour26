"""Graph API Email Tool.

Reliable email drafting and inline image attachment using
Microsoft Graph REST API + MSAL device-code authentication.

Usage:
  # Step 1: Draft an email
  python graph_email.py draft --to user@example.com \
    --subject "Hello" --body "<p>Check this out:</p>"

  # Step 2: Attach an inline image to an existing draft
  python graph_email.py attach-image --draft-id <DRAFT_ID> \
    --image-path /path/to/image.png --content-id hero_image

  # Step 3: Send a draft
  python graph_email.py send --draft-id <DRAFT_ID>

  # List recent drafts
  python graph_email.py list-drafts

Authentication:
  Uses MSAL device-code flow on first run. Tokens are cached
  in ~/.tailspin-graph-token-cache.json for subsequent calls.
"""

from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import os
import sys
from pathlib import Path
from typing import Any

import msal
import requests

# Azure AD app registration for delegated access.
# Using the well-known "Microsoft Graph Command Line Tools" public client
# which supports device-code flow without needing a custom app registration.
CLIENT_ID = "14d82eec-204b-4c2f-b7e8-296a70dab67e"
AUTHORITY = "https://login.microsoftonline.com/common"
SCOPES = ["Mail.ReadWrite", "Mail.Send"]

TOKEN_CACHE_PATH = Path.home() / ".tailspin-graph-token-cache.json"
GRAPH_BASE = "https://graph.microsoft.com/v1.0"


def _get_token_cache() -> msal.SerializableTokenCache:
    """Load or create a persistent MSAL token cache."""
    cache = msal.SerializableTokenCache()
    if TOKEN_CACHE_PATH.exists():
        cache.deserialize(TOKEN_CACHE_PATH.read_text())
    return cache


def _save_token_cache(cache: msal.SerializableTokenCache) -> None:
    """Persist the token cache to disk."""
    if cache.has_state_changed:
        TOKEN_CACHE_PATH.write_text(cache.serialize())


def get_access_token() -> str:
    """Acquire a valid access token, prompting device-code login if needed."""
    cache = _get_token_cache()
    app = msal.PublicClientApplication(
        CLIENT_ID, authority=AUTHORITY, token_cache=cache
    )

    # Try silent acquisition first (cached tokens).
    accounts = app.get_accounts()
    if accounts:
        result = app.acquire_token_silent(SCOPES, account=accounts[0])
        if result and "access_token" in result:
            _save_token_cache(cache)
            return result["access_token"]

    # Fall back to device-code flow.
    flow = app.initiate_device_flow(scopes=SCOPES)
    if "user_code" not in flow:
        raise RuntimeError(f"Device flow initiation failed: {json.dumps(flow)}")

    print("\n" + flow["message"] + "\n", file=sys.stderr)
    result = app.acquire_token_by_device_flow(flow)

    if "access_token" not in result:
        error = result.get("error_description", result.get("error", "Unknown error"))
        raise RuntimeError(f"Authentication failed: {error}")

    _save_token_cache(cache)
    return result["access_token"]


def _headers(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }


def _check_response(resp: requests.Response, action: str) -> dict[str, Any]:
    """Raise with details on failure, return JSON on success."""
    if not resp.ok:
        print(f"ERROR {action}: {resp.status_code}", file=sys.stderr)
        print(resp.text, file=sys.stderr)
        resp.raise_for_status()
    if resp.status_code == 204:
        return {}
    return resp.json()


# ── Commands ─────────────────────────────────────────────────

def cmd_draft(args: argparse.Namespace) -> None:
    """Create a draft email with HTML body."""
    token = get_access_token()

    body_content = args.body
    # If the body has an image placeholder, insert the cid reference.
    if args.image_cid:
        cid_tag = f'<br/><img src="cid:{args.image_cid}" /><br/>'
        body_content += cid_tag

    payload = {
        "subject": args.subject,
        "body": {"contentType": "HTML", "content": body_content},
        "toRecipients": [
            {"emailAddress": {"address": addr}} for addr in args.to
        ],
    }

    resp = requests.post(
        f"{GRAPH_BASE}/me/messages",
        headers=_headers(token),
        json=payload,
        timeout=30,
    )
    draft = _check_response(resp, "create draft")
    draft_id = draft["id"]
    print(f"Draft created! ID: {draft_id}")
    print(f"Subject: {draft.get('subject')}")
    print(f"To: {', '.join(r['emailAddress']['address'] for r in draft.get('toRecipients', []))}")
    return draft_id


def cmd_attach_image(args: argparse.Namespace) -> None:
    """Attach an inline image to an existing draft."""
    token = get_access_token()
    image_path = Path(args.image_path).expanduser()

    if not image_path.exists():
        print(f"ERROR: Image not found: {image_path}", file=sys.stderr)
        sys.exit(1)

    image_bytes = image_path.read_bytes()
    encoded = base64.b64encode(image_bytes).decode("ascii")

    content_type = mimetypes.guess_type(str(image_path))[0] or "image/png"

    payload = {
        "@odata.type": "#microsoft.graph.fileAttachment",
        "name": image_path.name,
        "contentType": content_type,
        "contentBytes": encoded,
        "isInline": True,
        "contentId": args.content_id,
    }

    resp = requests.post(
        f"{GRAPH_BASE}/me/messages/{args.draft_id}/attachments",
        headers=_headers(token),
        json=payload,
        timeout=60,
    )
    result = _check_response(resp, "attach image")
    print(f"Image attached inline (cid:{args.content_id})")
    print(f"  File: {image_path.name} ({len(image_bytes)} bytes)")
    print(f"  Attachment ID: {result.get('id', 'N/A')}")


def cmd_send(args: argparse.Namespace) -> None:
    """Send an existing draft."""
    token = get_access_token()

    resp = requests.post(
        f"{GRAPH_BASE}/me/messages/{args.draft_id}/send",
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    _check_response(resp, "send draft")
    print("Email sent successfully!")


def cmd_list_drafts(args: argparse.Namespace) -> None:
    """List recent drafts."""
    token = get_access_token()

    resp = requests.get(
        f"{GRAPH_BASE}/me/mailFolders/Drafts/messages",
        headers=_headers(token),
        params={"$top": args.top, "$select": "id,subject,createdDateTime,toRecipients"},
        timeout=30,
    )
    data = _check_response(resp, "list drafts")
    drafts = data.get("value", [])

    if not drafts:
        print("No drafts found.")
        return

    print(f"Found {len(drafts)} draft(s):\n")
    for i, d in enumerate(drafts, 1):
        to_list = ", ".join(
            r["emailAddress"]["address"]
            for r in d.get("toRecipients", [])
        )
        print(f"  {i}. {d.get('subject', '(no subject)')}")
        print(f"     To: {to_list or '(none)'}")
        print(f"     Created: {d.get('createdDateTime', 'N/A')}")
        print(f"     ID: {d['id']}")
        print()


# ── CLI ──────────────────────────────────────────────────────

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Microsoft Graph email tool for Tailspin Toys"
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # draft
    p_draft = sub.add_parser("draft", help="Create a draft email")
    p_draft.add_argument("--to", nargs="+", required=True, help="Recipient(s)")
    p_draft.add_argument("--subject", required=True)
    p_draft.add_argument("--body", required=True, help="HTML body content")
    p_draft.add_argument(
        "--image-cid",
        dest="image_cid",
        help="If set, appends an <img src='cid:VALUE'> tag to the body",
    )

    # attach-image
    p_attach = sub.add_parser("attach-image", help="Attach inline image to draft")
    p_attach.add_argument("--draft-id", required=True, help="Draft message ID")
    p_attach.add_argument("--image-path", required=True, help="Path to image file")
    p_attach.add_argument(
        "--content-id", default="hero_image", help="CID for inline reference"
    )

    # send
    p_send = sub.add_parser("send", help="Send a draft email")
    p_send.add_argument("--draft-id", required=True, help="Draft message ID")

    # list-drafts
    p_list = sub.add_parser("list-drafts", help="List recent drafts")
    p_list.add_argument("--top", type=int, default=5, help="Number of drafts")

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    commands = {
        "draft": cmd_draft,
        "attach-image": cmd_attach_image,
        "send": cmd_send,
        "list-drafts": cmd_list_drafts,
    }
    commands[args.command](args)


if __name__ == "__main__":
    main()
