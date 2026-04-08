import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";
import { drawBrandHeader } from "../_shared/pdf-branding.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Colors
const TEAL = [16, 185, 129] as const; // Emerald-500
const GOLD = [245, 158, 11] as const; // Amber-500
const DARK = [30, 41, 59] as const; // Slate-800
const GRAY = [100, 116, 139] as const; // Slate-500
const LIGHT_GRAY = [148, 163, 184] as const; // Slate-400

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Helper functions
    const addPageFooter = (pageNum: number) => {
      doc.setFontSize(8);
      doc.setTextColor(...LIGHT_GRAY);
      doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      });
      doc.text("Confidential – For Internal Use Only", margin, pageHeight - 10);
      doc.text("Chase Agents", pageWidth - margin, pageHeight - 10, {
        align: "right",
      });
    };

    const addNewPage = () => {
      addPageFooter(doc.getNumberOfPages());
      doc.addPage();
      y = margin;
    };

    const checkPageBreak = (neededSpace: number) => {
      if (y + neededSpace > pageHeight - 25) {
        addNewPage();
        return true;
      }
      return false;
    };

    const drawTealBox = (boxY: number, height: number) => {
      doc.setFillColor(...TEAL);
      doc.rect(margin - 5, boxY - 2, 3, height + 4, "F");
    };

    // ═══════════════════════════════════════════════════════════════
    // COVER PAGE
    // ═══════════════════════════════════════════════════════════════

    // Background gradient effect (teal to dark)
    doc.setFillColor(240, 253, 250); // Very light teal
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Top accent bar
    doc.setFillColor(...TEAL);
    doc.rect(0, 0, pageWidth, 8, "F");

    // Cover branding
    await drawBrandHeader(doc, {
      margin,
      top: 15,
      textColor: [...DARK],
      fontSize: 12,
      logoHeight: 10,
      gap: 4,
    });

    // Main title area
    y = 80;
    doc.setFontSize(32);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.text("AI Transformation", margin, y);
    y += 14;
    doc.text("Playbook", margin, y);

    // Subtitle
    y += 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    const subtitle = doc.splitTextToSize(
      "A Practical Guide to Shipping Reliable AI Automation – Without Failed Pilots, Wasted Budget, or Chaos",
      contentWidth,
    );
    doc.text(subtitle, margin, y);

    // Stats boxes
    y = 160;
    const boxWidth = (contentWidth - 10) / 2;

    // Stat 1
    doc.setFillColor(240, 253, 250);
    doc.setDrawColor(...TEAL);
    doc.roundedRect(margin, y, boxWidth, 35, 3, 3, "FD");
    doc.setFontSize(28);
    doc.setTextColor(...TEAL);
    doc.setFont("helvetica", "bold");
    doc.text("48%", margin + boxWidth / 2, y + 15, { align: "center" });
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.setFont("helvetica", "normal");
    doc.text("of digital initiatives", margin + boxWidth / 2, y + 23, {
      align: "center",
    });
    doc.text("meet targets (Gartner)", margin + boxWidth / 2, y + 28, {
      align: "center",
    });

    // Stat 2
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(...GOLD);
    doc.roundedRect(margin + boxWidth + 10, y, boxWidth, 35, 3, 3, "FD");
    doc.setFontSize(28);
    doc.setTextColor(...GOLD);
    doc.setFont("helvetica", "bold");
    doc.text("$4T", margin + boxWidth + 10 + boxWidth / 2, y + 15, {
      align: "center",
    });
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);
    doc.setFont("helvetica", "normal");
    doc.text(
      "DX spend by 2027",
      margin + boxWidth + 10 + boxWidth / 2,
      y + 23,
      { align: "center" },
    );
    doc.text("(IDC)", margin + boxWidth + 10 + boxWidth / 2, y + 28, {
      align: "center",
    });

    // Author info
    y = 220;
    doc.setFontSize(10);
    doc.setTextColor(...GRAY);
    doc.text("Author: Chase Agents", margin, y);
    doc.text("Version: 1.0  |  March 2026", margin, y + 6);

    // Bottom bar
    doc.setFillColor(...TEAL);
    doc.rect(0, pageHeight - 8, pageWidth, 8, "F");

    addPageFooter(1);

    // ═══════════════════════════════════════════════════════════════
    // EXECUTIVE SUMMARY
    // ═══════════════════════════════════════════════════════════════
    addNewPage();

    doc.setFontSize(24);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary", margin, y);
    y += 15;

    // Pull quote
    doc.setFillColor(240, 253, 250);
    doc.roundedRect(margin, y, contentWidth, 20, 3, 3, "F");
    doc.setFontSize(11);
    doc.setTextColor(...TEAL);
    doc.setFont("helvetica", "italic");
    const quote =
      '"Transformations fail not because the idea is wrong, but because execution breaks when reality hits."';
    doc.text(quote, margin + 5, y + 12);
    y += 28;

    doc.setFontSize(10);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "normal");

    const execContent = [
      "In a world where worldwide spending on Digital Transformation (DX) is forecast to reach nearly $4 trillion by 2027 (IDC), only 48% of digital initiatives meet or exceed their business outcome targets (Gartner). This playbook distills a proven, end-to-end approach to AI automation that mitigates risks, ensures reliability, and drives measurable ROI.",
      "",
      "Drawing from real-world insights, we address why most AI pilots fail in production and provide actionable frameworks to:",
    ];

    execContent.forEach((para) => {
      if (para) {
        const lines = doc.splitTextToSize(para, contentWidth);
        doc.text(lines, margin, y);
        y += lines.length * 5 + 3;
      } else {
        y += 3;
      }
    });

    // Bullet points
    const bullets = [
      "Select the right workflows for automation.",
      "Design for exceptions and approvals.",
      "Implement seamlessly.",
      "Measure and scale success.",
    ];

    bullets.forEach((bullet) => {
      doc.setFillColor(...TEAL);
      doc.circle(margin + 2, y - 1.5, 1.5, "F");
      doc.text(bullet, margin + 8, y);
      y += 6;
    });

    y += 5;
    const execContent2 =
      'By starting with workflows (not tools), designing for edge cases upfront, and focusing on outcomes, organizations can achieve the "Digital Vanguard" status where 71% of initiatives succeed (Gartner). This guide is for CIOs, CxOs, and transformation leaders ready to move from pilots to production.';
    const lines2 = doc.splitTextToSize(execContent2, contentWidth);
    doc.text(lines2, margin, y);
    y += lines2.length * 5 + 10;

    // Key Stats box
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text("Key Stats at a Glance:", margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const keyStats = [
      "DX Market Growth: 16.2% CAGR, reaching ~$4T by 2027 (IDC).",
      "Success Rate Gap: Average 48% vs. Digital Vanguard 71% (Gartner).",
      "Investment Priorities: 80%+ of CIOs increasing spend on AI/GenAI, cybersecurity, and data analytics (Gartner).",
    ];

    keyStats.forEach((stat) => {
      doc.setFillColor(...GOLD);
      doc.circle(margin + 2, y - 1.5, 1.5, "F");
      const statLines = doc.splitTextToSize(stat, contentWidth - 10);
      doc.text(statLines, margin + 8, y);
      y += statLines.length * 5 + 2;
    });

    // CTA Box
    y += 10;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1);
    doc.roundedRect(margin, y, contentWidth, 18, 3, 3, "D");
    doc.setFontSize(10);
    doc.setTextColor(...GOLD);
    doc.setFont("helvetica", "bold");
    doc.text("Ready to transform?", margin + 5, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(
      "Explore Chase Agents, then book a scoping call to implement this playbook.",
      margin + 5,
      y + 14,
    );

    addPageFooter(2);

    // ═══════════════════════════════════════════════════════════════
    // TABLE OF CONTENTS
    // ═══════════════════════════════════════════════════════════════
    addNewPage();

    doc.setFontSize(24);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.text("Table of Contents", margin, y);
    y += 20;

    const tocItems = [
      { num: "1", title: "The State of Digital Transformation", page: "4" },
      {
        num: "2",
        title: "The 5 Reasons AI Pilots Fail in Production",
        page: "5",
      },
      {
        num: "3",
        title: "Workflow Selection Checklist: What to Automate First",
        page: "7",
      },
      {
        num: "4",
        title: 'The "Exceptions + Approvals" Design Pattern',
        page: "8",
      },
      {
        num: "5",
        title: "Implementation Checklist: From Build to Rollout",
        page: "9",
      },
      {
        num: "6",
        title: "Measurement: Proving ROI and Reliability",
        page: "10",
      },
      { num: "7", title: "Why This Approach Works", page: "11" },
      { num: "8", title: "Next Steps and Resources", page: "12" },
    ];

    tocItems.forEach((item, i) => {
      doc.setFillColor(...TEAL);
      doc.circle(margin + 4, y - 1, 4, "F");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text(item.num, margin + 4, y + 0.5, { align: "center" });

      doc.setTextColor(...DARK);
      doc.setFont("helvetica", "normal");
      doc.text(item.title, margin + 15, y);

      // Dots
      const titleWidth = doc.getTextWidth(item.title);
      const dotsStart = margin + 15 + titleWidth + 2;
      const dotsEnd = pageWidth - margin - 10;
      doc.setTextColor(...LIGHT_GRAY);
      for (let x = dotsStart; x < dotsEnd; x += 2) {
        doc.text(".", x, y);
      }

      doc.setTextColor(...GOLD);
      doc.setFont("helvetica", "bold");
      doc.text(item.page, pageWidth - margin, y, { align: "right" });

      y += 12;
    });

    addPageFooter(3);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 1: STATE OF DX
    // ═══════════════════════════════════════════════════════════════
    addNewPage();

    // Section number
    doc.setFillColor(...TEAL);
    doc.circle(margin + 6, y + 2, 6, "F");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("1", margin + 6, y + 4, { align: "center" });

    doc.setFontSize(20);
    doc.setTextColor(...DARK);
    doc.text("The State of Digital Transformation", margin + 18, y + 5);
    y += 20;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);

    const section1Intro =
      "Digital transformation is accelerating, but results are uneven. According to Gartner's 2025 CIO Survey:";
    doc.text(section1Intro, margin, y);
    y += 10;

    const section1Bullets = [
      "Only 48% of enterprise-wide digital initiatives meet or exceed targets.",
      '"Digital Vanguard" leaders (co-owning delivery between CIOs and CxOs) achieve 71% success.',
      "Key enablers: CxOs dedicate 35% of staff to tech work (vs. 21% average) and meet CIOs 4x more often.",
    ];

    section1Bullets.forEach((bullet) => {
      doc.setFillColor(...TEAL);
      doc.circle(margin + 2, y - 1.5, 1.5, "F");
      const bulletLines = doc.splitTextToSize(bullet, contentWidth - 10);
      doc.text(bulletLines, margin + 8, y);
      y += bulletLines.length * 5 + 4;
    });

    y += 5;
    const section1Content2 =
      "IDC forecasts DX spending at a 16.2% CAGR, hitting nearly $4T by 2027 – potentially two-thirds of all ICT spend. Fastest growth in financial services (20.5% CAGR) and discrete manufacturing ($700B+ by 2027).";
    const lines1c2 = doc.splitTextToSize(section1Content2, contentWidth);
    doc.text(lines1c2, margin, y);
    y += lines1c2.length * 5 + 10;

    // Implication box
    doc.setFillColor(240, 253, 250);
    doc.roundedRect(margin, y, contentWidth, 15, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...TEAL);
    doc.text("Implication:", margin + 5, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(
      "Without co-ownership and robust execution, investments risk failure. This playbook bridges the gap.",
      margin + 30,
      y + 8,
    );

    addPageFooter(4);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 2: 5 REASONS AI PILOTS FAIL
    // ═══════════════════════════════════════════════════════════════
    addNewPage();

    doc.setFillColor(...TEAL);
    doc.circle(margin + 6, y + 2, 6, "F");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("2", margin + 6, y + 4, { align: "center" });

    doc.setFontSize(18);
    doc.setTextColor(...DARK);
    doc.text("The 5 Reasons AI Pilots Fail in Production", margin + 18, y + 5);
    y += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Most transformations fail due to execution gaps, not ideas. Here's why – and how to fix it:",
      margin,
      y,
    );
    y += 12;

    const failures = [
      {
        reason: "Ignoring Edge Cases",
        problem:
          "Pilots work on clean data but break on real-world exceptions (e.g., messy inputs).",
        solution:
          "Map exceptions upfront using stakeholder interviews. Design adaptive logic (e.g., if-then rules for 80/20 coverage).",
      },
      {
        reason: "Tool-First Approach",
        problem:
          "Starting with AI hype without workflow fit leads to mismatches.",
        solution:
          "Audit workflows first; select tools second. Use a compatibility matrix.",
      },
      {
        reason: "Lack of Approvals Integration",
        problem: "Automations halt on human decisions, causing bottlenecks.",
        solution:
          "Embed approval gates with notifications (e.g., Slack/Email triggers).",
      },
      {
        reason: "Poor Adoption",
        problem: "Teams resist due to complexity or lack of training.",
        solution:
          "Involve end-users in design; provide change management playbooks.",
      },
      {
        reason: "No Outcome Metrics",
        problem: "Success is vague, leading to abandoned projects.",
        solution:
          "Define KPIs pre-launch (e.g., time saved, error reduction); track post-rollout.",
      },
    ];

    failures.forEach((item, i) => {
      checkPageBreak(35);

      // Number circle
      doc.setFillColor(...GOLD);
      doc.circle(margin + 4, y + 2, 4, "F");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text(String(i + 1), margin + 4, y + 3.5, { align: "center" });

      // Reason title
      doc.setTextColor(...DARK);
      doc.setFont("helvetica", "bold");
      doc.text(item.reason, margin + 12, y + 3);
      y += 10;

      // Problem
      doc.setFont("helvetica", "normal");
      doc.setTextColor(220, 38, 38); // Red
      const probLines = doc.splitTextToSize(
        `Problem: ${item.problem}`,
        contentWidth - 12,
      );
      doc.text(probLines, margin + 12, y);
      y += probLines.length * 5 + 3;

      // Solution
      doc.setTextColor(...TEAL);
      const solLines = doc.splitTextToSize(
        `Prevention: ${item.solution}`,
        contentWidth - 12,
      );
      doc.text(solLines, margin + 12, y);
      y += solLines.length * 5 + 8;
    });

    // Stat insight
    checkPageBreak(15);
    doc.setFillColor(255, 251, 235);
    doc.roundedRect(margin, y, contentWidth, 12, 3, 3, "F");
    doc.setFontSize(9);
    doc.setTextColor(...GOLD);
    doc.setFont("helvetica", "bold");
    doc.text("Stat Insight:", margin + 5, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(
      "43% of CIOs are decreasing legacy infra spend for cloud/AI experiments (Gartner) – but without these fixes, waste ensues.",
      margin + 28,
      y + 7,
    );

    addPageFooter(doc.getNumberOfPages());

    // ═══════════════════════════════════════════════════════════════
    // SECTION 3: WORKFLOW SELECTION CHECKLIST
    // ═══════════════════════════════════════════════════════════════
    addNewPage();

    doc.setFillColor(...TEAL);
    doc.circle(margin + 6, y + 2, 6, "F");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("3", margin + 6, y + 4, { align: "center" });

    doc.setFontSize(18);
    doc.setTextColor(...DARK);
    doc.text("Workflow Selection Checklist", margin + 18, y + 5);
    y += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Prioritize workflows with high impact and low complexity. Use this checklist:",
      margin,
      y,
    );
    y += 12;

    // Checklist table
    const checklistItems = [
      {
        criterion:
          "Repetitive & Rule-Based: Does it involve manual data entry or decisions?",
        points: "+2",
      },
      {
        criterion: "High Volume: Processes 100+ instances/week?",
        points: "+2",
      },
      { criterion: "Error-Prone: Human errors cost >$10K/year?", points: "+2" },
      { criterion: "Scalable Data: Clean, accessible inputs?", points: "+1" },
      { criterion: "ROI Potential: Time savings >20%?", points: "+2" },
      { criterion: "Stakeholder Buy-In: CxO sponsorship?", points: "+1" },
    ];

    // Table header
    doc.setFillColor(...TEAL);
    doc.rect(margin, y, contentWidth - 20, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Criterion", margin + 3, y + 5);
    doc.text("Points", contentWidth, y + 5, { align: "right" });
    y += 8;

    checklistItems.forEach((item, i) => {
      const rowColor = i % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
      doc.setFillColor(...rowColor);
      doc.rect(margin, y, contentWidth - 20, 10, "F");

      doc.setTextColor(...DARK);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const criterionLines = doc.splitTextToSize(
        item.criterion,
        contentWidth - 35,
      );
      doc.text(criterionLines, margin + 3, y + 5);

      doc.setTextColor(...GOLD);
      doc.setFont("helvetica", "bold");
      doc.text(item.points, contentWidth, y + 5, { align: "right" });

      y += Math.max(10, criterionLines.length * 5 + 2);
    });

    y += 10;

    // Scoring guide
    doc.setFillColor(240, 253, 250);
    doc.roundedRect(margin, y, contentWidth, 18, 3, 3, "F");
    doc.setFontSize(10);
    doc.setTextColor(...TEAL);
    doc.setFont("helvetica", "bold");
    doc.text("Scoring Guide:", margin + 5, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(
      "8+ = Automate Now  |  5-7 = Pilot  |  <5 = Defer",
      margin + 5,
      y + 13,
    );
    y += 25;

    // Example
    doc.setTextColor(...GRAY);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Example: Automate claims processing (financial services) – 35.1% CAGR growth potential (IDC).",
      margin,
      y,
    );

    addPageFooter(doc.getNumberOfPages());

    // ═══════════════════════════════════════════════════════════════
    // SECTION 4: EXCEPTIONS + APPROVALS PATTERN
    // ═══════════════════════════════════════════════════════════════
    addNewPage();

    doc.setFillColor(...TEAL);
    doc.circle(margin + 6, y + 2, 6, "F");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("4", margin + 6, y + 4, { align: "center" });

    doc.setFontSize(18);
    doc.setTextColor(...DARK);
    doc.text('The "Exceptions + Approvals" Design Pattern', margin + 18, y + 5);
    y += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Reality hits with exceptions (e.g., invalid data) and approvals (e.g., manager sign-off). This pattern ensures resilience:",
      margin,
      y,
    );
    y += 12;

    const steps = [
      {
        title: "Step 1: Map Core Flow",
        desc: "Document the standard path from start to finish.",
      },
      {
        title: "Step 2: Identify Exceptions",
        desc: 'Brainstorm 10-20 scenarios (e.g., "Missing field? Route to human.").',
      },
      {
        title: "Step 3: Embed Approvals",
        desc: "Use API triggers for escalations (e.g., auto-pause until approved).",
      },
      {
        title: "Step 4: Test Iteratively",
        desc: "Simulate 100 runs; refine for 95%+ automation rate.",
      },
    ];

    steps.forEach((step, i) => {
      drawTealBox(y, 10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      doc.text(step.title, margin + 5, y + 4);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...GRAY);
      doc.text(step.desc, margin + 5, y + 10);
      y += 18;
    });

    // Benefit box
    y += 5;
    doc.setFillColor(240, 253, 250);
    doc.roundedRect(margin, y, contentWidth, 12, 3, 3, "F");
    doc.setFontSize(10);
    doc.setTextColor(...TEAL);
    doc.setFont("helvetica", "bold");
    doc.text("Benefit:", margin + 5, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(
      "Reduces failure from 52% (average) to Vanguard levels (Gartner).",
      margin + 23,
      y + 7,
    );

    addPageFooter(doc.getNumberOfPages());

    // ═══════════════════════════════════════════════════════════════
    // SECTION 5: IMPLEMENTATION CHECKLIST
    // ═══════════════════════════════════════════════════════════════
    addNewPage();

    doc.setFillColor(...TEAL);
    doc.circle(margin + 6, y + 2, 6, "F");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("5", margin + 6, y + 4, { align: "center" });

    doc.setFontSize(18);
    doc.setTextColor(...DARK);
    doc.text(
      "Implementation Checklist: From Build to Rollout",
      margin + 18,
      y + 5,
    );
    y += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("End-to-end rollout:", margin, y);
    y += 10;

    const phases = [
      {
        phase: "Build Phase",
        items: [
          "Assemble cross-functional team (IT + Business).",
          "Prototype in low-code tools.",
        ],
      },
      {
        phase: "Test Phase",
        items: ["Unit tests for exceptions.", "User acceptance testing (UAT)."],
      },
      {
        phase: "Rollout Phase",
        items: [
          "Phased deployment (e.g., 10% users first).",
          "Training sessions.",
        ],
      },
      { phase: "Monitor", items: ["Set up dashboards for real-time metrics."] },
    ];

    phases.forEach((p) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...TEAL);
      doc.text(p.phase, margin, y);
      y += 6;

      p.items.forEach((item) => {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...DARK);
        doc.text("☑  " + item, margin + 5, y);
        y += 6;
      });
      y += 4;
    });

    // Tip box
    y += 5;
    doc.setFillColor(255, 251, 235);
    doc.roundedRect(margin, y, contentWidth, 12, 3, 3, "F");
    doc.setFontSize(9);
    doc.setTextColor(...GOLD);
    doc.setFont("helvetica", "bold");
    doc.text("Tip:", margin + 5, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);
    doc.text(
      "Dedicate 26% of business staff to tech work, as in Vanguard orgs (Gartner).",
      margin + 15,
      y + 7,
    );

    addPageFooter(doc.getNumberOfPages());

    // ═══════════════════════════════════════════════════════════════
    // SECTION 6: MEASUREMENT
    // ═══════════════════════════════════════════════════════════════
    addNewPage();

    doc.setFillColor(...TEAL);
    doc.circle(margin + 6, y + 2, 6, "F");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("6", margin + 6, y + 4, { align: "center" });

    doc.setFontSize(18);
    doc.setTextColor(...DARK);
    doc.text("Measurement: Proving ROI and Reliability", margin + 18, y + 5);
    y += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Track success with:", margin, y);
    y += 10;

    const metrics = [
      {
        name: "Reliability",
        target: "Uptime >98%; Exception handling rate <5%.",
      },
      {
        name: "ROI",
        target:
          "Time saved × Hourly rate - Implementation costs. Aim for 6-12 month payback.",
      },
      {
        name: "Adoption",
        target: "User satisfaction score >4/5; Usage rate >80%.",
      },
      {
        name: "Expansion Metrics",
        target: "Number of scaled workflows post-pilot.",
      },
    ];

    metrics.forEach((metric) => {
      doc.setFillColor(...TEAL);
      doc.circle(margin + 2, y - 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      doc.text(metric.name + ":", margin + 8, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...GRAY);
      const targetLines = doc.splitTextToSize(metric.target, contentWidth - 40);
      doc.text(
        targetLines,
        margin + 8 + doc.getTextWidth(metric.name + ": "),
        y,
      );
      y += 10;
    });

    // Formula box
    y += 10;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 18, 3, 3, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...DARK);
    doc.text("ROI Formula:", margin + 5, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEAL);
    doc.text("ROI = (Savings - Costs) / Costs × 100%", margin + 35, y + 8);
    doc.setTextColor(...GRAY);
    doc.text(
      "Prove value amid $351B IT spend (Gartner) and $4T DX market (IDC).",
      margin + 5,
      y + 14,
    );

    addPageFooter(doc.getNumberOfPages());

    // ═══════════════════════════════════════════════════════════════
    // SECTION 7: WHY THIS APPROACH WORKS
    // ═══════════════════════════════════════════════════════════════
    addNewPage();

    doc.setFillColor(...TEAL);
    doc.circle(margin + 6, y + 2, 6, "F");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("7", margin + 6, y + 4, { align: "center" });

    doc.setFontSize(18);
    doc.setTextColor(...DARK);
    doc.text("Why This Approach Works", margin + 18, y + 5);
    y += 20;

    const whyCards = [
      {
        title: "We Start with the Workflow, Not the Tool",
        desc: "Ensures fit, avoiding 80% of mismatches.",
      },
      {
        title: "We Design for Edge Cases Upfront",
        desc: "Handles reality, boosting success to 71% (Vanguard).",
      },
      {
        title: "We Measure Outcomes, Then Expand",
        desc: "Data-driven scaling, aligning with 80% CIO investment priorities (Gartner).",
      },
    ];

    whyCards.forEach((card, i) => {
      // Card background
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(...TEAL);
      doc.roundedRect(margin, y, contentWidth, 25, 3, 3, "FD");

      // Number
      doc.setFillColor(...GOLD);
      doc.circle(margin + 10, y + 12.5, 6, "F");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text(String(i + 1), margin + 10, y + 14, { align: "center" });

      // Title
      doc.setFontSize(11);
      doc.setTextColor(...DARK);
      doc.text(card.title, margin + 22, y + 10);

      // Desc
      doc.setFontSize(9);
      doc.setTextColor(...GRAY);
      doc.setFont("helvetica", "normal");
      doc.text(card.desc, margin + 22, y + 17);

      y += 32;
    });

    addPageFooter(doc.getNumberOfPages());

    // ═══════════════════════════════════════════════════════════════
    // SECTION 8: NEXT STEPS
    // ═══════════════════════════════════════════════════════════════
    addNewPage();

    doc.setFillColor(...TEAL);
    doc.circle(margin + 6, y + 2, 6, "F");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("8", margin + 6, y + 4, { align: "center" });

    doc.setFontSize(18);
    doc.setTextColor(...DARK);
    doc.text("Next Steps and Resources", margin + 18, y + 5);
    y += 25;

    const nextSteps = [
      {
        num: "1",
        title: "Assess",
        desc: "Use the checklist to select a high-priority workflow.",
      },
      {
        num: "2",
        title: "Pilot",
        desc: "Apply the design pattern in a controlled pilot.",
      },
      {
        num: "3",
        title: "Scale",
        desc: "Measure outcomes, explore Chase Agents, and book a scoping call for expansion.",
      },
    ];

    nextSteps.forEach((step) => {
      doc.setFillColor(...TEAL);
      doc.circle(margin + 8, y + 5, 8, "F");
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text(step.num, margin + 8, y + 7, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(...DARK);
      doc.text(step.title, margin + 22, y + 4);

      doc.setFontSize(10);
      doc.setTextColor(...GRAY);
      doc.setFont("helvetica", "normal");
      doc.text(step.desc, margin + 22, y + 11);

      y += 22;
    });

    // Resources
    y += 15;
    doc.setFontSize(12);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.text("Resources:", margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEAL);
    doc.text("• Gartner 2025 CIO Survey: gartner.com/cio-survey", margin, y);
    y += 6;
    doc.text("• IDC DX Spending Guide: idc.com/dx-spending", margin, y);
    y += 6;
    doc.text(
      "• Chase Agents Resources: chaseagents.com/resources",
      margin,
      y,
    );

    // Contact
    y += 20;
    doc.setFillColor(...TEAL);
    doc.roundedRect(margin, y, contentWidth, 25, 3, 3, "F");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Ready to implement this playbook?",
      margin + contentWidth / 2,
      y + 10,
      { align: "center" },
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      "Contact: hello@chaseagents.com",
      margin + contentWidth / 2,
      y + 18,
      { align: "center" },
    );

    addPageFooter(doc.getNumberOfPages());

    // ═══════════════════════════════════════════════════════════════
    // BACK COVER
    // ═══════════════════════════════════════════════════════════════
    addNewPage();

    // Background
    doc.setFillColor(240, 253, 250);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Top bar
    doc.setFillColor(...TEAL);
    doc.rect(0, 0, pageWidth, 8, "F");

    // Thank you
    y = pageHeight / 2 - 30;
    doc.setFontSize(28);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.text("Transform with confidence.", pageWidth / 2, y, {
      align: "center",
    });

    y += 20;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY);
    doc.text(
      "Thank you for downloading the AI Transformation Playbook.",
      pageWidth / 2,
      y,
      { align: "center" },
    );

    y += 30;
    doc.setFillColor(...GOLD);
    doc.roundedRect(pageWidth / 2 - 60, y, 120, 15, 3, 3, "F");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Explore more at chaseagents.com/resources",
      pageWidth / 2,
      y + 9,
      { align: "center" },
    );

    // Logo
    y = pageHeight - 40;
    doc.setFontSize(14);
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.text("CHASE AGENTS", pageWidth / 2, y, { align: "center" });

    // Bottom bar
    doc.setFillColor(...TEAL);
    doc.rect(0, pageHeight - 8, pageWidth, 8, "F");

    addPageFooter(doc.getNumberOfPages());

    // Generate PDF
    const pdfOutput = doc.output("arraybuffer");
    const pdfBuffer = new Uint8Array(pdfOutput);

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("lead-magnets")
      .upload(
        "transformation-playbook/AI-Transformation-Playbook.pdf",
        pdfBuffer,
        {
          contentType: "application/pdf",
          upsert: true,
        },
      );

    if (uploadError) {
      throw uploadError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "PDF generated and uploaded successfully",
        path: "transformation-playbook/AI-Transformation-Playbook.pdf",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error generating playbook PDF:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
