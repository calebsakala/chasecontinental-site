/*
  LM10 — Neutral vs Proprietary Scorecard
  Slug: /resources/neutral-vs-proprietary-scorecard
  Palette: Slate #2F4F4F + Aqua #00FFFF + Gold #FFD700
*/

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Download,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import heroImage from "@/assets/scorecard-hero.jpg";

const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";

/* ── Types ── */
type Phase = "hero" | "scorecard" | "lead-gate" | "results";

interface Question {
  id: number;
  category: string;
  question: string;
  examples: { proprietary: string; neutral: string };
}

/* ── Questions ── */
const questions: Question[] = [
  {
    id: 1,
    category: "Cloud Infrastructure",
    question:
      "Do you rely on vendor-specific services or neutral, portable options?",
    examples: {
      proprietary: "AWS Lambda, Azure Functions",
      neutral: "Kubernetes on any cloud",
    },
  },
  {
    id: 2,
    category: "Database",
    question: "Is your database proprietary or neutral/open?",
    examples: {
      proprietary: "Oracle, AWS DynamoDB",
      neutral: "PostgreSQL, MySQL",
    },
  },
  {
    id: 3,
    category: "API Management",
    question: "Do your APIs use proprietary gateways or open standards?",
    examples: {
      proprietary: "Vendor-locked SDKs",
      neutral: "RESTful with OpenAPI",
    },
  },
  {
    id: 4,
    category: "Authentication",
    question: "Do you use vendor-specific auth or neutral protocols?",
    examples: { proprietary: "AWS Cognito", neutral: "OAuth2, OpenID Connect" },
  },
  {
    id: 5,
    category: "Data Formats",
    question: "Are data formats proprietary or neutral?",
    examples: {
      proprietary: "Vendor-specific binaries",
      neutral: "JSON, CSV, XML",
    },
  },
  {
    id: 6,
    category: "Software Licenses",
    question: "Is your core software proprietary or open source?",
    examples: { proprietary: "Microsoft licensed", neutral: "Apache-licensed" },
  },
  {
    id: 7,
    category: "Integration Tools",
    question:
      "Do integrations depend on proprietary middleware or neutral tools?",
    examples: { proprietary: "Vendor ESBs", neutral: "Apache Kafka" },
  },
  {
    id: 8,
    category: "Monitoring & Logging",
    question: "Use proprietary monitoring tools or neutral alternatives?",
    examples: {
      proprietary: "New Relic, Datadog (locked)",
      neutral: "Prometheus, ELK Stack",
    },
  },
  {
    id: 9,
    category: "CI/CD Pipelines",
    question: "Are pipelines vendor-locked or neutral?",
    examples: {
      proprietary: "GitHub Actions exclusively",
      neutral: "Jenkins, GitLab CI",
    },
  },
  {
    id: 10,
    category: "AI/ML Components",
    question: "Rely on proprietary models or neutral/open options?",
    examples: {
      proprietary: "Google Vertex AI",
      neutral: "Hugging Face models",
    },
  },
];

const answerOptions = [
  { value: 1, label: "Neutral", desc: "Open, portable, vendor-agnostic" },
  { value: 2, label: "Mixed", desc: "Some vendor dependency" },
  { value: 3, label: "Proprietary", desc: "Vendor-locked, hard to migrate" },
];

/* ── Role / Industry options ── */
const roleOptions = [
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

/* ── Band config ── */
const bandConfig = {
  low: {
    label: "Low Risk",
    range: "10–15",
    headline: "Minimal Lock-in Risk",
    subtitle: "Your stack is flexible and future-proof.",
    color: "hsl(142,70%,45%)",
    bgColor: "hsl(142,70%,45%)",
    icon: ShieldCheck,
    analysis: [
      "Your choices favor neutral tools, reducing migration costs by up to 50% (Gartner, 2024).",
      "Easy scaling, low TCO, high innovation agility.",
      "30% faster adoption of new tech (McKinsey, 2025).",
    ],
    recommendations: [
      {
        title: "Maintain Neutrality",
        detail:
          "Audit annually for open standards compliance. Review APIs for OpenAPI spec, ensure data portability with JSON/CSV exports.",
      },
      {
        title: "Enhance with Open AI",
        detail:
          "Integrate open AI models from Hugging Face to boost automation without lock-in. Reduces costs by ~20% vs proprietary alternatives.",
      },
      {
        title: "Scale with Multi-Cloud",
        detail:
          "Explore Kubernetes for redundancy across providers. Netflix's migration saved 15% on infra (Netflix Engineering Blog, 2023).",
      },
    ],
    cta: "Book a call to optimize further",
  },
  medium: {
    label: "Medium Risk",
    range: "16–22",
    headline: "Moderate Lock-in Risk",
    subtitle: "Balance needed to avoid escalation.",
    color: "hsl(45,90%,50%)",
    bgColor: "hsl(45,90%,50%)",
    icon: ShieldAlert,
    analysis: [
      "Mixed stack exposes you to partial lock-in, with migration costs potentially 2-3x higher (Journal of Cloud Computing, 2024).",
      "Vendor price hikes of 10-20% annually are common. Limited scalability.",
      "Hybrid approach saves 25% vs full rip-and-replace (Forrester, 2025).",
    ],
    recommendations: [
      {
        title: "Prioritize Database Migration",
        detail:
          "Switch to PostgreSQL for 40% cost savings. Export via pg_dump, refactor queries for compatibility.",
      },
      {
        title: "Adopt Modular Architecture",
        detail:
          "Containerize services with Docker to enable vendor swaps without downtime. Test in staging environments.",
      },
      {
        title: "Review Vendor Contracts",
        detail:
          "Negotiate exit clauses. A tech firm reduced penalties by 50% through audits (HBR, 2024).",
      },
    ],
    cta: "Book a call to mitigate risks",
  },
  high: {
    label: "High Risk",
    range: "23–30",
    headline: "Severe Lock-in Risk",
    subtitle: "Urgent action required.",
    color: "hsl(0,75%,55%)",
    bgColor: "hsl(0,75%,55%)",
    icon: Shield,
    analysis: [
      "Heavy proprietary reliance increases exit barriers, with costs up to 3x implementation (Nutanix, 2025).",
      "Innovation stall, high dependency on vendor roadmaps, vulnerability to disruptions.",
      "15-25% higher TCO long-term (OutSystems, 2025). 2x higher downtime risk.",
    ],
    recommendations: [
      {
        title: "Immediate Dependency Audit",
        detail:
          "Map all vendor dependencies using tools like Dependency Cruiser. Assess contracts for exit penalties.",
      },
      {
        title: "Shift to Open Alternatives",
        detail:
          "Replace proprietary AI with TensorFlow or Hugging Face. Can cut ML costs by 30%.",
      },
      {
        title: "Implement Data Portability",
        detail:
          "Adopt open data standards now (JSON, Parquet). A financial firm saved $10M escaping AWS lock-in (Bloomberg, 2024).",
      },
    ],
    cta: "Book a call now to unlock your stack",
  },
};

/* ── Event tracking ── */
const trackEvent = async (
  eventType: string,
  runId?: string,
  leadId?: string,
  payload?: Record<string, unknown>,
) => {
  try {
    await (supabase as any).from("cc_events").insert([
      {
        event_type: eventType,
        run_id: runId || null,
        lead_id: leadId || null,
        event_payload: payload || {},
      },
    ]);
  } catch (_) {
    /* silent */
  }
};

const NeutralVsProprietaryScorecard = () => {
  const [phase, setPhase] = useState<Phase>("hero");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    stackDesc: "",
  });
  const [runId, setRunId] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);

  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const band = score <= 15 ? "low" : score <= 22 ? "medium" : "high";
  const config = bandConfig[band];
  const progress = (Object.keys(answers).length / questions.length) * 100;
  const allAnswered = Object.keys(answers).length === questions.length;

  useEffect(() => {
    trackEvent("page_view", undefined, undefined, { page: "scorecard" });
  }, []);

  const startScorecard = () => {
    trackEvent("scorecard_start");
    setPhase("scorecard");
  };

  const selectAnswer = (qId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    // Auto-advance
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    }
  };

  const handleComplete = () => {
    if (!allAnswered) {
      toast.error("Please answer all 10 questions.");
      return;
    }
    setShowLeadModal(true);
  };

  const handleLeadSubmit = async () => {
    if (!leadForm.name.trim() || !leadForm.email.trim() || !leadForm.role) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Insert lead
      const { data: existingLead } = await (supabase as any)
        .from("cc_leads")
        .select("id")
        .eq("email", leadForm.email.trim())
        .maybeSingle();

      let lid = existingLead?.id;
      if (!lid) {
        const { data: newLead, error: le } = await (supabase as any)
          .from("cc_leads")
          .insert([
            {
              name: leadForm.name.trim(),
              email: leadForm.email.trim(),
              company: leadForm.company.trim() || null,
              role: leadForm.role,
              stack_desc: leadForm.stackDesc.trim() || null,
            },
          ])
          .select("id")
          .single();
        if (le) throw le;
        lid = newLead.id;
      }
      setLeadId(lid);

      // Also global leads
      const { error: mainLeadError } = await supabase.from("leads").upsert(
        [
          {
            name: leadForm.name.trim(),
            email: leadForm.email.trim(),
            company: leadForm.company.trim() || null,
            role: leadForm.role,
          },
        ],
        { onConflict: "email" },
      );
      if (mainLeadError) throw mainLeadError;

      // Insert scorecard run
      const answersArr = questions.map((q) => answers[q.id] || 2);
      const { data: run, error: re } = await (supabase as any)
        .from("cc_scorecard_runs")
        .insert([
          {
            lead_id: lid,
            answers_json: answersArr,
            score,
            band,
          },
        ])
        .select("id")
        .single();
      if (re) throw re;
      setRunId(run.id);

      await trackEvent("scorecard_complete", run.id, lid, { score, band });

      setShowLeadModal(false);
      setPhase("results");
      toast.success("Your results are ready!");
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    try {
      const answersArr = questions.map((q) => answers[q.id] || 2);
      const res = await supabase.functions.invoke("generate-scorecard-pdf", {
        body: {
          name: leadForm.name,
          email: leadForm.email,
          company: leadForm.company,
          score,
          band,
          answers: answersArr,
        },
      });
      if (res.error) throw res.error;

      await trackEvent("pdf_download", runId || undefined, leadId || undefined);

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Stack-Lock-In-Audit-Report.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Report downloaded!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>
          Neutral vs Proprietary Scorecard (Free) | Chase Continental
        </title>
        <meta
          name="description"
          content="Score your stack in 5 minutes. See lock-in risk and the fastest path to reliable automation."
        />
      </Helmet>
      <Header />

      {/* ════════ HERO ════════ */}
      {phase === "hero" && (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Technology assessment dashboard"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(180,25%,15%)]/80 via-[hsl(180,25%,15%)]/60 to-background/95" />
          </div>

          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-[hsl(180,100%,50%)]/8 blur-[100px] animate-pulse" />
          <div
            className="absolute bottom-20 left-20 w-56 h-56 rounded-full bg-[hsl(45,100%,50%)]/8 blur-[80px] animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />

          <div className="relative z-10 mx-auto max-w-4xl text-center px-6 pt-24">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-6 rounded-full border border-[hsl(45,100%,50%)]/40 bg-[hsl(180,25%,20%)]/60 px-5 py-2 text-xs font-bold uppercase tracking-widest text-[hsl(45,100%,60%)]"
            >
              Free Scorecard
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading leading-tight mb-6 text-white"
            >
              Is your stack{" "}
              <span className="bg-gradient-to-r from-[hsl(180,100%,50%)] to-[hsl(45,100%,50%)] bg-clip-text text-transparent">
                locking you in?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
            >
              Score your tools in 5 minutes. Get a clear recommendation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                size="lg"
                onClick={startScorecard}
                className="bg-[hsl(180,100%,40%)] hover:bg-[hsl(45,100%,50%)] hover:text-[hsl(180,25%,15%)] text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-105"
              >
                Start scorecard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-white/50 mt-4">
                Takes about 5 minutes. No signup required to start.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16"
            >
              <ChevronDown className="mx-auto h-6 w-6 text-white/30 animate-bounce" />
            </motion.div>
          </div>
        </section>
      )}

      {/* ════════ SCORECARD ════════ */}
      {phase === "scorecard" && (
        <section className="pt-28 pb-24 px-6">
          <div className="mx-auto max-w-3xl">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>
                  Question {currentQ + 1} of {questions.length}
                </span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question navigation dots */}
            <div className="flex gap-2 mb-8 justify-center flex-wrap">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQ(i)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                    i === currentQ
                      ? "bg-[hsl(180,100%,40%)] text-white scale-110"
                      : answers[q.id]
                        ? "bg-[hsl(180,100%,40%)]/20 text-[hsl(180,100%,40%)]"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Current Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50 bg-card shadow-xl">
                  <CardContent className="p-8 md:p-10">
                    <div className="mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[hsl(180,100%,40%)]">
                        {questions[currentQ].category}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold font-heading mb-6">
                      {questions[currentQ].question}
                    </h3>

                    <div className="space-y-3">
                      {answerOptions.map((opt) => {
                        const selected =
                          answers[questions[currentQ].id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() =>
                              selectAnswer(questions[currentQ].id, opt.value)
                            }
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                              selected
                                ? opt.value === 1
                                  ? "border-green-500 bg-green-500/10"
                                  : opt.value === 2
                                    ? "border-yellow-500 bg-yellow-500/10"
                                    : "border-red-500 bg-red-500/10"
                                : "border-border hover:border-[hsl(180,100%,40%)]/50 hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">{opt.label}</div>
                                <div className="text-sm text-muted-foreground">
                                  {opt.desc}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {opt.value === 1
                                    ? questions[currentQ].examples.neutral
                                    : opt.value === 3
                                      ? questions[currentQ].examples.proprietary
                                      : "Mix of both"}
                                </span>
                                {selected && (
                                  <CheckCircle2 className="h-5 w-5 text-[hsl(180,100%,40%)]" />
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                        disabled={currentQ === 0}
                      >
                        Previous
                      </Button>

                      {currentQ < questions.length - 1 ? (
                        <Button
                          onClick={() => setCurrentQ(currentQ + 1)}
                          disabled={!answers[questions[currentQ].id]}
                          className="bg-[hsl(180,100%,40%)] hover:bg-[hsl(180,100%,35%)] text-white"
                        >
                          Next <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleComplete}
                          disabled={!allAnswered}
                          className="bg-gradient-to-r from-[hsl(180,100%,40%)] to-[hsl(45,100%,45%)] text-white font-bold px-8"
                        >
                          See my results <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Running score */}
            {Object.keys(answers).length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center text-sm text-muted-foreground"
              >
                Running score: <span className="font-bold">{score}</span>/30
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ════════ RESULTS ════════ */}
      {phase === "results" && (
        <section className="pt-28 pb-24 px-6">
          <div className="mx-auto max-w-4xl">
            {/* Score Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-16"
            >
              <div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <config.icon
                  className="h-12 w-12"
                  style={{ color: config.color }}
                />
              </div>
              <h2
                className="text-4xl md:text-5xl font-extrabold font-heading mb-2"
                style={{ color: config.color }}
              >
                {config.headline}
              </h2>
              <p className="text-xl text-muted-foreground mb-4">
                {config.subtitle}
              </p>
              <div
                className="inline-block rounded-2xl px-8 py-4 mt-2"
                style={{
                  backgroundColor: `${config.color}15`,
                  border: `2px solid ${config.color}40`,
                }}
              >
                <span
                  className="text-5xl font-extrabold"
                  style={{ color: config.color }}
                >
                  {score}
                </span>
                <span className="text-2xl text-muted-foreground">/30</span>
              </div>
            </motion.div>

            {/* Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="mb-8 border-border/50 shadow-lg overflow-hidden">
                <div
                  className="px-8 py-4"
                  style={{ backgroundColor: `${config.color}15` }}
                >
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <AlertTriangle
                      className="h-5 w-5"
                      style={{ color: config.color }}
                    />
                    Analysis
                  </h3>
                </div>
                <CardContent className="p-8">
                  <ul className="space-y-3">
                    {config.analysis.map((a, i) => (
                      <li key={i} className="flex gap-3 text-muted-foreground">
                        <span style={{ color: config.color }}>•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Score Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="mb-8 border-border/50 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-lg font-bold mb-6">Score Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-border">
                          <th className="text-left py-3 px-2 font-bold">
                            Category
                          </th>
                          <th className="text-left py-3 px-2 font-bold">
                            Assessment
                          </th>
                          <th className="text-center py-3 px-2 font-bold">
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {questions.map((q) => {
                          const val = answers[q.id] || 2;
                          const label =
                            val === 1
                              ? "Neutral"
                              : val === 2
                                ? "Mixed"
                                : "Proprietary";
                          const labelColor =
                            val === 1
                              ? "text-green-600"
                              : val === 2
                                ? "text-yellow-600"
                                : "text-red-600";
                          return (
                            <tr
                              key={q.id}
                              className="border-b border-border/50"
                            >
                              <td className="py-3 px-2 font-medium">
                                {q.category}
                              </td>
                              <td
                                className={`py-3 px-2 font-semibold ${labelColor}`}
                              >
                                {label}
                              </td>
                              <td className="py-3 px-2 text-center font-bold">
                                {val}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="border-t-2 border-border">
                          <td className="py-3 px-2 font-bold" colSpan={2}>
                            Total Score
                          </td>
                          <td
                            className="py-3 px-2 text-center font-extrabold text-lg"
                            style={{ color: config.color }}
                          >
                            {score}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold font-heading mb-6">
                Recommendations
              </h3>
              <div className="space-y-4 mb-12">
                {config.recommendations.map((rec, i) => (
                  <Card
                    key={i}
                    className="border-border/50 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold"
                          style={{ backgroundColor: config.color }}
                        >
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">
                            {rec.title}
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {rec.detail}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                className="bg-[hsl(180,100%,40%)] hover:bg-[hsl(180,100%,35%)] text-white font-bold px-8 py-6 rounded-xl"
              >
                {pdfLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating
                    PDF…
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" /> Download Audit Report
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open(BOOK_CALL_URL, "_blank")}
                className="px-8 py-6 rounded-xl font-bold"
                style={{ borderColor: config.color, color: config.color }}
              >
                {config.cta} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* ════════ FAQ (show on hero phase) ════════ */}
      {phase === "hero" && (
        <section className="py-24 px-6 bg-card/50">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold font-heading text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  step: "1",
                  title: "Answer 10 Questions",
                  desc: "Rate each component of your tech stack on a neutral-to-proprietary scale.",
                },
                {
                  step: "2",
                  title: "Get Your Score",
                  desc: "See your vendor lock-in risk band with detailed analysis and recommendations.",
                },
                {
                  step: "3",
                  title: "Download Report",
                  desc: "Get a professional PDF audit report with sourced insights and next steps.",
                },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[hsl(180,100%,40%)]/10 text-[hsl(180,100%,40%)] font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {s.step}
                  </div>
                  <h3 className="font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-3xl font-bold font-heading text-center mb-8">
              FAQ
            </h2>
            <Accordion type="single" collapsible className="space-y-3">
              {[
                {
                  q: "What does this scorecard measure?",
                  a: "It assesses your tech stack's vendor lock-in risk across 10 critical categories — from cloud infrastructure to AI/ML components.",
                },
                {
                  q: "How long does it take?",
                  a: "About 5 minutes. 10 quick questions with instant results.",
                },
                {
                  q: "Is it really free?",
                  a: "Yes, completely free. No hidden costs.",
                },
                {
                  q: "What do I get?",
                  a: "A risk score, detailed analysis, tailored recommendations, and a downloadable PDF audit report.",
                },
                {
                  q: "Who is this for?",
                  a: "CTOs, engineering leaders, and anyone evaluating their tech stack's portability and vendor dependency.",
                },
              ].map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-border/50 rounded-xl px-6 bg-card shadow-sm"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      <Footer />

      {/* ════════ LEAD GATE MODAL ════════ */}
      <Dialog open={showLeadModal} onOpenChange={setShowLeadModal}>
        <DialogContent className="sm:max-w-md border-border/50 bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading flex items-center gap-2">
              <Shield className="h-5 w-5 text-[hsl(180,100%,40%)]" />
              See Your Results
            </DialogTitle>
            <DialogDescription>
              Fill in your details to unlock your score and recommendations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label>Name *</Label>
              <Input
                placeholder="Your name"
                value={leadForm.name}
                onChange={(e) =>
                  setLeadForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={leadForm.email}
                onChange={(e) =>
                  setLeadForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                placeholder="Your company"
                value={leadForm.company}
                onChange={(e) =>
                  setLeadForm((p) => ({ ...p, company: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Role *</Label>
              <Select
                value={leadForm.role}
                onValueChange={(v) => setLeadForm((p) => ({ ...p, role: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Brief Stack Description</Label>
              <Textarea
                placeholder="e.g., AWS-heavy, PostgreSQL, React frontend..."
                value={leadForm.stackDesc}
                onChange={(e) =>
                  setLeadForm((p) => ({ ...p, stackDesc: e.target.value }))
                }
                rows={3}
              />
            </div>

            <Button
              onClick={handleLeadSubmit}
              disabled={loading}
              className="w-full bg-[hsl(180,100%,40%)] hover:bg-[hsl(180,100%,35%)] text-white font-bold py-5 rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…
                </>
              ) : (
                <>
                  Unlock Results <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Your data is secure. No spam.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NeutralVsProprietaryScorecard;
