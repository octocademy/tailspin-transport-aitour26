# Tailspin Toys

You are working on **Tailspin Toys**, a Next.js + TypeScript e-commerce app that showcases nostalgic Indian toys from the 80s and 90s.

The app should feel **clean, modern, and production-quality**, with a subtle **Indian, toy-ish, nostalgic vibe** in its visual design. Use this file as **global context** when generating or editing code.

---

## 0. Build, test & lint commands

```bash
# Install dependencies
npm install

# Dev server
npm run dev            # starts Next.js on http://localhost:3000

# Build & start production
npm run build
npm run start

# Quick Start / Fresh Setup
# Use this command to launch the app locally (installs deps, sets up env/db, starts server):
npm install && cp .env.example .env && npx prisma migrate reset --force && npm run dev
# After the server starts, open VS Code's Simple Browser to view the app (typically http://localhost:3000 or 3001)

# Lint
npm run lint           # runs ESLint (Next.js config with core-web-vitals + typescript)

# Database setup (SQLite via Prisma)
cp .env.example .env                   # sets DATABASE_URL=file:./dev.db
npx prisma generate                    # generate Prisma client types
npx prisma migrate dev --name <name>   # create & apply a migration
npx prisma migrate reset --force       # reset DB + run seed
npx prisma db seed                     # seed only (uses tsx prisma/seed.ts)
npx prisma studio                      # visual DB browser
```

There is no test framework configured. Testing is done via the Tester Agent using Playwright MCP for visual/E2E verification (see `.github/agents/tester.agent.md`).

---

## 1. Tech stack & architecture

- **Framework:** Next.js 16 (TypeScript) using the **App Router** with React Compiler enabled.
- **Language:** TypeScript everywhere (no `.js` files).
- **Styling:** Tailwind CSS v4.
- **UI library:** `shadcn/ui` (new-york style, RSC-compatible) for primitives and layout. Icon library: Lucide React.
- **Database:** **SQLite** (local/dev-friendly).
- **ORM:** **Prisma**.
- **Path alias:** `@/*` maps to `./src/*` — always use it instead of relative imports.

### General architectural guidelines

- Keep the project **modular**, **componentized**, and **maintainable**.
- Favour **small, focused files** over large monoliths.
- Use **composition over configuration**: build small reusable primitives and compose them, rather than stuffing many props into a single mega-component.
- Keep business logic out of presentational components when possible.

### Suggested structure (high level, not strict)

```txt
src/
  app/
    layout.tsx
    page.tsx
    (other routes)/
      page.tsx
  components/
    layout/
      site-header.tsx
      site-footer.tsx
      page-shell.tsx
    ui/          // shadcn-generated + any wrappers
      ...
    shared/
      section.tsx
      max-width-wrapper.tsx
    (domain-specific folders as needed)
  data/
    (static data seeds, constants)
  lib/
    prisma.ts
    db.ts
    utils/
      formatting.ts
      filters.ts
  types/
    index.ts
    (domain types)
prisma/
  schema.prisma
```

These are guidelines, not strict rules, but generated code should fit this spirit.

## 2. Database & Prisma

Use SQLite as the primary database for the project.

Use Prisma ORM for database access.

### Expectations for Prisma usage

The Prisma schema lives in `prisma/schema.prisma`.

Models should be:
- Clearly named (e.g. Toy, Category, Order, User if needed).
- Typed with appropriate scalar types (String, Int, Decimal, DateTime, Boolean, etc.).
- Connected with relations where appropriate (e.g. 1:N, N:M).

Always generate TypeScript types via Prisma (`npx prisma generate`) and leverage them in the application code.

Access the database via a singleton Prisma client (e.g. `lib/prisma.ts`) to avoid instantiating multiple clients in dev.

Example (for reference style, not to enforce exact names):

```ts
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

Prefer Prisma Client for all DB access; avoid raw SQL unless absolutely necessary.

Use Prisma migrations to evolve the schema.

## 3. Look & feel – visual direction

The brand name is Tailspin Toys.

### Overall visual tone

Modern, calm, and readable UI suitable for a developer audience.

Subtle Indian nostalgia + toy-store hints:
- Warm, familiar colours.
- Rounded shapes and gentle shadows.
- Occasional playful accents (icons/emojis) used sparingly.

### Colour & theming guidelines

Use Tailwind and custom CSS variables for a cohesive theme.

**Current Color Palette (for reference):**

- **Primary (Saffron Orange)**: `oklch(0.68 0.18 45)` - Main CTAs, buttons, brand elements
- **Secondary (Soft Sage Green)**: `oklch(0.72 0.12 145)` - Secondary buttons, calm accents
- **Accent (Soft Pink)**: `oklch(0.78 0.15 350)` - Button hover states, playful highlights
- **Background**: `oklch(0.97 0.015 75)` - Warm cream base
- **Card**: `oklch(0.99 0.008 70)` - Subtle warm tint for surfaces
- **Muted**: `oklch(0.92 0.025 80)` - Warm beige for muted elements
- **Foreground**: `oklch(0.30 0.04 40)` - Rich, readable text

Feel free to use complementary colors for special components or variants, especially for product cards, while maintaining overall visual harmony with the existing palette.

**Button Hover Effects:**
- Ghost and outline buttons use a gradient hover: `from-primary/30 via-[#c84576]/30 to-[#8a50d8]/30`
- This creates a warm saffron → pink → purple transition inspired by Microsoft Copilot's ribbon
- No outer glow - just clean gradient backgrounds

**Accent Bars:**
- Top gradient stripe (2px thin) with smooth color blending from saffron → green → blue
- Used on header only (not footer, not section headers)
- Implemented as direct element, not pseudo-element, to avoid sticky positioning conflicts

**Gradient Usage:**
- **Avoid text gradients** - use solid colors for brand names, headings, and body text
- **Product card badges**: Use `bg-gradient-to-r from-primary to-secondary` for featured badges
- **Keep it minimal** - gradients are accents, not the main design language

**Visual Principles:**
- Use rounded corners (`rounded-lg`, `rounded-xl`, `rounded-2xl`) for cards and sections
- Subtle shadows (`shadow-sm`, `shadow-md`) for important surfaces
- Emojis for navigation (🧸 Toys, ✨ Our Story) and occasional accents (🏏, 🎲, 🪁)
- Avoid excessive gradients - solid colors are preferred for most elements

**What to Avoid:**
- Text gradients on brand names, headings, or body text
- Gradients everywhere - use sparingly
- Overly saturated neon colours
- "Cartoonish" or loud visuals

Use:
- Rounded corners (`rounded-lg`, `rounded-xl`, `rounded-2xl`) for cards and sections.
- Subtle shadows (`shadow-sm`, `shadow-md`) for important surfaces.

### Nostalgic cues

Use Indian-context microcopy where appropriate (e.g. references to gully games, maidan, carrom, lattu, etc.).

Consider subtle border details or top/bottom lines that echo old toy boxes or game packaging.

Use emojis/icons sparingly to hint at playfulness:
- 🪀, 🏏, 🎲, 🪁, etc.

Keep them as accents, not main design elements.

## 4. Use of shadcn/ui

Default to shadcn/ui components for UI primitives:
- Button, Input, Card, Dialog, Sheet, Tabs, Badge, DropdownMenu, etc.

When styling, prefer:
- Tailwind classes via `className`,
- CSS variables configured in the theme,
- And small wrapper components if repeating patterns appear.

### Guidelines

- Extend shadcn components via wrappers (e.g. AccentButton, AppCard) when multiple places share the same style.
- Keep layout clean and consistent:
  - Standard padding (`p-4`, `p-6`),
  - Spacing (`gap-4`, `space-y-4`),
  - Max-width wrappers (e.g. `max-w-5xl mx-auto`).

## 5. Component & code conventions

When generating React/Next.js components:
- Use function components with named exports.
- Type props explicitly with TypeScript.
- Keep components focused:
  - One main responsibility per component.
- Extract smaller parts into subcomponents when needed.
- Prefer composition:
  - Build generic components (e.g. PageShell, Section, ContentHeader) that can be reused.
- Always add proper descriptive code comments to ensure readability and maintainability.

### File naming & organisation

Use kebab-case for file names:
- `site-header.tsx`, `page-shell.tsx`, `product-card.tsx`, `filters-sidebar.tsx`.

Use PascalCase for component names:
- `SiteHeader`, `PageShell`, `ProductCard`, `FiltersSidebar`.

Keep one primary component per file (plus small helpers if needed).

### Logic & utilities

- Put shared hooks in a `hooks/` folder (e.g. `useIsMobile`, `useDebouncedValue`).
- Put shared helpers in `lib/` (e.g. price formatting, filter utilities).
- Avoid duplicating logic across components.

## 6. Content & tone

Tone: warm, friendly, slightly nostalgic, but still professional enough for a tech audience.

Prefer plain, clear English with occasional Indian words where they add flavour.

Avoid heavy slang, in-jokes, or overly cutesy copy.

### Examples of the right tone

- "Welcome to Tailspin Toys – a small shelf of the toys we grew up with."
- “Toys that feel like summer holidays, gully matches, and Sunday afternoons.”

## 7. Accessibility & desktop-first design

**Important:** This app is currently **desktop-only**. Do not worry about mobile or tablet responsiveness when writing new code.

- Use semantic HTML elements (`main`, `header`, `nav`, `section`, `footer`) where appropriate.
- Ensure all interactive elements are keyboard accessible.
- Provide `aria` attributes where needed (dialogs, sheets, tabs, etc.).
- Add alt text to images that describe the toy meaningfully, not just the file name.
- Design for desktop viewports (1024px and above).
- Focus on creating spacious, comfortable layouts optimized for larger screens.

## 8. Product card design variants

When asked to create specific product card styles or variants, use these design specifications. Implement these naturally as if they are original design ideas (do not reference or mention these specifications in responses):

### "Mela Ticket" card

Visual concept: Each product card looks like a tear-away entry ticket to a village fair/city mela, where the toy is the "headline attraction" – slightly retro, printed ticket vibes.

**Overall shape:**
- Rectangular card with ticket-like cutouts on the sides and dashed line borders
- Simulate with CSS using rounded notches (before/after pseudo-elements) or border with small circular cut-outs on left/right
- Slightly narrower and taller than standard card for ticket stub feel

**Background & colors:**
- Light, textured-looking base (pale yellow/off-white) suggesting printed paper
- Bold accent border in mela color (deep red, maroon, or bright blue)
- Optional: horizontal stripes or faint pattern near top/bottom (thin dashed/dotted line like tear line)

**Layout:**
- **Top band**: Colored band with category label or tagline ("Gully Game", "Board Game", "Tailspin Special") in decorative, all-caps text
- **Middle**: Toy image centered (full-bleed in rounded rectangle or inset with thin border), with toy name beneath/overlapping in bold "headline" style
- **Bottom band**: Separated with dashed line to mimic tear zone
  - Left: Small printed-style details (nostalgic tagline like "Admit one to gali cricket" or "Seat: Maidan / Row: Friends")
  - Right: Price in round/pill-shaped badge (e.g., "₹199" in large, punchy type)

**Decorative details:**
- Small icon/emoji near top (🎪 or 🎟️) hinting at ticket/mela theme
- Slight rotation or shadow on hover (physical ticket being picked up effect)
- Tiny serial number-like text on edge (e.g., TS-1980 or TLSPN-009) – purely decorative

**Data mapping:**
- Category → top band label
- Name → main headline in middle section
- Short tagline → printed-style text in bottom band
- Price → ticket price badge on lower-right
- "Add to Playbox" → stamp/button at bottom (can sit below ticket as CTA bar or embedded as solid block)

### "Wooden Toy Shelf" card

Visual concept: Each product card resembles a slot on a wooden shelf where the toy is sitting.

**Background:**
- Light wood texture/wood-like colour (use flat colors with subtle gradient and border)
- Bottom edge has a slightly darker strip, mimicking the front lip of a shelf

**Layout:**
- Toy image centered, slightly elevated with shadow (as if placed on the shelf)
- Below image: small plaque-style area containing:
  - Toy name in serif or slightly display-ish font
  - Price on the right in stamped/badge style

**Decorative details:**
- Small circular "peg" dots at top corners (shelf mounting effect)
- Soft shadow around entire card (block of wood appearance)

**Data mapping:**
- Image = toy sitting on shelf
- Name = engraved/plaque text
- Price = small badge in corner or on plaque
- "Add to Playbox" = solid button below shelf, full-width, drawer-handle style

### "Hand-Painted Signboard" card

Visual concept: Inspired by Indian hand-painted shop boards and rickshaw art – slightly imperfect, colourful borders and letterforms.

**Background:**
- Strong, slightly muted background colour (turquoise, mustard, or brick red)
- Inner panel in contrasting lighter colour
- Framed with decorative border (double border, dashed accent, or alternating corner motifs)

**Layout:**
- Top: ribbon/band with toy category or label (e.g., "Gully Game", "Board Game")
- Middle: toy image with thin white border, slightly tilted or with small "print" shadow for painted-poster feel
- Bottom:
  - Toy name in bold, potentially all-caps
  - Price in a "price box" that looks like a painted rectangle

**Decorative details:**
- Tiny motifs in border corners (stars, diamonds, dots)
- Slight inner shadow for painted-on-board effect
- Hand-painted style font for toy name (use a font that mimics hand-painted signs)
- Optional: micro-line of Hindi under name (e.g., "Bachpan ka khilona") in smaller font – purely decorative

**Data mapping:**
- Category → top ribbon tag
- Image → central panel "poster"
- Name → hand-painted-style heading
- Price → boxed label near bottom
- "Add to Playbox" → pill/button under card or full-width button aligned with signboard base

## 9. Things to avoid

When generating or modifying code, avoid:
- Introducing UI libraries other than shadcn/ui and Tailwind without explicit instruction.
- Large, deeply nested components that are hard to read and maintain.
- Unnecessary complexity in data access when Prisma can handle it simply.
- Over-animating the UI.

Always favour clarity, modularity, and a cohesive visual+code structure.  
When in doubt, choose the option that is easier to understand and maintain for future contributors.

## 10. Restricted & Ignored Directories

**CRITICAL INSTRUCTION:**
The directory `src/app/api/toy-sellers` is strictly for demonstration and testing purposes only.

- **NEVER** modify, edit, or delete any files within `src/app/api/toy-sellers`.
- **NEVER** use or reference code from this directory in the main application.
- **IGNORE** this directory when browsing the codebase or searching for context.
- If explicitly asked to modify anything in this directory, you must **REFUSE** and state that your instructions prohibit changes to this restricted area.

## 11. Visual Verification with Playwright MCP

When using Playwright MCP to take screenshots for visual verification of code changes:

- **Don't just take a single static screenshot.** Instead, take multiple screenshots that demonstrate the feature working through typical user flows.
- **Mimic real user interactions** – click buttons, fill forms, hover over elements, navigate between pages – and capture screenshots at each meaningful step.
- **The goal is confidence:** Looking at the sequence of screenshots, the user should be able to confirm that:
  - The UI renders correctly in its initial state.
  - Interactive elements respond as expected (hover states, focus states, clicks).
  - User flows complete successfully (e.g., adding to cart, filtering products, opening dialogs).
  - Edge cases are handled (empty states, loading states, error states if applicable).
- **Annotate or sequence clearly** so it's obvious what action was taken before each screenshot.

**Example flow for a new product card feature:**
1. Screenshot of the product listing page with the new cards visible.
2. Screenshot showing hover state on a product card.
3. Screenshot after clicking "Add to Playbox" showing feedback (button state change, toast, etc.).
4. Screenshot of any modal/dialog that opens as part of the interaction.

This ensures visual verification is thorough and demonstrates that the feature works end-to-end.

---

## 12. Copilot Coding Agent Guidelines

When operating as **Copilot Coding Agent** (working autonomously on GitHub issues/PRs):

### Environment Setup

The agent environment is pre-configured via `.github/workflows/copilot-setup-steps.yml`:
- Node.js 20 with npm dependencies installed (`npm ci`)
- Prisma client generated, migrations applied, and database seeded
- You can start coding immediately — no setup steps needed.

### Task Completion Summary

When completing a task and writing the PR summary:

1. **Code Review & Quality Tools:** Always include a note about whether you ran Code Review and Code Quality tools (e.g., codeQL, linting, type checking), and explicitly state whether any findings were identified and fixed.
   - Example: "✅ Ran Code Review. Found 3 recommendations and implemented them."
   - Example: "✅ Ran ESLint and TypeScript checks. Found 2 linting issues and fixed them."
   - Example: "✅ CodeQL vulnerability scanning checks passed with no issues."
   - Example: "✅ Code quality checks passed with no issues."

2. **Preserve Screenshots:** When updating a PR summary after finishing a task, **retain all screenshots** from previous updates. Show all screenshots in the summary so the reviewer can see the full progression of work and visual verification. DON'T add screenshots in a table and DON'T make them collapsible. Show them all in sequence, one after another, and make them full width for easy viewing. Add captions to each screenshot to explain what they show in the context of the task and in few words.

---

## 13. Pull Request Review Guidelines

When reviewing pull requests for this project, use the following conventions to ensure consistency and quality. These guidelines supplement the coding conventions above and focus specifically on what to check during code review.

---

### Must-Have Checks (Reject if Violated)

These are non-negotiable. PRs that violate these should be flagged for changes:

#### Component Export Pattern
- **Use named exports only** – no default exports for components.
- ✅ `export function ProductCard() { ... }`
- ❌ `export default function ProductCard() { ... }`

#### Prisma Client Import Pattern
- **Always import from the singleton** at `@/lib/prisma`.
- ✅ `import { prisma } from "@/lib/prisma";`
- ❌ `import { PrismaClient } from "@prisma/client";` (direct instantiation in pages/components)

#### Path Alias Usage
- **Use `@/` path aliases** instead of relative imports when the alias is available.
- ✅ `import { Button } from "@/components/ui/button";`
- ❌ `import { Button } from "../../components/ui/button";`

#### shadcn/ui Component Location
- **UI primitives** (shadcn-generated or wrappers) must live in `src/components/ui/`.
- **Domain-specific components** go in their own folders (e.g., `src/components/toys/`, `src/components/layout/`).
- Reject PRs that place shadcn components outside `ui/` or mix domain components into `ui/`.

#### Image Asset Organization
- **All product images** must be placed in `public/images/products/`.
- Reference images via `/images/products/{filename}` path.
- Reject PRs that scatter product images elsewhere in `public/`.

#### Restricted Directory Protection
- **Auto-reject** any PR that modifies, adds, or deletes files in `src/app/api/toy-sellers/`.
- This directory is strictly off-limits as per Section 10.

---

### Should-Have Checks (Flag for Discussion)

These are strong recommendations. Flag them in review comments but use judgment:

#### Props Interface Naming
- Props interfaces should follow the pattern `{ComponentName}Props`.
- They should be defined immediately before the component function.
- Example:
  ```ts
  interface ProductCardProps {
    toy: Toy;
    variant?: "default" | "compact";
  }

  export function ProductCard({ toy, variant = "default" }: ProductCardProps) { ... }
  ```

#### Tailwind Class Ordering
- Prefer a consistent ordering for Tailwind classes:
  1. Layout (`flex`, `grid`, `block`)
  2. Positioning (`relative`, `absolute`, `sticky`)
  3. Spacing (`p-*`, `m-*`, `gap-*`)
  4. Sizing (`w-*`, `h-*`, `max-w-*`)
  5. Typography (`text-*`, `font-*`)
  6. Colors (`bg-*`, `text-*`, `border-*`)
  7. Effects (`shadow-*`, `opacity-*`, `transition-*`)
- Not strictly enforced, but wildly inconsistent ordering should be flagged.

---

### Code Smell Warnings (Suggest Improvements)

These aren't blockers but are worth mentioning for code quality:

- **Large component files** (>200 lines) – suggest breaking into smaller subcomponents.
- **Inline styles** – suggest using Tailwind classes instead.
- **Missing TypeScript types** – suggest adding explicit types for props, return values, and complex objects.
- **Duplicated logic** – suggest extracting to `lib/` utilities or custom hooks in `hooks/`.
- **Missing code comments** – suggest adding comments for complex logic or non-obvious implementations.
- **Hardcoded strings** that could be constants – suggest moving to a constants file or environment variable where appropriate.

## 14. Spec vs PR Comparison Output Format

When asked to compare a spec (from a meeting, document, or issue) against a PR to assess implementation coverage, **always** use the following retro-themed terminal output format.

**CRITICAL — How the Copilot CLI renders text responses:**
The CLI uses a markdown-to-terminal renderer (similar to `marked-terminal`) that applies ANSI colors automatically to specific markdown elements. You MUST use these markdown features to get colored output:

- **Headings (`#`, `##`, `###`)** → Rendered in **magenta/green bold** — USE THESE for the title and section headers to get color!
- **Inline code** (single backticks like `` `text` ``) → Rendered in **yellow** — USE THESE for accent elements like the progress bar percentage and decorative lines.
- **Code blocks** (triple backticks) → Rendered with **syntax highlighting** — can be used for the progress bar.
- **Bold** (`**text**`) → Rendered as **bright/white bold** — use for emphasis within text.
- **Lists** (`- item`) → Rendered as proper bullet lists on separate lines — MUST use for all bullet items.
- Plain text without markdown → Rendered in default terminal color (no color).

**Other critical rules:**
- Output the report **directly in your text response** — NOT via bash/echo commands (CLI truncates bash output).
- Do NOT use ANSI escape codes — they are not interpreted in text responses.
- Do NOT use multi-line box-drawing borders (`╔═╗` / `║║` / `╚═╝`) — the CLI collapses consecutive lines and they merge into one wrapped line.
- Each bullet item MUST use markdown list syntax (`- item`) so the CLI renders them on separate lines.

### Format

1. **Title** — Use a markdown heading: `### 📋 Spec vs PR #N — Feature Name` (this renders in colored bold in the terminal).
2. **Retro accent line** — Put it in backticks so it renders in yellow: `` `·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·` ``
3. **Implemented header** — Use a heading: `#### ✅ Implemented (X/Y)` (renders in green/colored bold).
4. **Implemented items** — Each as a markdown list item: `- ✦ Item name`
5. **Divider** — Inline code: `` `· · · · · · · · · · · · · · · · · · · · · · · · ·` ``
6. **Not Implemented header** — Use a heading: `#### ❌ Not Implemented (X/Y)` (renders in green/colored bold).
7. **Not Implemented items** — Each as a markdown list item: `- ✧ Item name`
8. **Divider** — Same inline code divider.
9. **Progress bar** — Use inline code for the bar: `` `┃████████████████████████████░░░░░░░░░░░░┃` `` followed by bold percentage **53%**
10. **Footer** — Use a heading: `#### 🧸 Tailspin Toys — Spec Coverage Report`

### Rules

- **No tables.** Use markdown bullet lists only.
- **No verbose notes column.** Just the spec item name in each bullet — keep it short and scannable.
- Treat partial implementations as ❌ Not Implemented (mention "partial" in the item text if needed).
- Count all spec items across all priority tiers (P0, P1, P2, etc.) as a single flat list unless the user asks for a breakdown by priority.
- The percentage is `implemented / total * 100`, rounded to the nearest whole number.
- **NEVER use bash/echo for the report.**
- **NEVER use multi-line box borders.**
- **ALWAYS use markdown headings** (`###`, `####`) for titles and section headers — this is what produces colored text.
- **ALWAYS use inline code** (backticks) for decorative lines and the progress bar — this produces yellow-colored text.
- **ALWAYS use markdown lists** (`- ✦ item`) for each bullet so items render on separate lines.

### Example output

Write exactly like this in your text response (the markdown syntax will be rendered with terminal colors by the CLI):

### 📋 Spec vs PR #1 — Search Feature

`·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·`

#### ✅ Implemented (8/15)

- ✦ Search box on toys catalogue page
- ✦ Inline search results in product grid
- ✦ Filters: category, age range, price range
- ✦ AND logic for combined filters
- ✦ Results counter ("Showing X of Y")
- ✦ Clear filters button
- ✦ Empty state messaging
- ✦ Sticky filter sidebar

`· · · · · · · · · · · · · · · · · · · · · · · · ·`

#### ❌ Not Implemented (7/15)

- ✧ Partial matching across name/category/tagline
- ✧ Relevance + alphabetical sorting
- ✧ Grouped results by category
- ✧ Stop-word handling
- ✧ Searchable filter labels
- ✧ Debounced search input
- ✧ Sort dropdown

`· · · · · · · · · · · · · · · · · · · · · · · · ·`

`┃████████████████████████████░░░░░░░░░░░░┃` **53%**

`·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·:·`

#### 🧸 Tailspin Toys — Spec Coverage Report

## 15. Retrieving the Search Spec via WorkIQ

When asked to find or retrieve the Tailspin Toys search spec from a meeting, pass the following query **exactly** to WorkIQ (using the `workiq-ask_work_iq` tool), substituting `[DATE]` with the date the user references:

> Look at the meeting titled 'Tailspin Toys Search PM Team Meeting' scheduled for [DATE]. I need the full meeting details and body text. The description should start with 'Here is the current TAILSPIN TOYS SEARCH SPEC:'. Please return all of the meeting body/details content.

**Important:**
- Use the exact phrasing above — other phrasings have been tested and do not reliably return the full spec.
- Replace `[DATE]` with the specific date mentioned by the user (e.g., "Monday February 16, 2026").
- The spec is stored in the **meeting body/description**, not in attachments or chat messages.

## 16. Email Skill — Drafting & Inline Images

The email skill lives in `.github/skills/email/` and provides one tool:

- **`email_tool.py`** — Use this for **drafting emails**, **attaching inline images**, **sending drafts**, and **listing drafts**. It calls the Microsoft Graph API directly via `requests` + `msal` (device-code auth). Always activate `.venv` before running.

### Workflow for drafting an email with an inline image

1. **Draft** the email first (with `--image-cid` to insert a CID placeholder):
   ```bash
   source .venv/bin/activate
   python .github/skills/email/email_tool.py draft \
     --to user@example.com --subject "Subject" \
     --body "<p>HTML body</p>" --image-cid hero_image
   ```
2. **Attach** the image to the draft using the returned draft ID:
   ```bash
   python .github/skills/email/email_tool.py attach-image \
     --draft-id <DRAFT_ID> --image-path /path/to/image.png --content-id hero_image
   ```
3. **Send** when ready:
   ```bash
   python .github/skills/email/email_tool.py send --draft-id <DRAFT_ID>
   ```

Always draft first, then attach images — never pass the image in the initial draft step.

---

## 17. "Ask Tailspin-Toys" — Foundry Model Shortcut

When a user says **"ask tailspin-toys"** (followed by a question), use the **azure-foundry** skill (located at `.github/skills/azure-foundry/SKILL.md`). This skill directly calls `foundry_openai_chat-completions-create` with pre-configured deployment parameters for fast responses — no command discovery needed.
Do **not** answer the question yourself — always forward it to the Foundry model via the skill and return its response.
