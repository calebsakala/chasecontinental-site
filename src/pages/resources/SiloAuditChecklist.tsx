import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Shield,
  ArrowRight,
  Download,
  Lock,
  ChevronDown,
  ChevronUp,
  Eye,
  Network,
  Workflow,
  ClipboardCheck,
  BarChart3,
  Users,
  Clock,
  Zap,
  Bot,
  DollarSign,
  ShieldCheck,
  Scaling,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { queueResourceEmail } from "@/lib/resourceEmail";
import siloHero from "@/assets/silo-audit-hero.jpg";

/* ─── Constants ─── */
const META_TITLE = "AI Agent Silo Checklist — Free Assessment | Chase Agents";
const META_DESC =
  "Uncover whether your AI initiatives are creating new silos. 20-point assessment with an operating-layer action plan.";
const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";
const CHASE_AGENTS_URL = "https://chaseagents.com";
const ASSET_KEY = "silo-audit-checklist";

type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
type AuditRunInsert = Database["public"]["Tables"]["audit_runs"]["Insert"];
type DownloadInsert = Database["public"]["Tables"]["downloads"]["Insert"];

const getSessionId = () => {
  let sid = sessionStorage.getItem("cc_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("cc_session_id", sid);
  }
  return sid;
};

const getUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
  };
};

/* ─── 20 AI Agent Silo Checklist Items ─── */
const CHECKLIST_ITEMS = [
  // AI Visibility & Strategy
  {
    id: 1,
    category: "AI Visibility & Strategy",
    question:
      "Leadership has a single view of all AI and automation initiatives running across the organisation.",
  },
  {
    id: 2,
    category: "AI Visibility & Strategy",
    question:
      "We have a clear inventory of every AI agent, bot, and automated workflow currently in production.",
  },
  {
    id: 3,
    category: "AI Visibility & Strategy",
    question:
      "Each AI initiative has a defined, measurable business outcome it's tracked against — not just 'we're using AI.'",
  },
  {
    id: 4,
    category: "AI Visibility & Strategy",
    question:
      "When an AI agent fails or produces an incorrect result, the responsible owner or team is notified automatically.",
  },
  {
    id: 5,
    category: "AI Visibility & Strategy",
    question:
      "We have full visibility of our total AI spend — including tools, compute, licences, and internal time — across all teams.",
  },

  // System Connectivity & Data Flow
  {
    id: 6,
    category: "Connectivity & Data Flow",
    question:
      "Our AI agents can access data from multiple business systems — not just the one they were built for.",
  },
  {
    id: 7,
    category: "Connectivity & Data Flow",
    question:
      "When one AI workflow produces an output, it flows into downstream systems without manual handoff.",
  },
  {
    id: 8,
    category: "Connectivity & Data Flow",
    question:
      "Our AI tools share a common, high-quality data layer — they're not each working from their own inconsistent copy of the truth.",
  },
  {
    id: 9,
    category: "Connectivity & Data Flow",
    question:
      "We could swap out an AI vendor or model without rebuilding the workflows that depend on it.",
  },
  {
    id: 10,
    category: "Connectivity & Data Flow",
    question:
      "New AI capabilities can be integrated into our existing systems and workflows within weeks, not months.",
  },

  // Risk, Governance & Control
  {
    id: 11,
    category: "Risk & Governance",
    question:
      "There is a clear owner accountable for each AI agent's performance, accuracy, and business impact.",
  },
  {
    id: 12,
    category: "Risk & Governance",
    question:
      "AI-driven decisions that affect customers, finances, or compliance go through a structured review process.",
  },
  {
    id: 13,
    category: "Risk & Governance",
    question:
      "We have a documented escalation path for when an AI agent produces unexpected or harmful results.",
  },
  {
    id: 14,
    category: "Risk & Governance",
    question:
      "Our AI initiatives follow a consistent, organisation-wide framework for testing, rollout, and monitoring — not team-by-team improvisation.",
  },
  {
    id: 15,
    category: "Risk & Governance",
    question:
      "We know which AI agents handle sensitive data — and access is strictly controlled, audited, and compliant with regulations.",
  },

  // Scale-Readiness & Orchestration
  {
    id: 16,
    category: "Scale & Orchestration",
    question:
      "Our AI agents are orchestrated centrally — not managed as isolated projects by different teams.",
  },
  {
    id: 17,
    category: "Scale & Orchestration",
    question:
      "Teams that have built successful AI automations systematically share their learnings, patterns, and reusable components across the organisation.",
  },
  {
    id: 18,
    category: "Scale & Orchestration",
    question:
      "We could double our AI automation footprint without proportionally increasing the people managing it.",
  },
  {
    id: 19,
    category: "Scale & Orchestration",
    question:
      "Our current systems environment is documented well enough to onboard a new AI initiative without a discovery phase.",
  },
  {
    id: 20,
    category: "Scale & Orchestration",
    question:
      "We review and rationalise our AI agent portfolio on a regular cadence — retiring what doesn't perform.",
  },
];

const CATEGORIES = [
  "AI Visibility & Strategy",
  "Connectivity & Data Flow",
  "Risk & Governance",
  "Scale & Orchestration",
];
const CATEGORY_ICONS: Record<string, typeof Eye> = {
  "AI Visibility & Strategy": Bot,
  "Connectivity & Data Flow": Network,
  "Risk & Governance": ShieldCheck,
  "Scale & Orchestration": Scaling,
};

type AnswerValue = "yes" | "partially" | "no";
const ANSWER_OPTIONS: { value: AnswerValue; label: string; points: number }[] =
  [
    { value: "yes", label: "Yes", points: 2 },
    { value: "partially", label: "Partially", points: 1 },
    { value: "no", label: "No", points: 0 },
  ];

const ROLE_OPTIONS = [
  "C-Suite (CEO, COO, CTO, CIO)",
  "SVP / VP Operations",
  "Director of Operations",
  "Director of Digital Transformation",
  "Head of IT / Technology",
  "Operations Manager",
  "Programme / Project Manager",
  "Process Improvement Lead",
  "Strategy / Management Consultant",
  "Business Analyst",
  "Team Lead / Senior Manager",
  "Other",
];

const VERTICAL_OPTIONS = [
  "Logistics & Supply Chain",
  "BPO & Customer Operations",
  "E-commerce & Marketplaces",
  "Sales & Revenue Operations",
  "Mining & Natural Resources",
  "iGaming & Digital Entertainment",
  "Manufacturing",
  "Government & Public Sector",
  "Financial Operations",
  "Healthcare",
  "Other",
];

const AGENT_COUNT_OPTIONS = ["0-2", "3-5", "6-10", "11-25", "26+"];

const ORG_SIZE_OPTIONS = ["1-25", "26-100", "101-500", "501-2000", "2000+"];

const FAQ_ITEMS = [
  {
    q: "Who is this checklist designed for?",
    a: "Operations leaders, transformation leads, and senior managers at organisations that have started deploying AI agents or automation — and want to ensure those initiatives aren't creating new silos.",
  },
  {
    q: "How long does it take?",
    a: "About 10 minutes. Each item is a simple Yes / Partially / No response. You'll have your score and personalised action plan immediately.",
  },
  {
    q: "Do I need to be technical?",
    a: "Not at all. The questions focus on operational outcomes, governance, and business impact — not technical implementation details.",
  },
  {
    q: "Will you spam me?",
    a: "No. You'll receive your PDF results and optionally a short follow-up series with actionable tips. You can unsubscribe anytime.",
  },
  {
    q: "What if we haven't deployed AI agents yet?",
    a: "This checklist is most valuable for organisations that have already started AI automation. If you're in the planning phase, it will still highlight readiness gaps to address before you begin.",
  },
  {
    q: "What happens after I download the report?",
    a: "You'll get a personalised PDF with your overall score, category breakdowns, and prioritised recommendations. Then you can explore Chase Agents or book a scoping call for your workflow.",
  },
];

const trackEvent = async (
  eventName: string,
  payload: Json = {},
  leadId?: string,
) => {
  try {
    const eventRecord: EventInsert = {
      event_name: eventName,
      session_id: getSessionId(),
      lead_id: leadId || null,
      event_payload: payload,
    };

    await supabase.from("events").insert(eventRecord);
  } catch (e) {
    console.error("Event tracking error:", e);
  }
};

/* ─── Component ─── */
const SiloAuditChecklist = () => {
  const { toast } = useToast();
  const checklistRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<
    "landing" | "checklist" | "gated" | "complete"
  >("landing");
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [currentCategory, setCurrentCategory] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Lead form
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    customRole: "",
    vertical: "",
    customVertical: "",
    agentCount: "",
    orgSize: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Results
  const [score, setScore] = useState(0);
  const [band, setBand] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    document.title = META_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", META_DESC);
    trackEvent("page_view", { asset_key: "silo-audit-checklist" });
  }, []);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === 20;

  const calculateScore = () => {
    // Max: 20 questions × 2 pts = 40. Normalize to 0–10.
    const raw = Object.values(answers).reduce((sum, v) => {
      const opt = ANSWER_OPTIONS.find((o) => o.value === v);
      return sum + (opt?.points ?? 0);
    }, 0);
    return Math.round((raw / 40) * 100) / 10;
  };

  const getRawCategoryScore = (category: string) => {
    const catItems = CHECKLIST_ITEMS.filter((i) => i.category === category);
    return catItems.reduce((sum, item) => {
      const ans = answers[item.id];
      const opt = ANSWER_OPTIONS.find((o) => o.value === ans);
      return sum + (opt?.points ?? 0);
    }, 0);
  };

  const getCategoryScore = (category: string) => {
    // Max per category: 5 questions × 2 pts = 10. Normalize to 0–10.
    const raw = getRawCategoryScore(category);
    return Math.round((raw / 10) * 100) / 10;
  };

  const getMaturityLevel = (score: number, maxScore: number) => {
    const pct = score / maxScore;
    if (pct >= 0.8) return "high";
    if (pct >= 0.4) return "medium";
    return "low";
  };

  const getBand = (s: number) => {
    // s is 0–10 normalized
    if (s < 4) return "High Risk";
    if (s < 8) return "Moderate Risk";
    return "Low Risk";
  };

  const handleStartChecklist = () => {
    setPhase("checklist");
    trackEvent("checklist_started");
    setTimeout(
      () => checklistRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const handleSeeResults = () => {
    const s = calculateScore();
    const b = getBand(s);
    setScore(s);
    setBand(b);
    setPhase("gated");
    trackEvent("checklist_completed", { score: s, band: b });
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const handleSubmitLead = async () => {
    if (honeypot.trim()) {
      // Ignore autofill noise on the hidden field to avoid blocking real users.
      setHoneypot("");
    }
    if (!leadForm.name || !leadForm.email) {
      toast({
        title: "Required fields",
        description: "Please enter your name and email.",
        variant: "destructive",
      });
      return;
    }

    const trimmedName = leadForm.name.trim();
    const normalizedEmail = leadForm.email.toLowerCase().trim();
    const company = leadForm.company.trim() || null;

    setSubmitting(true);
    try {
      const verticalValue =
        leadForm.vertical === "Other"
          ? leadForm.customVertical
          : leadForm.vertical;
      const roleValue =
        leadForm.role === "Other" ? leadForm.customRole : leadForm.role;
      const utm = getUtmParams();

      const leadRecord: LeadInsert = {
        name: trimmedName,
        email: normalizedEmail,
        company,
        role: roleValue,
        vertical: verticalValue,
      };

      const { data: leadData, error: leadError } = await supabase
        .from("leads")
        .upsert(leadRecord, { onConflict: "email" })
        .select("id")
        .single();

      if (leadError) throw leadError;
      const leadId = leadData.id;

      const answersArray = CHECKLIST_ITEMS.map((item) => ({
        id: item.id,
        category: item.category,
        question: item.question,
        answer: answers[item.id] || "no",
        score:
          ANSWER_OPTIONS.find((o) => o.value === (answers[item.id] || "no"))
            ?.points ?? 0,
      }));

      const categoryScores = CATEGORIES.map((cat) => {
        const rawCat = getRawCategoryScore(cat);
        const normCat = getCategoryScore(cat);
        return {
          category: cat,
          raw_score: rawCat,
          score: normCat,
          maturity: getMaturityLevel(rawCat, 10),
          band: getBand(normCat),
        };
      });

      const overallRaw = Object.values(answers).reduce((sum, v) => {
        const opt = ANSWER_OPTIONS.find((o) => o.value === v);
        return sum + (opt?.points ?? 0);
      }, 0);
      const overallMaturity = getMaturityLevel(overallRaw, 40);

      const auditRun: AuditRunInsert = {
        lead_id: leadId,
        asset_key: ASSET_KEY,
        answers_json: answersArray,
        score,
        band,
        agent_count: leadForm.agentCount || null,
        org_size: leadForm.orgSize || null,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      };

      await supabase.from("audit_runs").insert(auditRun);

      await trackEvent(
        "lead_submit",
        {
          asset_key: ASSET_KEY,
          score,
          band,
          agent_count: leadForm.agentCount || null,
          org_size: leadForm.orgSize || null,
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
        },
        leadId,
      );

      const { data, error } = await supabase.functions.invoke(
        "generate-audit-pdf",
        {
          body: {
            lead_id: leadId,
            name: trimmedName,
            email: normalizedEmail,
            company,
            answers: answersArray,
            score,
            band,
            category_scores: categoryScores,
            overall_maturity: overallMaturity,
            overall_raw: overallRaw,
          },
        },
      );

      if (error) throw new Error(error.message);

      const pdfUrl = data?.pdf_url;
      const filePath = data?.file_path;

      if (!pdfUrl || !filePath) {
        throw new Error("PDF generation returned an incomplete response");
      }

      const downloadRecord: DownloadInsert = {
        lead_id: leadId,
        asset_key: ASSET_KEY,
        file_path: filePath,
        downloaded_at: new Date().toISOString(),
      };

      await supabase.from("downloads").insert(downloadRecord);

      queueResourceEmail({
        assetKey: ASSET_KEY,
        leadId,
        name: trimmedName,
        email: normalizedEmail,
        company,
        filePath,
      });

      setPdfUrl(pdfUrl);
      setPhase("complete");
      await trackEvent(
        "download_start",
        { asset_key: ASSET_KEY, file_path: filePath },
        leadId,
      );

      const pdfResponse = await fetch(pdfUrl);
      if (!pdfResponse.ok) throw new Error("PDF download failed");
      const pdfBlob = await pdfResponse.blob();
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "AI-Agent-Silo-Audit-Checklist.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Your audit report is ready!",
        description: "Your PDF download should start automatically.",
      });
    } catch (err: unknown) {
      console.error(err);
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const catItems = CHECKLIST_ITEMS.filter(
    (i) => i.category === CATEGORIES[currentCategory],
  );

  const selectStyle =
    "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ─── HERO — Dark immersive with visible image ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Full-bleed background image with strong overlays for text legibility */}
        <div className="absolute inset-0 z-0">
          <img src={siloHero} alt="" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(7,12,25,0.92) 0%, rgba(7,12,25,0.75) 50%, rgba(7,12,25,0.3) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(7,12,25,0.95) 0%, transparent 40%, rgba(7,12,25,0.4) 100%)",
            }}
          />
        </div>

        {/* Animated floating orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, hsl(190 95% 50% / 0.4), transparent)",
          }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, hsl(160 84% 39% / 0.4), transparent)",
          }}
          animate={{ x: [0, -20, 0], y: [0, 15, 0], scale: [1, 1.15, 1] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 grid lg:grid-cols-5 gap-12 items-center w-full">
          <div className="lg:col-span-3">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 mb-6 rounded-full border border-cyan/30 bg-cyan/10 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--cyan))]"
            >
              <Bot className="h-3.5 w-3.5" />
              Free AI Readiness Assessment
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading text-white mb-6"
              style={{ lineHeight: 1.05 }}
            >
              Are your AI agents{" "}
              <span className="bg-gradient-to-r from-[hsl(var(--cyan))] to-[hsl(var(--teal))] bg-clip-text text-transparent">
                building new silos?
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl leading-relaxed"
            >
              Most organisations deploying AI automation are unknowingly
              recreating the same interoperability problems they had with
              traditional software. This 10-minute assessment reveals exactly
              where.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={handleStartChecklist}
                className="group text-base font-semibold px-8 py-6 rounded-xl bg-[hsl(var(--cyan))] text-[hsl(var(--cyan-foreground))] hover:bg-[hsl(var(--cyan))]/90 transition-all duration-300 shadow-[0_0_30px_hsl(var(--cyan)/0.3)]"
              >
                Start the assessment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <span className="text-sm text-white/70 self-center">
                ~10 minutes · No technical knowledge required
              </span>
            </motion.div>
          </div>

          {/* Stats card - glassmorphism on dark */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl p-6 backdrop-blur-xl border border-white/10 bg-white/5">
              <div className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--cyan))] mb-5">
                Why this matters
              </div>
              <div className="space-y-4">
                {[
                  {
                    stat: "48%",
                    label:
                      "of digital initiatives miss their business outcome targets",
                    source: "Gartner",
                  },
                  {
                    stat: "70%",
                    label:
                      "of AI projects never move beyond pilot — often due to integration failures",
                    source: "McKinsey",
                  },
                  {
                    stat: "3×",
                    label:
                      "higher failure rate when AI agents are deployed without cross-system connectivity",
                    source: "Forrester",
                  },
                  {
                    stat: "$4T+",
                    label:
                      "global AI & DX spend projected by 2027 — much of it at risk from siloed deployments",
                    source: "IDC",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="p-4 rounded-xl border border-white/10 bg-white/10"
                  >
                    <p className="text-2xl font-bold font-heading text-[hsl(var(--cyan))]">
                      {item.stat}
                    </p>
                    <p className="text-xs text-white/80 mt-1 leading-relaxed">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-white/50 mt-1 italic">
                      — {item.source}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── WHAT YOU'LL GET ─── */}
      <section className="py-20 px-6 bg-card/50">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-10 text-center">
            What you'll uncover
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Bot,
                text: "Whether your AI agents are working together — or duplicating effort across isolated teams",
              },
              {
                icon: BarChart3,
                text: "A clear 0–10 score you can share with leadership to quantify AI silo risk",
              },
              {
                icon: AlertTriangle,
                text: "The specific gaps creating fragmentation, vendor lock-in, and governance blind spots",
              },
              {
                icon: DollarSign,
                text: "Visibility into whether your AI investments are creating leverage — or just overhead",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-5 rounded-xl border border-border bg-card"
              >
                <item.icon className="h-6 w-6 flex-shrink-0 mt-0.5 text-cyan" />
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      {phase === "landing" && (
        <section className="py-20 px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold font-heading text-foreground mb-10 text-center">
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  icon: ClipboardCheck,
                  title: "Answer 20 questions",
                  desc: "Simple Yes / Partially / No responses covering four critical areas of AI agent deployment.",
                },
                {
                  step: "02",
                  icon: BarChart3,
                  title: "See your score instantly",
                  desc: "Get a 0–10 readiness score with a category-by-category breakdown of your AI silo risk.",
                },
                {
                  step: "03",
                  icon: Download,
                  title: "Download your report",
                  desc: "Receive a personalised PDF with prioritised recommendations tailored to your specific gaps.",
                },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative p-6 rounded-xl border border-border bg-card"
                >
                  <span className="text-5xl font-bold font-heading absolute top-4 right-4 text-cyan/10">
                    {s.step}
                  </span>
                  <s.icon className="h-8 w-8 text-cyan mb-3" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── AUDIT PREVIEW ─── */}
      {phase === "landing" && (
        <section className="py-20 px-6 bg-card/50">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold font-heading text-foreground mb-8 text-center">
              Preview the 20-point assessment
            </h2>
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              {CHECKLIST_ITEMS.slice(0, 6).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-6 py-4 border-b border-border/50"
                >
                  <span className="text-xs font-mono w-6 text-cyan">
                    {String(item.id).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.question}
                  </span>
                </div>
              ))}
              <div className="relative">
                <div className="blur-sm pointer-events-none select-none">
                  {CHECKLIST_ITEMS.slice(6, 10).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-6 py-4 border-b border-border/50"
                    >
                      <span className="text-xs font-mono w-6 text-cyan">
                        {String(item.id).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.question}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-background/60">
                  <Button
                    onClick={handleStartChecklist}
                    className="font-semibold px-6 py-3 rounded-xl bg-cyan text-cyan-foreground hover:bg-cyan/90"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Start the full assessment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── INTERACTIVE CHECKLIST ─── */}
      <AnimatePresence>
        {(phase === "checklist" || phase === "gated") && (
          <motion.section
            ref={checklistRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-20 px-6"
          >
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold font-heading text-foreground mb-3 text-center">
                AI Agent Silo Assessment
              </h2>
              <p className="text-center text-sm text-muted-foreground mb-8">
                For each statement, select{" "}
                <strong className="text-foreground">Yes</strong>,{" "}
                <strong className="text-foreground">Partially</strong>, or{" "}
                <strong className="text-foreground">No</strong>
              </p>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>{answeredCount} of 20 answered</span>
                  <span>{Math.round((answeredCount / 20) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-cyan"
                    animate={{ width: `${(answeredCount / 20) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Category tabs */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {CATEGORIES.map((cat, i) => {
                  const Icon = CATEGORY_ICONS[cat];
                  const catAnswered = CHECKLIST_ITEMS.filter(
                    (item) => item.category === cat && answers[item.id],
                  ).length;
                  const catTotal = CHECKLIST_ITEMS.filter(
                    (item) => item.category === cat,
                  ).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCurrentCategory(i)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                        currentCategory === i
                          ? "border-cyan/40 bg-cyan/10 text-cyan"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {cat}
                      <span className="rounded-full px-1.5 py-0.5 text-[10px] bg-muted text-muted-foreground">
                        {catAnswered}/{catTotal}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {catItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-5 rounded-xl border bg-card ${answers[item.id] ? "border-cyan/30" : "border-border"}`}
                  >
                    <p className="text-sm font-medium text-foreground mb-4">
                      <span className="font-mono mr-2 text-cyan">
                        {String(item.id).padStart(2, "0")}
                      </span>
                      {item.question}
                    </p>
                    <div className="flex gap-2">
                      {ANSWER_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [item.id]: opt.value,
                            }))
                          }
                          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                            answers[item.id] === opt.value
                              ? opt.value === "yes"
                                ? "border-teal/50 bg-teal/10 text-teal"
                                : opt.value === "partially"
                                  ? "border-cyan/50 bg-cyan/10 text-cyan"
                                  : "border-destructive/50 bg-destructive/10 text-destructive"
                              : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-border/80"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentCategory(Math.max(0, currentCategory - 1))
                  }
                  disabled={currentCategory === 0}
                >
                  Previous
                </Button>
                {currentCategory < 3 ? (
                  <Button
                    onClick={() => setCurrentCategory(currentCategory + 1)}
                    className="bg-cyan text-cyan-foreground hover:bg-cyan/90"
                  >
                    Next: {CATEGORIES[currentCategory + 1]}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSeeResults}
                    disabled={!allAnswered}
                    className={
                      allAnswered
                        ? "bg-cyan text-cyan-foreground hover:bg-cyan/90"
                        : ""
                    }
                  >
                    See my results
                  </Button>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ─── RESULTS + GATE ─── */}
      <AnimatePresence>
        {phase === "gated" && (
          <motion.section
            ref={formRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-20 px-6"
          >
            <div className="mx-auto max-w-2xl">
              {/* Score preview */}
              <div className="rounded-2xl p-8 mb-10 text-center border border-border bg-card">
                <p className="text-sm font-semibold uppercase tracking-wider text-cyan mb-2">
                  Your AI Agent Silo Score
                </p>
                <p
                  className="text-6xl font-bold font-heading mb-2"
                  style={{
                    color:
                      score < 4
                        ? "hsl(var(--destructive))"
                        : score < 8
                          ? "hsl(var(--cyan))"
                          : "hsl(var(--teal))",
                  }}
                >
                  {score}
                  <span className="text-2xl text-muted-foreground">/10</span>
                </p>
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
                    score < 4
                      ? "bg-destructive/10 text-destructive"
                      : score < 8
                        ? "bg-cyan/10 text-cyan"
                        : "bg-teal/10 text-teal"
                  }`}
                >
                  {band}
                </span>
              </div>

              {/* Lead form */}
              <div className="rounded-2xl p-8 border border-cyan/20 bg-card">
                <h3 className="text-xl font-bold font-heading text-foreground mb-2 text-center">
                  Get your personalised audit report
                </h3>
                <p className="text-sm text-center text-muted-foreground mb-6">
                  Enter your details to download a branded PDF with your full
                  results, category breakdown, and tailored action plan.
                </p>

                {/* Honeypot */}
                <div className="absolute -left-[9999px]">
                  <input
                    name="cc_hp"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="new-password"
                    aria-hidden="true"
                  />
                </div>

                <div className="grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                        Name *
                      </Label>
                      <Input
                        value={leadForm.name}
                        onChange={(e) =>
                          setLeadForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                        Email *
                      </Label>
                      <Input
                        type="email"
                        value={leadForm.email}
                        onChange={(e) =>
                          setLeadForm((p) => ({ ...p, email: e.target.value }))
                        }
                        placeholder="work@company.com"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                        Company
                      </Label>
                      <Input
                        value={leadForm.company}
                        onChange={(e) =>
                          setLeadForm((p) => ({
                            ...p,
                            company: e.target.value,
                          }))
                        }
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                        Role
                      </Label>
                      <select
                        value={leadForm.role}
                        onChange={(e) =>
                          setLeadForm((p) => ({ ...p, role: e.target.value }))
                        }
                        className={selectStyle}
                      >
                        <option value="">Select your role</option>
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      {leadForm.role === "Other" && (
                        <Input
                          value={leadForm.customRole}
                          onChange={(e) =>
                            setLeadForm((p) => ({
                              ...p,
                              customRole: e.target.value,
                            }))
                          }
                          placeholder="Please specify your role"
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">
                      Industry / Vertical
                    </Label>
                    <select
                      value={leadForm.vertical}
                      onChange={(e) =>
                        setLeadForm((p) => ({ ...p, vertical: e.target.value }))
                      }
                      className={selectStyle}
                    >
                      <option value="">Select your industry</option>
                      {VERTICAL_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                    {leadForm.vertical === "Other" && (
                      <Input
                        value={leadForm.customVertical}
                        onChange={(e) =>
                          setLeadForm((p) => ({
                            ...p,
                            customVertical: e.target.value,
                          }))
                        }
                        placeholder="Please specify your industry"
                        className="mt-2"
                      />
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                        Active AI agents
                      </Label>
                      <select
                        value={leadForm.agentCount}
                        onChange={(e) =>
                          setLeadForm((p) => ({
                            ...p,
                            agentCount: e.target.value,
                          }))
                        }
                        className={selectStyle}
                      >
                        <option value="">Select range</option>
                        {AGENT_COUNT_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">
                        Team size
                      </Label>
                      <select
                        value={leadForm.orgSize}
                        onChange={(e) =>
                          setLeadForm((p) => ({
                            ...p,
                            orgSize: e.target.value,
                          }))
                        }
                        className={selectStyle}
                      >
                        <option value="">Select size</option>
                        {ORG_SIZE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmitLead}
                    disabled={submitting}
                    className="w-full mt-2 py-6 text-base font-semibold rounded-xl bg-cyan text-cyan-foreground hover:bg-cyan/90"
                  >
                    {submitting
                      ? "Generating your report…"
                      : "Download my audit report"}
                    <Download className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ─── COMPLETE / THANK YOU ─── */}
      <AnimatePresence>
        {phase === "complete" && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-20 px-6"
          >
            <div className="mx-auto max-w-2xl text-center">
              <div className="rounded-2xl p-10 border border-teal/30 bg-card">
                <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-teal" />
                <h2 className="text-3xl font-bold font-heading text-foreground mb-3">
                  Your report is ready!
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Score:{" "}
                  <strong
                    className={
                      score < 4
                        ? "text-destructive"
                        : score < 8
                          ? "text-cyan"
                          : "text-teal"
                    }
                  >
                    {score}/10 — {band}
                  </strong>
                </p>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("download_complete", {
                      asset_key: "silo-audit-checklist",
                    })
                  }
                >
                  <Button className="px-8 py-6 text-base font-semibold rounded-xl bg-cyan text-cyan-foreground hover:bg-cyan/90 mb-6">
                    <Download className="mr-2 h-5 w-5" />
                    Download PDF
                  </Button>
                </a>

                <div className="mt-8 text-left space-y-3">
                  <h4 className="text-sm font-semibold text-cyan">
                    What to do next:
                  </h4>
                  {[
                    "Review your category scores — focus on the lowest-scoring area first.",
                    "Share the PDF with your leadership team — use it to quantify AI silo risk across the organisation.",
                    "Use your score to prioritise one operating-layer workflow and deploy it with deterministic execution.",
                  ].map((text, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-cyan/10 text-cyan">
                        {i + 1}
                      </span>
                      <p className="text-sm text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </div>

                <a
                  href={CHASE_AGENTS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("explore_chase_agents_click", {
                      asset_key: "silo-audit-checklist",
                    })
                  }
                >
                  <Button className="mt-8 px-8 py-5 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                    Explore Chase Agents
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>

                <a
                  href={BOOK_CALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("book_call_click", {
                      asset_key: "silo-audit-checklist",
                    })
                  }
                >
                  <Button
                    variant="outline"
                    className="mt-3 px-8 py-5 text-base font-semibold rounded-xl"
                  >
                    Book a scoping call
                  </Button>
                </a>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ─── PROOF ─── */}
      {phase === "landing" && (
        <section className="py-16 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground/60 mb-6">
              Trusted by operations teams at
            </p>
            <div className="flex items-center justify-center gap-10 mb-8 opacity-50">
              <span className="text-lg font-bold font-heading text-foreground">
                CCID
              </span>
              <span className="text-lg font-bold font-heading text-foreground">
                Heineken
              </span>
            </div>
            <div className="inline-block px-6 py-3 rounded-xl border border-border bg-card">
              <p className="text-sm font-medium text-muted-foreground italic">
                "Errors down. Turnaround time down. Visibility up."
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ ─── */}
      <section className="py-20 px-6 bg-card/50">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-10 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-border overflow-hidden bg-card"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-foreground">
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 flex-shrink-0 text-cyan" />
                  ) : (
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-4 text-sm text-muted-foreground">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-4">
            Ready to move from siloed pilots to a connected{" "}
            <span className="text-cyan">operating layer?</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Start with Chase Agents to see deterministic automation patterns,
            then book a scoping call when you want workflow-level guidance.
          </p>
          <a href={CHASE_AGENTS_URL} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="px-8 py-6 text-base font-semibold rounded-xl bg-cyan text-cyan-foreground hover:bg-cyan/90"
            >
              Explore Chase Agents
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
          <a
            href={BOOK_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("book_call_click", {
                asset_key: "silo-audit-checklist",
              })
            }
          >
            <Button
              size="lg"
              variant="outline"
              className="mt-3 px-8 py-6 text-base font-semibold rounded-xl"
            >
              Book a scoping call
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SiloAuditChecklist;
