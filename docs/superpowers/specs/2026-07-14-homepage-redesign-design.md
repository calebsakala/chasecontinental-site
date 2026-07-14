# Chase Continental Homepage Redesign — Design Spec

Date: 2026-07-14
Repo: calebsakala/chasecontinental-site (Netlify, React + Vite + Tailwind + shadcn)
File in focus: `src/pages/LandingPage.tsx` (full rewrite)

## Objective
Redesign the homepage to tell one linear story to an enterprise operations leader:
solve operational problems → how we think → how we build → proof → why different →
who we are → let's talk. Feel closer to Stripe / Linear / Retool / Palantir / OpenAI
than a consulting site. Sell the **business outcome**; AI is the mechanism, not the pitch.
Make the **methodology** (critical-path mapping → intervention classification → precision
build) visible throughout — it's the moat competitors can't copy.

## Global decisions
- **Full rewrite** of `LandingPage.tsx` into the 11-section order below.
- **Keep the design system**: tokens (navy `--primary`, `--teal`, `--gold`, `--background`),
  Plus Jakarta Sans headings, `Header`, `Footer`, shadcn `Button`/`Card`, `Reveal` wrapper.
- **Reuse** already-built: Trusted by (CCID, Heineken, Moya, Datafree, HealthyMe) and
  Backed by (Google Cloud for Startups, Microsoft for Startups Founders Hub) rows; the
  hosted `/case-study/` page (Moya) and its links.
- **Remove**: decorative gradients, repeated messaging, "Security" and "Product Thinking"
  value cards (replaced), and any section not in the new order.
- **Restraint**: generous whitespace, strong type, clean grids, diagrams/metrics over
  abstract AI art.
- **Phased implementation** (verify + commit each phase): (A) scaffold + Hero + §2–4;
  (B) §4.5 How We Work + §5 Chase Agents; (C) §6–10 + Heineken placeholder page.

## Hero image
- Use `dcxs.png` (team + Cape Town sunset + architecture-flow overlay). Copy to
  `public/static/images/hero-ops.png`. Treat as an enterprise UI panel: rounded corners,
  1px border, soft shadow; crop/position so the team + diagram read on the right column.
- Keep current `hero-robot.png` in the repo, unreferenced (revert path). `fg.png` (founder
  split) kept aside for possible Leadership use later.

## Two framework components (built as real UI)
### InterventionMatrix (used in §4.5)
3-column bordered matrix, subtle teal→gold progression (certainty→judgment):
- **Deterministic Automation** — Rule-based. No model. Zero hallucination risk.
  Scheduling, routing, formatting, validation.
- **Hybrid** — Model-assisted with a human review gate. Analysis drafts, anomaly
  flagging, risk scoring.
- **AI-Assisted Judgment** — Model informs. Human decides. Strategy, relationship,
  interpretation.
Caption: "This classification determines where AI adds value and where deterministic
execution is safer, cheaper, and more reliable." Reads as a framework, not a bullet list.

### MeasurementLayers (used in §5)
Interactive stacked diagram, Layer 5 (top, narrow) → Layer 1 (bottom, widest). Hover/tap a
layer to reveal its one-line description.
- L5 Technical Performance — model accuracy, latency, error rates
- L4 Adoption — usage frequency, tool diversity, workflow coverage
- L3 Operational KPIs — cycle time, completion rates, rework reduction
- L2 Strategic Outcomes — capacity freed for judgment, new capabilities unlocked
- L1 Financial Impact — revenue lift, cost avoidance, cost elimination
Caption: "Most vendors stop at Layer 5. We start there and report at Layer 1."

## Sections (final copy)
1. **Hero** — H: "Building software that changes the way people work." Sub: "We design and
   build reliable AI systems that automate operations, connect business software, and help
   teams execute faster — with measurable outcomes, complete visibility, and enterprise-grade
   reliability." Quiet line: *"The AI works. Nobody has to ask it to."* Buttons: Book a
   Strategy Call (primary), Explore Our Work (secondary). Right: hero-ops.png. Below:
   Trusted by + Backed by rows.
2. **Results** — H: "Proven in production." 5 cards: 100+ workflows automated · 30+ countries
   with active deployments · 90% reduction in manual processing time · 10.4× productivity
   improvement · <$5/month operational cost per automation at scale. Caption: "Measured across
   client engagements and production deployments."
3. **Problem** — H: "Most companies don't have an AI problem. They have an operations problem."
   Body (2 paras) + line: "Most AI pilots make this worse — they create a new class of work:
   prompting, checking, correcting, and rerunning." 4 cards: Disconnected Systems · Manual
   Operations · Limited Visibility · AI That Creates More Work.
4. **Solution** — H: "We turn disconnected operations into one intelligent system." Body +
   line: "The system knows when to act. Nobody has to tell it to." 6 cards: Connect Every
   System · Digital Employees · Reliability First · Human Control · Built-In Measurement ·
   Institutional Knowledge.
4.5 **How We Work** (new) — H: "A methodology built for operational environments." Body: "We
   don't start with AI. We start with the workflow." Phase 1 Diagnostic Framing · Phase 2
   Intervention Classification (InterventionMatrix) · Phase 3 Precision Intervention.
5. **Chase Agents** — label "Enterprise Automation Platform"; H: "Powered by Chase Agents."
   Body + model-agnostic line ("runs inside Claude, ChatGPT, or any MCP-compatible
   environment. No vendor lock-in. No single point of failure."). Architecture flow: Business
   Systems → Chase Agents → AI Planning Layer → Deterministic Actions → Five-Layer Measurement
   → Monitoring → Business Outcomes. MeasurementLayers component under it. Button: Explore
   Chase Agents.
6. **Case Studies** — H: "Real deployments. Measurable outcomes." CCID (90% faster · 100%
   paperless · 4× visibility · 60% lower costs → existing blog route); Moya (10.4× · 18%
   revenue · 3wk→<1hr · <$5/mo; line: "A four-person team now operates at the output capacity
   of a full department." → `/case-study/`); Heineken (multi-region monitoring · automated
   compliance reporting · executive visibility → **new placeholder page `/case-study/heineken/`**).
7. **Industries** — H: "Built for operations-intensive organisations." 8 one-line cards:
   Manufacturing, Logistics, Government, Mining, BPO, Sales Operations, E-commerce, iGaming.
8. **Why Chase Continental** — H: "Why enterprise teams choose Chase Continental." 6 cards:
   AI Must Not Create Work · Production Ready · Reliable AI · Observable · Model-Independent ·
   Business Outcomes.
9. **Leadership** — H: "Built by operators who ship production systems." Intro sentence. Keep
   founder cards (charles.png, caleb.jpg); bios ~3 sentences.
10. **Final CTA** — H: "Ready to automate the work that's slowing your business down?" Body
   (methodology-specific). Buttons: Book a Strategy Call, See Case Studies. Small: "30-minute
   consultation • No obligation • Implementation roadmap included."
- **Footer** — existing `Footer` component; verify links (Company · Products · Case Studies ·
  Resources · Blog · Privacy · Contact · LinkedIn · Email).

## Heineken placeholder page
New route `/case-study/heineken/` — a plain, on-brand case-study scaffold (Header/Footer, hero
title "Heineken", the three result bullets, and a "content coming soon" body). Content to be
supplied later. Wire the §6 Heineken card button to it.

## Deploy
`npm run build` (tsc + vite) each phase → verify (DOM + isolated render where below-fold) →
commit → push `main` → Netlify auto-deploys. `git add` explicit paths to avoid partial commits.
