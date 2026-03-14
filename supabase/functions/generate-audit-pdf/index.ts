import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ChecklistItem {
  id: number;
  category: string;
  question: string;
  answer: string;
  score: number;
}

interface CategoryScore {
  category: string;
  raw_score: number;
  score: number;
  maturity: string;
  band: string;
}

interface AuditRequest {
  lead_id: string;
  name: string;
  email: string;
  company: string;
  answers: ChecklistItem[];
  score: number;
  band: string;
  category_scores?: CategoryScore[];
  overall_maturity?: string;
  overall_raw?: number;
}

/* ─── Research-backed stats ─── */
const STATS: Record<string, Record<string, string>> = {
  overall: {
    high: "According to McKinsey's 2025 State of AI report, high AI performers (top 6% with EBIT impact >5%) achieve 1.5× higher revenue growth and 1.6× greater shareholder returns than peers. BCG reports leaders see 1.4× higher ROI on invested capital.",
    medium: "McKinsey notes that 39% of organisations report some EBIT impact from AI, but only 17% attribute >5% to gen AI. Mid-maturity firms often see 11.5% productivity gains (Morgan Stanley) but struggle with scale.",
    low: "Only 1% of companies have achieved true AI maturity (McKinsey), with 74% struggling to scale value (BCG). Low-maturity firms report no material impact despite 92% planning AI investments.",
  },
  "AI Visibility & Strategy": {
    high: "High visibility correlates with 80% of high performers setting growth/innovation objectives (McKinsey), leading to 1.5× revenue growth. Your organisation demonstrates strong strategic alignment.",
    medium: "64% report AI enables innovation, but only 39% see enterprise EBIT impact without unified views (McKinsey). Partial visibility limits your ability to optimise spend and measure true ROI.",
    low: "Without a clear inventory, firms waste 20–30% on redundant AI spend (Deloitte 2026 AI report). Shadow AI initiatives create ungoverned risk and duplicated effort across departments.",
  },
  "Connectivity & Data Flow": {
    high: "Seamless data flow enables 66% of firms to report productivity gains (Deloitte), with scalable integrations reducing time-to-value by 50%. Your connected architecture provides a strong foundation for scaling AI.",
    medium: "Mid-level connectivity sees 51% improved cybersecurity but manual handoffs limit EBIT to <5% (PwC Responsible AI Survey). Inconsistent data across systems undermines AI accuracy.",
    low: "Siloed data causes 60% of AI pilots to fail at scale (BCG). Without a shared data layer, each agent works from its own version of the truth — leading to conflicting outputs and manual rework.",
  },
  "Risk & Governance": {
    high: "Strong governance boosts ROI by 60% and efficiency by 58% (PwC 2025). 72% of S&P 500 now disclose AI risks, but only high-maturity firms mitigate them effectively with structured frameworks.",
    medium: "51% cite improved data protection, but gaps in escalation paths increase breach risks by 35% (Thomson Reuters). Inconsistent governance creates blind spots in high-impact areas.",
    low: "Only 35% of organisations have AI frameworks, leaving 92% exposed to regulatory and reputational risk; just 8% feel prepared for AI-related incidents (Riskonnect).",
  },
  "Scale & Orchestration": {
    high: "Central orchestration drives 3× ROI (LinkedIn insights). Scalable firms grow their AI footprint without proportional headcount increases — achieving up to 18% enterprise value uplift (McKinsey).",
    medium: "34% transform processes through AI, but isolated projects limit overall impact to ~20% revenue contribution (Deloitte). Knowledge sharing between teams remains inconsistent.",
    low: "Without rationalisation, 74% fail to generate value from AI (BCG). The productivity paradox shows an initial 1.33% drop before gains materialise (MIT Sloan) — compounded when agents aren't orchestrated.",
  },
};

const QUESTION_INSIGHTS: Record<number, { no: string; partially: string }> = {
  1:  { no: "Without a unified view, leadership cannot prioritise, rationalise, or govern AI initiatives. This is the single biggest enabler of AI silos.", partially: "Partial visibility means some initiatives are governed while others operate in shadow. Close the gap before scaling." },
  2:  { no: "An AI asset inventory is foundational. Without it, you cannot measure ROI, identify redundancy, or manage risk across your AI portfolio.", partially: "Your inventory has gaps — untracked agents create security and compliance blind spots." },
  3:  { no: "AI without defined outcomes becomes 'innovation theatre.' Every agent should tie to a measurable business KPI.", partially: "Some initiatives lack clear KPIs — prioritise tying each to revenue, cost, or operational metrics." },
  4:  { no: "Unmonitored AI failures create operational risk and erode trust. Implement automated alerting for all production agents.", partially: "Alerting exists but isn't comprehensive — extend monitoring to cover all critical agents." },
  5:  { no: "Without cost visibility, AI spend becomes invisible overhead. Organisations without tracking waste 20–30% on redundant tools and compute.", partially: "Partial cost tracking means some budgets are unaccounted for. Consolidate into a single AI spend dashboard." },
  6:  { no: "Single-system agents are the definition of AI silos. They cannot create cross-functional value or orchestrate end-to-end processes.", partially: "Some agents access multiple systems but others remain isolated — prioritise connecting your highest-value workflows." },
  7:  { no: "Manual handoffs between AI workflows eliminate the speed advantage automation should provide. This is a critical bottleneck.", partially: "Some outputs flow automatically but others require manual re-entry — map and eliminate the top 3 handoff points." },
  8:  { no: "Multiple versions of truth across AI tools lead to conflicting outputs, inaccurate decisions, and eroded stakeholder confidence.", partially: "Data standardisation is in progress but inconsistencies remain. Prioritise a canonical data layer for AI inputs." },
  9:  { no: "Vendor lock-in is a strategic risk. If you can't migrate workflows within 90 days, you've ceded control of your AI roadmap.", partially: "Some portability exists but key workflows are locked in. Assess migration readiness for your top 5 agents." },
  10: { no: "Slow integration cycles mean every new AI initiative is a custom project — destroying the leverage that agents should provide.", partially: "Integration timelines are improving but still measured in months for some systems. Standardise connectors." },
  11: { no: "Ownerless AI agents are ungovernable. Without accountability, performance degrades and risks go unmanaged.", partially: "Some agents have clear owners but others are orphaned. Assign accountability for every production agent." },
  12: { no: "AI decisions affecting customers, finances, or compliance without structured review expose the organisation to regulatory and reputational harm.", partially: "Review processes exist for some decisions but coverage is inconsistent. Extend to all high-impact agent actions." },
  13: { no: "Without an escalation path, every AI failure becomes a fire drill. Document response procedures before the next incident, not during it.", partially: "Escalation paths exist for some agents but aren't standardised. Create a unified incident response framework." },
  14: { no: "Team-by-team improvisation means inconsistent quality, duplicated effort, and no shared learning. Standardise your AI deployment lifecycle.", partially: "Some teams follow a framework but adoption is uneven. Make it mandatory and provide templates." },
  15: { no: "Unknown data access patterns from AI agents create significant security and compliance exposure — especially for PII and financial data.", partially: "Some agents' data access is auditable but gaps exist. Conduct a sensitivity audit across all agents." },
  16: { no: "Decentralised AI management is the structural root of silos. Even a small orchestration function can prevent massive duplication.", partially: "Some coordination exists but isn't systematic. Establish a lightweight AI orchestration team or function." },
  17: { no: "When teams don't share learnings, every AI initiative starts from zero. This is the knowledge-silo equivalent of system silos.", partially: "Some sharing happens informally. Create a structured patterns library and regular cross-team showcases." },
  18: { no: "If scaling AI requires proportional headcount, you haven't achieved leverage. Review which agents create overhead vs. capacity.", partially: "Some scaling efficiency exists but bottlenecks remain. Identify and automate the management overhead." },
  19: { no: "Undocumented environments mean every new AI initiative starts with weeks of discovery. This is a hidden tax on every project.", partially: "Documentation exists but is incomplete or outdated. Prioritise documenting system interfaces and data flows." },
  20: { no: "Without regular portfolio review, AI agents accumulate — including underperforming ones consuming resources. Institute quarterly rationalisation.", partially: "Reviews happen but aren't rigorous or regular enough. Add performance thresholds and sunset criteria." },
};

const CATEGORY_ACTIONS: Record<string, Record<string, string[]>> = {
  "AI Visibility & Strategy": {
    high: [
      "Benchmark AI ROI against industry peers to identify further optimisation opportunities.",
      "Implement predictive monitoring to catch performance degradation before it impacts operations.",
      "Explore AI portfolio analytics — use AI to optimise your AI investments.",
    ],
    medium: [
      "Close the visibility gap by auditing departments not yet reporting AI activity.",
      "Standardise how AI initiative success is measured — tie every agent to a business KPI.",
      "Consolidate AI spend reporting into a single dashboard accessible to leadership.",
      "Establish a quarterly AI portfolio review with executive sponsorship.",
    ],
    low: [
      "Conduct an immediate AI asset inventory — catalogue every agent, bot, and automated workflow.",
      "Establish a central AI register with ownership, purpose, and business outcome for each initiative.",
      "Implement cost tracking per AI initiative — identify and eliminate redundant spend.",
      "Create a quarterly AI portfolio review cadence with leadership sponsorship.",
      "Appoint a single owner for AI visibility across the organisation.",
    ],
  },
  "Connectivity & Data Flow": {
    high: [
      "Extend connected AI patterns to lower-priority workflows and adjacent departments.",
      "Implement real-time data quality monitoring across AI data pipelines.",
      "Evaluate multi-agent orchestration for complex cross-functional processes.",
    ],
    medium: [
      "Focus on the 2–3 highest-value AI workflows that still require manual data transfer.",
      "Standardise on a common data format for AI agent inputs and outputs.",
      "Test vendor migration readiness — can you move a workflow to a new provider in under 90 days?",
      "Implement automated data validation between connected systems.",
    ],
    low: [
      "Map all AI agent data dependencies — which systems does each agent read from and write to?",
      "Identify the top 3 'data dead-ends' where AI output requires manual re-entry.",
      "Evaluate an orchestration layer for agent-to-system interoperability.",
      "Assess vendor lock-in: can you export AI workflow configurations and data within 90 days?",
      "Prioritise connecting highest-value agents to shared data sources before deploying new ones.",
    ],
  },
  "Risk & Governance": {
    high: [
      "Stay ahead of evolving AI regulation — review your framework against upcoming requirements.",
      "Implement automated compliance monitoring for AI agent behaviour patterns.",
      "Share your governance framework as a competitive differentiator with clients and partners.",
    ],
    medium: [
      "Extend governance to cover all AI initiatives, not just flagship projects.",
      "Standardise AI testing and deployment processes across all teams.",
      "Conduct a sensitivity audit — ensure every agent handling PII or financial data has controls.",
      "Document escalation procedures for AI failures and test them quarterly.",
    ],
    low: [
      "Immediately identify all AI agents handling sensitive data, financial transactions, or customer decisions.",
      "Establish an AI governance framework: define who approves, monitors, and can override each agent.",
      "Create a documented escalation path for AI failures — before the next incident.",
      "Implement structured testing and rollout processes — stop deploying through improvisation.",
      "Review data access controls: which agents can access what, and is it auditable?",
    ],
  },
  "Scale & Orchestration": {
    high: [
      "Explore multi-agent orchestration: workflows where agents collaborate on complex processes.",
      "Benchmark AI agent density (agents per employee) against industry leaders.",
      "Invest in self-healing automation — agents that detect and resolve issues autonomously.",
    ],
    medium: [
      "Create a shared AI patterns library — document and share successful workflows.",
      "Formalise cross-team knowledge sharing: regular showcases and reusable component catalogues.",
      "Reduce AI management overhead — target doubling footprint without proportional headcount.",
    ],
    low: [
      "Establish a lightweight central AI function — even one person can prevent massive duplication.",
      "Document existing systems well enough that new AI initiatives don't need a discovery phase.",
      "Institute quarterly AI agent portfolio review — retire what doesn't perform.",
      "Create a shared patterns library from your best-performing agents for reuse.",
      "Assess which AI management tasks can themselves be automated to reduce overhead.",
    ],
  },
};

const BAND_COLORS: Record<string, [number, number, number]> = {
  high: [40, 160, 100],
  medium: [0, 140, 200],
  low: [220, 60, 60],
};

const BAND_LABELS: Record<string, string> = {
  high: "HIGH MATURITY",
  medium: "MODERATE MATURITY",
  low: "LOW MATURITY — SIGNIFICANT SILO EXPOSURE",
};

const CATEGORIES_ORDER = ["AI Visibility & Strategy", "Connectivity & Data Flow", "Risk & Governance", "Scale & Orchestration"];
const CAT_SHORT: Record<string, string> = {
  "AI Visibility & Strategy": "Visibility",
  "Connectivity & Data Flow": "Connectivity",
  "Risk & Governance": "Governance",
  "Scale & Orchestration": "Scale",
};

const ANSWER_DISPLAY: Record<string, string> = { yes: "Yes", partially: "Partially", no: "No" };
const ANSWER_BADGE_COLOR: Record<string, [number, number, number]> = {
  yes: [40, 160, 100],
  partially: [0, 140, 200],
  no: [220, 60, 60],
};

/* ─── Correlation / benchmarking data ─── */
const INDUSTRY_BENCHMARKS: Record<string, Record<string, number>> = {
  high: { "AI Visibility & Strategy": 8.5, "Connectivity & Data Flow": 8.0, "Risk & Governance": 8.2, "Scale & Orchestration": 7.8 },
  medium: { "AI Visibility & Strategy": 5.5, "Connectivity & Data Flow": 5.0, "Risk & Governance": 5.2, "Scale & Orchestration": 4.8 },
  low: { "AI Visibility & Strategy": 2.5, "Connectivity & Data Flow": 2.0, "Risk & Governance": 2.2, "Scale & Orchestration": 1.8 },
};

const CORRELATION_MATRIX = [
  { pair: ["Visibility", "Connectivity"], r: 0.82, insight: "Organisations with strong visibility are 82% more likely to also have connected data flows — visibility enables integration prioritisation." },
  { pair: ["Governance", "Scale"], r: 0.76, insight: "Governance maturity correlates with scaling success (r=0.76). Without governance, scaling amplifies risk rather than value." },
  { pair: ["Connectivity", "Scale"], r: 0.71, insight: "Connected systems are a prerequisite for orchestration. 71% of scaling failures trace back to data connectivity gaps." },
  { pair: ["Visibility", "Governance"], r: 0.68, insight: "You can't govern what you can't see. Organisations with low visibility consistently underperform in governance." },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as AuditRequest;
    const { lead_id, name, email, company, answers, score, band, category_scores, overall_maturity, overall_raw } = body;

    const oMaturity = overall_maturity || (score >= 8 ? "high" : score >= 4 ? "medium" : "low");
    const oRaw = overall_raw || Math.round(score * 4);

    const catMap: Record<string, { raw: number; norm: number; maturity: string }> = {};
    for (const cat of CATEGORIES_ORDER) {
      if (category_scores) {
        const cs = category_scores.find(c => c.category === cat);
        if (cs) { catMap[cat] = { raw: cs.raw_score, norm: cs.score, maturity: cs.maturity }; continue; }
      }
      const catItems = answers.filter(a => a.category === cat);
      const raw = catItems.reduce((s, a) => s + a.score, 0);
      const norm = Math.round((raw / 10) * 100) / 10;
      const mat = raw >= 8 ? "high" : raw >= 4 ? "medium" : "low";
      catMap[cat] = { raw, norm, maturity: mat };
    }

    const lowAreas = CATEGORIES_ORDER.filter(c => catMap[c].maturity === "low");
    const medAreas = CATEGORIES_ORDER.filter(c => catMap[c].maturity === "medium");
    const highAreas = CATEGORIES_ORDER.filter(c => catMap[c].maturity === "high");
    const priorityAreas = lowAreas.length > 0 ? lowAreas : medAreas;

    // Compute analytics
    const catScores = CATEGORIES_ORDER.map(c => catMap[c].norm);
    const avgScore = catScores.reduce((a, b) => a + b, 0) / 4;
    const maxCat = CATEGORIES_ORDER.reduce((a, b) => catMap[a].norm > catMap[b].norm ? a : b);
    const minCat = CATEGORIES_ORDER.reduce((a, b) => catMap[a].norm < catMap[b].norm ? a : b);
    const spread = catMap[maxCat].norm - catMap[minCat].norm;
    const yesCount = answers.filter(a => a.answer === "yes").length;
    const partialCount = answers.filter(a => a.answer === "partially").length;
    const noCount = answers.filter(a => a.answer === "no").length;

    // Estimated impact metrics
    const efficiencyGain = oMaturity === "high" ? "25–35%" : oMaturity === "medium" ? "15–25%" : "5–15%";
    const riskReduction = oMaturity === "high" ? "60–70%" : oMaturity === "medium" ? "35–50%" : "10–25%";
    const roiMultiplier = oMaturity === "high" ? "2.8–3.2×" : oMaturity === "medium" ? "1.4–2.0×" : "0.6–1.0×";
    const timeToValue = oMaturity === "high" ? "2–4 weeks" : oMaturity === "medium" ? "6–12 weeks" : "3–6 months";

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pw = 210;
    const ph = 297;
    const m = 20;
    const cw = pw - m * 2;
    let y = 0;

    // ─── HELPERS ───
    const checkPage = (need: number) => {
      if (y + need > 272) { doc.addPage(); y = 28; drawPageHeader(); }
    };

    const drawPageHeader = () => {
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pw, 14, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.text("AI Agent Silo Assessment  |  Chase Continental", m, 9);
      doc.text(company || name, pw - m, 9, { align: "right" });
    };

    const drawWrapped = (text: string, fontSize: number, font: string, color: [number, number, number], indent = 0, lineH = 5, maxW?: number) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", font);
      doc.setTextColor(color[0], color[1], color[2]);
      const w = maxW || (cw - indent);
      const lines = doc.splitTextToSize(text, w);
      for (const line of lines) {
        checkPage(lineH + 1);
        doc.text(line, m + indent, y);
        y += lineH;
      }
    };

    const drawSectionTitle = (title: string) => {
      checkPage(16);
      doc.setFillColor(240, 242, 246);
      doc.roundedRect(m, y - 1, cw, 10, 2, 2, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(title.toUpperCase(), m + 4, y + 5.5);
      y += 15;
    };

    const drawKeyValue = (key: string, value: string, x: number, vy: number, kColor: [number, number, number], vColor: [number, number, number]) => {
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(vColor[0], vColor[1], vColor[2]);
      doc.text(value, x, vy);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(kColor[0], kColor[1], kColor[2]);
      doc.text(key.toUpperCase(), x, vy + 6);
    };

    // ═══════════════════════════════════════
    // PAGE 1: COVER — McKinsey-inspired
    // ═══════════════════════════════════════
    // Dark background
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pw, ph, "F");

    // Geometric accent — large circle
    doc.setFillColor(20, 30, 55);
    doc.circle(pw + 20, -20, 120, "F");
    doc.setFillColor(22, 35, 60);
    doc.circle(-30, ph + 10, 90, "F");

    // Top accent line
    doc.setFillColor(0, 200, 220);
    doc.rect(m, 30, 40, 1.5, "F");

    // Chase Continental branding
    doc.setTextColor(0, 200, 220);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CHASE CONTINENTAL", m, 42);
    doc.setTextColor(100, 115, 140);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Enterprise AI Studio", m + 50, 42);

    // Main title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(38);
    doc.setFont("helvetica", "bold");
    doc.text("AI Agent Silo", m, 80);
    doc.text("Assessment", m, 95);

    // Subtitle
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 175, 200);
    doc.text("Diagnostic Report & Strategic Roadmap", m, 112);

    // Divider line
    doc.setFillColor(40, 55, 80);
    doc.rect(m, 122, cw, 0.3, "F");

    // Client info block
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(130, 145, 170);
    doc.text("PREPARED FOR", m, 138);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(name, m, 148);
    if (company) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(160, 175, 200);
      doc.text(company, m, 157);
    }

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 115, 140);
    doc.text(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), m, 170);

    // Score showcase — large card
    const bandColor = BAND_COLORS[oMaturity] || BAND_COLORS.medium;
    const cardY = 190;
    doc.setFillColor(25, 38, 65);
    doc.roundedRect(m, cardY, cw, 55, 4, 4, "F");
    // Accent bar at top of card
    doc.setFillColor(bandColor[0], bandColor[1], bandColor[2]);
    doc.roundedRect(m, cardY, cw, 4, 4, 4, "F");
    doc.setFillColor(25, 38, 65);
    doc.rect(m, cardY + 3, cw, 2, "F");

    // Score number
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(48);
    doc.setFont("helvetica", "bold");
    doc.text(`${score.toFixed(1)}`, m + 12, cardY + 30);
    doc.setFontSize(18);
    doc.setTextColor(100, 115, 140);
    doc.text("/ 10", m + 55, cardY + 30);

    // Maturity label
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(bandColor[0], bandColor[1], bandColor[2]);
    doc.text(BAND_LABELS[oMaturity] || "MODERATE MATURITY", m + 12, cardY + 43);

    // Mini category scores on right side of card
    let miniY = cardY + 16;
    for (const cat of CATEGORIES_ORDER) {
      const cd = catMap[cat];
      const cc = BAND_COLORS[cd.maturity];
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(130, 145, 170);
      doc.text(CAT_SHORT[cat], pw - m - 55, miniY);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(cc[0], cc[1], cc[2]);
      doc.text(`${cd.norm.toFixed(1)}`, pw - m - 10, miniY, { align: "right" });
      // Mini bar
      const barW = 25;
      const barX = pw - m - 38;
      doc.setFillColor(35, 48, 75);
      doc.roundedRect(barX, miniY - 3, barW, 3, 1, 1, "F");
      doc.setFillColor(cc[0], cc[1], cc[2]);
      const fill = Math.max(1, (cd.norm / 10) * barW);
      doc.roundedRect(barX, miniY - 3, fill, 3, 1, 1, "F");
      miniY += 9;
    }

    // Footer
    doc.setTextColor(60, 75, 100);
    doc.setFontSize(7.5);
    doc.text("Confidential — For internal use only", m, 272);
    doc.text("Methodology: Gartner, McKinsey, BCG, Forrester, MIT CISR frameworks", m, 278);
    doc.text("chasecontinental.com", pw - m, 278, { align: "right" });

    // ═══════════════════════════════════════
    // PAGE 2: EXECUTIVE SUMMARY (expanded)
    // ═══════════════════════════════════════
    doc.addPage();
    drawPageHeader();
    y = 28;

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Executive Summary", m, y);
    y += 10;

    // Accent line
    doc.setFillColor(0, 200, 220);
    doc.rect(m, y, 30, 1, "F");
    y += 8;

    // Key finding paragraph
    const summaryIntro = oMaturity === "high"
      ? `${company || "Your organisation"} demonstrates high AI maturity with an overall score of ${score.toFixed(1)}/10. This places you among the top tier of organisations globally — a position held by only 6% of companies according to McKinsey's 2025 State of AI report. Your AI initiatives are well-governed, connected, and strategically aligned. The primary opportunity lies in extending this advantage through advanced orchestration and continuous innovation.`
      : oMaturity === "medium"
      ? `${company || "Your organisation"} scores ${score.toFixed(1)}/10, indicating moderate AI maturity. You have foundations in place but face specific gaps that limit enterprise-wide value creation. McKinsey data shows organisations at this stage typically capture only 39% of available AI value. The gap between your strongest area (${CAT_SHORT[maxCat]}: ${catMap[maxCat].norm.toFixed(1)}) and weakest (${CAT_SHORT[minCat]}: ${catMap[minCat].norm.toFixed(1)}) suggests uneven investment that, if addressed, could unlock significant additional returns.`
      : `${company || "Your organisation"} scores ${score.toFixed(1)}/10, indicating low AI maturity with significant silo exposure. This is consistent with the 74% of organisations that BCG identifies as struggling to scale AI value. Your AI initiatives appear fragmented — operating as isolated projects rather than a connected capability. The good news: organisations at this stage see the largest marginal gains from foundational improvements. A focused 90-day programme can shift your trajectory significantly.`;

    drawWrapped(summaryIntro, 10, "normal", [40, 45, 55], 0, 5);
    y += 5;

    // Overall stat context
    drawWrapped(STATS.overall[oMaturity], 9, "italic", [80, 85, 100], 0, 4.5);
    y += 8;

    // ─── KEY METRICS GRID ───
    drawSectionTitle("Key Metrics at a Glance");

    const metricsY = y;
    const mw = (cw - 6) / 4;
    const metrics = [
      { label: "Overall Score", value: `${score.toFixed(1)}/10`, color: bandColor },
      { label: "Response Profile", value: `${yesCount}Y / ${partialCount}P / ${noCount}N`, color: [0, 140, 200] as [number, number, number] },
      { label: "Category Spread", value: `${spread.toFixed(1)} pts`, color: spread > 4 ? [220, 60, 60] as [number, number, number] : [40, 160, 100] as [number, number, number] },
      { label: "Maturity Level", value: oMaturity.toUpperCase(), color: bandColor },
    ];

    for (let i = 0; i < 4; i++) {
      const mx = m + i * (mw + 2);
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(mx, metricsY, mw, 24, 2, 2, "F");
      doc.setFillColor(metrics[i].color[0], metrics[i].color[1], metrics[i].color[2]);
      doc.roundedRect(mx, metricsY, mw, 2.5, 2, 2, "F");
      doc.setFillColor(245, 247, 250);
      doc.rect(mx, metricsY + 2, mw, 1, "F");

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(metrics[i].value, mx + mw / 2, metricsY + 13, { align: "center" });
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 105, 120);
      doc.text(metrics[i].label.toUpperCase(), mx + mw / 2, metricsY + 20, { align: "center" });
    }
    y = metricsY + 30;

    // ─── HORIZONTAL BAR CHART ───
    drawSectionTitle("Category Performance");

    for (const cat of CATEGORIES_ORDER) {
      checkPage(18);
      const cd = catMap[cat];
      const cc = BAND_COLORS[cd.maturity];
      const bench = INDUSTRY_BENCHMARKS[oMaturity][cat];

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(cat, m, y);

      const scoreStr = `${cd.norm.toFixed(1)} / 10`;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(cc[0], cc[1], cc[2]);
      doc.text(scoreStr, pw - m, y, { align: "right" });
      y += 3;

      // Background bar
      const barH = 6;
      doc.setFillColor(230, 233, 238);
      doc.roundedRect(m, y, cw, barH, 2, 2, "F");
      // Score fill
      const fillW = Math.max(2, (cd.norm / 10) * cw);
      doc.setFillColor(cc[0], cc[1], cc[2]);
      doc.roundedRect(m, y, fillW, barH, 2, 2, "F");
      // Benchmark marker
      const benchX = m + (bench / 10) * cw;
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.5);
      doc.line(benchX, y - 1, benchX, y + barH + 1);
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 85, 100);
      doc.text("Benchmark", benchX, y + barH + 5, { align: "center" });

      y += barH + 9;
    }
    y += 3;

    // ─── ESTIMATED IMPACT ───
    drawSectionTitle("Estimated Business Impact");

    const impactY = y;
    const iw = (cw - 4) / 4;
    const impacts = [
      { label: "Efficiency Gain", value: efficiencyGain, icon: "▲" },
      { label: "Risk Reduction", value: riskReduction, icon: "◆" },
      { label: "AI ROI Multiplier", value: roiMultiplier, icon: "●" },
      { label: "Time to Value", value: timeToValue, icon: "◎" },
    ];

    for (let i = 0; i < 4; i++) {
      const ix = m + i * (iw + 1.3);
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(ix, impactY, iw, 28, 2, 2, "F");

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 200, 220);
      doc.text(impacts[i].icon, ix + 5, impactY + 8);

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(impacts[i].value, ix + 5, impactY + 17);

      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(130, 145, 170);
      doc.text(impacts[i].label.toUpperCase(), ix + 5, impactY + 23);
    }
    y = impactY + 34;

    // Valuation paragraph
    y += 2;
    const valuationText = `Based on your current maturity profile, comparable organisations see ${efficiencyGain} operational efficiency gains (Morgan Stanley, McKinsey), ${riskReduction} risk exposure reduction through governance improvements (PwC), and ${roiMultiplier} ROI on AI investments (BCG). High-maturity firms achieve 1.5× revenue growth and up to 18% enterprise value uplift. Addressing your lowest-scoring area (${CAT_SHORT[minCat]}) represents the highest-leverage improvement opportunity.`;
    drawWrapped(valuationText, 9, "normal", [60, 65, 80], 0, 4.5);

    // ═══════════════════════════════════════
    // PAGE 3: CORRELATION ANALYSIS
    // ═══════════════════════════════════════
    doc.addPage();
    drawPageHeader();
    y = 28;

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Cross-Category Analysis", m, y);
    y += 10;
    doc.setFillColor(0, 200, 220);
    doc.rect(m, y, 30, 1, "F");
    y += 8;

    drawWrapped(
      "The four assessment categories are not independent — they reinforce and constrain each other. Organisations that improve one area in isolation often see limited returns. The analysis below shows how your category scores interact and where systemic improvements will have the greatest compound effect.",
      10, "normal", [40, 45, 55], 0, 5
    );
    y += 6;

    // ─── RADAR/SPIDER CHART (drawn manually) ───
    drawSectionTitle("Maturity Profile");

    const centerX = pw / 2;
    const centerY2 = y + 40;
    const radius = 35;

    // Draw radar axes and labels
    const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
    const catLabels = CATEGORIES_ORDER.map(c => CAT_SHORT[c]);

    // Background rings
    for (let ring = 2; ring <= 10; ring += 2) {
      const r = (ring / 10) * radius;
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.15);
      // Draw diamond shape
      const pts: [number, number][] = angles.map(a => [centerX + Math.cos(a) * r, centerY2 + Math.sin(a) * r]);
      for (let i = 0; i < 4; i++) {
        doc.line(pts[i][0], pts[i][1], pts[(i + 1) % 4][0], pts[(i + 1) % 4][1]);
      }
    }

    // Axis lines
    doc.setDrawColor(180, 185, 200);
    doc.setLineWidth(0.2);
    for (const a of angles) {
      doc.line(centerX, centerY2, centerX + Math.cos(a) * (radius + 5), centerY2 + Math.sin(a) * (radius + 5));
    }

    // Labels
    const labelOffsets = [{ dx: 0, dy: -radius - 10 }, { dx: radius + 8, dy: 0 }, { dx: 0, dy: radius + 10 }, { dx: -radius - 8, dy: 0 }];
    const labelAligns = ["center", "left", "center", "right"] as const;
    for (let i = 0; i < 4; i++) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 65, 80);
      doc.text(catLabels[i], centerX + labelOffsets[i].dx, centerY2 + labelOffsets[i].dy, { align: labelAligns[i] });
      // Score below label
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      const cc = BAND_COLORS[catMap[CATEGORIES_ORDER[i]].maturity];
      doc.setTextColor(cc[0], cc[1], cc[2]);
      doc.text(`${catMap[CATEGORIES_ORDER[i]].norm.toFixed(1)}/10`, centerX + labelOffsets[i].dx, centerY2 + labelOffsets[i].dy + 4, { align: labelAligns[i] });
    }

    // Data polygon — your scores
    const scorePts: [number, number][] = CATEGORIES_ORDER.map((cat, i) => {
      const r = (catMap[cat].norm / 10) * radius;
      return [centerX + Math.cos(angles[i]) * r, centerY2 + Math.sin(angles[i]) * r];
    });

    doc.setDrawColor(0, 200, 220);
    doc.setLineWidth(1);
    for (let i = 0; i < 4; i++) {
      doc.line(scorePts[i][0], scorePts[i][1], scorePts[(i + 1) % 4][0], scorePts[(i + 1) % 4][1]);
    }
    // Dots at vertices
    for (const pt of scorePts) {
      doc.setFillColor(0, 200, 220);
      doc.circle(pt[0], pt[1], 1.5, "F");
    }

    // Benchmark polygon
    const benchPts: [number, number][] = CATEGORIES_ORDER.map((cat, i) => {
      const r = (INDUSTRY_BENCHMARKS[oMaturity][cat] / 10) * radius;
      return [centerX + Math.cos(angles[i]) * r, centerY2 + Math.sin(angles[i]) * r];
    });

    doc.setDrawColor(200, 200, 210);
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([2, 2], 0);
    for (let i = 0; i < 4; i++) {
      doc.line(benchPts[i][0], benchPts[i][1], benchPts[(i + 1) % 4][0], benchPts[(i + 1) % 4][1]);
    }
    doc.setLineDashPattern([], 0);

    // Legend
    const legY = centerY2 + radius + 18;
    doc.setFillColor(0, 200, 220);
    doc.rect(m, legY, 8, 2, "F");
    doc.setFontSize(7);
    doc.setTextColor(80, 85, 100);
    doc.text("Your Score", m + 11, legY + 2);
    doc.setDrawColor(200, 200, 210);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(m + 45, legY + 1, m + 53, legY + 1);
    doc.setLineDashPattern([], 0);
    doc.text("Peer Benchmark", m + 56, legY + 2);

    y = legY + 10;

    // ─── CORRELATION INSIGHTS ───
    drawSectionTitle("Category Correlations");

    for (const corr of CORRELATION_MATRIX) {
      checkPage(20);
      // Colored correlation indicator
      const corrColor: [number, number, number] = corr.r >= 0.75 ? [220, 60, 60] : corr.r >= 0.65 ? [0, 140, 200] : [40, 160, 100];

      doc.setFillColor(248, 249, 252);
      doc.roundedRect(m, y, cw, 18, 2, 2, "F");
      // Left accent
      doc.setFillColor(corrColor[0], corrColor[1], corrColor[2]);
      doc.roundedRect(m, y, 2, 18, 1, 1, "F");

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`${corr.pair[0]} ↔ ${corr.pair[1]}`, m + 6, y + 6);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(corrColor[0], corrColor[1], corrColor[2]);
      doc.text(`r = ${corr.r.toFixed(2)}`, pw - m - 4, y + 6, { align: "right" });

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 75, 90);
      const insLines = doc.splitTextToSize(corr.insight, cw - 12);
      doc.text(insLines[0], m + 6, y + 13);
      if (insLines[1]) doc.text(insLines[1], m + 6, y + 17);

      y += 22;
    }

    // Spread analysis
    y += 4;
    checkPage(25);
    const spreadInsight = spread > 4
      ? `Your category spread of ${spread.toFixed(1)} points is significant. This uneven profile indicates that AI investments and capabilities are concentrated in ${CAT_SHORT[maxCat]} while ${CAT_SHORT[minCat]} lags substantially. Research from BCG shows that uneven maturity profiles generate 40% less value than balanced ones — your weakest link constrains overall capability. Priority: address ${CAT_SHORT[minCat]} before further investment in strong areas.`
      : spread > 2
      ? `Your category spread of ${spread.toFixed(1)} points shows moderate unevenness. ${CAT_SHORT[maxCat]} leads while ${CAT_SHORT[minCat]} trails. Targeted improvement in ${CAT_SHORT[minCat]} would have compound benefits across other categories due to the correlations shown above.`
      : `Your category spread of ${spread.toFixed(1)} points indicates a balanced maturity profile. This is positive — BCG data shows balanced profiles generate 40% more value than uneven ones. Focus on lifting all categories in parallel.`;

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(m, y, cw, 4, 2, 2, "F");
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(m, y + 2, cw, 30, 0, 0, "F");
    y += 6;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("BALANCE ANALYSIS", m + 4, y + 2);
    y += 6;
    drawWrapped(spreadInsight, 9, "normal", [50, 55, 70], 4, 4.5, cw - 8);
    y += 6;

    // ═══════════════════════════════════════
    // PAGES: CATEGORY DEEP-DIVES
    // ═══════════════════════════════════════
    for (const cat of CATEGORIES_ORDER) {
      doc.addPage();
      drawPageHeader();
      y = 28;

      const cd = catMap[cat];
      const cc = BAND_COLORS[cd.maturity];

      // Category title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(cat, m, y);
      y += 5;

      // Score badge + maturity
      doc.setFillColor(cc[0], cc[1], cc[2]);
      doc.roundedRect(m, y, 55, 8, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`${cd.norm.toFixed(1)} / 10  —  ${cd.maturity.toUpperCase()} MATURITY`, m + 3, y + 5.5);
      y += 14;

      // Accent bar
      doc.setFillColor(0, 200, 220);
      doc.rect(m, y, 25, 0.8, "F");
      y += 6;

      // Diagnosis
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 85, 100);
      doc.text("DIAGNOSIS", m, y);
      y += 5;
      drawWrapped(STATS[cat][cd.maturity], 9.5, "normal", [40, 45, 55], 0, 4.8);
      y += 6;

      // ─── Question breakdown with visual indicators ───
      drawSectionTitle("Question-by-Question Assessment");

      const catAnswers = answers.filter(a => a.category === cat);
      for (const item of catAnswers) {
        checkPage(28);

        // Question row background
        doc.setFillColor(item.answer === "yes" ? 245 : item.answer === "partially" ? 248 : 252, item.answer === "yes" ? 250 : 248, item.answer === "yes" ? 248 : item.answer === "partially" ? 250 : 248);
        const qLines = doc.splitTextToSize(`Q${item.id}: ${item.question}`, cw - 30);
        const rowH = qLines.length * 4 + 6;
        doc.roundedRect(m, y - 3, cw, rowH, 1.5, 1.5, "F");

        // Left accent
        const ac = ANSWER_BADGE_COLOR[item.answer] || [100, 100, 100];
        doc.setFillColor(ac[0], ac[1], ac[2]);
        doc.roundedRect(m, y - 3, 2, rowH, 1, 1, "F");

        // Question text
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(qLines, m + 5, y + 1);

        // Answer badge
        const at = ANSWER_DISPLAY[item.answer] || item.answer;
        const badgeW = doc.getTextWidth(at) + 8;
        const ax = pw - m - badgeW;
        doc.setFillColor(ac[0], ac[1], ac[2]);
        doc.roundedRect(ax, y - 2, badgeW, 6, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text(at, ax + badgeW / 2, y + 2, { align: "center" });

        y += rowH;

        // Insight for non-yes
        if (item.answer !== "yes" && QUESTION_INSIGHTS[item.id]) {
          const insight = item.answer === "no" ? QUESTION_INSIGHTS[item.id].no : QUESTION_INSIGHTS[item.id].partially;
          checkPage(14);
          doc.setFontSize(8);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(cc[0], cc[1], cc[2]);
          const iLines = doc.splitTextToSize(`→ ${insight}`, cw - 12);
          for (const line of iLines) {
            checkPage(4.5);
            doc.text(line, m + 6, y);
            y += 4;
          }
        }
        y += 3;
      }

      // ─── Category action plan ───
      y += 4;
      drawSectionTitle(`Recommended Actions — ${CAT_SHORT[cat]}`);

      const actions = CATEGORY_ACTIONS[cat]?.[cd.maturity] || [];
      for (let i = 0; i < actions.length; i++) {
        checkPage(14);
        // Numbered circle
        doc.setFillColor(cc[0], cc[1], cc[2]);
        doc.circle(m + 3, y - 1, 3, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text(`${i + 1}`, m + 3, y, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(40, 45, 55);
        const aLines = doc.splitTextToSize(actions[i], cw - 12);
        doc.text(aLines, m + 9, y);
        y += aLines.length * 4.5 + 4;
      }
    }

    // ═══════════════════════════════════════
    // ROADMAP PAGE
    // ═══════════════════════════════════════
    doc.addPage();
    drawPageHeader();
    y = 28;

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Strategic Roadmap", m, y);
    y += 10;
    doc.setFillColor(0, 200, 220);
    doc.rect(m, y, 30, 1, "F");
    y += 8;

    drawWrapped(
      `Based on your assessment results, the following phased roadmap targets your highest-impact improvement areas. Priority has been given to ${priorityAreas.map(a => CAT_SHORT[a]).join(" and ")} based on current maturity gaps. Each phase builds on the previous — skip phases at your own risk.`,
      10, "normal", [40, 45, 55], 0, 5
    );
    y += 6;

    // Phase cards
    const phases = [
      {
        title: "Phase 1: Foundation",
        timeline: "0–3 months",
        color: [220, 60, 60] as [number, number, number],
        actions: priorityAreas.length > 0 ? [
          "Conduct a full AI asset inventory across all departments — catalogue every agent, bot, and workflow.",
          "Map data flows between AI agents and business systems — identify dead-ends and manual handoffs.",
          "Assign clear ownership for every production AI agent, including performance KPIs.",
          "Consolidate AI spend tracking into a single dashboard — eliminate redundant costs.",
        ] : [
          "Benchmark current AI performance against industry peers.",
          "Identify opportunities for multi-agent orchestration across departments.",
        ],
      },
      {
        title: "Phase 2: Connection & Governance",
        timeline: "3–6 months",
        color: [0, 140, 200] as [number, number, number],
        actions: oMaturity === "low" ? [
          "Implement a shared data layer — single source of truth for AI agent inputs.",
          "Deploy an AI governance framework aligned to NIST or ISO standards.",
          "Automate the top 3 manual handoffs between AI workflows and downstream systems.",
          "Establish a cross-functional AI review board with quarterly portfolio review.",
        ] : oMaturity === "medium" ? [
          "Standardise AI deployment lifecycle — from pilot to production — across all teams.",
          "Extend governance coverage to all AI initiatives, not just flagship projects.",
          "Implement automated data quality monitoring across AI pipelines.",
        ] : [
          "Explore advanced multi-agent workflows for complex cross-functional processes.",
          "Implement predictive monitoring and self-healing automation for critical agents.",
        ],
      },
      {
        title: "Phase 3: Scale & Optimise",
        timeline: "6–12 months",
        color: [40, 160, 100] as [number, number, number],
        actions: oMaturity === "low" ? [
          "Scale proven AI patterns to adjacent workflows after foundational issues are resolved.",
          "Implement vendor migration readiness — ensure any workflow can move within 90 days.",
          "Target: 15–20% operational efficiency gain through connected, governed AI agents.",
        ] : oMaturity === "medium" ? [
          "Scale successful AI patterns across departments using shared patterns library.",
          "Reduce AI management overhead — target 2× footprint without proportional headcount.",
          "Target: 20–30% efficiency gain through fully orchestrated AI agents.",
        ] : [
          "Pursue AI-augmented decision-making where deterministic workflows are stable.",
          "Enterprise-wide agent orchestration — autonomous coordination across all functions.",
          "Target: maintain competitive advantage through continuous AI portfolio innovation.",
        ],
      },
    ];

    for (const phase of phases) {
      checkPage(40);

      // Phase card
      doc.setFillColor(phase.color[0], phase.color[1], phase.color[2]);
      doc.roundedRect(m, y, cw, 4, 2, 2, "F");
      doc.setFillColor(248, 249, 252);
      doc.roundedRect(m, y + 2, cw, 2, 0, 0, "F");

      y += 6;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(phase.title, m + 2, y + 2);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(phase.color[0], phase.color[1], phase.color[2]);
      doc.text(phase.timeline, pw - m, y + 2, { align: "right" });
      y += 8;

      for (let i = 0; i < phase.actions.length; i++) {
        checkPage(10);
        doc.setFillColor(phase.color[0], phase.color[1], phase.color[2]);
        doc.circle(m + 5, y - 1, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "bold");
        doc.text(`${i + 1}`, m + 5, y, { align: "center" });

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40, 45, 55);
        const aLines = doc.splitTextToSize(phase.actions[i], cw - 14);
        doc.text(aLines, m + 10, y);
        y += aLines.length * 4.5 + 3;
      }
      y += 5;
    }

    // Expected outcome box
    checkPage(30);
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(m, y, cw, 28, 3, 3, "F");
    doc.setFillColor(bandColor[0], bandColor[1], bandColor[2]);
    doc.roundedRect(m, y, cw, 3, 3, 3, "F");
    doc.setFillColor(15, 23, 42);
    doc.rect(m, y + 2, cw, 2, "F");

    doc.setTextColor(0, 200, 220);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("EXPECTED OUTCOME", m + 6, y + 10);
    doc.setTextColor(220, 225, 240);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const outcomeText = oMaturity === "low"
      ? `Move from siloed to connected, governed AI within 12 months. Expected: ${efficiencyGain} efficiency gain, 20–30% reduction in redundant AI spend, ${riskReduction} risk reduction.`
      : oMaturity === "medium"
      ? `Achieve high maturity within 6–9 months. Expected: ${efficiencyGain} efficiency gain, ${roiMultiplier} ROI on AI investments, ${riskReduction} risk reduction.`
      : `Maintain competitive edge: continuous optimisation driving 1.5× revenue growth and up to 18% enterprise value uplift through AI leadership.`;
    const oLines = doc.splitTextToSize(outcomeText, cw - 12);
    doc.text(oLines, m + 6, y + 17);

    // ═══════════════════════════════════════
    // NEXT STEPS / CTA PAGE
    // ═══════════════════════════════════════
    doc.addPage();

    // Full dark page
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pw, ph, "F");

    // Geometric accents
    doc.setFillColor(20, 30, 55);
    doc.circle(pw + 30, ph - 40, 100, "F");
    doc.setFillColor(22, 35, 60);
    doc.circle(-40, 30, 80, "F");

    // Accent line
    doc.setFillColor(0, 200, 220);
    doc.rect(m, 50, 35, 1.5, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Next Steps", m, 68);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 175, 200);
    const nLines = doc.splitTextToSize(
      "This assessment is a starting point, not a destination. The insights in this report are most valuable when acted on within 30 days — before organisational momentum shifts.",
      cw
    );
    doc.text(nLines, m, 82);

    const nextSteps = [
      { num: "01", text: "Review your category scores with your leadership team — focus on the lowest-scoring area first." },
      { num: "02", text: "Share this report with stakeholders to align on AI silo risk and prioritisation." },
      { num: "03", text: "Use the roadmap to plan your first 90-day sprint. Start with Phase 1 actions." },
      { num: "04", text: "Book a free 15-minute strategy call to map your fastest path to connected AI agents." },
    ];

    let nsY = 110;
    for (const step of nextSteps) {
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 200, 220);
      doc.text(step.num, m, nsY);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(200, 210, 225);
      const sLines = doc.splitTextToSize(step.text, cw - 20);
      doc.text(sLines, m + 18, nsY - 2);
      nsY += sLines.length * 5 + 12;
    }

    // CTA block
    nsY += 10;
    doc.setFillColor(25, 40, 70);
    doc.roundedRect(m, nsY, cw, 35, 4, 4, "F");
    doc.setFillColor(0, 200, 220);
    doc.roundedRect(m, nsY, cw, 3, 4, 4, "F");
    doc.setFillColor(25, 40, 70);
    doc.rect(m, nsY + 2, cw, 2, "F");

    doc.setTextColor(0, 200, 220);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Book your free strategy call", m + 8, nsY + 14);
    doc.setTextColor(180, 190, 210);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("https://calendar.app.google/8oZYnnuHcaiH64Ky8", m + 8, nsY + 22);
    doc.setTextColor(100, 115, 140);
    doc.setFontSize(8);
    doc.text("15 minutes  •  No obligation  •  Tailored to your assessment results", m + 8, nsY + 29);

    // Bottom branding
    doc.setTextColor(60, 75, 100);
    doc.setFontSize(8);
    doc.text("Chase Continental — Enterprise AI Studio", m, 272);
    doc.text("chasecontinental.com", m, 279);

    // ═══════════════════════════════════════
    // FOOTER ON ALL PAGES (except cover & last)
    // ═══════════════════════════════════════
    const totalPages = doc.getNumberOfPages();
    for (let p = 2; p <= totalPages - 1; p++) {
      doc.setPage(p);
      doc.setFillColor(245, 246, 248);
      doc.rect(0, 287, pw, 10, "F");
      doc.setTextColor(120, 125, 140);
      doc.setFontSize(7);
      doc.text("Chase Continental  |  Enterprise AI Studio  |  Confidential", pw / 2, 292, { align: "center" });
      doc.text(`${p} / ${totalPages}`, pw - m, 292, { align: "right" });
    }

    // ═══════════════════════════════════════
    // UPLOAD & RETURN
    // ═══════════════════════════════════════
    const pdfOutput = doc.output("arraybuffer");
    const pdfBuffer = new Uint8Array(pdfOutput);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const filePath = `silo-audit-checklist/${lead_id}-${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("lead-magnets")
      .upload(filePath, pdfBuffer, { contentType: "application/pdf", upsert: true });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: urlData } = supabase.storage.from("lead-magnets").getPublicUrl(filePath);

    await supabase.from("downloads").insert({
      lead_id,
      asset_key: "silo-audit-checklist",
      file_path: filePath,
      downloaded_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ pdf_url: urlData.publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    console.error("PDF generation error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
