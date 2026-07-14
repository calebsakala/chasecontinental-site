# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the Chase Continental homepage (`src/pages/LandingPage.tsx`) into the 11-section enterprise narrative from the spec, add two framework components and a Heineken placeholder case-study page, and deploy.

**Architecture:** Single-page React component composed of section blocks using the existing design system (tokens, `Header`/`Footer`, shadcn `Button`/`Card`, `Reveal`). Two new reusable components (`InterventionMatrix`, `MeasurementLayers`) live in `src/components/`. One new route/page for Heineken. Build-and-verify per task; deploy to Netlify via push to `main`.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind + shadcn/ui, framer-motion, react-router-dom.

**Spec:** `docs/superpowers/specs/2026-07-14-homepage-redesign-design.md` — the source of truth for all copy. Copy verbatim from it.

## Global Constraints
- Keep design-system tokens: `primary` (navy), `teal`, `gold`, `background`, `muted-foreground`, `card`, `border`; headings `font-heading` (Plus Jakarta Sans). Reuse `Header`, `Footer`, `Reveal`, shadcn `Button`/`Card`.
- No decorative gradients, no repeated messaging, restrained color, generous whitespace, clean grids (per spec "Additional Design Direction").
- Reuse the existing Trusted by / Backed by rows and the Backed-by logos exactly as-is (Google Cloud for Startups, Microsoft for Startups Founders Hub — do not rename).
- Every task ends green: `npm run build` succeeds (tsc + vite) AND a DOM/visual check passes. Commit with **explicit `git add <paths>`** (never `git add -A` with mixed deletes — caused a partial commit before).
- Booking URL (existing): `https://calendar.app.google/8oZYnnuHcaiH64Ky8`. Chase Agents URL: `https://chaseagents.com`.

## File structure
- Modify: `src/pages/LandingPage.tsx` — full rewrite (11 sections).
- Create: `src/components/InterventionMatrix.tsx` — 3-column classification matrix.
- Create: `src/components/MeasurementLayers.tsx` — interactive 5-layer stack.
- Create: `src/pages/HeinekenCaseStudy.tsx` — placeholder case-study page.
- Modify: `src/App.tsx` — add `/case-study/heineken` route (react-router) OR use static page (decision in Task C1).
- Add asset: `public/static/images/hero-ops.png` (from `/Users/apple/Downloads/dcxs.png`).

---

## PHASE A — Scaffold + Hero + Results + Problem + Solution

### Task A1: Hero image asset + section scaffold
**Files:** add `public/static/images/hero-ops.png`; Modify `src/pages/LandingPage.tsx`.
- [ ] Copy `/Users/apple/Downloads/dcxs.png` → `public/static/images/hero-ops.png`; if wider than needed, that's fine (CSS object-position handles crop).
- [ ] Rewrite `LandingPage.tsx` top-to-bottom as empty section skeletons in the 11-section order (each `<section>` with just its heading), keeping `Header`/`Footer`/imports. Preserve the existing Trusted-by/Backed-by JSX by moving it into the Hero section block.
- [ ] `npm run build` → PASS. Commit: `git add src/pages/LandingPage.tsx public/static/images/hero-ops.png && git commit`.

### Task A2: Hero (§1)
- [ ] Build hero: left column = headline, subheading, quiet line *"The AI works. Nobody has to ask it to."* (smaller, muted, italic), primary "Book a Strategy Call" (opens booking URL) + secondary "Explore Our Work" (scroll to `#results` or `/#results`). Right column = `hero-ops.png` in a rounded, bordered, shadowed panel (`object-cover`, `object-position` to favor the right/team side). Below both columns: existing Trusted by + Backed by rows.
- [ ] Verify (browser preview `chase-dist` after build): DOM has the headline, quiet line, both buttons, `hero-ops.png` loads (`naturalWidth>0`), Trusted/Backed present. Commit.

### Task A3: Results (§2)
- [ ] 5 stat cards (100+, 30+, 90%, 10.4×, `<$5/month`) with labels + caption, in a clean responsive grid (`md:grid-cols-3 lg:grid-cols-5` or a 5-up row). Copy from spec §2.
- [ ] Build PASS; DOM shows 5 stat numbers incl. "<$5/month". Commit.

### Task A4: Problem (§3)
- [ ] Heading + 2 body paragraphs + the "new class of work" line; 4 cards (Disconnected Systems, Manual Operations, Limited Visibility, AI That Creates More Work). Copy from spec §3.
- [ ] Build PASS; DOM shows 4 card titles. Commit.

### Task A5: Solution (§4)
- [ ] Heading + body + "system knows when to act" line; 6 cards (incl. Institutional Knowledge). Copy from spec §4.
- [ ] Build PASS; DOM shows 6 card titles. Commit. **Checkpoint: review Phase A with user; push `main`.**

---

## PHASE B — How We Work + Chase Agents (the two framework components)

### Task B1: `InterventionMatrix` component
**Files:** Create `src/components/InterventionMatrix.tsx`.
**Interfaces:** Produces `export default function InterventionMatrix(): JSX.Element` (self-contained, no props).
- [ ] 3-column bordered matrix. Column headers: "Deterministic Automation", "Hybrid", "AI-Assisted Judgment". Under each: a one-line definition + an examples line (copy from spec InterventionMatrix). Subtle teal→gold accent progression across columns (e.g., top border color per column: teal → muted → gold). Monospace column labels. Below the grid: the caption from spec. Must read as a framework grid, not bullets. Responsive: stacks to 1 column on mobile.
- [ ] Build PASS. (Rendered/verified when used in B2.)

### Task B2: How We Work section (§4.5)
- [ ] Heading + body; Phase 1 / Phase 2 / Phase 3 as a horizontal progression (numbered). Phase 2 renders `<InterventionMatrix />`. Copy from spec §4.5.
- [ ] Build PASS; DOM shows "Deterministic Automation"/"Hybrid"/"AI-Assisted Judgment" and 3 phase titles. Isolated-render screenshot to confirm the matrix reads as a grid. Commit.

### Task B3: `MeasurementLayers` component (interactive)
**Files:** Create `src/components/MeasurementLayers.tsx`.
**Interfaces:** Produces `export default function MeasurementLayers(): JSX.Element`. Uses `useState<number|null>` for the hovered/active layer.
- [ ] Stacked layers L5 (top, narrowest) → L1 (bottom, widest), widths increasing (e.g. 52% → 100%). Each layer: label (e.g., "Layer 3 — Operational KPIs"); on hover/focus (and tap on mobile) reveal its one-line description (copy from spec). Active layer highlighted (teal). Below: caption "Most vendors stop at Layer 5. We start there and report at Layer 1." Keyboard-focusable for a11y.
- [ ] Build PASS.

### Task B4: Chase Agents section (§5)
- [ ] Label "Enterprise Automation Platform" + heading + body + model-agnostic line. Architecture flow (vertical, arrowed): Business Systems → Chase Agents → AI Planning Layer → Deterministic Actions → Five-Layer Measurement → Monitoring → Business Outcomes. Under it, `<MeasurementLayers />`. Primary button "Explore Chase Agents" (→ chaseagents.com). Copy from spec §5.
- [ ] Build PASS; DOM shows flow nodes + all 5 layer labels; hover on a layer reveals description (verify via JS dispatch of mouseover or by asserting the description text nodes exist). Commit. **Checkpoint: review Phase B; push `main`.**

---

## PHASE C — Case Studies + Heineken page + Industries + Why + Leadership + CTA

### Task C1: Heineken placeholder page + route
**Files:** Create `src/pages/HeinekenCaseStudy.tsx`; Modify `src/App.tsx`.
- [ ] Page: `Header`, hero title "Heineken — Sustainability Monitoring", the 3 result bullets (multi-region monitoring · automated compliance reporting · executive operational visibility), a short "Full case study coming soon." body, a "Book a call" CTA, `Footer`. Match site styling. Route `/case-study/heineken` via react-router in `App.tsx` (follow existing `/resources/...` route pattern).
- [ ] Build PASS; navigate to `/case-study/heineken` → DOM shows "Heineken". Commit.

### Task C2: Case Studies (§6)
- [ ] Heading + 3 cards. CCID (4 metrics → existing blog case-study route, reuse the current link), Moya (4 metrics + "four-person team…" line → `/case-study/`), Heineken (3 bullets → `/case-study/heineken`). Copy from spec §6. Cards styled on the dark section like the current results cards.
- [ ] Build PASS; DOM shows 3 card titles + correct hrefs. Commit.

### Task C3: Industries (§7)
- [ ] Heading + 8 one-line cards (Manufacturing, Logistics, Government, Mining, BPO, Sales Operations, E-commerce, iGaming). Clean grid.
- [ ] Build PASS; DOM shows 8 items. Commit.

### Task C4: Why Chase Continental (§8)
- [ ] Heading + 6 cards (AI Must Not Create Work, Production Ready, Reliable AI, Observable, Model-Independent, Business Outcomes). Copy from spec §8.
- [ ] Build PASS; DOM shows 6 titles incl. "AI Must Not Create Work" and "Model-Independent". Commit.

### Task C5: Leadership (§9)
- [ ] Heading + intro sentence; keep founder cards (charles.png, caleb.jpg from `/static/images/team/`); trim each bio to ~3 sentences.
- [ ] Build PASS; DOM shows founder names. Commit.

### Task C6: Final CTA (§10) + Footer check
- [ ] Heading + methodology body; buttons Book a Strategy Call + See Case Studies; small "30-minute consultation • No obligation • Implementation roadmap included". Verify `Footer` links cover Company · Products · Case Studies · Resources · Blog · Privacy · Contact · LinkedIn · Email (adjust `Footer.tsx` only if links are missing).
- [ ] Full `npm run build` PASS; full-page DOM sweep (all 11 section headings present, no console errors). Commit. **Final: push `main`; verify live deploy.**

---

## Self-review
- **Spec coverage:** every spec section (1–10, 4.5, Footer, hero image, both components, Heineken page) maps to a task above (A2,A3,A4,A5,B2,B4,C2,C3,C4,C5,C6, plus B1/B3/C1). ✓
- **Placeholder scan:** none — copy is pulled verbatim from the committed spec; components have concrete structure. ✓
- **Type consistency:** components are prop-less default exports (`InterventionMatrix`, `MeasurementLayers`); imported by section tasks that use those exact names. ✓
