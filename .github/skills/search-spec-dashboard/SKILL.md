---
name: search-spec-dashboard
description: "Updates a dashboard to show the progress made by the engineering team of implementing the search spec."
---

# Search Spec Dashboard Skill

## Purpose

This skill lets an agent (or a human user) **update the Tailspin Toys
Search Team Dashboard** by pointing at a progress-report file.  The
dashboard is a **standalone Next.js app** hosted in a separate repo
and deployed to GitHub Pages.

### Deployed dashboard

- **Dashboard repo:** https://github.com/octodemo/tailspin-toys-search-dashboard
- **GitHub Pages URL:** https://super-robot-mwm5e17.pages.github.io/

The dashboard auto-deploys to GitHub Pages on every push to `main` via
the `.github/workflows/deploy-pages.yml` workflow in the dashboard repo.

---

## When to activate

Activate this skill when the user or agent says something like:

- "Update the search dashboard with this file"
- "Refresh the search spec progress from `<filename>`"
- "Use `<filename>` to update the search spec dashboard"
- "Update the dashboard"

The user/agent **must** reference (or provide the path to) a
progress-report file.  If no file is mentioned, ask for one before
proceeding.

---

## Key file to update

The **only file you need to modify** is in the dashboard repo:

```
octodemo/tailspin-toys-search-dashboard  →  src/data/search-spec-data.ts
```

This is the single source of truth.  The dashboard page and components
read from this file automatically — you never need to touch them.

---

## How to update the dashboard

### Step 1 — Read the progress-report file

Read the file the user/agent referenced.  The file is usually a plain-text
report structured like `search-spec-progress.txt` at the repo root.
It follows this general format:

```
TAILSPIN TOYS — Spec vs PR #<n> Coverage Report
...
P0 — Must Have for MVP (<count> items)
✅ IMPLEMENTED (<done>/<total>)
  <id>. <title>
    → <detail>
...
❌ NOT IMPLEMENTED (<remaining>/<total>)
  <id>. <title>
    → <detail>
...
P1 — Must Have for MLP (<count> items)
... (same structure)
...
OVERALL SUMMARY
Total spec items:  <n>
Implemented:       <n>
Not implemented:   <n>
Progress: <bar> <percent>%
```

Parse every item (id, title, detail, priority, status) from the file.

### Step 2 — Read the current data file from the dashboard repo

Use the GitHub MCP tool to read the current file:

- **Owner:** `octodemo`
- **Repo:** `tailspin-toys-search-dashboard`
- **Path:** `src/data/search-spec-data.ts`

This gives you the current state so you can produce an updated version.

### Step 3 — Build the updated data file

Produce a new version of `src/data/search-spec-data.ts` with:

1. **`reportMeta`** — update `prNumber`, `prTitle`, `specSource`, and
   `reportDate` to match the new report.

2. **`specItems`** array — update each item's `status` and `detail`
   to reflect the current state from the report.  Each entry must have:
   - `id` (number) — the spec-item number.
   - `priority` — `"P0"` or `"P1"`.
   - `title` (string) — short name.
   - `detail` (string) — description of what was done / what is missing.
   - `status` — `"implemented"` or `"not-implemented"`.

3. **Do not touch** the derived helper functions (`itemsByPriority`,
   `implementedCount`, etc.) — they compute automatically from the array.

### Step 4 — Push the updated file to the dashboard repo

Use the GitHub MCP `create_or_update_file` tool to push the updated
file to the dashboard repo:

- **Owner:** `octodemo`
- **Repo:** `tailspin-toys-search-dashboard`
- **Path:** `src/data/search-spec-data.ts`
- **Branch:** `main`
- **Message:** `"Update search spec progress — <X>/<Y> implemented (<Z>%)"`
- **Content:** the full updated file content

This push will automatically trigger the `deploy-pages.yml` workflow
which builds and deploys the dashboard to GitHub Pages within ~2 minutes.

### Step 5 — Confirm to the user

Report back:
- How many items were updated and the new overall progress percentage.
- Any items whose status changed (e.g. went from `not-implemented` →
  `implemented`).
- The GitHub Pages URL where the updated dashboard will be live:
  https://super-robot-mwm5e17.pages.github.io/

---

## Data-file schema reference

```ts
export type Priority = "P0" | "P1";
export type ItemStatus = "implemented" | "not-implemented";

export interface SpecItem {
  id: number;
  priority: Priority;
  title: string;
  detail: string;
  status: ItemStatus;
}

export interface ReportMeta {
  prNumber: number;
  prTitle: string;
  specSource: string;
  reportDate: string; // ISO date, e.g. "2026-02-12"
}
```

---

## Important rules

- **Only update `src/data/search-spec-data.ts`** in the dashboard repo
  (`octodemo/tailspin-toys-search-dashboard`).  Never modify the
  dashboard page or components unless the user explicitly asks.
- Always push directly to `main` so the GitHub Pages deployment triggers.
- Preserve the existing TypeScript types and helper functions in the file.
- If the report file introduces a **new priority level** (e.g. P2),
  extend the `Priority` type and add items accordingly.
- Keep the `specItems` array ordered by `id` for readability.
- Always use named exports (no default exports).
