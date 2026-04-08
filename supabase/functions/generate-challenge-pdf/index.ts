import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";
import { drawBrandHeader } from "../_shared/pdf-branding.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const STORAGE_BUCKET = "lead-magnets";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ error: "Supabase environment variables are missing." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    const { signupId, name, email } = await req.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const w = doc.internal.pageSize.getWidth();
    const margin = 50;
    const contentW = w - margin * 2;
    let y = 0;

    const addPage = () => {
      doc.addPage();
      y = margin;
    };
    const checkPage = (need: number) => {
      if (y + need > 760) addPage();
    };

    // ── Cover ──
    doc.setFillColor(15, 30, 55);
    doc.rect(0, 0, w, 842, "F");

    doc.setFillColor(0, 180, 190);
    doc.rect(margin, 120, 80, 4, "F");

    await drawBrandHeader(doc, {
      margin,
      top: 82,
      textColor: [0, 180, 190],
      fontSize: 12,
      logoHeight: 18,
      gap: 10,
    });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(38);
    doc.setFont("helvetica", "bold");
    doc.text("5-Day Automation", margin, 200);
    doc.text("Pilot Challenge", margin, 245);

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 200, 220);
    doc.text("Your Guide to Building a Successful", margin, 300);
    doc.text("Automation Plan", margin, 322);

    doc.setFontSize(11);
    doc.setTextColor(140, 160, 180);
    doc.text(`Prepared for: ${name || "Operations Leader"}`, margin, 400);
    doc.text(`Email: ${email || ""}`, margin, 420);
    doc.text(
      `Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      margin,
      440,
    );

    doc.setFillColor(212, 175, 55);
    doc.rect(margin, 740, contentW, 3, "F");
    doc.setFontSize(9);
    doc.setTextColor(120, 140, 160);
    doc.text("© 2026 Chase Agents. All rights reserved.", margin, 770);

    // ── Exec Summary ──
    addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, w, 842, "F");

    doc.setTextColor(15, 30, 55);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", margin, y);
    y += 10;
    doc.setFillColor(0, 180, 190);
    doc.rect(margin, y, 60, 3, "F");
    y += 30;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const summary = [
      "This 5-day challenge provides a structured framework for building your first",
      "automation pilot plan. Each day focuses on a critical planning step—from",
      "identifying the right workflow to defining success metrics and rollout strategy.",
      "",
      "Key Statistics:",
      "• Automation can reduce processing time by up to 77%",
      "• Worker productivity can increase by up to 90%",
      "• Error reduction of up to 70% through structured exception handling",
      "• ROI of 30-200% achievable in the first year",
      "• 80% of finance tasks can be automated with proper planning",
      "• 60% of companies are already implementing automation",
    ];
    summary.forEach((line) => {
      doc.text(line, margin, y);
      y += 16;
    });

    // ── Automation Benefits Breakdown ──
    y += 20;
    doc.setTextColor(15, 30, 55);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Automation Benefits Breakdown", margin, y);
    y += 25;

    const benefits = [
      { label: "Productivity Increase", pct: 40, color: [0, 180, 190] },
      { label: "Error Reduction", pct: 25, color: [100, 84, 39] },
      { label: "Cost Savings", pct: 20, color: [212, 175, 55] },
      { label: "Time Savings", pct: 15, color: [80, 45, 168] },
    ];

    doc.setFontSize(10);
    benefits.forEach((b) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text(`${b.label} (${b.pct}%)`, margin, y + 12);
      // Bar
      doc.setFillColor(235, 235, 235);
      doc.roundedRect(margin + 200, y, 250, 16, 4, 4, "F");
      doc.setFillColor(b.color[0], b.color[1], b.color[2]);
      doc.roundedRect(
        margin + 200,
        y,
        250 * (b.pct / 100) * 2.5,
        16,
        4,
        4,
        "F",
      );
      y += 28;
    });

    // ── Day pages ──
    const days = [
      {
        day: 1,
        title: "Pick the Workflow",
        content: [
          "Objective: Identify repetitive, high-volume, rule-based tasks.",
          "",
          "What to look for:",
          "• Tasks performed more than 50 times per week",
          "• Processes with clear inputs and outputs",
          "• Work that follows consistent rules (if X, then Y)",
          "• Areas with high error rates or bottlenecks",
          "",
          "Examples of automatable workflows:",
          "• Invoice processing and accounts payable",
          "• Data entry and validation",
          "• Report generation and distribution",
          "• Order fulfillment and tracking updates",
          "• Employee onboarding document collection",
          "",
          "Action: List your top 3 candidate workflows and score them on",
          "volume, complexity, and impact. Pick the highest-scoring one.",
          "",
          "Key stat: Automation can reduce processing time by up to 77%.",
        ],
      },
      {
        day: 2,
        title: "Map the Real Steps",
        content: [
          "Objective: Document the current process step by step.",
          "",
          "How to map your workflow:",
          "1. Walk through the process with the team who does it daily",
          "2. Document every step—including the 'unofficial' ones",
          "3. Note where handoffs happen between people or systems",
          "4. Identify wait times and decision points",
          "5. Use a simple flowchart or numbered list",
          "",
          "What to capture at each step:",
          "• Who performs it (role, not person)",
          "• What tools are used (email, ERP, spreadsheet)",
          "• How long it takes on average",
          "• What can go wrong",
          "",
          "Action: Create a step-by-step map of your chosen workflow.",
          "",
          "Key stat: Proper process mapping can boost productivity by 90%.",
        ],
      },
      {
        day: 3,
        title: "Define Exceptions + Approvals",
        content: [
          "Objective: Handle the edge cases that break automation.",
          "",
          "Common exception types:",
          "• Missing or invalid data",
          "• Amounts above approval thresholds",
          "• New vendors/customers not in the system",
          "• Regulatory or compliance flags",
          "• System timeouts or API failures",
          "",
          "For each exception, define:",
          "• Trigger condition (what causes it)",
          "• Handling action (what should happen)",
          "• Who approves the resolution",
          "• Escalation timeline (how long before escalation)",
          "",
          "Approval workflow design:",
          "• Sequential: one approver after another",
          "• Parallel: multiple approvers simultaneously",
          "• Threshold-based: auto-approve below certain values",
          "",
          "Key stat: Structured exception handling reduces errors by 70%.",
        ],
      },
      {
        day: 4,
        title: "Define Success Metrics",
        content: [
          "Objective: Set measurable KPIs using SMART goals.",
          "",
          "Essential metrics to track:",
          "",
          "1. Time Saved",
          "   • Cycle time: from start to completion",
          "   • Target: 50-77% reduction",
          "",
          "2. Error Rate",
          "   • Exceptions per 100 transactions",
          "   • Target: 70% fewer errors",
          "",
          "3. Cost Savings",
          "   • Labor hours saved × hourly cost",
          "   • Infrastructure/tool cost reduction",
          "",
          "4. Throughput",
          "   • Volume processed per day/week",
          "   • Target: 2-5x current capacity",
          "",
          "5. ROI",
          "   • (Savings - Investment) / Investment × 100",
          "   • Target: 30-200% in year one",
          "",
          "Action: Set baseline measurements for your chosen workflow.",
        ],
      },
      {
        day: 5,
        title: "Rollout Plan + Next Steps",
        content: [
          "Objective: Create a phased implementation plan.",
          "",
          "Phase 1 — Pilot (Weeks 1-2):",
          "• Deploy automation for a small subset (10-20% of volume)",
          "• Monitor closely with daily check-ins",
          "• Document issues and quick wins",
          "",
          "Phase 2 — Validate (Weeks 3-4):",
          "• Compare metrics against baseline",
          "• Gather team feedback",
          "• Refine exception handling",
          "",
          "Phase 3 — Scale (Month 2+):",
          "• Expand to full volume",
          "• Train all team members",
          "• Set up ongoing monitoring dashboards",
          "",
          "Change management essentials:",
          "• Communicate the 'why' to all stakeholders",
          "• Provide hands-on training sessions",
          "• Designate automation champions in each team",
          "",
          "Next step: Explore Chase Agents, then book a scoping call if you need rollout support.",
        ],
      },
    ];

    days.forEach((d) => {
      addPage();
      doc.setTextColor(15, 30, 55);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(`Day ${d.day}: ${d.title}`, margin, y);
      y += 10;
      doc.setFillColor(
        d.day <= 2 ? 0 : d.day <= 4 ? 212 : 80,
        d.day <= 2 ? 180 : d.day <= 4 ? 175 : 45,
        d.day <= 2 ? 190 : d.day <= 4 ? 55 : 168,
      );
      doc.rect(margin, y, 60, 3, "F");
      y += 25;

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      d.content.forEach((line) => {
        checkPage(16);
        doc.text(line, margin, y);
        y += 15;
      });
    });

    // ── Sources ──
    addPage();
    doc.setTextColor(15, 30, 55);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Sources & References", margin, y);
    y += 10;
    doc.setFillColor(0, 180, 190);
    doc.rect(margin, y, 60, 3, "F");
    y += 30;

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const sources = [
      "• McKinsey Global Institute — Jobs Lost, Jobs Gained: Workforce Transitions",
      "• Deloitte — The robots are ready. Are you? (Global RPA Survey)",
      "• Forrester — The Total Economic Impact of RPA",
      "• UiPath — State of Automation Report 2025",
      "• Gartner — Hyperautomation Strategic Technology Trend",
      "• Harvard Business Review — Process Mapping and Automation",
    ];
    sources.forEach((s) => {
      doc.text(s, margin, y);
      y += 14;
    });

    y += 20;
    doc.setFillColor(212, 175, 55);
    doc.rect(margin, y, contentW, 3, "F");
    y += 20;
    doc.setFontSize(9);
    doc.setTextColor(140, 140, 140);
    doc.text("© 2026 Chase Agents. All rights reserved.", margin, y);

    const pdfBytes = doc.output("arraybuffer");
    const resolvedSignupId = signupId?.trim() || crypto.randomUUID();
    const filePath = `5-day-pilot-challenge/${resolvedSignupId}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, new Uint8Array(pdfBytes), {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(filePath, 3600);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      throw signedUrlError ?? new Error("Could not create signed URL.");
    }

    return new Response(
      JSON.stringify({
        success: true,
        pdf_url: signedUrlData.signedUrl,
        file_path: filePath,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
