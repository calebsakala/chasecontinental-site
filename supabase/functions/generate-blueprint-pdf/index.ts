import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
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

type WorkflowStep = {
  description?: string;
  owner?: string;
  tool?: string;
};

type WorkflowException = {
  exception?: string;
  trigger?: string;
  action?: string;
  approval?: string;
};

type WorkflowMetric = {
  name?: string;
  target?: string;
  baseline?: string;
  method?: string;
};

type WorkflowData = {
  workflowName?: string;
  steps?: WorkflowStep[];
  exceptions?: WorkflowException[];
  metrics?: WorkflowMetric[];
};

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
    const rawBody = await req.text();
    let parsedBody: Record<string, unknown> = {};
    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    const { name, email, workflowData, leadId, lead_id } = parsedBody as {
      name?: string;
      email?: string;
      workflowData?: WorkflowData;
      leadId?: string;
      lead_id?: string;
    };
    const resolvedLeadId = lead_id ?? leadId ?? crypto.randomUUID();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { jsPDF } = await import("https://esm.sh/jspdf@2.5.1");
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

    const hasData =
      workflowData &&
      ((workflowData.steps && workflowData.steps.length > 0) ||
        (workflowData.exceptions && workflowData.exceptions.length > 0) ||
        (workflowData.metrics && workflowData.metrics.length > 0));

    // Helper to build one full blueprint (blank or populated)
    const buildBlueprint = async (populated: boolean, isFirst: boolean) => {
      if (!isFirst) addPage();

      // ── Cover Page ──
      doc.setFillColor(49, 27, 100);
      doc.rect(0, 0, w, 842, "F");
      doc.setFillColor(212, 175, 55);
      doc.rect(margin, 120, 80, 4, "F");

      await drawBrandHeader(doc, {
        margin,
        top: 82,
        textColor: [212, 175, 55],
        fontSize: 12,
        logoHeight: 18,
        gap: 10,
      });

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(36);
      doc.text("Deterministic", margin, 200);
      doc.text("Automation", margin, 245);
      doc.text("Blueprint", margin, 290);

      if (populated && workflowData?.workflowName) {
        doc.setFontSize(16);
        doc.setTextColor(0, 176, 255);
        doc.text(workflowData.workflowName, margin, 340);
        doc.setFontSize(12);
        doc.setTextColor(200, 200, 220);
        doc.text("Populated with your workflow data", margin, 370);
      } else {
        doc.setFontSize(14);
        doc.setTextColor(200, 200, 220);
        doc.text("Blank Template — Fill in your details", margin, 340);
      }

      doc.setFontSize(11);
      doc.setTextColor(160, 160, 180);
      doc.text(`Prepared for: ${name || "Operations Leader"}`, margin, 420);
      doc.text(`Email: ${email || ""}`, margin, 440);
      doc.text(
        `Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
        margin,
        460,
      );

      doc.setFillColor(0, 176, 255);
      doc.rect(margin, 740, contentW, 3, "F");
      doc.setFontSize(9);
      doc.setTextColor(140, 140, 160);
      doc.text("© 2026 Chase Agents. All rights reserved.", margin, 770);

      // ── Intro Page ──
      addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, w, 842, "F");
      doc.setTextColor(49, 27, 100);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Introduction", margin, y);
      y += 10;
      doc.setFillColor(0, 176, 255);
      doc.rect(margin, y, 60, 3, "F");
      y += 30;

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const intro = [
        "This blueprint helps you turn messy, unpredictable work into a repeatable,",
        "deterministic workflow. By defining clear steps, handling exceptions,",
        "incorporating approvals, and measuring outcomes, you ensure consistency.",
        "",
        "How to Use This Template:",
        "• Fill in the blanks with your process details",
        "• Use the tables to map out flows and exceptions",
        "• Refer to the checklist to measure success",
        "• Iterate based on real-world results",
      ];
      intro.forEach((line) => {
        doc.text(line, margin, y);
        y += 16;
      });

      // ── Section 1: Workflow Steps ──
      addPage();
      doc.setTextColor(49, 27, 100);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Section 1: Step-by-Step Workflow Template", margin, y);
      y += 10;
      doc.setFillColor(212, 175, 55);
      doc.rect(margin, y, 60, 3, "F");
      y += 25;

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Map out the core steps of your workflow.", margin, y);
      y += 25;

      const cols = [40, 150, 110, 100, 95];
      const headers = [
        "Step #",
        "Description",
        "Responsible",
        "Inputs/Outputs",
        "Tool",
      ];
      doc.setFillColor(49, 27, 100);
      doc.rect(margin, y, contentW, 22, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      let cx = margin + 5;
      headers.forEach((h, i) => {
        doc.text(h, cx, y + 15);
        cx += cols[i];
      });
      y += 22;

      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      const stepCount =
        populated && workflowData?.steps?.length
          ? Math.max(workflowData.steps.length, 10)
          : 10;
      for (let i = 0; i < stepCount; i++) {
        checkPage(22);
        const fill = i % 2 === 0 ? 245 : 255;
        doc.setFillColor(fill, fill, fill);
        doc.rect(margin, y, contentW, 22, "F");
        doc.setDrawColor(220, 220, 220);
        doc.rect(margin, y, contentW, 22, "S");
        cx = margin + 5;
        doc.text(String(i + 1), cx, y + 15);
        cx += cols[0];
        if (populated && workflowData?.steps?.[i]) {
          const s = workflowData.steps[i];
          doc.text((s.description || "").substring(0, 30), cx, y + 15);
          cx += cols[1];
          doc.text((s.owner || "").substring(0, 20), cx, y + 15);
          cx += cols[2];
          cx += cols[3];
          doc.text((s.tool || "").substring(0, 18), cx, y + 15);
        } else {
          doc.text("[Fill in]", cx, y + 15);
        }
        y += 22;
      }

      // ── Section 2: Exception Mapping ──
      addPage();
      doc.setTextColor(49, 27, 100);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Section 2: Exception + Approval Mapping", margin, y);
      y += 10;
      doc.setFillColor(0, 176, 255);
      doc.rect(margin, y, 60, 3, "F");
      y += 25;

      const eCols = [120, 100, 120, 80, 75];
      const eHeaders = [
        "Exception",
        "Trigger",
        "Action",
        "Approval?",
        "Escalation",
      ];
      doc.setFillColor(49, 27, 100);
      doc.rect(margin, y, contentW, 22, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      cx = margin + 5;
      eHeaders.forEach((h, i) => {
        doc.text(h, cx, y + 15);
        cx += eCols[i];
      });
      y += 22;

      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      const excCount =
        populated && workflowData?.exceptions?.length
          ? Math.max(workflowData.exceptions.length, 6)
          : 6;
      for (let i = 0; i < excCount; i++) {
        const fill = i % 2 === 0 ? 245 : 255;
        doc.setFillColor(fill, fill, fill);
        doc.rect(margin, y, contentW, 22, "F");
        doc.setDrawColor(220, 220, 220);
        doc.rect(margin, y, contentW, 22, "S");
        cx = margin + 5;
        if (populated && workflowData?.exceptions?.[i]) {
          const e = workflowData.exceptions[i];
          doc.text((e.exception || "").substring(0, 22), cx, y + 15);
          cx += eCols[0];
          doc.text((e.trigger || "").substring(0, 18), cx, y + 15);
          cx += eCols[1];
          doc.text((e.action || "").substring(0, 22), cx, y + 15);
          cx += eCols[2];
          doc.text((e.approval || "").substring(0, 12), cx, y + 15);
        } else {
          doc.text("[Fill in]", cx, y + 15);
        }
        y += 22;
      }

      y += 30;
      checkPage(80);
      doc.setTextColor(49, 27, 100);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Approval Checkpoints", margin, y);
      y += 20;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      for (let i = 1; i <= 3; i++) {
        doc.text(
          `Checkpoint ${i}: [After Step ___] — Approver: [___] — Criteria: [___]`,
          margin,
          y,
        );
        y += 18;
      }

      // ── Section 3: Measurement ──
      addPage();
      doc.setTextColor(49, 27, 100);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Section 3: Measurement Checklist", margin, y);
      y += 10;
      doc.setFillColor(212, 175, 55);
      doc.rect(margin, y, 60, 3, "F");
      y += 25;

      const mCols = [100, 80, 80, 80, 155];
      const mHeaders = ["Metric", "Target", "Baseline", "Post-Impl", "Method"];
      doc.setFillColor(49, 27, 100);
      doc.rect(margin, y, contentW, 22, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      cx = margin + 5;
      mHeaders.forEach((h, i) => {
        doc.text(h, cx, y + 15);
        cx += mCols[i];
      });
      y += 22;

      const defaultMetrics = [
        "Success Rate",
        "Time Saved",
        "Error Rate",
        "Approval Time",
        "Compliance Score",
      ];
      const metricRows =
        populated && workflowData?.metrics?.length
          ? workflowData.metrics
          : defaultMetrics.map((m: string) => ({
              name: m,
              target: "",
              baseline: "",
              method: "",
            }));

      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      metricRows.forEach((m: WorkflowMetric, i: number) => {
        checkPage(22);
        const fill = i % 2 === 0 ? 245 : 255;
        doc.setFillColor(fill, fill, fill);
        doc.rect(margin, y, contentW, 22, "F");
        doc.setDrawColor(220, 220, 220);
        doc.rect(margin, y, contentW, 22, "S");
        cx = margin + 5;
        doc.text((m.name || "").substring(0, 18), cx, y + 15);
        cx += mCols[0];
        if (populated) {
          doc.text((m.target || "").substring(0, 14), cx, y + 15);
          cx += mCols[1];
          doc.text((m.baseline || "").substring(0, 14), cx, y + 15);
        }
        y += 22;
      });

      // Next Steps
      y += 40;
      checkPage(80);
      doc.setTextColor(49, 27, 100);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Next Steps", margin, y);
      y += 25;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      [
        "1. Fill in each section with your specific process details.",
        "2. Test the workflow with a small pilot before full rollout.",
        "3. Iterate based on measurement results.",
        "4. Scale successful patterns across your organization.",
      ].forEach((s) => {
        doc.text(s, margin, y);
        y += 18;
      });

      y += 30;
      doc.setFillColor(0, 176, 255);
      doc.rect(margin, y, contentW, 3, "F");
      y += 20;
      doc.setFontSize(9);
      doc.setTextColor(140, 140, 140);
      doc.text("© 2026 Chase Agents. All rights reserved.", margin, y);
    };

    // Build populated version first if we have data, then blank
    if (hasData) {
      await buildBlueprint(true, true);
      await buildBlueprint(false, false);
    } else {
      await buildBlueprint(false, true);
    }

    const pdfBytes = doc.output("arraybuffer");
    const filePath = `deterministic-blueprint/${resolvedLeadId}-${Date.now()}.pdf`;

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
      throw signedUrlError ?? new Error("Could not create a signed URL.");
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
