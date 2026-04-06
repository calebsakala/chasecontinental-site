import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";
import { drawBrandHeader } from "../_shared/pdf-branding.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SwipeFileRequest {
  lead_id?: string;
  name: string;
  email: string;
  company?: string;
}

/* ─── All 15 workflow patterns ─── */
const PATTERNS = [
  {
    id: 1,
    title: "Automated Order Fulfillment Workflow",
    category: "E-commerce",
    overview:
      "Streamlines end-to-end order processing from receipt to delivery, automating stock checks, payment confirmation, warehouse notification, label generation, and tracking updates.",
    realInsights:
      "Platforms like NetworkON automate this to handle peak volumes, reducing manual emails and boosting fulfillment speed by 30%. Companies with mature fulfillment automation report 40% fewer shipping errors and 25% faster order-to-door times.",
    whereItBreaks:
      "Fails during inventory discrepancies (e.g., real-time stockouts) or integration lags between ERP/CRM systems, leading to over-promising deliveries. Multi-warehouse routing adds complexity when stock levels aren't synchronized in real-time. Payment gateway timeouts can stall the entire chain.",
    implementationTips: [
      "Integrate with APIs from tools like NetSuite; use RPA bots for validation",
      "Start with 20% of orders automated and scale based on error rates",
      "Implement circuit breakers between payment and fulfillment stages",
      "Add dead-letter queues for failed order processing attempts",
      "Monitor order-to-ship time as your primary reliability metric",
    ],
  },
  {
    id: 2,
    title: "Predictive Inventory Replenishment",
    category: "Supply Chain",
    overview:
      "Uses AI to forecast demand and auto-trigger replenishment orders based on historical data, sales trends, and external factors like weather and economic indicators.",
    realInsights:
      "Striim's real-time analytics prevent stockouts in supply chains, with ML models analyzing routes and bundling dead stock for clearance, improving profitability by 15-20%. Companies using predictive replenishment see 30% reduction in carrying costs.",
    whereItBreaks:
      "Inaccurate data inputs (e.g., unaccounted seasonal spikes) cause overstocking. Lacks human oversight for black-swan events like supply disruptions. New product launches have no historical data to train on. Supplier lead time variability undermines auto-ordering accuracy.",
    implementationTips: [
      "Leverage big data tools like DHL's prescriptive analytics",
      "Set thresholds for auto-orders with manual override capabilities",
      "Combine with IoT sensors for real-time stock monitoring",
      "Build in safety stock buffers that adjust dynamically",
      "Retrain models monthly with latest sales data to prevent drift",
    ],
  },
  {
    id: 3,
    title: "AI-Optimized Delivery Routing",
    category: "Logistics",
    overview:
      "Dynamically plans routes using AI to factor in traffic, weather, load, and deadlines, minimizing fuel consumption and delivery time across the fleet.",
    realInsights:
      "Datamatics' Agentic AI agents optimize LTL consignments, reducing delivery times by 25% in logistics networks. JD.com's real-time routing handles 1M+ daily deliveries with 99.2% on-time rates.",
    whereItBreaks:
      "Relies on accurate geo-data; breaks in rural areas with poor connectivity or unexpected road closures. Real-time recalculation under high load can cause timeout cascades. Driver override behavior (ignoring suggested routes) creates data integrity issues.",
    implementationTips: [
      "Use ML libraries like networkx for graph optimization; integrate with GPS APIs",
      "Pilot in one region before scaling; cache last-known-good routes as fallback",
      "Build driver feedback loops to improve route quality over time",
      "Implement geofencing alerts for deviation detection",
      "Test with historical delivery data before live deployment",
    ],
  },
  {
    id: 4,
    title: "Robotic Warehouse Picking System",
    category: "Logistics",
    overview:
      "Deploys robots and automated systems for picking, sorting, and packing, guided by ML for efficient travel paths within warehouse zones.",
    realInsights:
      "AI-powered warehouses reduce sorting time by 40%, as seen in e-commerce giants with AS/RS cutting human travel. Amazon's Kiva robots handle 300+ picks/hour vs 100 for manual processes.",
    whereItBreaks:
      "Hardware failures or mismatched item sizes disrupt flow. High initial costs ($2-5M+) limit scalability for SMEs. Software bugs in path planning can cause robot gridlock. Mixed-SKU pallets confuse picking algorithms.",
    implementationTips: [
      "Start with hybrid human-robot setups; use barcode integration for accuracy",
      "Monitor with analytics to refine picking algorithms weekly",
      "Implement graceful degradation — manual fallback when robots fail",
      "Zone your warehouse to minimize robot travel distance",
      "Maintain 99.5%+ barcode scan accuracy as your quality gate",
    ],
  },
  {
    id: 5,
    title: "RPA for Invoice Processing",
    category: "BPO",
    overview:
      "Automates data entry, validation, and reconciliation of invoices using software bots across multiple formats, currencies, and regulatory requirements.",
    realInsights:
      "BPO firms cut processing time by 40% via RPA, handling global logistics workflows across 15 countries. Staple.ai reports 92% straight-through processing rates for standardized invoice formats.",
    whereItBreaks:
      "Non-standard invoice formats cause OCR errors (handwritten notes, unusual layouts). Security risks if bots access sensitive financial data without encryption. Currency conversion edge cases create reconciliation mismatches. PDF image quality directly impacts accuracy.",
    implementationTips: [
      "Deploy rule-based bots first, then add AI for OCR on complex formats",
      "Audit logs for compliance — every bot action must be traceable",
      "Integrate with ERP systems like SAP or Oracle Financials",
      "Build exception queues for invoices that fail validation",
      "Set confidence thresholds — anything below 95% goes to human review",
    ],
  },
  {
    id: 6,
    title: "Real-Time Supply Chain Visibility",
    category: "Supply Chain",
    overview:
      "Provides end-to-end tracking via IoT sensors and analytics platforms, alerting stakeholders on delays, temperature deviations, or anomalies in real-time.",
    realInsights:
      "Flow.space uses big data for accurate inventory positioning, enabling proactive adjustments in e-commerce supply chains. Companies with real-time visibility report 20% faster response to disruptions.",
    whereItBreaks:
      "Data silos between partners fragment visibility — each tier may use different standards. IoT feed latency during peak loads degrades real-time accuracy. Sensor battery failures create blind spots. Legacy partner systems resist API integration.",
    implementationTips: [
      "Use unified streaming platforms like Striim or Kafka for data aggregation",
      "Implement dashboards with anomaly detection and auto-alerting",
      "Ensure API compatibility across all supply chain partners",
      "Build redundancy into IoT networks (dual sensors for critical checkpoints)",
      "Start with tier-1 suppliers and expand visibility gradually",
    ],
  },
  {
    id: 7,
    title: "Machine Learning Demand Forecasting",
    category: "Big Data",
    overview:
      "Analyzes massive datasets to predict sales volumes, incorporating promotions, market trends, competitor pricing, and macroeconomic indicators.",
    realInsights:
      "JD.com's AI models improve forecasting accuracy by 20% using explainable AI for promotion planning. Best-in-class forecasters achieve MAPE (Mean Absolute Percentage Error) under 15%.",
    whereItBreaks:
      "Biased historical data leads to flawed predictions — garbage in, garbage out. Models can't account for truly novel events (pandemics, trade wars). Promotional cannibalization effects confuse simple models. Real-time data pipeline failures cause stale predictions.",
    implementationTips: [
      "Train models on diverse, clean datasets spanning 3+ years",
      "Use ensemble methods (combine multiple model outputs) for robustness",
      "Validate with A/B testing — compare ML forecasts vs baseline",
      "Build human override capabilities for known upcoming anomalies",
      "Monitor model drift monthly and retrain when accuracy drops 5%+",
    ],
  },
  {
    id: 8,
    title: "Automated Exception Management",
    category: "Operations",
    overview:
      "Detects and resolves workflow issues like delays, quality failures, and data anomalies via intelligent alerts, auto-rerouting, and escalation protocols.",
    realInsights:
      "NetSuite's supply chain automation handles exceptions in manufacturing, reducing downtime by 30%. Mature exception management systems resolve 70% of incidents without human intervention.",
    whereItBreaks:
      "Over-reliance on static rules misses nuanced, multi-factor cases. Escalation loops can overwhelm teams when thresholds are miscalibrated. Alert fatigue causes operators to ignore genuine critical issues. New exception types aren't caught by existing rules.",
    implementationTips: [
      "Define clear, tiered thresholds (warning → critical → emergency)",
      "Integrate with notification services (Slack, PagerDuty) for smart routing",
      "Log all exception resolutions to train ML models for future auto-resolution",
      "Review and prune alert rules quarterly to prevent fatigue",
      "Build self-healing capabilities for the top 10 most common exceptions",
    ],
  },
  {
    id: 9,
    title: "Streamlined Returns Processing",
    category: "E-commerce",
    overview:
      "Automates return requests, quality inspections, refund processing, restocking decisions, and customer communication in a single orchestrated flow.",
    realInsights:
      "RPA cuts e-commerce returns processing time by 50%, with AI-powered fraud detection reducing fraudulent returns by 35%. Companies with automated returns report 20% higher customer satisfaction scores.",
    whereItBreaks:
      "High return volumes during sales events overwhelm queue capacity. Poor integration with inventory systems causes double-counting or ghost stock. Subjective quality assessments resist full automation. Cross-border returns add customs and currency complexity.",
    implementationTips: [
      "Use workflows with conditional logic (return reason → inspection level)",
      "Add photo verification via computer vision for damage assessment",
      "Track return rate metrics by SKU to identify product quality issues",
      "Build fraud scoring models based on customer return history",
      "Implement restocking priority queues for high-demand returned items",
    ],
  },
  {
    id: 10,
    title: "Vendor Managed Inventory Automation",
    category: "Supply Chain",
    overview:
      "Suppliers auto-monitor retail stock levels and replenish based on shared real-time data, shifting inventory management responsibility to the vendor.",
    realInsights:
      "Lean supply chain systems optimize manufacturing supply chains, reducing holding costs by 25%. Walmart's VMI program with P&G is the gold standard, eliminating 15% of distribution costs.",
    whereItBreaks:
      "Trust issues in data sharing — retailers fear exposing sales data; suppliers fear demand manipulation. Delays if supplier ERP systems are incompatible with retailer platforms. Demand spikes require faster response than VMI agreements typically allow.",
    implementationTips: [
      "Establish SLAs with clear performance penalties and rewards",
      "Use secure API gateways with data masking for sensitive information",
      "Start with top 3 vendors by volume to prove the model",
      "Build shared dashboards for transparency and alignment",
      "Define escalation protocols for stock-out emergencies",
    ],
  },
  {
    id: 11,
    title: "Dynamic Pricing Engine",
    category: "E-commerce",
    overview:
      "Adjusts prices in real-time based on demand signals, competitive pricing, inventory levels, time of day, and customer segments.",
    realInsights:
      "Datamatics' AI agents for logistics generate competitive LTL pricing, boosting margins by 8-12%. Airlines and hotels pioneered this — e-commerce adoption is growing 30% year-over-year.",
    whereItBreaks:
      "Rapid fluctuations alienate customers who see different prices minutes apart. Regulatory hurdles in some markets (EU price discrimination rules). Competitor scraping introduces noisy signals. Price wars can emerge from two dynamic engines competing.",
    implementationTips: [
      "Set guardrails: minimum margin, maximum discount %, rate-of-change limits",
      "Monitor customer sentiment alongside price changes",
      "Test in low-stakes product categories before rolling out broadly",
      "Build A/B testing into the engine to measure elasticity",
      "Implement price explanation capabilities for customer service teams",
    ],
  },
  {
    id: 12,
    title: "Dead Stock Liquidation Automation",
    category: "Supply Chain",
    overview:
      "Identifies slow-moving inventory using velocity analysis and auto-triggers markdown sequences, channel-specific bundling, or liquidation auction workflows.",
    realInsights:
      "Striim's analytics bundle dead stock for e-commerce discounts, clearing inventory efficiently. Companies with automated liquidation recover 40% more value vs ad-hoc markdown approaches.",
    whereItBreaks:
      "Misidentification of seasonal items (winter coats flagged in summer). Over-discounting erodes brand perception and trains customers to wait for sales. Bundling slow-movers with popular items can hurt star product margins.",
    implementationTips: [
      "Use time-based thresholds with seasonal exclusion calendars",
      "Integrate with secondary marketplace APIs (B-Stock, Overstock)",
      "Analyze post-liquidation ROI to refine trigger sensitivity",
      "Build brand-protection guardrails (minimum price floors, channel restrictions)",
      "Create automated reporting for finance teams on write-down projections",
    ],
  },
  {
    id: 13,
    title: "Automated Customer Service Ticketing",
    category: "BPO",
    overview:
      "Routes customer queries to AI chatbots or specialist teams using intent classification, automating responses for common issues while escalating complex cases.",
    realInsights:
      "Staple.ai's CRM handles 1M queries monthly, boosting satisfaction by 20%. Best-in-class systems resolve 65% of tickets without human intervention and reduce average handling time by 40%.",
    whereItBreaks:
      "Complex multi-issue queries confuse single-intent classifiers. AI hallucinations in unstructured free-text responses erode trust. Sentiment detection fails on sarcasm and cultural nuances. Escalated tickets lose context in the handoff to human agents.",
    implementationTips: [
      "Train on historical tickets with balanced positive/negative examples",
      "Use sentiment analysis for smart escalation timing",
      "Maintain hybrid approach — never remove human escalation path",
      "Build context-passing protocols so agents see full conversation history",
      "Monitor CSAT by channel to detect automation quality degradation",
    ],
  },
  {
    id: 14,
    title: "Compliance Auditing Workflow",
    category: "Operations",
    overview:
      "Automates regulatory compliance checks against current rules, generates audit reports, flags violations, and routes remediation tasks to responsible teams.",
    realInsights:
      "DHL's AI analytics ensure resilient supply chains with prescriptive compliance optimization. Automated compliance reduces audit preparation time by 60% and catches 3× more violations than manual processes.",
    whereItBreaks:
      "Evolving laws outpace rule engine updates — especially across jurisdictions. Incomplete data inputs lead to false positives that waste investigator time. Natural language regulations resist rule-based encoding. Cross-border compliance multiplies complexity exponentially.",
    implementationTips: [
      "Update rule engines quarterly with legal team sign-off",
      "Integrate with legal databases for live regulatory feed updates",
      "Automate notifications with SLA-tracked remediation workflows",
      "Build jurisdiction-specific rule sets rather than one-size-fits-all",
      "Create audit trail reports that satisfy both internal and external reviewers",
    ],
  },
  {
    id: 15,
    title: "End-to-End Supply Chain Orchestration",
    category: "Supply Chain",
    overview:
      "Agentic AI coordinates planning, sourcing, manufacturing, logistics, and delivery optimization across all stages using autonomous decision-making agents.",
    realInsights:
      "ArXiv research frameworks use generative AI for e-commerce, bridging intent to action. Early adopters report 25% improvement in supply chain responsiveness and 15% reduction in total logistics cost.",
    whereItBreaks:
      "Over-complexity in multi-agent systems creates debugging nightmares. Dependency on high-quality, real-time data across all stages. Agent conflicts when optimizing for competing objectives (cost vs speed). Lack of explainability makes stakeholders distrustful of autonomous decisions.",
    implementationTips: [
      "Build modular agents — each responsible for one domain",
      "Use natural language interfaces for ops teams to monitor and override",
      "Iterate based on feedback; don't attempt full orchestration from day one",
      "Implement guardrails: maximum autonomous decision value, escalation rules",
      "Create explainability dashboards showing why each decision was made",
    ],
  },
];

async function buildPdf(req: SwipeFileRequest): Promise<Uint8Array> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  const M = 20; // margin
  const CW = W - 2 * M; // content width
  let y = 0;

  const addPage = () => {
    doc.addPage();
    y = M;
  };

  const checkSpace = (needed: number) => {
    if (y + needed > H - 25) addPage();
  };

  // Helper colors
  const COBALT = [0, 71, 171] as const;
  const DARK = [15, 23, 42] as const;
  const GOLD = [255, 215, 0] as const;
  const LIME = [191, 255, 0] as const;
  const WHITE = [255, 255, 255] as const;
  const GRAY = [148, 163, 184] as const;
  const LIGHT_BG = [241, 245, 249] as const;

  // ─── COVER PAGE ───
  doc.setFillColor(...DARK);
  doc.rect(0, 0, W, H, "F");

  // Accent strip
  doc.setFillColor(...COBALT);
  doc.rect(0, 0, W, 6, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, 6, W, 2, "F");

  await drawBrandHeader(doc, {
    margin: M,
    top: 14,
    textColor: [...GOLD],
    fontSize: 12,
    logoHeight: 8.5,
    gap: 4,
  });

  // Badge
  y = 60;
  doc.setFillColor(COBALT[0], COBALT[1], COBALT[2]);
  doc.roundedRect(M, y, 55, 10, 5, 5, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("EXCLUSIVE SWIPE FILE", M + 27.5, y + 6.5, { align: "center" });

  // Title
  y += 25;
  doc.setTextColor(...WHITE);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(
    "15 Proven Automation Workflow Patterns",
    CW,
  );
  doc.text(titleLines, M, y);
  y += titleLines.length * 14;

  // Subtitle
  y += 5;
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  const subLines = doc.splitTextToSize(
    "Real-World Strategies for Logistics, Supply Chain, Big Data, BPO, and E-Commerce",
    CW,
  );
  doc.text(subLines, M, y);
  y += subLines.length * 8;

  // Divider line
  y += 15;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(M, y, M + 60, y);

  // Prepared for
  y += 12;
  doc.setFontSize(11);
  doc.setTextColor(...GRAY);
  doc.text("Prepared for", M, y);
  y += 7;
  doc.setFontSize(14);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.text(req.name, M, y);
  if (req.company) {
    y += 7;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    doc.text(req.company, M, y);
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text("Chase Continental | March 2026", M, H - 20);
  doc.text("chasecontinental.com", W - M, H - 20, { align: "right" });

  // ─── EXECUTIVE SUMMARY ───
  addPage();

  // Header bar
  doc.setFillColor(...COBALT);
  doc.rect(0, 0, W, 3, "F");

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text("Executive Summary", M, y + 5);
  y += 15;

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(M, y, M + 40, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);

  const execSummary = [
    "In today's hyper-competitive landscape, automation is not just an efficiency tool — it's a strategic imperative. This swipe file distills 15 battle-tested workflow patterns drawn from real implementations across logistics, supply chain, big data, BPO, and e-commerce.",
    "",
    "These patterns address core challenges like handoffs, exceptions, and scalability, drawing insights from leaders like JD.com, DHL, and Amazon-inspired models.",
    "",
    "Key takeaways:",
  ];

  for (const para of execSummary) {
    if (para === "") {
      y += 4;
      continue;
    }
    const lines = doc.splitTextToSize(para, CW);
    checkSpace(lines.length * 5);
    doc.text(lines, M, y);
    y += lines.length * 5;
  }

  y += 3;
  const keyTakeaways = [
    "Automation can reduce processing times by 40-50% while cutting errors by up to 70%",
    "Focus on integration points to avoid silos; real-time analytics turns data into decisions",
    "Implementation success hinges on starting small, iterating with AI, and monitoring for edge cases",
  ];

  for (const kt of keyTakeaways) {
    checkSpace(8);
    doc.setFillColor(...LIGHT_BG);
    const ktLines = doc.splitTextToSize(kt, CW - 12);
    doc.roundedRect(M, y - 3, CW, ktLines.length * 5 + 6, 2, 2, "F");
    doc.setTextColor(...COBALT);
    doc.setFont("helvetica", "bold");
    doc.text("→", M + 4, y + 1);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(ktLines, M + 12, y + 1);
    y += ktLines.length * 5 + 10;
  }

  // ─── PATTERN PAGES ───
  for (const pattern of PATTERNS) {
    addPage();

    // Top accent bar
    doc.setFillColor(...COBALT);
    doc.rect(0, 0, W, 3, "F");

    // Pattern number badge
    doc.setFillColor(...COBALT);
    doc.roundedRect(M, y, 30, 10, 3, 3, "F");
    doc.setTextColor(...WHITE);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`PATTERN ${pattern.id}`, M + 15, y + 6.5, { align: "center" });

    // Category badge
    doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.roundedRect(M + 35, y, 35, 10, 3, 3, "F");
    doc.setTextColor(...DARK);
    doc.setFontSize(8);
    doc.text(pattern.category.toUpperCase(), M + 52.5, y + 6.5, {
      align: "center",
    });

    y += 18;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    const tLines = doc.splitTextToSize(pattern.title, CW);
    doc.text(tLines, M, y);
    y += tLines.length * 8 + 5;

    // Gold divider
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(M, y, M + 40, y);
    y += 8;

    // Overview
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COBALT);
    doc.text("Overview", M, y);
    y += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const oLines = doc.splitTextToSize(pattern.overview, CW);
    checkSpace(oLines.length * 5);
    doc.text(oLines, M, y);
    y += oLines.length * 5 + 8;

    // Real Insights
    checkSpace(30);
    doc.setFillColor(...LIGHT_BG);
    const riLines = doc.splitTextToSize(pattern.realInsights, CW - 10);
    doc.roundedRect(M, y - 3, CW, riLines.length * 5 + 16, 3, 3, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COBALT);
    doc.text("Real-World Insights", M + 5, y + 3);
    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(riLines, M + 5, y);
    y += riLines.length * 5 + 12;

    // Where It Breaks
    checkSpace(30);
    doc.setFillColor(255, 247, 237); // warm bg
    const wbLines = doc.splitTextToSize(pattern.whereItBreaks, CW - 10);
    doc.roundedRect(M, y - 3, CW, wbLines.length * 5 + 16, 3, 3, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(194, 65, 12); // amber-700
    doc.text("⚠ Where It Breaks", M + 5, y + 3);
    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(wbLines, M + 5, y);
    y += wbLines.length * 5 + 12;

    // Implementation Tips
    checkSpace(20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COBALT);
    doc.text("Implementation Tips", M, y);
    y += 8;

    for (let t = 0; t < pattern.implementationTips.length; t++) {
      const tip = pattern.implementationTips[t];
      const tipLines = doc.splitTextToSize(tip, CW - 12);
      checkSpace(tipLines.length * 5 + 4);
      doc.setFillColor(...COBALT);
      doc.circle(M + 3, y + 1, 1.5, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(tipLines, M + 10, y + 2);
      y += tipLines.length * 5 + 4;
    }
  }

  // ─── WHY THIS MATTERS ───
  addPage();
  doc.setFillColor(...COBALT);
  doc.rect(0, 0, W, 3, "F");

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text("Why This Matters", M, y + 5);
  y += 15;

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(M, y, M + 40, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);

  const whyParas = [
    "Most teams build fragile, siloed automations that work in demos but fail in production. These 15 patterns emphasize three principles that separate successful deployments from expensive experiments:",
    "",
    "Integration — Every pattern addresses the handoff points where data moves between systems. These are where 80% of automation failures occur.",
    "",
    "Resilience — Each pattern includes explicit failure analysis and recovery strategies. Production automation must handle exceptions gracefully, not just happy paths.",
    "",
    "Scalability — Tips focus on incremental rollout strategies that let you prove value before committing. Start with 20%, measure, then expand.",
    "",
    "Organizations that implement these patterns consistently report 20-50% efficiency gains, 40-70% error reduction, and significantly faster time-to-resolution when issues do occur.",
  ];

  for (const p of whyParas) {
    if (p === "") {
      y += 4;
      continue;
    }
    const pLines = doc.splitTextToSize(p, CW);
    checkSpace(pLines.length * 5.5);
    doc.text(pLines, M, y);
    y += pLines.length * 5.5;
  }

  // Stats boxes
  y += 10;
  checkSpace(25);
  const stats = [
    { value: "40-50%", label: "Processing Time Reduced" },
    { value: "70%", label: "Error Reduction" },
    { value: "3.2×", label: "Fewer Incidents" },
  ];
  const boxW = (CW - 10) / 3;
  for (let s = 0; s < stats.length; s++) {
    const bx = M + s * (boxW + 5);
    doc.setFillColor(...COBALT);
    doc.roundedRect(bx, y, boxW, 22, 3, 3, "F");
    doc.setTextColor(...WHITE);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(stats[s].value, bx + boxW / 2, y + 10, { align: "center" });
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(stats[s].label, bx + boxW / 2, y + 17, { align: "center" });
  }

  // ─── NEXT STEPS ───
  y += 35;
  checkSpace(40);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text("Next Steps", M, y);
  y += 10;

  const nextSteps = [
    "Pick 2-3 patterns most relevant to your operations",
    "Map your current workflow against the 'Where It Breaks' analysis",
    "Implement the tips — start small, measure, iterate",
    "Book a free workflow review at chasecontinental.com to go deeper",
  ];

  for (let n = 0; n < nextSteps.length; n++) {
    checkSpace(10);
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(M, y - 3, CW, 10, 2, 2, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COBALT);
    doc.text(`${n + 1}.`, M + 5, y + 3);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(nextSteps[n], M + 14, y + 3);
    y += 14;
  }

  // Footer on last page
  y = H - 30;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(M, y, W - M, y);
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text("© 2026 Chase Continental. All rights reserved.", M, y);
  doc.text("chasecontinental.com", W - M, y, { align: "right" });

  return doc.output("arraybuffer") as unknown as Uint8Array;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: SwipeFileRequest = await req.json();
    const { lead_id, name, email, company } = body;

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const pdfBytes = await buildPdf({ lead_id, name, email, company });

    // Upload to Supabase storage
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const fileName = `swipefile-${(lead_id || "anon").slice(0, 8)}-${Date.now()}.pdf`;
    const filePath = `orchestration-swipe-file/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("lead-magnets")
      .upload(filePath, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("lead-magnets")
        .createSignedUrl(filePath, 3600);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      throw (
        signedUrlError ??
        new Error("Could not create a signed URL for the swipe file.")
      );
    }

    return new Response(
      JSON.stringify({ pdf_url: signedUrlData.signedUrl, file_path: filePath }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("generate-swipefile-pdf error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
