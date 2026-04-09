---
name: email
description: Use this skill when the user wants to read or send emails, manage contacts, or view their inbox. This skill handles all email-related tasks including drafting brand partnership outreach emails and embedding inline images.
---

# Email Skill

**Important**: This skill does NOT handle calendar events or meeting scheduling. For calendar-related requests, use the calendar skill instead.

## Tool

**`email_tool.py`** — Calls the Microsoft Graph API directly via `requests` + `msal`
(device-code auth). Handles drafting emails, attaching inline images, sending drafts,
and listing drafts.

## Instructions

The virtual environment (`.venv`) must be activated before running. The tool authenticates
via MSAL device-code flow; tokens are cached at `~/.tailspin-graph-token-cache.json`.

**Step 1 — Create a draft email:**
```bash
source .venv/bin/activate
python .github/skills/email/email_tool.py draft \
  --to recipient@example.com \
  --subject "Subject line" \
  --body "<p>HTML body content</p>" \
  --image-cid hero_image   # optional: adds <img src='cid:hero_image'> to body
```
This prints the draft ID needed for subsequent steps.

**Step 2 — Attach an inline image to the draft:**
```bash
python .github/skills/email/email_tool.py attach-image \
  --draft-id <DRAFT_ID> \
  --image-path /path/to/image.png \
  --content-id hero_image
```

**Step 3 — Send the draft:**
```bash
python .github/skills/email/email_tool.py send --draft-id <DRAFT_ID>
```

**List recent drafts:**
```bash
python .github/skills/email/email_tool.py list-drafts --top 5
```

## Trigger Phrases

This skill should be activated when the user says things like:
- "Show me my emails"
- "Send an email to..."
- "Create a draft email"
- "What's in my inbox?"
- "Read my latest email"
- "Check my email"
- "Send a message to..."
- "Who emailed me today?"
- "Save this email as a draft"
- "Draft an outreach email to [brand]"
- "Email [brand] about a partnership"
- "Send a pitch to [contact]"
- "Add an image to my email"
- "Attach a screenshot to the draft"

## Capabilities

- **Draft emails** with HTML body and optional inline image placeholders
- **Attach inline images** to existing drafts by content ID
- **Send drafts**
- **List drafts**
- Draft brand partnership outreach emails

## Outreach Email Workflow

When drafting partnership/sponsor outreach emails:

1. **Gather context first:**
   - Check if pitch deck exists: `brand-assets/pitch-decks/{company}/{Company}_Pitch.pptx`
   - Check brand-config.json for `website_live_url`
   - Use any brand profile document from `created_docs/brand-profiles/`

2. **Draft email with `email_tool.py`:**
   - Personalized introduction referencing the brand's values/campaigns
   - Brief pitch of what the influencer offers
   - Mention the attached pitch deck
   - Include website link if available
   - Clear call-to-action

3. **Attachment handling:**
   - Note the pitch deck path for manual attachment
   - The email will include a note: "📎 Attach: [path to pitch deck]"
   - For inline images, use the two-step workflow: `draft` with `--image-cid`, then `attach-image`

## Domain Boundaries

- ❌ Cannot schedule Calendar events or meeting scheduling (use calendar skill)