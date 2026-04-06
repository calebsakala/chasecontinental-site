import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";
import { drawBrandHeader } from "../_shared/pdf-branding.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const STORAGE_BUCKET = "lead-magnets";

type RequestBody = {
  lead_id?: string;
  name?: string;
  email?: string;
  company?: string | null;
};

/* colours */
const COBALT = [0, 71, 171];
const DARK = [15, 23, 42];
const TEAL = [13, 148, 136];
const GOLD = [245, 158, 11];
const WHITE = [255, 255, 255];
const GRAY = [100, 116, 139];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

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
    const body = (await req.json().catch(() => ({}))) as RequestBody;
    const name = body.name?.trim() || "Operations Leader";
    const leadId = body.lead_id?.trim() || crypto.randomUUID();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const W = 210,
      H = 297;
    let y = 0;

    const addPage = () => {
      doc.addPage();
      y = 20;
    };
    const checkPage = (need: number) => {
      if (y + need > H - 25) addPage();
    };

    /* --- COVER --- */
    doc.setFillColor(...DARK);
    doc.rect(0, 0, W, H, "F");

    // Gold accent line
    doc.setFillColor(...GOLD);
    doc.rect(0, 0, W, 4, "F");

    await drawBrandHeader(doc, {
      margin: 20,
      top: 14,
      textColor: [...GOLD],
      fontSize: 12,
      logoHeight: 8.5,
      gap: 4,
    });

    // Badge
    doc.setFillColor(...TEAL);
    doc.roundedRect(20, 30, 50, 10, 5, 5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...WHITE);
    doc.text("FREE GUIDE", 45, 37, { align: "center" });

    // Title
    doc.setFontSize(36);
    doc.setTextColor(...WHITE);
    doc.text("Peak Season", 20, 65);
    doc.text("Automation", 20, 80);
    doc.setTextColor(...GOLD);
    doc.text("Survival Guide", 20, 95);

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(180, 190, 210);
    doc.text("Keep workflows stable when volume spikes.", 20, 115);
    doc.text("A practical guide for operations leaders.", 20, 123);

    // Prepared for
    doc.setFontSize(11);
    doc.setTextColor(...TEAL);
    doc.text(`Prepared for: ${name}`, 20, 150);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text("Chase Continental | March 2026", 20, H - 20);
    doc.text("chasecontinental.com", W - 20, H - 20, { align: "right" });

    /* --- PAGE 2: INTRO --- */
    addPage();
    doc.setFillColor(...TEAL);
    doc.rect(0, 0, W, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...DARK);
    doc.text("Introduction", 20, y + 10);
    y += 22;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const intro = [
      "Peak season in e-commerce and logistics brings massive volume spikes,",
      "testing the limits of your automation systems. Weak points in workflows",
      "can lead to breakdowns, lost revenue, and unhappy customers.",
      "",
      "This guide covers:",
      "  - 7 common failure modes that surface under peak volume",
      "  - A comprehensive 12-item pre-peak readiness checklist",
      "  - Monitoring and escalation essentials",
      "",
      "Use it as a practical playbook before your next surge.",
    ];
    intro.forEach((line) => {
      doc.text(line, 20, y);
      y += 6;
    });

    /* --- PAGE 3-4: 7 FAILURE MODES --- */
    addPage();
    doc.setFillColor(...COBALT);
    doc.rect(0, 0, W, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...DARK);
    doc.text("7 Failure Modes at Peak", 20, y + 10);
    y += 22;

    const failures = [
      {
        title: "1. Inventory Sync Failures",
        body: "API lags and database bottlenecks cause real-time stock discrepancies, leading to overselling and stockouts under high volume.",
      },
      {
        title: "2. Order Processing Delays",
        body: "Manual or semi-automated systems get overwhelmed, causing bottlenecks in picking, packing, and labeling.",
      },
      {
        title: "3. Shipping & Delivery Disruptions",
        body: "Carrier integrations break under load, resulting in delayed label generation or routing errors and missed SLAs.",
      },
      {
        title: "4. Staff & Labor Shortages",
        body: "Even automated systems need human oversight; shortages lead to unmonitored failures or slow resolutions.",
      },
      {
        title: "5. Website & System Overloads",
        body: "E-commerce platforms crash or slow down, abandoning carts. Poor load balancing in automation layers exacerbates this.",
      },
      {
        title: "6. Returns Processing Overload",
        body: "Increased returns flood systems, with automation failing to handle exceptions like damaged goods or fraud detection.",
      },
      {
        title: "7. Demand Forecasting Inaccuracies",
        body: "AI forecasting tools mispredict spikes, leading to imbalanced resources and cascading failures.",
      },
    ];

    failures.forEach((f) => {
      checkPage(22);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...COBALT);
      doc.text(f.title, 20, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(f.body, 170);
      doc.text(lines, 20, y);
      y += lines.length * 5 + 8;
    });

    /* --- CHECKLIST --- */
    addPage();
    doc.setFillColor(...TEAL);
    doc.rect(0, 0, W, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...DARK);
    doc.text("Pre-Peak Readiness Checklist", 20, y + 10);
    y += 22;

    const checklist = [
      "Analyze historical data to forecast demand accurately.",
      "Test automation systems under simulated peak loads.",
      "Optimize inventory levels to avoid stockouts or overstock.",
      "Train staff on escalation procedures and system monitoring.",
      "Negotiate capacity with shipping carriers in advance.",
      "Update and maintain warehouse machinery and robotics.",
      "Implement real-time inventory sync across platforms.",
      "Set up backup plans for system downtimes or carrier issues.",
      "Audit website performance and scalability.",
      "Prepare returns processing workflows with automation.",
      "Integrate predictive analytics for demand adjustments.",
      "Establish communication protocols for delays and updates.",
    ];

    checklist.forEach((item, i) => {
      checkPage(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...TEAL);
      doc.text("[ ]", 20, y);
      doc.setTextColor(...DARK);
      doc.text(`${i + 1}.`, 27, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(item, 35, y);
      y += 8;
    });

    /* --- MONITORING --- */
    addPage();
    doc.setFillColor(...GOLD);
    doc.rect(0, 0, W, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...DARK);
    doc.text("Monitoring + Escalation Basics", 20, y + 10);
    y += 25;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...COBALT);
    doc.text("Monitoring Essentials", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const monLines = doc.splitTextToSize(
      "Use real-time dashboards to track KPIs like order throughput, error rates, and system health. Implement automated alerts for thresholds (e.g., via webhooks). Tools like WMS provide visibility into bottlenecks. Monitor daily during peak and adjust resources predictively.",
      170,
    );
    doc.text(monLines, 20, y);
    y += monLines.length * 5 + 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...COBALT);
    doc.text("Escalation Procedures", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const escLines = doc.splitTextToSize(
      "Define tiers - Level 1: On-site fixes (15 min response). Level 2: IT involvement (30 min). Level 3: Executive alerts (1 hour). Set response times for each tier and ensure coverage during peak periods. Document resolution steps for common failure modes to reduce mean time to recovery.",
      170,
    );
    doc.text(escLines, 20, y);
    y += escLines.length * 5 + 10;

    /* --- BACK COVER --- */
    addPage();
    doc.setFillColor(...DARK);
    doc.rect(0, 0, W, H, "F");
    doc.setFillColor(...GOLD);
    doc.rect(0, 0, W, 4, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(...WHITE);
    doc.text("Ready to peak-proof", W / 2, 100, { align: "center" });
    doc.text("your automation?", W / 2, 115, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(180, 190, 210);
    doc.text(
      "Book a free readiness review with Chase Continental.",
      W / 2,
      140,
      { align: "center" },
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...TEAL);
    doc.text("chasecontinental.com", W / 2, 165, { align: "center" });

    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.text(
      "(c) 2026 Chase Continental. All rights reserved.",
      W / 2,
      H - 20,
      {
        align: "center",
      },
    );

    /* output */
    const pdfOutput = doc.output("arraybuffer");
    const filePath = `peak-season-survival-guide/${leadId}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, new Uint8Array(pdfOutput), {
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
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
