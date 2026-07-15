export type RouteMeta = {
  title: string;
  description: string;
  image: string;
};

export const SITE_ORIGIN = "https://chasecontinental.com";
export const DEFAULT_IMAGE = "/static/images/og-chasecontinental.jpg";

export const DEFAULT_META: RouteMeta = {
  title: "Chase Continental: AI Automation Agency for Enterprise Operations",
  description:
    "An AI studio that redesigns how organisations work. We build reliable AI automation and custom software that deliver measurable business outcomes.",
  image: DEFAULT_IMAGE,
};

export const ROUTE_META: Record<string, RouteMeta> = {
  "/": {
    title: "Chase Continental: AI Automation Agency for Enterprise Operations",
    description:
      "We build software that changes the way people work. Reliable AI automation and custom systems for organisations ready to scale, strategy, tooling, and execution.",
    image: DEFAULT_IMAGE,
  },
  "/products": {
    title: "Chase Agents & OptiWeb: Our Products | Chase Continental",
    description:
      "Chase Agents: reliable AI automation with the flexibility of AI and the reliability of code. OptiWeb: web design and Google Business Profile management.",
    image: DEFAULT_IMAGE,
  },
  "/resources": {
    title: "Resources & Insights | Chase Continental",
    description:
      "Case studies, frameworks, and points of view on building AI automation that survives contact with real operations.",
    image: DEFAULT_IMAGE,
  },
  "/resources/charles": {
    title: "Charles K. Chirongoma: Building organizations that think | Chase Continental",
    description:
      "Charles K. Chirongoma designs how organisations make decisions, then builds the systems that execute them. The thesis behind Chase Agents, OptiWeb, and Precinct.",
    image: "/static/images/team/charles.png",
  },
  "/resources/heineken-case-study": {
    title: "Heineken Circular Economy Programme: Case Study | Chase Continental",
    description:
      "With Greenway Africa, we cleaned and structured messy field data into a governed reporting system across four regions, 252,000 tonnes of glass recovered, 14 KPIs tracked monthly.",
    image: DEFAULT_IMAGE,
  },
  "/resources/ccid-case-study": {
    title: "CCID Digital Transformation: Case Study | Chase Continental",
    description:
      "How CCID moved manual workflows into a modern operational system: 90% faster processing, 100% paperless, and 4× operational visibility.",
    image: DEFAULT_IMAGE,
  },
  "/case-study/": {
    title: "Moya App: AI Enablement Case Study | Chase Continental",
    description:
      "A three-week research delivery cycle compressed to under an hour, revenue lifted, and the full stack running for under $5 a month, a 10.4× productivity gain.",
    image: DEFAULT_IMAGE,
  },
  "/blogs": {
    title: "Blog | Chase Continental",
    description:
      "Points of view on AI in production, operational design, and building systems that make organisations more capable over time.",
    image: DEFAULT_IMAGE,
  },
  "/resources/ai-roi-calculator": {
    title: "AI Automation ROI Calculator | Chase Continental",
    description:
      "Estimate your AI automation ROI with industry benchmarks across 12+ sectors, based on revenue and headcount.",
    image: DEFAULT_IMAGE,
  },
  "/resources/deterministic-blueprint": {
    title: "Deterministic Automation Blueprint | Chase Continental",
    description:
      "A fill-in-the-blank template to turn messy work into a repeatable, reliable workflow.",
    image: DEFAULT_IMAGE,
  },
  "/resources/silo-audit-checklist": {
    title: "AI Agent Silo Checklist | Chase Continental",
    description:
      "A 20-point assessment to uncover whether your AI initiatives are creating new silos, with an operating-layer action plan.",
    image: DEFAULT_IMAGE,
  },
  "/resources/transformation-playbook": {
    title: "AI Transformation Playbook | Chase Continental",
    description:
      "A practical guide to shipping reliable AI automation without failed pilots, wasted budget, or chaos.",
    image: DEFAULT_IMAGE,
  },
  "/resources/reliability-assessment": {
    title: "Production Reliability Assessment | Chase Continental",
    description:
      "A 5-minute assessment to see whether your automation can hold up in production, with your next steps mapped.",
    image: DEFAULT_IMAGE,
  },
  "/resources/orchestration-swipe-file": {
    title: "Automation Workflow Swipe File | Chase Continental",
    description:
      "15 workflow patterns you can adapt across logistics, supply chain, BPO, and e-commerce.",
    image: DEFAULT_IMAGE,
  },
  "/resources/peak-season-survival-guide": {
    title: "Peak Season Survival Guide | Chase Continental",
    description:
      "Keep workflows stable when volume spikes, with a checklist for peak-season reliability.",
    image: DEFAULT_IMAGE,
  },
  "/resources/5-day-pilot-challenge": {
    title: "5-Day Automation Pilot Guide | Chase Continental",
    description:
      "Map one workflow, define metrics, and move into deterministic execution in five days.",
    image: DEFAULT_IMAGE,
  },
  "/resources/neutral-vs-proprietary-scorecard": {
    title: "Neutral vs Proprietary Scorecard | Chase Continental",
    description:
      "Score your stack in 5 minutes. See lock-in risk and the fastest path to reliable automation.",
    image: DEFAULT_IMAGE,
  },
  "/resources/shopify-ops-automation": {
    title: "Shopify Ops Automation | Chase Continental",
    description:
      "Orders, inventory, fulfilment, returns, support, and finance, orchestrated with reliable AI automation.",
    image: DEFAULT_IMAGE,
  },
  "/privacy": {
    title: "Privacy Policy | Chase Continental",
    description: "How Chase Continental collects, uses, and protects your data.",
    image: DEFAULT_IMAGE,
  },
};
