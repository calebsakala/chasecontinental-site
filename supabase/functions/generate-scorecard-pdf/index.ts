import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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

    const { name, email, company, score, band, answers } = parsedBody as {
      name?: string;
      email?: string;
      company?: string | null;
      score?: number;
      band?: string;
      answers?: number[];
    };

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

    const bandColors: Record<string, [number, number, number]> = {
      low: [34, 197, 94],
      medium: [234, 179, 8],
      high: [239, 68, 68],
    };
    const bandColor = bandColors[band] || [100, 100, 100];

    const questions = [
      "Cloud Infrastructure",
      "Database",
      "API Management",
      "Authentication",
      "Data Formats",
      "Software Licenses",
      "Integration Tools",
      "Monitoring & Logging",
      "CI/CD Pipelines",
      "AI/ML Components",
    ];

    // ── Cover ──
    doc.setFillColor(47, 79, 79);
    doc.rect(0, 0, w, 842, "F");

    doc.setFillColor(255, 215, 0);
    doc.rect(margin, 120, 80, 4, "F");

    doc.setTextColor(255, 215, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CHASE CONTINENTAL", margin, 100);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(34);
    doc.text("Stack Lock-In", margin, 200);
    doc.text("Audit Report", margin, 245);

    doc.setFontSize(18);
    doc.setTextColor(...bandColor);
    const bandLabel =
      band === "low"
        ? "Low Risk"
        : band === "medium"
          ? "Medium Risk"
          : "High Risk";
    doc.text(`${bandLabel} — Score: ${score}/30`, margin, 310);

    doc.setFontSize(11);
    doc.setTextColor(180, 200, 200);
    doc.text(`Prepared for: ${name || "Tech Leader"}`, margin, 380);
    if (company) doc.text(`Company: ${company}`, margin, 400);
    doc.text(
      `Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      margin,
      company ? 420 : 400,
    );

    doc.setFillColor(0, 255, 255);
    doc.rect(margin, 740, contentW, 3, "F");
    doc.setFontSize(9);
    doc.setTextColor(140, 160, 160);
    doc.text("© 2026 Chase Continental. All rights reserved.", margin, 770);

    // ── Executive Summary ──
    addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, w, 842, "F");

    doc.setTextColor(47, 79, 79);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", margin, y);
    y += 10;
    doc.setFillColor(0, 255, 255);
    doc.rect(margin, y, 60, 3, "F");
    y += 30;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const summaries: Record<string, string[]> = {
      low: [
        `Your score of ${score}/30 indicates minimal vendor lock-in risk.`,
        "Your stack favors neutral, portable tools — reducing migration costs",
        "by up to 50% (Gartner, 2024). You're well-positioned for agility.",
        "",
        "Key strengths: Open standards, portable infrastructure, flexible integrations.",
        "Continue maintaining neutrality and audit annually for compliance.",
      ],
      medium: [
        `Your score of ${score}/30 indicates moderate vendor lock-in risk.`,
        "Mixed dependencies expose you to partial lock-in, with migration",
        "costs potentially 2-3x higher (Journal of Cloud Computing, 2024).",
        "",
        "Priority: Identify high-impact areas for migration. Start with databases",
        "and authentication to reduce risk without disrupting operations.",
      ],
      high: [
        `Your score of ${score}/30 indicates severe vendor lock-in risk.`,
        "Heavy proprietary reliance increases exit barriers, with costs up to",
        "3x implementation (Nutanix, 2025). Urgent action is recommended.",
        "",
        "Immediate steps: Audit dependencies, plan phased exits, implement",
        "data portability standards. Book a strategy call for guided migration.",
      ],
    };

    (summaries[band] || summaries.medium).forEach((line) => {
      doc.text(line, margin, y);
      y += 16;
    });

    // ── Score Breakdown ──
    y += 30;
    doc.setTextColor(47, 79, 79);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Score Breakdown", margin, y);
    y += 25;

    const answerLabels: Record<string, string> = {
      "1": "Neutral",
      "2": "Mixed",
      "3": "Proprietary",
    };

    doc.setFillColor(47, 79, 79);
    doc.rect(margin, y, contentW, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Category", margin + 5, y + 15);
    doc.text("Assessment", margin + 250, y + 15);
    doc.text("Points", margin + 400, y + 15);
    y += 22;

    doc.setFont("helvetica", "normal");
    questions.forEach((q, i) => {
      checkPage(22);
      const fill = i % 2 === 0 ? 245 : 255;
      doc.setFillColor(fill, fill, fill);
      doc.rect(margin, y, contentW, 22, "F");
      doc.setDrawColor(220, 220, 220);
      doc.rect(margin, y, contentW, 22, "S");
      doc.setTextColor(60, 60, 60);
      doc.text(q, margin + 5, y + 15);
      const val = answers?.[i]?.toString() || "2";
      doc.text(answerLabels[val] || "Mixed", margin + 250, y + 15);
      doc.text(val, margin + 400, y + 15);
      y += 22;
    });

    // Total row
    doc.setFillColor(47, 79, 79);
    doc.rect(margin, y, contentW, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", margin + 5, y + 15);
    doc.text(`${score}/30`, margin + 400, y + 15);
    y += 22;

    // ── Recommendations ──
    addPage();
    doc.setTextColor(47, 79, 79);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Recommendations", margin, y);
    y += 10;
    doc.setFillColor(255, 215, 0);
    doc.rect(margin, y, 60, 3, "F");
    y += 30;

    const recs: Record<string, Array<{ title: string; detail: string[] }>> = {
      low: [
        {
          title: "1. Maintain Neutrality",
          detail: [
            "Audit annually for open standards compliance.",
            "Review APIs for OpenAPI spec, ensure data portability with JSON/CSV exports.",
          ],
        },
        {
          title: "2. Enhance with Open AI",
          detail: [
            "Integrate open models from Hugging Face to boost automation.",
            "Reduces costs by 20% vs proprietary alternatives.",
          ],
        },
        {
          title: "3. Scale with Multi-Cloud",
          detail: [
            "Explore Kubernetes for redundancy across providers.",
            "Netflix's migration saved 15% on infrastructure (Netflix Engineering Blog, 2023).",
          ],
        },
      ],
      medium: [
        {
          title: "1. Prioritize Database Migration",
          detail: [
            "Switch proprietary databases to PostgreSQL for 40% cost savings.",
            "Export via pg_dump, refactor queries for compatibility.",
          ],
        },
        {
          title: "2. Adopt Modular Architecture",
          detail: [
            "Containerize services with Docker to enable vendor swaps.",
            "Test in staging to prevent downtime during transitions.",
          ],
        },
        {
          title: "3. Review Vendor Contracts",
          detail: [
            "Negotiate exit clauses for flexibility in all agreements.",
            "A tech firm reduced penalties by 50% through audits (HBR, 2024).",
          ],
        },
      ],
      high: [
        {
          title: "1. Immediate Dependency Audit",
          detail: [
            "Map all vendor dependencies using tools like Dependency Cruiser.",
            "Assess contracts for exit penalties and plan phased migrations.",
          ],
        },
        {
          title: "2. Shift to Open Alternatives",
          detail: [
            "Replace proprietary AI with TensorFlow or Hugging Face models.",
            "Can cut ML costs by 30% while maintaining capability.",
          ],
        },
        {
          title: "3. Implement Data Portability",
          detail: [
            "Adopt open data standards immediately (JSON, CSV, Parquet).",
            "A financial firm escaped AWS lock-in, saving $10M (Bloomberg, 2024).",
          ],
        },
      ],
    };

    (recs[band] || recs.medium).forEach((rec) => {
      checkPage(80);
      doc.setTextColor(47, 79, 79);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(rec.title, margin, y);
      y += 20;
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      rec.detail.forEach((d) => {
        doc.text(`• ${d}`, margin + 10, y);
        y += 16;
      });
      y += 10;
    });

    // ── Sources ──
    y += 20;
    checkPage(120);
    doc.setTextColor(47, 79, 79);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Sources", margin, y);
    y += 20;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const sources = [
      'Gartner, "Avoiding Vendor Lock-In in Cloud Ecosystems," 2024',
      'McKinsey, "Digital Transformation Report," 2025',
      'Journal of Cloud Computing, "Vendor Lock-In Costs," 2024',
      'Forrester, "Hybrid Cloud Strategies," 2025',
      'Harvard Business Review, "Escaping Vendor Lock-In," 2024',
      'Nutanix, "Ecosystem Scorecards," 2025',
      'Netflix Engineering Blog, "Cloud Migration Results," 2023',
    ];
    sources.forEach((s) => {
      doc.text(`• ${s}`, margin, y);
      y += 12;
    });

    // CTA
    y += 20;
    doc.setFillColor(0, 255, 255);
    doc.rect(margin, y, contentW, 3, "F");
    y += 25;
    doc.setTextColor(47, 79, 79);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Ready to reduce lock-in? Book a strategy call at chasecontinental.com",
      margin,
      y,
    );

    const pdfBytes = doc.output("arraybuffer");
    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="Stack-Lock-In-Audit-Report.pdf"',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
