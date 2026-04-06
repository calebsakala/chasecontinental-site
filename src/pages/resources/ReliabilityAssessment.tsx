/*
  LM04 — Production Reliability Assessment (Quiz)
  Slug: /resources/reliability-assessment
  Accent: amber/orange | Highlight: gold
*/

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Clock,
  ChevronDown,
  Download,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { queueResourceEmail } from "@/lib/resourceEmail";
import { toast } from "sonner";

// Hero background image
import heroImage from "@/assets/ai-network.jpg";

const ASSET_KEY = "reliability-assessment";

// Session ID for tracking
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("assessment_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("assessment_session_id", sessionId);
  }
  return sessionId;
};

// Role and Industry options
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

const industryOptions = [
  "E-commerce & Retail",
  "Healthcare & Life Sciences",
  "Financial Services",
  "Manufacturing",
  "Logistics & Supply Chain",
  "BPO & Outsourcing",
  "Technology / SaaS",
  "Professional Services",
  "Other",
];

// Questions with scoring (higher = more reliable)
const questions = [
  {
    id: 1,
    question: "How many tools does a single workflow touch?",
    whyItMatters:
      "More tools mean more integration points, increasing the risk of failures in data handoffs or API changes.",
    options: [
      { label: "1–2 tools", score: 10 },
      { label: "3–5 tools", score: 5 },
      { label: "6+ tools", score: 0 },
      { label: "Unsure/Not applicable", score: 3 },
    ],
  },
  {
    id: 2,
    question: "How often do inputs arrive incomplete?",
    whyItMatters:
      "AI automations rely on clean, complete data; incomplete inputs lead to errors, hallucinations, or stalled processes.",
    options: [
      { label: "Never", score: 10 },
      { label: "Rarely (less than 10% of cases)", score: 7 },
      { label: "Sometimes (10-30% of cases)", score: 3 },
      { label: "Often (more than 30% of cases)", score: 0 },
    ],
  },
  {
    id: 3,
    question: "How often are there approvals or exceptions in the workflow?",
    whyItMatters:
      "Human-in-the-loop approvals or exceptions can introduce delays and inconsistencies, making full automation brittle.",
    options: [
      { label: "Never", score: 10 },
      { label: "Rarely (less than 5% of cases)", score: 7 },
      { label: "Sometimes (5-20% of cases)", score: 3 },
      { label: "Often (more than 20% of cases)", score: 0 },
    ],
  },
  {
    id: 4,
    question: "Do you have a single source of truth for workflow status?",
    whyItMatters:
      "Without a centralized status tracker, debugging failures becomes chaotic, leading to longer downtimes.",
    options: [
      { label: "Yes, fully implemented", score: 10 },
      { label: "Partially (e.g., in some tools but not all)", score: 5 },
      { label: "No", score: 0 },
      { label: "Planning to implement", score: 3 },
    ],
  },
  {
    id: 5,
    question: "How do you currently measure error rate?",
    whyItMatters:
      "Without measurement, you can't detect drifts or improvements, allowing silent failures to compound.",
    options: [
      { label: "Automated monitoring and dashboards", score: 10 },
      { label: "Manual spot-checks", score: 5 },
      { label: "Not measured systematically", score: 0 },
      { label: "Basic logging only", score: 3 },
    ],
  },
  {
    id: 6,
    question: "How often do rules or requirements change?",
    whyItMatters:
      "Frequent changes can obsolete AI models or logic, causing outputs to drift without retraining.",
    options: [
      { label: "Rarely (less than once a quarter)", score: 10 },
      { label: "Occasionally (quarterly)", score: 5 },
      { label: "Frequently (monthly or more)", score: 0 },
      { label: "Unsure", score: 3 },
    ],
  },
  {
    id: 7,
    question: "Who owns the workflow end-to-end?",
    whyItMatters:
      "Clear ownership ensures accountability for fixes; fragmented ownership leads to finger-pointing and delays.",
    options: [
      { label: "A dedicated team or individual", score: 10 },
      { label: "Shared across departments with clear roles", score: 5 },
      { label: "No clear owner", score: 0 },
      { label: "Ownership is being defined", score: 3 },
    ],
  },
  {
    id: 8,
    question: "Can you audit what happened and why in a workflow?",
    whyItMatters:
      "Auditability allows root-cause analysis; without it, fixing issues is guesswork, eroding trust.",
    options: [
      { label: "Yes, full logging and traceability", score: 10 },
      { label: "Partial auditing (e.g., only key steps)", score: 5 },
      { label: "No auditing capabilities", score: 0 },
      { label: "Basic timestamps only", score: 3 },
    ],
  },
  {
    id: 9,
    question:
      "What's the cost of a single error (e.g., financial, time, or reputational)?",
    whyItMatters:
      "High-cost errors amplify risk; understanding this helps prioritize reliability investments.",
    options: [
      { label: "Low (minimal impact)", score: 10 },
      { label: "Medium (noticeable but recoverable)", score: 5 },
      { label: "High (significant business harm)", score: 0 },
      { label: "Very high (could be catastrophic)", score: 0 },
    ],
  },
  {
    id: 10,
    question: "How often do you rework the same tasks due to errors?",
    whyItMatters:
      "High rework indicates underlying unreliability, wasting resources and highlighting automation gaps.",
    options: [
      { label: "Rarely (less than 5% of tasks)", score: 10 },
      { label: "Sometimes (5-15% of tasks)", score: 5 },
      { label: "Often (more than 15% of tasks)", score: 0 },
      { label: "Unsure", score: 3 },
    ],
  },
];

const getBand = (score: number): "high-risk" | "medium-risk" | "strong" => {
  if (score <= 39) return "high-risk";
  if (score <= 69) return "medium-risk";
  return "strong";
};

const bandConfig = {
  "high-risk": {
    label: "High Risk",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: AlertTriangle,
    description:
      "Your automation has significant vulnerabilities that could cause production failures.",
  },
  "medium-risk": {
    label: "Medium Risk",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: Clock,
    description:
      "Your automation has some gaps that should be addressed before scaling.",
  },
  strong: {
    label: "Strong",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    icon: Shield,
    description:
      "Your automation foundation is solid, but there's always room to optimize.",
  },
};

const recommendationsByBand = {
  "high-risk": [
    "Consolidate to fewer tools and establish a single source of truth",
    "Implement comprehensive error tracking and alerting",
    "Assign clear end-to-end ownership for each workflow",
  ],
  "medium-risk": [
    "Build automated monitoring dashboards for key metrics",
    "Document exception handling procedures",
    "Create audit trails for all critical decision points",
  ],
  strong: [
    "Optimize for edge cases and reduce rework loops",
    "Implement predictive monitoring to catch issues early",
    "Consider cross-training to reduce single points of failure",
  ],
};

const faqs = [
  {
    question: "Is this assessment accurate?",
    answer:
      "This assessment provides a directional score based on common reliability factors we've observed across 100+ automation implementations. It's designed to surface key risk areas, not provide a definitive diagnosis.",
  },
  {
    question: "Do I need exact numbers?",
    answer:
      "No. Best estimates work fine. The goal is to identify patterns and areas of concern, not precise measurements. If you're unsure, go with your gut—it's usually right.",
  },
  {
    question: "What happens after I complete this?",
    answer:
      "You'll see your score, risk band, and three prioritized recommendations. You can download a detailed PDF report and optionally book a free reliability review call where we'll dive deeper into your specific situation.",
  },
];

type Phase = "hero" | "assessment" | "results";

interface AnswerDetail {
  question_id: number;
  question_text: string;
  selected_option: string;
  score: number;
  max_score: number;
}

const ReliabilityAssessment = () => {
  const [phase, setPhase] = useState<Phase>("hero");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [answerDetails, setAnswerDetails] = useState<AnswerDetail[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [assessmentRunId, setAssessmentRunId] = useState<string | null>(null);

  // PDF download state
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    industry: "",
  });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const sessionId = getSessionId();

  // Track event helper
  const trackEvent = async (
    eventName: string,
    payload: Record<string, unknown> = {},
  ) => {
    try {
      await supabase.from("events").insert([
        {
          session_id: sessionId,
          event_name: eventName,
          event_payload: payload as Json,
        },
      ]);
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  };

  // Start assessment
  const handleStartAssessment = async () => {
    setPhase("assessment");
    trackEvent("assessment_started", { asset_key: "reliability-assessment" });

    // Create assessment run
    try {
      const { data, error } = await supabase
        .from("assessment_runs")
        .insert([
          {
            session_id: sessionId,
            asset_key: "reliability-assessment",
            answers_json: {} as Json,
            score: 0,
            band: "pending",
          },
        ])
        .select("id")
        .single();

      if (data && !error) {
        setAssessmentRunId(data.id);
      }
    } catch (error) {
      console.error("Failed to create assessment run:", error);
    }
  };

  // Handle answer selection
  const handleSelectAnswer = (optionIndex: number) => {
    const question = questions[currentQuestion];
    const selectedOpt = question.options[optionIndex];
    const score = selectedOpt.score;

    setSelectedOption(optionIndex.toString());
    setAnswers((prev) => ({ ...prev, [question.id]: score }));

    // Store detailed answer for PDF
    setAnswerDetails((prev) => {
      const existing = prev.filter((a) => a.question_id !== question.id);
      return [
        ...existing,
        {
          question_id: question.id,
          question_text: question.question,
          selected_option: selectedOpt.label,
          score: score,
          max_score: 10,
        },
      ];
    });

    trackEvent("question_answered", {
      question_id: question.id,
      question_number: currentQuestion + 1,
      answer_index: optionIndex,
      score,
    });
  };

  // Handle next question
  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Calculate final score
      const totalScore = Object.values(answers).reduce(
        (sum, score) => sum + score,
        0,
      );
      const band = getBand(totalScore);

      // Update assessment run
      if (assessmentRunId) {
        try {
          await supabase
            .from("assessment_runs")
            .update({
              answers_json: answers as unknown as Json,
              score: totalScore,
              band: band,
            })
            .eq("id", assessmentRunId);
        } catch (error) {
          console.error("Failed to update assessment run:", error);
        }
      }

      trackEvent("assessment_completed", {
        score: totalScore,
        band,
        answers,
      });

      setPhase("results");
    }
  };

  // Calculate score
  const totalScore = Object.values(answers).reduce(
    (sum, score) => sum + score,
    0,
  );
  const band = getBand(totalScore);
  const config = bandConfig[band];
  const BandIcon = config.icon;

  // Book call click
  const handleBookCall = () => {
    trackEvent("book_call_click", { score: totalScore, band });
    window.open("https://calendar.app.google/8oZYnnuHcaiH64Ky8", "_blank");
  };

  // Generate PDF
  const handleGeneratePdf = async () => {
    if (!leadForm.name || !leadForm.email) {
      toast.error("Please fill in your name and email");
      return;
    }

    const trimmedName = leadForm.name.trim();
    const normalizedEmail = leadForm.email.toLowerCase().trim();
    const company = leadForm.company.trim() || null;

    setIsGeneratingPdf(true);
    trackEvent("lead_submit", {
      name: trimmedName,
      email: normalizedEmail,
      company,
      role: leadForm.role,
      industry: leadForm.industry,
      score: totalScore,
      band,
    });

    try {
      // Create or get lead
      const { data: existingLead } = await supabase
        .from("leads")
        .select("id")
        .eq("email", normalizedEmail)
        .maybeSingle();

      let leadId = existingLead?.id;

      if (!leadId) {
        const { data: newLead, error: leadError } = await supabase
          .from("leads")
          .insert([
            {
              name: trimmedName,
              email: normalizedEmail,
              company,
              role: leadForm.role || null,
              vertical: leadForm.industry || null,
            },
          ])
          .select("id")
          .single();

        if (leadError) throw leadError;
        leadId = newLead?.id;
      }

      // Update assessment run with lead_id
      if (assessmentRunId && leadId) {
        await supabase
          .from("assessment_runs")
          .update({ lead_id: leadId })
          .eq("id", assessmentRunId);
      }

      if (!leadId) {
        throw new Error("Could not create a lead for this report.");
      }

      // Sort answer details by question ID
      const sortedAnswers = [...answerDetails].sort(
        (a, b) => a.question_id - b.question_id,
      );

      // Generate PDF
      const response = await supabase.functions.invoke(
        "generate-assessment-pdf",
        {
          body: {
            lead_id: leadId,
            name: trimmedName,
            email: normalizedEmail,
            company,
            answers: sortedAnswers,
            score: totalScore,
            band: band,
          },
        },
      );

      if (response.error) throw new Error(response.error.message);

      const pdfUrl = response.data?.pdf_url;
      const filePath = response.data?.file_path;

      if (!pdfUrl || !filePath) {
        throw new Error(
          "Assessment report generation returned an incomplete response.",
        );
      }

      await supabase.from("downloads").insert([
        {
          lead_id: leadId,
          asset_key: ASSET_KEY,
          file_path: filePath,
          downloaded_at: new Date().toISOString(),
        },
      ]);

      queueResourceEmail({
        assetKey: ASSET_KEY,
        leadId,
        name: trimmedName,
        email: normalizedEmail,
        company,
        filePath,
      });

      trackEvent("download_start", {
        asset_key: ASSET_KEY,
        file_path: filePath,
        score: totalScore,
        band,
      });

      setPdfUrl(pdfUrl);
      setShowLeadForm(false);
      toast.success("Report generated. Your email copy is on the way.");
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>
          Production Reliability Assessment (Free) | Chase Continental
        </title>
        <meta
          name="description"
          content="Take a 5-minute assessment to see if your AI automation will hold up in production."
        />
      </Helmet>

      <Header />

      {/* Hero Phase */}
      <AnimatePresence mode="wait">
        {phase === "hero" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Full-bleed Hero Section */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={heroImage}
                  alt="AI Network Visualization"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-600/10" />
              </div>

              {/* Floating gradient orbs */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/15 rounded-full blur-[100px] animate-pulse delay-1000" />

              {/* Hero Content */}
              <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block mb-6 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur-sm px-5 py-2 text-sm font-semibold uppercase tracking-wider text-amber-400"
                >
                  Free 5-Minute Assessment
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl lg:text-7xl font-bold font-heading mb-6 leading-tight"
                >
                  Will Your Automation{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                    Survive Production?
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10"
                >
                  Score your AI workflows across 10 reliability factors. Get
                  instant results and a personalized action plan.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Button
                    size="lg"
                    onClick={handleStartAssessment}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-10 py-7 text-lg rounded-2xl shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105"
                  >
                    Start Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    No technical expertise needed • Results in 5 minutes
                  </span>
                </motion.div>
              </div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-6 h-10 rounded-full border-2 border-amber-500/30 flex items-start justify-center p-2"
                >
                  <div className="w-1.5 h-2.5 bg-amber-500 rounded-full" />
                </motion.div>
              </motion.div>
            </section>

            {/* Why this exists section */}
            <section className="py-24 px-6 bg-gradient-to-b from-background to-muted/30">
              <div className="mx-auto max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Why This Assessment Exists
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    We've seen 100+ automation projects fail in production.
                    Here's what happens when reliability isn't built in.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: AlertTriangle,
                      title: "Pilots Fail in Production",
                      description:
                        "AI pilots break when real-world exceptions appear that weren't in the training data or test scenarios.",
                    },
                    {
                      icon: Clock,
                      title: "Workflows Break at Scale",
                      description:
                        "Edge cases multiply across multiple tools. One API change can cascade into total workflow failure.",
                    },
                    {
                      icon: Shield,
                      title: "Trust Collapses Quickly",
                      description:
                        "When outputs drift and nobody can verify what happened, stakeholders lose confidence fast.",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="h-full bg-card/50 backdrop-blur-xl border-amber-500/10 hover:border-amber-500/30 transition-all">
                        <CardContent className="p-8">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6">
                            <item.icon className="h-7 w-7 text-amber-500" />
                          </div>
                          <h3 className="text-xl font-semibold mb-3">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {item.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6">
              <div className="mx-auto max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <h2 className="text-3xl font-bold mb-4">
                    Frequently Asked Questions
                  </h2>
                </motion.div>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="border-amber-500/10"
                    >
                      <AccordionTrigger className="text-left hover:text-amber-500 text-lg">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-base">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {/* CTA at bottom of FAQ */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-12 text-center"
                >
                  <Button
                    size="lg"
                    onClick={handleStartAssessment}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-8 py-6 text-lg rounded-xl"
                  >
                    Take the Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}

        {/* Assessment Phase */}
        {phase === "assessment" && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <section className="pt-32 pb-24 px-6">
              <div className="mx-auto max-w-2xl">
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ~{Math.ceil((questions.length - currentQuestion) * 0.5)}{" "}
                      min remaining
                    </span>
                  </div>
                  <Progress
                    value={(currentQuestion / questions.length) * 100}
                    className="h-2 bg-muted"
                  />
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-card/50 backdrop-blur border-amber-500/20">
                      <CardContent className="p-8">
                        <h2 className="text-xl md:text-2xl font-semibold mb-4">
                          {questions[currentQuestion].question}
                        </h2>

                        <p className="text-sm text-muted-foreground mb-8 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                          <span className="font-medium text-amber-500">
                            Why it matters:
                          </span>{" "}
                          {questions[currentQuestion].whyItMatters}
                        </p>

                        <RadioGroup
                          value={selectedOption || ""}
                          onValueChange={(value) =>
                            handleSelectAnswer(parseInt(value))
                          }
                          className="space-y-4"
                        >
                          {questions[currentQuestion].options.map(
                            (option, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                              >
                                <Label
                                  htmlFor={`option-${i}`}
                                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                                    selectedOption === i.toString()
                                      ? "border-amber-500 bg-amber-500/10"
                                      : "border-border hover:border-amber-500/50"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value={i.toString()}
                                    id={`option-${i}`}
                                  />
                                  <span className="text-base">
                                    {option.label}
                                  </span>
                                </Label>
                              </motion.div>
                            ),
                          )}
                        </RadioGroup>

                        <div className="mt-8 flex justify-end">
                          <Button
                            onClick={handleNext}
                            disabled={selectedOption === null}
                            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                          >
                            {currentQuestion < questions.length - 1
                              ? "Next"
                              : "See Results"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>
            </section>
          </motion.div>
        )}

        {/* Results Phase */}
        {phase === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <section className="pt-32 pb-24 px-6">
              <div className="mx-auto max-w-3xl">
                {/* Score Display */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-12"
                >
                  <h1 className="text-3xl md:text-4xl font-bold mb-8">
                    Your Reliability Score
                  </h1>

                  <div
                    className={`inline-flex flex-col items-center p-8 rounded-2xl border ${config.bgColor} ${config.borderColor}`}
                  >
                    <div className="text-6xl md:text-7xl font-bold mb-2">
                      {totalScore}
                    </div>
                    <div className="text-lg text-muted-foreground mb-4">
                      out of 100
                    </div>
                    <div className={`flex items-center gap-2 ${config.color}`}>
                      <BandIcon className="h-6 w-6" />
                      <span className="text-xl font-semibold">
                        {config.label}
                      </span>
                    </div>
                  </div>

                  <p className="mt-6 text-muted-foreground max-w-lg mx-auto">
                    {config.description}
                  </p>
                </motion.div>

                {/* Recommendations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold mb-6">
                    Your Top 3 Priorities
                  </h2>
                  <div className="space-y-4">
                    {recommendationsByBand[band].map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <Card className="bg-card/50 backdrop-blur border-amber-500/10">
                          <CardContent className="p-4 flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                              <span className="text-amber-500 font-semibold">
                                {i + 1}
                              </span>
                            </div>
                            <p className="text-base">{rec}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Download Report CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mb-8"
                >
                  <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                          <Download className="h-6 w-6 text-amber-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">
                            Download Your Full Report
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Get an in-depth PDF with detailed analysis for each
                            question, personalized recommendations, and a phased
                            action plan to improve your automation reliability.
                          </p>
                          {pdfUrl ? (
                            <Button
                              size="lg"
                              onClick={() => window.open(pdfUrl, "_blank")}
                              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                            >
                              <Download className="mr-2 h-5 w-5" />
                              Download Report (PDF)
                            </Button>
                          ) : (
                            <Button
                              size="lg"
                              onClick={() => setShowLeadForm(true)}
                              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                            >
                              Get Your Free Report
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center"
                >
                  <Card className="bg-card/50 backdrop-blur border-amber-500/10">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-bold mb-3">
                        Want a deeper analysis?
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Book a free 30-minute reliability review. We'll walk
                        through your specific workflows and identify the
                        highest-impact fixes.
                      </p>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleBookCall}
                        className="border-amber-500/30 hover:bg-amber-500/10"
                      >
                        Book a reliability review
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Retake */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-8 text-center"
                >
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setPhase("hero");
                      setCurrentQuestion(0);
                      setAnswers({});
                      setAnswerDetails([]);
                      setSelectedOption(null);
                      setAssessmentRunId(null);
                      setPdfUrl(null);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Retake assessment
                  </Button>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Capture Modal */}
      <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Get Your Free Report</DialogTitle>
            <DialogDescription>
              Enter your details to receive your personalized reliability
              assessment report.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={leadForm.name}
                  onChange={(e) =>
                    setLeadForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={leadForm.email}
                  onChange={(e) =>
                    setLeadForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Your company"
                value={leadForm.company}
                onChange={(e) =>
                  setLeadForm((prev) => ({ ...prev, company: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Select
                  value={leadForm.role}
                  onValueChange={(value) =>
                    setLeadForm((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={leadForm.industry}
                  onValueChange={(value) =>
                    setLeadForm((prev) => ({ ...prev, industry: value }))
                  }
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold"
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf || !leadForm.name || !leadForm.email}
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              We respect your privacy. No spam, ever.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ReliabilityAssessment;
