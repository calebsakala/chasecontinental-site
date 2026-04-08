import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
const FILE_PATH = "ccid-case-study/ccid-case-study.pdf";

const NAVY: [number, number, number] = [15, 23, 42];
const TEAL: [number, number, number] = [13, 148, 136];
const GOLD: [number, number, number] = [217, 119, 6];
const SLATE: [number, number, number] = [71, 85, 105];
const LIGHT: [number, number, number] = [241, 245, 249];
const WHITE: [number, number, number] = [255, 255, 255];

const CHALLENGE_BULLETS = [
  "Manual reporting consumed 20+ hours per week across the team.",
  "Error rates in data entry exceeded 12%, causing downstream rework.",
  "Leadership lacked real-time visibility into operational performance.",
];

const WHAT_CHANGED_BULLETS = [
  "Deterministic automation replaced manual data aggregation and validation.",
  "Structured workflows enforced data integrity at every handoff point.",
  "A unified dashboard gave leadership live KPIs without waiting for reports.",
];

const KPI_TILES = [
  {
    number: "90%",
    label: "Faster Processing",
    desc: "Report turnaround compressed from days to minutes.",
  },
  {
    number: "60%",
    label: "Cost Reduction",
    desc: "Operational spend dropped through automation.",
  },
  {
    number: "4x",
    label: "Visibility Gain",
    desc: "Real-time dashboards replaced weekly spreadsheets.",
  },
];

const TIMELINE_STEPS = [
  {
    week: "Week 1-2",
    title: "Discovery & Mapping",
    desc: "Audited existing workflows and identified automation candidates.",
  },
  {
    week: "Week 3-4",
    title: "System Design",
    desc: "Designed deterministic pipelines with built-in validation.",
  },
  {
    week: "Week 5-8",
    title: "Build & Connect",
    desc: "Deployed automation agents and connected live data sources.",
  },
  {
    week: "Week 9-10",
    title: "Launch & Measure",
    desc: "Went live with full reporting dashboard and KPI tracking.",
  },
];

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
    const { jsPDF } = await import("https://esm.sh/jspdf@2.5.1");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    const bottomLimit = 276;
    let y = 0;

    const addFooter = () => {
      doc.setDrawColor(...LIGHT);
      doc.line(margin, 286, pageWidth - margin, 286);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...SLATE);
      doc.text("CCID Case Study | Chase Agents", margin, 291);
      doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin, 291, {
        align: "right",
      });
    };

    const startContentPage = async () => {
      doc.addPage();
      const header = await drawBrandHeader(doc, {
        margin,
        top: 12,
        text: "CHASE AGENTS",
        textColor: NAVY,
        fontSize: 12,
        logoHeight: 6,
        gap: 3,
      });
      y = header.bottomY + 12;
    };

    const ensureSpace = async (needed: number) => {
      if (y + needed <= bottomLimit) return;
      addFooter();
      await startContentPage();
    };

    const addParagraph = async (
      text: string,
      fontSize = 11,
      color: [number, number, number] = SLATE,
      gapAfter = 6,
    ) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, contentWidth);
      const blockHeight = lines.length * (fontSize * 0.46) + gapAfter;
      await ensureSpace(blockHeight + 2);
      doc.text(lines, margin, y);
      y += lines.length * (fontSize * 0.46) + gapAfter;
    };

    const addSectionTitle = async (title: string) => {
      await ensureSpace(14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...NAVY);
      doc.text(title, margin, y);
      y += 4;
      doc.setDrawColor(...TEAL);
      doc.setLineWidth(0.7);
      doc.line(margin, y, margin + 34, y);
      y += 8;
    };

    const addBullets = async (items: string[]) => {
      for (const item of items) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...TEAL);
        const lines = doc.splitTextToSize(item, contentWidth - 8);
        const blockHeight = lines.length * 5.2 + 4;
        await ensureSpace(blockHeight + 2);
        doc.text("•", margin, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(...SLATE);
        doc.text(lines, margin + 6, y);
        y += lines.length * 5.2 + 4;
      }
    };

    doc.setFillColor(...NAVY);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
    const coverHeader = await drawBrandHeader(doc, {
      margin,
      top: 16,
      text: "CHASE AGENTS",
      textColor: WHITE,
      fontSize: 13,
      logoHeight: 7,
      gap: 4,
    });

    doc.setFillColor(...TEAL);
    doc.rect(margin, coverHeader.bottomY + 12, 42, 2.2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(...WHITE);
    doc.text("CCID Case Study", margin, 74);
    doc.text("Deterministic Operations", margin, 88);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(226, 232, 240);
    doc.text(
      doc.splitTextToSize(
        "How CCID achieved 90% faster processing by using Chase Agents as the operating layer across fragmented reporting workflows.",
        contentWidth,
      ),
      margin,
      104,
    );

    doc.setFillColor(255, 255, 255, 0.08);
    doc.roundedRect(margin, 128, contentWidth, 42, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...WHITE);
    doc.text("Client Snapshot", margin + 8, 140);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.text(
      "Sector: Government and public-sector operations",
      margin + 8,
      149,
    );
    doc.text(
      "Problem: Manual reporting, low visibility, error-prone handoffs",
      margin + 8,
      156,
    );
    doc.text(
      "Outcome: Faster processing, lower operating cost, live KPI visibility",
      margin + 8,
      163,
    );

    const tileY = 188;
    const tileWidth = (contentWidth - 8) / 3;
    KPI_TILES.forEach((tile, index) => {
      const x = margin + index * (tileWidth + 4);
      doc.setFillColor(...WHITE);
      doc.roundedRect(x, tileY, tileWidth, 34, 4, 4, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...NAVY);
      doc.text(tile.number, x + 6, tileY + 11);
      doc.setFontSize(9.5);
      doc.setTextColor(...GOLD);
      doc.text(tile.label.toUpperCase(), x + 6, tileY + 18);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.8);
      doc.setTextColor(...SLATE);
      doc.text(
        doc.splitTextToSize(tile.desc, tileWidth - 12),
        x + 6,
        tileY + 24,
      );
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(226, 232, 240);
    doc.text(
      doc.splitTextToSize(
        "This PDF summarizes the challenge, the deterministic workflow redesign, the measured gains, and the implementation sequence Chase Agents used to stabilize execution.",
        contentWidth,
      ),
      margin,
      242,
    );

    doc.setFillColor(...TEAL);
    doc.roundedRect(margin, 256, contentWidth, 18, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(...WHITE);
    doc.text(
      "Explore Chase Agents, then book a scoping call to map the same pattern into your environment.",
      margin + 6,
      267,
    );
    addFooter();

    await startContentPage();

    await addSectionTitle("The Challenge");
    await addParagraph(
      "CCID needed faster and more reliable reporting, but the existing process depended on manual aggregation, spreadsheet handoffs, and delayed leadership visibility.",
      11,
      SLATE,
      7,
    );
    await addBullets(CHALLENGE_BULLETS);

    await addSectionTitle("What Changed");
    await addParagraph(
      "Chase Agents introduced deterministic workflows so each handoff, validation step, and reporting output was controlled by a repeatable operating layer rather than ad hoc manual effort.",
      11,
      SLATE,
      7,
    );
    await addBullets(WHAT_CHANGED_BULLETS);

    await addSectionTitle("Measured Results");
    await addParagraph(
      "The outcome was not just faster reporting. CCID reduced rework, compressed turnaround times, and gave leadership a live operational view without waiting for weekly spreadsheet updates.",
      11,
      SLATE,
      7,
    );

    for (const tile of KPI_TILES) {
      await ensureSpace(22);
      doc.setFillColor(...LIGHT);
      doc.roundedRect(margin, y, contentWidth, 17, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...NAVY);
      doc.text(`${tile.number} ${tile.label}`, margin + 6, y + 7);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(...SLATE);
      doc.text(tile.desc, margin + 6, y + 13);
      y += 22;
    }

    addFooter();
    await startContentPage();

    await addSectionTitle("Implementation Timeline");
    for (const [index, step] of TIMELINE_STEPS.entries()) {
      await ensureSpace(28);
      doc.setFillColor(...LIGHT);
      doc.roundedRect(margin, y, contentWidth, 22, 3, 3, "F");
      doc.setFillColor(...TEAL);
      doc.circle(margin + 8, y + 11, 4, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...WHITE);
      doc.text(String(index + 1), margin + 8, y + 12, { align: "center" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...GOLD);
      doc.text(step.week, margin + 16, y + 8);
      doc.setTextColor(...NAVY);
      doc.text(step.title, margin + 16, y + 14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...SLATE);
      doc.text(
        doc.splitTextToSize(step.desc, contentWidth - 24),
        margin + 16,
        y + 19,
      );
      y += 28;
    }

    await addSectionTitle("Where This Fits");
    await addParagraph(
      "This pattern fits organizations that need deterministic execution across reporting, reconciliations, workflow handoffs, or other operations where delays and data quality issues compound downstream.",
    );
    await addParagraph(
      "If your team is still moving critical data through spreadsheets, manual QA, or disconnected systems, Chase Agents can connect those workflows without introducing opaque automation behavior.",
    );

    await ensureSpace(34);
    doc.setFillColor(...NAVY);
    doc.roundedRect(margin, y, contentWidth, 26, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...WHITE);
    doc.text("Next Step", margin + 8, y + 9);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.text(
      doc.splitTextToSize(
        "Explore Chase Agents at chaseagents.com, then book a scoping call to identify the highest-value workflow to stabilize first.",
        contentWidth - 16,
      ),
      margin + 8,
      y + 16,
    );

    addFooter();

    const pdfOutput = doc.output("arraybuffer");
    const pdfBuffer = new Uint8Array(pdfOutput);
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(FILE_PATH, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "CCID case study PDF generated and uploaded successfully",
        path: FILE_PATH,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error generating CCID case study PDF:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
