export type RouteMeta = {
  title: string;
  description: string;
  image: string;
};

export const SITE_ORIGIN = "https://chaseagents.com";
export const DEFAULT_IMAGE = "/static/images/chase-agents-hero.png";

export const DEFAULT_META: RouteMeta = {
  title: "Chase Continental — Production-grade AI agents",
  description:
    "Chase Continental - Production-grade AI agents that transform your operations.",
  image: DEFAULT_IMAGE,
};

export const ROUTE_META: Record<string, RouteMeta> = {
  "/": {
    title: "Chase Continental — Production-grade AI agents",
    description:
      "Production-grade AI agents and automation that run inside real operations. Deterministic execution, built for enterprise reliability.",
    image: DEFAULT_IMAGE,
  },

  "/resources/charles": {
    title: "Charles — AI Product Builder & Founder | Chase Agents",
    description:
      "I build AI products and execution systems that run inside real operations. Founder, systems thinker, and product-led transformation operator.",
    image: "/static/images/team/charles.png",
  },
  "/resources/ai-roi-calculator": {
    title: "AI Automation ROI Calculator | Chase Agents",
    description:
      "Calculate your AI automation ROI with industry-specific benchmarks from McKinsey, Deloitte, and PwC. 12+ sectors, revenue & headcount based projections.",
    image: DEFAULT_IMAGE,
  },
  "/resources/deterministic-blueprint": {
    title: "Deterministic Automation Blueprint (Free) | Chase Agents",
    description:
      "A fill-in-the-blank template to turn messy work into a repeatable workflow.",
    image: DEFAULT_IMAGE,
  },
  "/resources/ccid-case-study": {
    title: "CCID Case Study (Download) | Chase Agents",
    description:
      "See how CCID achieved faster processing and stronger visibility with Chase Agents as the operating layer.",
    image: DEFAULT_IMAGE,
  },
  "/resources/silo-audit-checklist": {
    title: "AI Agent Silo Checklist — Free Assessment | Chase Agents",
    description:
      "Uncover whether your AI initiatives are creating new silos. 20-point assessment with an operating-layer action plan.",
    image: DEFAULT_IMAGE,
  },
  "/resources/transformation-playbook": {
    title: "AI Transformation Playbook (Free) | Chase Agents",
    description:
      "A practical guide to ship reliable AI automation—without failed pilots, wasted budget, or chaos.",
    image: DEFAULT_IMAGE,
  },
  "/resources/reliability-assessment": {
    title: "Production Reliability Assessment (Free) | Chase Agents",
    description:
      "Take a 5-minute assessment to see if your automation can hold up in production, then map your operating-layer next steps.",
    image: DEFAULT_IMAGE,
  },
  "/resources/orchestration-swipeFile": {
    title: "Automation Workflow Swipe File (Free) | Chase Agents",
    description:
      "15 workflow patterns you can adapt across logistics, supply chain, BPO, and e-commerce with operating-layer execution principles.",
    image: DEFAULT_IMAGE,
  },
  "/resources/peak-season-survival-guide": {
    title: "Peak Season Survival Guide | Chase Agents",
    description:
      "Keep workflows stable when volume spikes with an operating-layer checklist for peak-season reliability.",
    image: DEFAULT_IMAGE,
  },
  "/resources/5-day-pilot-challenge": {
    title: "5-Day Automation Pilot Guide (Free) | Chase Agents",
    description:
      "Get the 5-day pilot guide, map one workflow, define metrics, and move into deterministic operating-layer execution.",
    image: DEFAULT_IMAGE,
  },
  "/resources/neutral-vs-proprietary-scorecard": {
    title: "Neutral vs Proprietary Scorecard (Free) | Chase Agents",
    description:
      "Score your stack in 5 minutes. See lock-in risk and the fastest path to reliable automation.",
    image: DEFAULT_IMAGE,
  },
  "/resources/shopify-ops-automation": {
    title: "Shopify Automation — AI-Powered Ops for Shopify | Chase Agents",
    description:
      "Production-grade Shopify automation: orders, inventory, fulfillment, returns, support, and finance — all orchestrated by Chase Agents.",
    image: DEFAULT_IMAGE,
  },
};
