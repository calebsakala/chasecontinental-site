import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";
import { drawBrandHeader } from "../_shared/pdf-branding.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ============================================================================
// SECTOR CONFIGURATIONS (must match frontend)
// ============================================================================
const SECTOR_NAMES: Record<string, string> = {
  healthcare: "Healthcare & Life Sciences",
  financial_services: "Financial Services & Banking",
  manufacturing: "Manufacturing & Industrial",
  retail: "Retail & E-commerce",
  logistics: "Logistics & Supply Chain",
  technology: "Technology & SaaS",
  bpo: "BPO & Shared Services",
  legal: "Legal & Professional Services",
  insurance: "Insurance",
  energy: "Energy & Utilities",
  construction: "Construction & Real Estate",
  cpg: "CPG & Distribution",
};

const REVENUE_LABELS: Record<string, string> = {
  startup: "$1M - $10M",
  small: "$10M - $50M",
  medium: "$50M - $250M",
  large: "$250M - $1B",
  enterprise: "$1B - $10B",
  mega: "$10B+",
};

const HEADCOUNT_LABELS: Record<string, string> = {
  micro: "10 - 50",
  small: "50 - 200",
  medium: "200 - 1,000",
  large: "1,000 - 5,000",
  enterprise: "5,000 - 25,000",
  mega: "25,000+",
};

type RoiOutputs = {
  roiPercentage?: number;
  annualSavings?: number;
  paybackMonths?: number;
  threeYearValue?: number;
  timeSavings?: number;
  errorSavings?: number;
  productivityGain?: number;
  hoursSavedPerYear?: number;
  errorsPreventedPerYear?: number;
  keyMetric?: string;
  sectorInsight?: string;
  source?: string;
};

type RoiInputs = {
  sector?: string;
  revenueId?: string;
  headcountId?: string;
};

type RoiRunData = {
  inputs?: RoiInputs;
  outputs?: RoiOutputs;
  sector?: string;
};

type RoiLeadData = {
  company?: string | null;
  name?: string | null;
};

type Recommendation = {
  title: string;
  description: string;
};

type Risk = {
  title: string;
  mitigation: string;
};

// ============================================================================
// Report Generation
// ============================================================================
function formatCurrency(value: number) {
  if (!value || Number.isNaN(value)) return "$0";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function formatNumber(value: number) {
  if (!value || Number.isNaN(value)) return "0";
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
}

function getOpportunityTier(outputs: RoiOutputs) {
  const roi = outputs.roiPercentage || 0;

  if (roi > 500) {
    return {
      title: "Transformational Opportunity",
      color: [5, 150, 105] as const,
      description:
        "Exceptional ROI indicates transformational potential. Recommend enterprise-wide deployment with phased rollout.",
    };
  }

  if (roi > 300) {
    return {
      title: "High Impact Opportunity",
      color: [37, 99, 235] as const,
      description:
        "Strong ROI supports broad automation investment. Recommend department-level deployment with rapid scaling plan.",
    };
  }

  if (roi > 150) {
    return {
      title: "Strategic Opportunity",
      color: [124, 58, 237] as const,
      description:
        "Solid ROI justifies strategic investment. Recommend targeted process automation with clear success metrics.",
    };
  }

  if (roi > 50) {
    return {
      title: "Moderate Opportunity",
      color: [217, 119, 6] as const,
      description:
        "Positive ROI warrants focused pilots. Recommend starting with highest-impact processes.",
    };
  }

  return {
    title: "Exploratory Opportunity",
    color: [107, 114, 128] as const,
    description: "Early-stage exploration recommended with targeted pilots.",
  };
}

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function addBulletList(
  doc: jsPDF,
  items: string[],
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  let cursorY = y;

  for (const item of items) {
    const lines = doc.splitTextToSize(item, maxWidth - 6);
    doc.text("-", x, cursorY);
    doc.text(lines, x + 6, cursorY);
    cursorY += lines.length * lineHeight + 2;
  }

  return cursorY;
}

async function generateExecutiveSummaryPdf(
  runData: RoiRunData,
  leadData: RoiLeadData | null,
): Promise<ArrayBuffer> {
  const inputs = runData.inputs || {};
  const outputs = runData.outputs || {};
  const sectorName = SECTOR_NAMES[inputs.sector] || inputs.sector || "Unknown";
  const revLabel =
    REVENUE_LABELS[inputs.revenueId] || inputs.revenueId || "N/A";
  const hcLabel =
    HEADCOUNT_LABELS[inputs.headcountId] || inputs.headcountId || "N/A";
  const companyName = leadData?.company || "Your Organization";
  const contactName = leadData?.name || "Executive";
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const recommendations = getRecommendations(
    inputs.sector,
    inputs.revenueId,
    outputs,
  );
  const risks = getRisks(inputs.sector, inputs.headcountId);

  const opportunity = getOpportunityTier(outputs);
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const addPage = () => {
    doc.addPage();
    y = margin;
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 20) {
      addPage();
    }
  };

  const addSectionHeader = (
    eyebrow: string,
    title: string,
    subtitle?: string,
  ) => {
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(eyebrow.toUpperCase(), margin, y);
    y += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(22);
    doc.text(title, margin, y);
    y += 7;
    if (subtitle) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(71, 85, 105);
      y = addWrappedText(doc, subtitle, margin, y, contentWidth, 5);
      y += 5;
    }
  };

  const drawMetricCard = (
    x: number,
    yPos: number,
    value: string,
    label: string,
    accent: readonly [number, number, number],
  ) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, yPos, 82, 28, 4, 4, "FD");
    doc.setTextColor(...accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.text(value, x + 5, yPos + 11);
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(label, x + 5, yPos + 21);
  };

  const drawInsightCard = (
    title: string,
    body: string,
    accent: readonly [number, number, number],
  ) => {
    ensureSpace(28);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 24, 3, 3, "FD");
    doc.setFillColor(...accent);
    doc.rect(margin, y, 2, 24, "F");
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, margin + 6, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    const lines = doc.splitTextToSize(body, contentWidth - 12);
    doc.text(lines, margin + 6, y + 13);
    y += Math.max(24, 13 + lines.length * 4);
    y += 6;
  };

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, pageWidth, 4, "F");
  await drawBrandHeader(doc, {
    margin,
    top: 12,
    textColor: [255, 255, 255],
    fontSize: 11,
    logoHeight: 7,
    gap: 3.5,
  });
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CONFIDENTIAL - EXECUTIVE SUMMARY", pageWidth / 2, 34, {
    align: "center",
  });
  doc.setFontSize(30);
  doc.text("AI Automation", pageWidth / 2, 68, { align: "center" });
  doc.setTextColor(129, 140, 248);
  doc.text("ROI Analysis", pageWidth / 2, 82, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(148, 163, 184);
  doc.text(`Personalized assessment for ${companyName}`, pageWidth / 2, 110, {
    align: "center",
  });
  doc.text(`${sectorName} sector`, pageWidth / 2, 118, { align: "center" });
  doc.setDrawColor(129, 140, 248);
  doc.line(80, 132, 130, 132);
  doc.setFontSize(11);
  doc.setTextColor(203, 213, 225);
  doc.text(`Prepared for: ${contactName}`, pageWidth / 2, 152, {
    align: "center",
  });
  doc.text(`Revenue: ${revLabel}`, pageWidth / 2, 160, { align: "center" });
  doc.text(`Headcount: ${hcLabel} employees`, pageWidth / 2, 168, {
    align: "center",
  });
  doc.text(`Date: ${today}`, pageWidth / 2, 176, { align: "center" });
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.text("Chase Agents", pageWidth / 2, 250, { align: "center" });

  addPage();
  addSectionHeader(
    "Section 1 - The What",
    "Executive Overview",
    `Based on ${sectorName.toLowerCase()} benchmarks, your organization is positioned for significant returns on AI automation investment.`,
  );

  drawMetricCard(
    margin,
    y,
    formatCurrency(outputs.annualSavings || 0),
    "Projected annual savings",
    [5, 150, 105],
  );
  drawMetricCard(
    110,
    y,
    `${outputs.roiPercentage || 0}%`,
    "Return on investment",
    [99, 102, 241],
  );
  y += 34;
  drawMetricCard(
    margin,
    y,
    `${outputs.paybackMonths || 0} months`,
    "Estimated payback period",
    [217, 119, 6],
  );
  drawMetricCard(
    110,
    y,
    formatCurrency(outputs.threeYearValue || 0),
    "3-year net value",
    [15, 23, 42],
  );
  y += 38;

  doc.setFillColor(...opportunity.color);
  doc.roundedRect(margin, y, 64, 8, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(opportunity.title, margin + 4, y + 5.5);
  y += 13;
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y = addWrappedText(doc, opportunity.description, margin, y, contentWidth, 5);
  y += 6;

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Savings composition", margin, y);
  y += 8;
  const compositionRows = [
    [
      "Time and labor savings",
      formatCurrency(outputs.timeSavings || 0),
      `${outputs.annualSavings ? Math.round((outputs.timeSavings / outputs.annualSavings) * 100) : 0}%`,
    ],
    [
      "Error reduction",
      formatCurrency(outputs.errorSavings || 0),
      `${outputs.annualSavings ? Math.round((outputs.errorSavings / outputs.annualSavings) * 100) : 0}%`,
    ],
    [
      "Productivity gains",
      formatCurrency(outputs.productivityGain || 0),
      `${outputs.annualSavings ? Math.round((outputs.productivityGain / outputs.annualSavings) * 100) : 0}%`,
    ],
    [
      "Total annual savings",
      formatCurrency(outputs.annualSavings || 0),
      "100%",
    ],
  ];
  for (const [label, amount, share] of compositionRows) {
    ensureSpace(10);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 9, 2, 2, "FD");
    doc.setTextColor(30, 41, 59);
    doc.setFont(
      "helvetica",
      label === "Total annual savings" ? "bold" : "normal",
    );
    doc.setFontSize(9.5);
    doc.text(label, margin + 4, y + 5.8);
    doc.text(amount, 145, y + 5.8, { align: "right" });
    doc.text(share, pageWidth - margin - 4, y + 5.8, { align: "right" });
    y += 11;
  }
  y += 4;
  drawInsightCard(
    outputs.keyMetric || "Industry benchmark",
    `${outputs.sectorInsight || "Sector-specific insight"} - Source: ${outputs.source || "Industry research"}`,
    [99, 102, 241],
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  addWrappedText(
    doc,
    "Projections are based on 2025-2026 industry benchmarks from McKinsey, Deloitte, PwC, and Gartner. Actual results vary based on implementation quality, organizational readiness, and market conditions.",
    margin,
    y,
    contentWidth,
    4,
  );

  addPage();
  addSectionHeader(
    "Section 2 - The Why and The How",
    "Strategic Rationale",
    `Why AI automation matters for ${sectorName.toLowerCase()} organizations operating at the ${revLabel} revenue scale.`,
  );

  drawInsightCard(
    "Competitive advantage",
    `88% of enterprises are actively deploying AI automation. Organizations that delay risk falling behind competitors who achieve ${formatCurrency(outputs.annualSavings || 0)} in annual operational savings.`,
    [99, 102, 241],
  );
  drawInsightCard(
    "Workforce optimization",
    `With ${formatNumber(outputs.hoursSavedPerYear || 0)} hours saved annually, your team can redirect capacity toward strategic initiatives, innovation, and customer experience.`,
    [5, 150, 105],
  );
  drawInsightCard(
    "Error prevention",
    `Preventing ${formatNumber(outputs.errorsPreventedPerYear || 0)} errors per year protects brand reputation while saving ${formatCurrency(outputs.errorSavings || 0)} in rework and loss prevention.`,
    [217, 119, 6],
  );

  ensureSpace(20);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Implementation roadmap", margin, y);
  y += 8;
  recommendations.forEach((rec: Recommendation, index: number) => {
    drawInsightCard(
      `Phase ${index + 1}: ${rec.title}`,
      rec.description,
      [124, 58, 237],
    );
  });

  ensureSpace(20);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Key risks and mitigations", margin, y);
  y += 8;
  risks.forEach((risk: Risk) => {
    drawInsightCard(risk.title, risk.mitigation, [217, 119, 6]);
  });

  ensureSpace(35);
  doc.setFillColor(99, 102, 241);
  doc.roundedRect(margin, y, contentWidth, 24, 4, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Ready to move forward?", margin + 6, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  addWrappedText(
    doc,
    "Explore Chase Agents, then book a scoping call to plan your rollout. Visit chaseagents.com or reply to the email that delivered this report.",
    margin + 6,
    y + 14,
    contentWidth - 12,
    4,
  );

  return doc.output("arraybuffer");
}

function getRecommendations(
  sector: string,
  revenueId: string,
  outputs: RoiOutputs,
): Recommendation[] {
  const isSmall = ["startup", "small"].includes(revenueId);
  const isLarge = ["enterprise", "mega"].includes(revenueId);

  const base = [
    {
      title: "Process Discovery & Prioritization (Weeks 1-4)",
      description: `Map current workflows and identify the highest-impact automation candidates. Focus on processes contributing to your projected ${outputs.annualSavings ? "$" + Math.round(outputs.annualSavings * 0.3).toLocaleString() : ""} in quick-win savings.`,
    },
    {
      title: "Pilot Deployment (Weeks 5-12)",
      description: `Deploy AI automation on 2-3 priority processes. Target the estimated ${outputs.paybackMonths || "N/A"}-month payback period by selecting processes with the highest error rates and manual effort.`,
    },
    {
      title: "Scale & Optimize (Months 4-12)",
      description: `Expand automation across departments based on pilot learnings. Aim to capture the full ${outputs.annualSavings ? "$" + Math.round(outputs.annualSavings).toLocaleString() : ""} annual savings by end of Year 1.`,
    },
  ];

  if (isLarge) {
    base.push({
      title: "Enterprise Center of Excellence (Year 2+)",
      description:
        "Establish a dedicated AI CoE to standardize automation practices, manage vendor relationships, and drive continuous improvement across the organization.",
    });
  }

  if (isSmall) {
    base[0].description =
      "Start with a focused assessment of your top 5 most time-consuming processes. Small teams benefit most from targeting repetitive, rule-based tasks first.";
  }

  return base;
}

function getRisks(sector: string, headcountId: string): Risk[] {
  const risks = [
    {
      title: "Change Management",
      mitigation:
        "Invest in employee training and communication. Frame AI as augmentation, not replacement. Start with processes where staff already feel pain.",
    },
    {
      title: "Data Quality",
      mitigation:
        "Audit data inputs before automation. Poor data quality is the #1 cause of AI project failure. Budget 15-20% of implementation time for data preparation.",
    },
    {
      title: "Integration Complexity",
      mitigation:
        "Choose automation platforms with pre-built connectors for your existing tech stack. Avoid custom integrations where possible in Phase 1.",
    },
  ];

  if (
    ["healthcare", "financial_services", "insurance", "legal"].includes(sector)
  ) {
    risks.push({
      title: "Regulatory Compliance",
      mitigation:
        "Ensure AI systems meet industry-specific compliance requirements. Implement audit trails and human-in-the-loop safeguards for regulated processes.",
    });
  }

  return risks;
}

// ============================================================================
// EDGE FUNCTION
// ============================================================================
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { run_id, lead_id } = await req.json();

    if (!run_id) {
      throw new Error("run_id is required");
    }

    // Fetch run data
    const { data: runData, error: runError } = await supabaseClient
      .from("lm02_calculator_runs")
      .select("*")
      .eq("id", run_id)
      .single();

    if (runError || !runData) {
      throw new Error("Failed to fetch run data");
    }

    // Fetch lead data if available
    let leadData = null;
    if (lead_id) {
      const { data, error } = await supabaseClient
        .from("leads")
        .select("*")
        .eq("id", lead_id)
        .single();
      if (!error) leadData = data;
    }

    const pdfReport = await generateExecutiveSummaryPdf(runData, leadData);
    const filePath = `ai-roi-calculator/roi-report-${run_id}.pdf`;
    const { error: uploadError } = await supabaseClient.storage
      .from("lead-magnets")
      .upload(filePath, new Uint8Array(pdfReport), {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabaseClient.storage
        .from("lead-magnets")
        .createSignedUrl(filePath, 3600);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      throw signedUrlError || new Error("Failed to create signed URL");
    }

    // Track event
    await supabaseClient.from("events").insert({
      event_name: "pdf_generated",
      lead_id: lead_id,
      event_payload: {
        run_id,
        report_url: signedUrlData.signedUrl,
        file_path: filePath,
        sector: runData.sector,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Executive summary generated",
        report_url: signedUrlData.signedUrl,
        pdf_url: signedUrlData.signedUrl,
        file_path: filePath,
        insights: {
          headline: "Your AI Automation ROI Executive Summary",
          data: runData.outputs,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error: unknown) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
