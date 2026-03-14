/*
  LM07 — Deterministic Mastery Protocol™ Blueprint (Interactive Template)
  Slug: /resources/deterministic-blueprint
  Accent: deep purple | Highlight: electric blue | Gold accents
*/

import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Download,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ListChecks,
  GitBranch,
  BarChart3,
  FileText,
  Plus,
  Trash2,
  Zap,
  Pencil,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

import heroImage from "@/assets/blueprint-hero.jpg";

/* ── types ── */
interface WorkflowStep {
  id: string;
  description: string;
  owner: string;
  tool: string;
}

interface ExceptionRow {
  id: string;
  exception: string;
  trigger: string;
  action: string;
  approval: string;
}

interface MetricRow {
  id: string;
  name: string;
  target: string;
  baseline: string;
  method: string;
}

/* ── session ── */
const getSessionId = () => {
  let sid = sessionStorage.getItem("blueprint_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("blueprint_session_id", sid);
  }
  return sid;
};

/* ── options ── */
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
  "Logistics & Supply Chain",
  "Manufacturing",
  "Healthcare",
  "BPO / Outsourcing",
  "Financial Services",
  "Technology / SaaS",
  "Professional Services",
  "Other",
];

/* ── what's included items ── */
const includedItems = [
  {
    icon: ListChecks,
    title: "Step-by-step workflow template",
    desc: "10-step fill-in-the-blank framework for mapping any process end-to-end.",
  },
  {
    icon: GitBranch,
    title: "Exception + approval mapping",
    desc: "Decision trees and routing logic for handling edge cases and sign-offs.",
  },
  {
    icon: BarChart3,
    title: "Measurement checklist",
    desc: "KPIs and tracking methods to prove your workflow is actually working.",
  },
];

/* ── FAQ data ── */
const faqItems = [
  {
    q: "What is the Deterministic Automation Blueprint?",
    a: "It's a free fill-in-the-blank template to turn chaotic processes into predictable, repeatable workflows by defining steps, handling exceptions, and adding checkpoints.",
  },
  {
    q: "Who is this for?",
    a: "Business owners, automation enthusiasts, and teams looking to streamline operations without guesswork.",
  },
  {
    q: "Is it really free?",
    a: "Yes, instant access after opt-in—no strings attached.",
  },
  {
    q: "What format is the template?",
    a: "Downloadable PDF — you'll get a blank template PLUS a populated version with the data you entered in the builder.",
  },
  {
    q: "How do I use it?",
    a: "Use the interactive builder above to fill in your process details, then download both blank and populated PDFs.",
  },
];

/* ── track event helper ── */
const trackEvent = async (
  eventType: string,
  leadId?: string,
  payload?: Record<string, unknown>,
) => {
  try {
    await (supabase as any).from("lm07_events").insert([
      {
        event_type: eventType,
        lead_id: leadId || null,
        event_payload: payload || {},
      },
    ]);
  } catch (_) {
    /* silent */
  }
};

/* ── helpers ── */
const makeId = () => crypto.randomUUID();
const emptyStep = (): WorkflowStep => ({
  id: makeId(),
  description: "",
  owner: "",
  tool: "",
});
const emptyException = (): ExceptionRow => ({
  id: makeId(),
  exception: "",
  trigger: "",
  action: "",
  approval: "",
});
const emptyMetric = (): MetricRow => ({
  id: makeId(),
  name: "",
  target: "",
  baseline: "",
  method: "",
});

const DeterministicBlueprint = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    industry: "",
  });

  // Interactive builder state
  const [workflowName, setWorkflowName] = useState("");
  const [steps, setSteps] = useState<WorkflowStep[]>([
    emptyStep(),
    emptyStep(),
    emptyStep(),
  ]);
  const [exceptions, setExceptions] = useState<ExceptionRow[]>([
    emptyException(),
  ]);
  const [metrics, setMetrics] = useState<MetricRow[]>([emptyMetric()]);

  useEffect(() => {
    trackEvent("page_view", undefined, { page: "deterministic-blueprint" });
  }, []);

  const scrollToOptIn = () => {
    trackEvent("cta_click", undefined, { cta: "hero" });
    setShowModal(true);
  };

  const scrollToBuilder = () => {
    trackEvent("cta_click", undefined, { cta: "hero-builder" });
    document
      .getElementById("workflow-builder")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Step handlers
  const updateStep = (id: string, field: keyof WorkflowStep, value: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };
  const addStep = () => setSteps((prev) => [...prev, emptyStep()]);
  const removeStep = (id: string) =>
    setSteps((prev) =>
      prev.length > 1 ? prev.filter((s) => s.id !== id) : prev,
    );

  // Exception handlers
  const updateException = (
    id: string,
    field: keyof ExceptionRow,
    value: string,
  ) => {
    setExceptions((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  };
  const addException = () =>
    setExceptions((prev) => [...prev, emptyException()]);
  const removeException = (id: string) =>
    setExceptions((prev) =>
      prev.length > 1 ? prev.filter((e) => e.id !== id) : prev,
    );

  // Metric handlers
  const updateMetric = (id: string, field: keyof MetricRow, value: string) => {
    setMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };
  const addMetric = () => setMetrics((prev) => [...prev, emptyMetric()]);
  const removeMetric = (id: string) =>
    setMetrics((prev) =>
      prev.length > 1 ? prev.filter((m) => m.id !== id) : prev,
    );

  const hasBuilderData = useCallback(() => {
    return (
      workflowName.trim() ||
      steps.some(
        (s) => s.description.trim() || s.owner.trim() || s.tool.trim(),
      ) ||
      exceptions.some((e) => e.exception.trim()) ||
      metrics.some((m) => m.name.trim())
    );
  }, [workflowName, steps, exceptions, metrics]);

  const handleGeneratePdf = async () => {
    if (
      !leadForm.name.trim() ||
      !leadForm.email.trim() ||
      !leadForm.role ||
      !leadForm.industry
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Check for existing lead
      const { data: existingLead } = await (supabase as any)
        .from("lm07_leads")
        .select("id")
        .eq("email", leadForm.email.trim())
        .maybeSingle();

      let leadId = existingLead?.id;

      if (!leadId) {
        const { data: newLead, error: leadError } = await (supabase as any)
          .from("lm07_leads")
          .insert([
            {
              name: leadForm.name.trim(),
              email: leadForm.email.trim(),
              company: leadForm.company.trim() || null,
              role: leadForm.role,
              vertical: leadForm.industry,
            },
          ])
          .select("id")
          .single();
        if (leadError) throw leadError;
        leadId = newLead.id;
      }

      // Also upsert into main leads table
      const { error: mainLeadError } = await supabase.from("leads").upsert(
        [
          {
            name: leadForm.name.trim(),
            email: leadForm.email.trim(),
            company: leadForm.company.trim() || null,
            role: leadForm.role,
            vertical: leadForm.industry,
          },
        ],
        { onConflict: "email" },
      );
      if (mainLeadError) throw mainLeadError;

      // Track events
      await trackEvent("lead_submit", leadId, {
        source: "deterministic-blueprint",
      });

      // Prepare workflow data for the edge function
      const workflowData = {
        workflowName: workflowName.trim(),
        steps: steps.filter(
          (s) => s.description.trim() || s.owner.trim() || s.tool.trim(),
        ),
        exceptions: exceptions.filter((e) => e.exception.trim()),
        metrics: metrics.filter((m) => m.name.trim()),
      };

      // Generate PDF
      const res = await supabase.functions.invoke("generate-blueprint-pdf", {
        body: {
          leadId,
          name: leadForm.name.trim(),
          email: leadForm.email.trim(),
          workflowData: hasBuilderData() ? workflowData : null,
        },
      });

      if (res.error) throw res.error;

      // Track download
      await (supabase as any).from("lm07_downloads").insert([
        {
          lead_id: leadId,
          template_version: "2.0",
        },
      ]);
      await trackEvent("pdf_download", leadId, {
        hasWorkflowData: !!hasBuilderData(),
      });

      // Download
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Deterministic-Automation-Blueprint.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(
        "Blueprint downloaded! You'll get both a blank template and your populated version.",
      );
      setShowModal(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>
          Deterministic Automation Blueprint (Free) | Chase Continental
        </title>
        <meta
          name="description"
          content="A fill-in-the-blank template to turn messy work into a repeatable workflow."
        />
      </Helmet>
      <Header />

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Blueprint workflow dashboard"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(270,40%,12%)]/70 via-[hsl(270,40%,12%)]/50 to-background/95" />
        </div>

        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[hsl(270,60%,50%)]/10 blur-[80px] animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-[hsl(200,100%,50%)]/10 blur-[60px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center px-6 pt-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 rounded-full border border-[hsl(45,80%,55%)]/40 bg-[hsl(270,60%,30%)]/60 px-5 py-2 text-xs font-bold uppercase tracking-widest text-[hsl(45,80%,65%)]"
          >
            Free Template
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading leading-tight mb-6 text-white"
          >
            Turn messy work into a{" "}
            <span className="bg-gradient-to-r from-[hsl(270,80%,70%)] to-[hsl(200,100%,60%)] bg-clip-text text-transparent">
              repeatable workflow.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
          >
            Build your workflow right here — then download a blank template and
            a populated blueprint with your data.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={scrollToBuilder}
              className="bg-gradient-to-r from-[hsl(270,70%,55%)] to-[hsl(200,100%,50%)] hover:from-[hsl(270,70%,45%)] hover:to-[hsl(200,100%,40%)] text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg shadow-[hsl(270,70%,55%)]/25 transition-all hover:scale-105"
            >
              Start building <Pencil className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToOptIn}
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
            >
              Get blank template <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-white/50 mt-4"
          >
            Instant access. No credit card.
          </motion.p>

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

      {/* ════════ WHAT'S INCLUDED ════════ */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block mb-4 rounded-full border border-[hsl(270,60%,50%)]/20 bg-[hsl(270,60%,50%)]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(270,60%,50%)]">
              What's Inside
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading">
              Everything you need to make automation{" "}
              <span className="text-[hsl(270,60%,50%)]">predictable</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {includedItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm hover:border-[hsl(270,60%,50%)]/30 transition-all hover:shadow-lg hover:shadow-[hsl(270,60%,50%)]/5">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(270,60%,50%)]/15 to-[hsl(200,100%,50%)]/10 flex items-center justify-center mb-5">
                      <item.icon className="h-7 w-7 text-[hsl(270,60%,50%)]" />
                    </div>
                    <h3 className="text-lg font-bold font-heading mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ INTERACTIVE WORKFLOW BUILDER ════════ */}
      <section
        id="workflow-builder"
        className="py-24 px-6 bg-gradient-to-b from-background via-[hsl(270,20%,96%)] to-background"
      >
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block mb-4 rounded-full border border-[hsl(200,100%,50%)]/20 bg-[hsl(200,100%,50%)]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(200,100%,50%)]">
              Interactive Builder
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading">
              Build your workflow{" "}
              <span className="text-[hsl(200,100%,50%)]">right here</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Fill in your workflow details below. When you download, you'll get
              a blank template <strong>plus</strong> a version populated with
              your data.
            </p>
          </motion.div>

          <div className="space-y-10">
            {/* Workflow Name */}
            <Card className="border-border/50 bg-card shadow-lg">
              <CardContent className="p-6 md:p-8">
                <Label className="text-base font-bold mb-3 block">
                  Workflow Name
                </Label>
                <Input
                  placeholder='e.g., "Order Fulfillment Process" or "Client Onboarding"'
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="text-base"
                />
              </CardContent>
            </Card>

            {/* Section 1: Steps */}
            <Card className="border-border/50 bg-card shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[hsl(270,60%,50%)] to-[hsl(270,40%,40%)] px-6 md:px-8 py-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  Define Your Workflow Steps
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  List each step — who does it and what tool is used.
                </p>
              </div>
              <CardContent className="p-6 md:p-8 space-y-4">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid grid-cols-12 gap-3 items-start"
                  >
                    <div className="col-span-1 flex items-center justify-center h-10">
                      <span className="text-sm font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                    </div>
                    <div className="col-span-5">
                      <Input
                        placeholder="What happens in this step?"
                        value={step.description}
                        onChange={(e) =>
                          updateStep(step.id, "description", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="Who's responsible?"
                        value={step.owner}
                        onChange={(e) =>
                          updateStep(step.id, "owner", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        placeholder="Tool used"
                        value={step.tool}
                        onChange={(e) =>
                          updateStep(step.id, "tool", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(step.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        disabled={steps.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
                <Button variant="outline" onClick={addStep} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add step
                </Button>
              </CardContent>
            </Card>

            {/* Section 2: Exceptions */}
            <Card className="border-border/50 bg-card shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[hsl(200,100%,40%)] to-[hsl(200,80%,35%)] px-6 md:px-8 py-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Map Exceptions &amp; Approvals
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  What can go wrong? How should it be handled?
                </p>
              </div>
              <CardContent className="p-6 md:p-8 space-y-4">
                {exceptions.map((exc, i) => (
                  <motion.div
                    key={exc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid grid-cols-12 gap-3 items-start"
                  >
                    <div className="col-span-3">
                      <Input
                        placeholder="Exception scenario"
                        value={exc.exception}
                        onChange={(e) =>
                          updateException(exc.id, "exception", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="What triggers it?"
                        value={exc.trigger}
                        onChange={(e) =>
                          updateException(exc.id, "trigger", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="Handling action"
                        value={exc.action}
                        onChange={(e) =>
                          updateException(exc.id, "action", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Select
                        value={exc.approval}
                        onValueChange={(v) =>
                          updateException(exc.id, "approval", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Approval?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Conditional">
                            Conditional
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeException(exc.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        disabled={exceptions.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
                <Button
                  variant="outline"
                  onClick={addException}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add exception
                </Button>
              </CardContent>
            </Card>

            {/* Section 3: Metrics */}
            <Card className="border-border/50 bg-card shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[hsl(45,80%,45%)] to-[hsl(35,80%,40%)] px-6 md:px-8 py-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  Measurement Checklist
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  How will you know this workflow is working?
                </p>
              </div>
              <CardContent className="p-6 md:p-8 space-y-4">
                {metrics.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid grid-cols-12 gap-3 items-start"
                  >
                    <div className="col-span-3">
                      <Input
                        placeholder="Metric name"
                        value={m.name}
                        onChange={(e) =>
                          updateMetric(m.id, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="Target value"
                        value={m.target}
                        onChange={(e) =>
                          updateMetric(m.id, "target", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        placeholder="Baseline"
                        value={m.baseline}
                        onChange={(e) =>
                          updateMetric(m.id, "baseline", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="How to measure"
                        value={m.method}
                        onChange={(e) =>
                          updateMetric(m.id, "method", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMetric(m.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        disabled={metrics.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
                <Button variant="outline" onClick={addMetric} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add metric
                </Button>
              </CardContent>
            </Card>

            {/* Generate CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center pt-6"
            >
              <Button
                size="lg"
                onClick={scrollToOptIn}
                className="bg-gradient-to-r from-[hsl(270,70%,55%)] to-[hsl(200,100%,50%)] hover:from-[hsl(270,70%,45%)] hover:to-[hsl(200,100%,40%)] text-white font-bold px-12 py-6 text-lg rounded-xl shadow-lg shadow-[hsl(270,70%,55%)]/25 transition-all hover:scale-105"
              >
                {hasBuilderData() ? (
                  <>
                    Generate my blueprint <FileText className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    Get the blank template <Download className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                {hasBuilderData()
                  ? "You'll get a blank template + a version populated with your data above."
                  : "Fill in the builder above to also get a populated version, or download the blank template now."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="py-24 px-6 bg-card/50">
        <div className="mx-auto max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold font-heading text-center mb-12"
          >
            Frequently Asked Questions
          </motion.h2>

          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border/50 rounded-xl px-6 bg-card shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline text-foreground">
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

      <Footer />

      {/* ════════ LEAD CAPTURE MODAL ════════ */}
      <AnimatePresence>
        {showModal && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="sm:max-w-md border-border/50 bg-card">
              <DialogHeader>
                <DialogTitle className="text-xl font-heading flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[hsl(270,60%,50%)]" />
                  {hasBuilderData()
                    ? "Generate Your Blueprint"
                    : "Get the Blueprint"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {hasBuilderData()
                    ? "Fill in your details to download your populated blueprint + blank template."
                    : "Fill in your details to download the Deterministic Automation Blueprint."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="bp-name">Name *</Label>
                  <Input
                    id="bp-name"
                    placeholder="Your name"
                    value={leadForm.name}
                    onChange={(e) =>
                      setLeadForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="bp-email">Email *</Label>
                  <Input
                    id="bp-email"
                    type="email"
                    placeholder="you@company.com"
                    value={leadForm.email}
                    onChange={(e) =>
                      setLeadForm((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="bp-company">Company</Label>
                  <Input
                    id="bp-company"
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
                    onValueChange={(v) =>
                      setLeadForm((p) => ({ ...p, role: v }))
                    }
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
                  <Label>Industry *</Label>
                  <Select
                    value={leadForm.industry}
                    onValueChange={(v) =>
                      setLeadForm((p) => ({ ...p, industry: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {hasBuilderData() && (
                  <div className="rounded-lg bg-[hsl(270,60%,50%)]/5 border border-[hsl(270,60%,50%)]/20 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-[hsl(270,60%,50%)]">
                      <CheckCircle2 className="h-4 w-4" />
                      Your workflow data will be included
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      You'll get 2 PDFs: blank template + populated with your{" "}
                      {steps.filter((s) => s.description.trim()).length} steps,{" "}
                      {exceptions.filter((e) => e.exception.trim()).length}{" "}
                      exceptions, and{" "}
                      {metrics.filter((m) => m.name.trim()).length} metrics.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleGeneratePdf}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[hsl(270,70%,55%)] to-[hsl(200,100%,50%)] hover:from-[hsl(270,70%,45%)] hover:to-[hsl(200,100%,40%)] text-white font-bold py-5 rounded-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Generating…
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Download Now
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Instant access. No spam.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeterministicBlueprint;
