---
name: frontend-design
description: "Generate an interactive HTML preview of the user's actual project UI with adjustable design-token knobs, DevTools-style element annotation, in-place text edit, and one-click markdown export back to Codex. Use when the user invokes $frontend-design or /frontend-design, requests a UI mockup or design review of an existing app, route, or component, asks for round-trip in-browser feedback on a codebase, or pastes a Frontend design round-trip export to apply. Do not use for prose deliverables. The template is only a behavior scaffold; generated previews and adjustable knobs must come from the user's real project, not from the template sample UI."
---

# Frontend Design

## How this skill is meant to be used — READ FIRST

`assets/preview-template.html` is a **behavior scaffold**, not a **visual design source**.

What the template provides — lift verbatim or near-verbatim:

- CSS for: app shell, controls rail, decision controls, comment overlays, picker, popover, side panel, export modal, toast
- JS modules for: decision system, comment picker, marker rendering, popover handling, direct-edit plumbing, export markdown assembly
- HTML skeleton: app shell, controls rail container, preview-pair container, modal overlays, markers layer
- The `data-fd-id` convention, scope semantics, `data-fd-editable` mechanics, export markdown format

What the template does NOT provide and you MUST NOT clone into the generated preview:

- The sample dashboard cards, workbench header, inspector rows, form components, status palette, type samples, or any other visual content inside `.preview-pair`
- The `TOKEN_GROUPS` structure and values — neither the categories (Surface / Accents / Typography / Radius / Density) nor the specific knobs / value ranges. The set of adjustable knobs in your generated preview must reflect the user's project's **actual tunable design dimensions** (what their `styles.css` / `tailwind.config` / theme files actually expose), not the template's example list.
- The `data-fd-id` names (those refer to the template's sample UI; yours must reflect YOUR design)

**If your generated preview's visual design comes from the template rather than from the user's actual project, the output is invalid and must be regenerated.**

This skill is a Codex-native approximation of a Claude Design-style feedback loop. It does not depend on Claude Design, a hosted service, a browser extension, npm, or a build step.

---

## When to invoke

Trigger when any of these match:

- User types `/frontend-design <topic>` or `$frontend-design <topic>`
- User asks for a UI mockup, design review, design-token preview, layout comparison, or visual / interaction decision before code is written
- User asks to design, review, or refine an existing frontend route, component, screenshot, or local app URL
- User wants to round-trip per-element feedback through HTML before committing it to code
- User pastes a `Frontend design round-trip` export and asks Codex to apply it

Do not invoke for prose-only deliverables such as API contracts, PR descriptions, or architecture notes.

---

## Workflow (mandatory order — do NOT skip Step 1)

### Step 1 — Understand the user's project BEFORE reading the template

Before opening `assets/preview-template.html`, gather context about the user's actual project:

- **Routes / pages**: which URL or file path is the design about?
- **Components**: read the relevant TSX / Vue / Svelte / HTML files for the target screen
- **Design tokens**: read `styles.css`, `tailwind.config`, theme files, or wherever the project defines colors, typography, spacing, radius, shadows
- **i18n**: read locale files if the project is internationalized
- **Live preview**: if a dev server URL is available (e.g., `http://127.0.0.1:5174/`), describe what's rendered there
- **Recent design work**: skim `Docs/`, `design/`, or any design docs for direction
- **Screenshots / mockups**: read any reference images the user provides

Determine the working mode:

- **Existing-app mode** (default): user references real components, routes, screenshots, or implementation phase. Your generated preview MUST match the live route in navigation frame, IA, density, typography scale, color tokens, and component hierarchy. A standalone preview that has no visual or structural relationship to the app is an invalid use of this skill.
- **Standalone-concept mode**: only when there is no existing app surface yet, OR when the user explicitly asks for an isolated mockup. Even here, design from the user's stated intent (brand, domain, design tokens, references), NOT from the template's sample.

### Step 2 — Design the UI based on Step 1 context (BEFORE touching the template)

Design the UI now, before opening the template. Reading the template first will anchor you to its sample dashboard layout.

Design principles:

- Match the user's project's navigation frame, IA, layout density
- Use the user's actual design tokens (colors, fonts, spacing) — read them, do not invent
- Use real terminology from the user's domain (route names, backend object names, copy from i18n files)
- Pattern decisions (cards / lists / tables / forms) should mirror what the user's project actually uses
- The template's "workbench / 4-card dashboard / inspector / status palette" pattern is ONE possible layout. If the user's app is Auteur, your preview should look like Auteur. If it's a Twitter clone, like Twitter. If it's a CRM, like a CRM.

### Step 3 — For existing-app mode: implement or update the real app UI

In existing-app mode the HTML preview cannot be the only deliverable unless the user explicitly asks for preview-only work. Implement or update the real app UI either before or in the same pass as the preview. Prefer deriving preview styles from the project's real CSS variables/classes. If exact extraction is impractical, recreate the app screen closely and call out any known differences.

### Step 4 — Read `assets/preview-template.html` and extract ONLY the scaffolding

Now read the template. Read it for the scaffolding only.

Lift verbatim into your generated file:

- All `<style>` blocks for: app shell, controls rail, decision controls, comment system, direct-edit indicators, export modal, toast
- All `<script>` content (decision system, comment picker, marker rendering, popover, direct-edit plumbing, export logic)
- The HTML skeleton: `<header class="app-header">`, `<aside class="controls">`, `.markers-layer`, `.picker-overlay`, `.comment-popover`, `.comment-list-panel`, `.export-modal`, `.toast`

Do NOT lift:

- The HTML inside `<div class="preview theme-light">` and `<div class="preview theme-dark">` (the template's sample UI)
- The `TOKENS` JavaScript object (you write a new one matching YOUR design's decisions)
- Sample-only CSS classes (`.wb-header`, `.node`, `.inspector`, `.form-sample`, `.status-grid` etc.) unless your designed UI actually uses those exact patterns

### Step 5 — Assemble the new preview

- Place your Step 2 design inside both `<div class="preview theme-light">` and `<div class="preview theme-dark">` containers (mirror them)
- **Design the knob set from the user's project, not the template.** Inspect the project's `styles.css` / `tailwind.config` / theme files and identify what is genuinely tunable (which CSS variables exist, which numeric properties recur across components). Build `TOKENS` and `SECTION_ORDER` to expose exactly those dimensions. The template's Surface/Accents/Typography/Radius/Density categories are one possible shape — they are NOT a required structure. If the project has a custom shadow scale, include a shadow knob. If the project doesn't have an opacity scale, do not invent an opacity slider just because it would feel symmetric. The knob set IS part of the design; design it for this project.
- Use the user's project's design-token NAMES. Do not invent token names that the project doesn't already have.
- Update `PREVIEW_META.source`, `PREVIEW_META.topic`, `PREVIEW_META.targetFile` to point at the user's real source files
- Replace title, subtitle, and help banner copy

### Step 6 — Decorate

- Add `data-fd-id="<kebab-name>"` to every meaningful element in YOUR designed UI. IDs reflect YOUR design's anatomy — do not reuse the template's anchor names. In existing-app mode, add matching anchors to the real components when practical and low-risk.
- Add `data-fd-editable="text"` to visible text that should be directly editable in the preview.
- Add `data-fd-editable="value"` to inputs, textareas, and selects whose values should be exported.

### Step 7 — Choose the output path and write the file

- In Auteur or repos with `Docs/`: `Docs/_frontend_preview/<topic-slug>/<YYYY-MM-DD>-<slug>.html`
- Otherwise: `./.frontend-design/<topic-slug>/<YYYY-MM-DD>-<slug>.html`

Write the HTML file. It must open directly via `file://` with no server.

### Step 8 — Verify

- Generated HTML contains no `<script src=`, external stylesheet `<link>`, remote image URL, or remote font import
- Inline script passes `node --check` when Node is available
- Open via `file://` or in-app browser when practical
- Test one decision control, one direct edit, one comment, and Export
- **In existing-app mode, also open the real route and compare side-by-side. Verify the preview is not a disconnected mockup; it should share the live page's main structure and visual language. If it doesn't, regenerate.**
- If code changed, run the project's normal frontend checks (typecheck, lint, build). If a check cannot run, state why.

### Step 9 — Report

Tell the user:

- Whether this was existing-app mode or standalone-concept mode
- What real files / routes / components it corresponds to
- The file path
- How to open the review surface, add comments, edit text, and Export markdown back into Codex

---

## Anti-patterns — regenerate if any of these apply

- ❌ Cloning template's sample UI (workbench header / 4 dashboard cards / inspector / form sample / status palette / type sample) into the generated preview when the user's project doesn't have those elements
- ❌ Substituting only text inside the template's sample components and leaving the visual structure unchanged ("text-substitution agent" behavior)
- ❌ **Cloning the template's `TOKEN_GROUPS` categories (Surface / Accents / Typography / Radius / Density) verbatim** instead of designing knobs that reflect the user's project's actual tunable design dimensions
- ❌ Using `data-fd-id="node-activity"` / `wb-header` / template-specific anchor names when your design doesn't have those concepts
- ❌ Hardcoding template's hex colors (`#2563eb`, `#f59e0b`, etc.) when the user's project defines its own design tokens
- ❌ Skipping Step 1 ("understand project context") and going straight to template manipulation
- ❌ Generating a preview that, opened side-by-side with the user's real app, looks like a different product

---

## Element IDs

Every meaningful UI anchor in YOUR designed UI gets `data-fd-id="<kebab-name>"`. The following are NAMING PATTERNS, not values to copy verbatim:

| Element kind | Naming pattern |
|---|---|
| Page section | `section-<slug>` |
| Card | `card-<slug>` |
| List row | `row-<slug>` |
| Form field | `field-<name>` |
| Status pill | `pill-<state>` |
| Button | `btn-<purpose>` |
| Text block | `text-<role>` |

Light + dark mirrors share the same `data-fd-id` — comments and direct edits are conceptual references to the UI element, not theme-specific references.

---

## Decision controls

| Control type | Use when | Example |
|---|---|---|
| Dropdown | Discrete curated alternatives | Color palette, font family, layout pattern |
| Slider | Continuous numeric values | Font size, radius, padding, opacity |
| Segmented | Compact 2-3 option choice | Density, weight, alignment |
| Toggle | Boolean state | Show grid, show markers, RTL preview |

Controls update the preview in real time. Dropdowns preview on hover, commit on click. Sliders commit on every input event. Segmented and toggle commit on click.

---

## Comment Mode

Implement the DevTools-style element picker from the template:

- Default mode shows a pristine preview with no comment indicators.
- Show Markers mode displays numbered markers without entering picker mode.
- Comment Mode uses hover overlay, selector hint, plus badge, and click-to-comment behavior.
- The popover supports free text plus `this`, `all-matching`, `all-like-this`, and `global` scopes.
- Parent and Child controls allow the user to retarget before saving.
- Resolve selectors by walking up to the nearest `data-fd-id`; fall back to a best-effort CSS selector only when no anchor exists.

Markers render in a top-level fixed-position layer so they're never clipped by ancestor `overflow: hidden`. They auto-attach to both light and dark mirrors via DOM-index pairing.

---

## Pane expand / collapse

Each preview pane has a toggle button in its outer top corner: `▶` in the light pane's top-right, `◀` in the dark pane's top-left.

- Click the light pane's `▶` → light expands to full width, dark collapses to a 36 px right strip whose only visible element is its `◀` button.
- Click the dark pane's `◀` → dark expands to full width, light collapses to a 36 px left strip whose only visible element is its `▶` button.
- Click the collapsed strip's arrow → restore the split view.

The collapse is **display only**. Decision knobs continue to apply CSS variables to both `theme-light` and `theme-dark` panes simultaneously regardless of which one is visible — when the user expands the collapsed pane again, every adjustment made in the meantime is already there. Direct edits and comment markers behave the same way.

---

## Direct edits

Use direct edits for copy, labels, option values, field values, and small visible text changes.

- Use `data-fd-editable="text"` for visible text nodes that should become editable in the preview.
- Use `data-fd-editable="value"` for inputs, textareas, and selects.
- Keep matching light/dark elements synchronized by sharing the same `data-fd-id`.
- Export changed values in the `Direct edits` section.
- When applying exported edits, route user-facing copy through the project's i18n system if one exists.

---

## Export

One Export button assembles one markdown block with:

1. Metadata: source path, timestamp, skill name, topic.
2. Decisions: changed token / control values.
3. Direct edits: changed visible copy or form values.
4. Element comments: selector, scope, and note.
5. Apply: concrete implementation and verification instructions for Codex pointing at REAL project files.

Use `references/export-format.md` as the contract. Do not change the export shape unless you update that reference too.

If nothing changed and no comments were added, Export shows a no-op toast and does not open the modal.

---

## Output rules

- Self-contained: inline CSS and inline vanilla JS only
- No CDN, external image fetch, external font fetch, npm import, or build step
- Opens directly via `file://`
- Light and dark themes appear side by side by default
- Existing-app previews must be visually and structurally tied to the real app route they represent — the first viewport should share the same navigation frame, page content, state model, density, and theme tokens as the live app

---

## Reference files

- `assets/preview-template.html` — **behavior scaffold** (mechanics demo only; the sample UI inside `.preview-pair` is throwaway illustration — DO NOT clone it into generated previews)
- `references/export-format.md` — exact markdown shape for the Codex round-trip prompt
