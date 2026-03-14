/*
  LM05 — Neutral Orchestration Swipe File
  Slug: /resources/orchestration-swipe-file
  Accent: cobalt | Highlight: neon-lime | Gold accents
*/

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Lock,
  Download,
  Loader2,
  CheckCircle2,
  Zap,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";

import heroImage from "@/assets/swipefile-hero.jpg";

// Session tracking
const getSessionId = () => {
  let sid = sessionStorage.getItem("swipefile_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("swipefile_session_id", sid);
  }
  return sid;
};

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

// All 15 workflow patterns
const workflows = [
  {
    id: 1,
    title: "Automated Order Fulfillment",
    category: "E-commerce",
    description: "End-to-end order processing from receipt to delivery—stock checks, payment, labels, tracking.",
    breaksAt: "Inventory discrepancies or ERP/CRM integration lag cause over-promising.",
    tip: "Start with 20% of orders automated; use API contracts for all handoffs.",
  },
  {
    id: 2,
    title: "Predictive Inventory Replenishment",
    category: "Supply Chain",
    description: "AI forecasts demand and auto-triggers replenishment based on sales trends and external data.",
    breaksAt: "Unaccounted seasonal spikes cause overstocking; black-swan events bypass rules.",
    tip: "Combine ML models with IoT sensors; set manual overrides for anomaly thresholds.",
  },
  {
    id: 3,
    title: "AI-Optimized Delivery Routing",
    category: "Logistics",
    description: "Dynamic route planning using traffic, weather, load, and deadline constraints.",
    breaksAt: "Poor connectivity in rural areas; unexpected road closures break real-time data feeds.",
    tip: "Pilot in one region; cache last-known-good routes as fallback.",
  },
  {
    id: 4,
    title: "Robotic Warehouse Picking",
    category: "Logistics",
    description: "ML-guided robots for picking, sorting, and packing with optimized travel paths.",
    breaksAt: "Hardware failures or mismatched item sizes disrupt flow; high initial costs.",
    tip: "Start hybrid human-robot; use barcode integration for 99.5%+ accuracy.",
  },
  {
    id: 5,
    title: "RPA Invoice Processing",
    category: "BPO",
    description: "Automated data entry, validation, and reconciliation of invoices across formats.",
    breaksAt: "Non-standard formats cause OCR errors; security risks without encryption.",
    tip: "Deploy rule-based bots first, then layer in AI OCR; audit logs for compliance.",
  },
  {
    id: 6,
    title: "Real-Time Supply Chain Visibility",
    category: "Supply Chain",
    description: "End-to-end tracking via IoT and analytics with proactive delay alerts.",
    breaksAt: "Data silos between partners fragment visibility; IoT latency during peaks.",
    tip: "Use streaming data platforms; ensure API compatibility across all partners.",
  },
  {
    id: 7,
    title: "ML Demand Forecasting",
    category: "Big Data",
    description: "Analyzes historical and market data to predict sales incorporating promotions.",
    breaksAt: "Biased historical data leads to flawed predictions; ignores qualitative signals.",
    tip: "Train on diverse datasets; validate forecasts with A/B testing before scaling.",
  },
  {
    id: 8,
    title: "Automated Exception Management",
    category: "Operations",
    description: "Detects delays, quality failures, and anomalies then auto-reroutes or escalates.",
    breaksAt: "Over-reliance on static rules misses nuanced cases; escalation loops overwhelm teams.",
    tip: "Define clear thresholds; log all resolutions to train smarter ML models.",
  },
  {
    id: 9,
    title: "Streamlined Returns Processing",
    category: "E-commerce",
    description: "Automated return requests, inspections, refunds, and restocking workflows.",
    breaksAt: "High volume overwhelms systems; poor inventory sync causes double-counting.",
    tip: "Add photo verification via AI; track metrics to identify root-cause patterns.",
  },
  {
    id: 10,
    title: "Vendor Managed Inventory",
    category: "Supply Chain",
    description: "Suppliers auto-monitor and replenish stock based on shared real-time data.",
    breaksAt: "Trust issues in data sharing; delays if supplier systems are incompatible.",
    tip: "Establish SLAs with penalties; use secure API gateways; start with top 3 vendors.",
  },
  {
    id: 11,
    title: "Dynamic Pricing Engine",
    category: "E-commerce",
    description: "Real-time price adjustments based on demand, competition, and inventory levels.",
    breaksAt: "Rapid fluctuations alienate customers; regulatory hurdles in some markets.",
    tip: "Set min/max guardrails; test in low-stakes segments before rolling out.",
  },
  {
    id: 12,
    title: "Dead Stock Liquidation",
    category: "Supply Chain",
    description: "Identifies slow-movers and auto-triggers sales, bundling, or auction workflows.",
    breaksAt: "Misidentification of seasonal items; over-discounting erodes margins.",
    tip: "Use time-based thresholds with seasonal exclusion rules; analyze post-sale ROI.",
  },
  {
    id: 13,
    title: "Automated Customer Service",
    category: "BPO",
    description: "Routes queries to bots or specialist teams, automating common issue responses.",
    breaksAt: "Complex queries escalate poorly; AI hallucinations in unstructured responses.",
    tip: "Train on historical tickets; use sentiment analysis for smart escalation.",
  },
  {
    id: 14,
    title: "Compliance Auditing Workflow",
    category: "Operations",
    description: "Automated regulatory checks with report generation and flag escalation.",
    breaksAt: "Evolving laws outpace rules; incomplete data leads to false positives.",
    tip: "Update rule engines quarterly; integrate with legal databases for live feeds.",
  },
  {
    id: 15,
    title: "End-to-End Supply Chain Orchestration",
    category: "Supply Chain",
    description: "Agentic AI coordinates planning, execution, and optimization across all stages.",
    breaksAt: "Over-complexity in multi-agent systems; dependency on high-quality data.",
    tip: "Build modular agents; iterate based on feedback; natural language interfaces for ops.",
  },
];

const whatsInside = [
  { icon: Zap, text: "15 real workflow patterns across 5 industries" },
  { icon: AlertTriangle, text: '"Where it breaks" failure analysis for each' },
  { icon: Lightbulb, text: "Implementation tips you can use today" },
];

const faqs = [
  {
    question: "Is this really free?",
    answer: "Yes. We provide this swipe file to help teams build better automations. There's no catch—just useful patterns you can steal and adapt.",
  },
  {
    question: "Do I need technical skills to use these patterns?",
    answer: "No. Each pattern includes a high-level overview that operations leaders can use, plus implementation tips for engineering teams. It works for both audiences.",
  },
  {
    question: "What industries do these patterns cover?",
    answer: "Logistics, supply chain, BPO, e-commerce, and big data/analytics. Most patterns can be adapted across industries with minor modifications.",
  },
  {
    question: "How is this different from generic automation advice?",
    answer: "Every pattern includes real 'where it breaks' analysis from production deployments. We don't just tell you what to build—we tell you where it fails and how to prevent it.",
  },
];

const OrchestrationSwipeFile = () => {
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
  const [unlocked, setUnlocked] = useState(false);

  const sessionId = getSessionId();

  const trackEvent = async (eventName: string, payload: Record<string, unknown> = {}) => {
    try {
      await supabase.from("events").insert([{
        session_id: sessionId,
        event_name: eventName,
        event_payload: payload as Json,
      }]);
    } catch (e) {
      console.error("Event tracking failed:", e);
    }
  };

  const handleGetSwipeFile = () => {
    trackEvent("swipefile_cta_click");
    setShowLeadForm(true);
  };

  const handleSubmit = async () => {
    if (!leadForm.name.trim() || !leadForm.email.trim()) {
      toast.error("Please fill in your name and email");
      return;
    }

    setIsGeneratingPdf(true);
    trackEvent("swipefile_lead_submit", {
      name: leadForm.name,
      email: leadForm.email,
      company: leadForm.company,
      role: leadForm.role,
      industry: leadForm.industry,
    });

    try {
      // Upsert lead
      const { data: existingLead } = await supabase
        .from("leads")
        .select("id")
        .eq("email", leadForm.email)
        .maybeSingle();

      let leadId = existingLead?.id;

      if (!leadId) {
        const { data: newLead, error: leadError } = await supabase
          .from("leads")
          .insert([{
            name: leadForm.name,
            email: leadForm.email,
            company: leadForm.company || null,
            role: leadForm.role || null,
            vertical: leadForm.industry || null,
          }])
          .select("id")
          .single();
        if (leadError) throw leadError;
        leadId = newLead?.id;
      }

      // Log download
      await supabase.from("downloads").insert([{
        lead_id: leadId || null,
        asset_key: "orchestration-swipe-file",
      }]);

      // Generate PDF via edge function
      const response = await supabase.functions.invoke("generate-swipefile-pdf", {
        body: {
          lead_id: leadId,
          name: leadForm.name,
          email: leadForm.email,
          company: leadForm.company,
        },
      });

      if (response.error) throw new Error(response.error.message);

      const url = response.data?.pdf_url;
      if (url) {
        setPdfUrl(url);
        setUnlocked(true);
        setShowLeadForm(false);
        toast.success("Swipe file unlocked! Downloading now…");
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Failed to generate swipe file:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const categoryColor = (cat: string) => {
    const map: Record<string, string> = {
      "E-commerce": "text-[hsl(160,84%,39%)] border-[hsl(160,84%,39%)]/30 bg-[hsl(160,84%,39%)]/10",
      "Supply Chain": "text-blue-400 border-blue-400/30 bg-blue-400/10",
      Logistics: "text-amber-400 border-amber-400/30 bg-amber-400/10",
      "Big Data": "text-purple-400 border-purple-400/30 bg-purple-400/10",
      BPO: "text-pink-400 border-pink-400/30 bg-pink-400/10",
      Operations: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
    };
    return map[cat] || "text-muted-foreground border-border bg-muted";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Automation Workflow Swipe File (Free) | Chase Continental</title>
        <meta name="description" content="15 real workflow patterns you can adapt across logistics, supply chain, big data, BPO, and e-commerce." />
      </Helmet>

      <Header />

      {/* ───── HERO ───── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Workflow automation grid" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-[hsl(75,100%,50%)]/10" />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[hsl(75,100%,50%)]/10 rounded-full blur-[100px] animate-pulse delay-1000" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 rounded-full border border-blue-400/30 bg-blue-400/10 backdrop-blur-sm px-5 py-2 text-sm font-semibold uppercase tracking-wider text-blue-400"
          >
            Free Swipe File
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold font-heading mb-6 leading-tight drop-shadow-lg"
          >
            Steal 15 workflows{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[hsl(75,100%,50%)]">
              that actually work.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 drop-shadow-sm"
          >
            Real patterns for connecting tools, handling exceptions, and keeping work moving.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <Button
              size="lg"
              onClick={handleGetSwipeFile}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-10 py-7 text-lg rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105"
            >
              Get the swipe file
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <span className="text-sm text-muted-foreground">Instant access · No spam</span>
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
            className="w-6 h-10 rounded-full border-2 border-blue-500/30 flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-2.5 bg-blue-500 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ───── PREVIEW GRID ───── */}
      <section className="py-24 px-6 bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Preview the Patterns</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Here's a taste of the 15 battle-tested workflow patterns inside.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((wf, i) => {
              const isLocked = i >= 3 && !unlocked;
              return (
                <motion.div
                  key={wf.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.05, 0.4) }}
                  className="relative"
                >
                  <Card
                    className={`h-full bg-card/50 backdrop-blur-xl border-blue-500/10 hover:border-blue-500/30 transition-all ${
                      isLocked ? "select-none" : ""
                    }`}
                  >
                    <CardContent className={`p-6 ${isLocked ? "filter blur-[6px]" : ""}`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-muted-foreground">#{wf.id}</span>
                        <span className={`text-xs font-semibold rounded-full border px-2.5 py-0.5 ${categoryColor(wf.category)}`}>
                          {wf.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-3">{wf.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{wf.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground"><span className="font-medium text-foreground">Breaks at:</span> {wf.breaksAt}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground"><span className="font-medium text-foreground">Tip:</span> {wf.tip}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/60 backdrop-blur-sm rounded-lg border border-blue-500/10">
                      <Lock className="h-8 w-8 text-amber-400 mb-2" />
                      <span className="text-sm font-semibold text-foreground">Unlock All 15</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {!unlocked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <Button
                size="lg"
                onClick={handleGetSwipeFile}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-10 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/25"
              >
                Unlock All 15 Patterns
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ───── WHAT'S INSIDE ───── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">What's Inside</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build resilient automation—stolen from real deployments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {whatsInside.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full bg-card/50 backdrop-blur-xl border-blue-500/10 hover:border-blue-500/30 transition-all">
                  <CardContent className="p-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-[hsl(75,100%,50%)]/20 flex items-center justify-center mx-auto mb-6">
                      <item.icon className="h-7 w-7 text-blue-400" />
                    </div>
                    <p className="text-lg font-semibold">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── WHY THIS MATTERS ───── */}
      <section className="py-24 px-6 bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">Why This Matters</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Most teams build one-off automations that fail at handoffs and exceptions. 
              These patterns emphasize integration, resilience, and scalability—drawing from 
              real deployments to deliver <span className="font-semibold text-foreground">20–50% efficiency gains</span>.
            </p>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-3 gap-6 text-center">
                  {[
                    { stat: "40–50%", label: "Processing time reduced" },
                    { stat: "70%", label: "Error reduction" },
                    { stat: "15+", label: "Proven patterns" },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="text-2xl md:text-3xl font-bold text-blue-400">{s.stat}</div>
                      <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ───── OPT-IN CTA ───── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Ready to steal these workflows?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get the full swipe file with all 15 patterns, failure analysis, and implementation tips.
            </p>
            {pdfUrl ? (
              <Button
                size="lg"
                onClick={() => window.open(pdfUrl, "_blank")}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-10 py-6 text-lg rounded-xl"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Again
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleGetSwipeFile}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-10 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/25"
              >
                Get the swipe file
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            <p className="mt-4 text-sm text-muted-foreground">Instant access · No spam</p>
          </motion.div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="py-24 px-6 bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold font-heading mb-4">Frequently Asked Questions</h2>
          </motion.div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-blue-500/10">
                <AccordionTrigger className="text-left hover:text-blue-400 text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ───── LEAD CAPTURE MODAL ───── */}
      <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Get the Swipe File</DialogTitle>
            <DialogDescription>
              Enter your details to unlock all 15 workflow patterns and download the full PDF.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sf-name">Name *</Label>
                <Input
                  id="sf-name"
                  placeholder="Your name"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sf-email">Work Email *</Label>
                <Input
                  id="sf-email"
                  type="email"
                  placeholder="you@company.com"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sf-company">Company</Label>
              <Input
                id="sf-company"
                placeholder="Your company"
                value={leadForm.company}
                onChange={(e) => setLeadForm((p) => ({ ...p, company: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sf-role">Your Role</Label>
                <Select value={leadForm.role} onValueChange={(v) => setLeadForm((p) => ({ ...p, role: v }))}>
                  <SelectTrigger id="sf-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sf-industry">Industry</Label>
                <Select value={leadForm.industry} onValueChange={(v) => setLeadForm((p) => ({ ...p, industry: v }))}>
                  <SelectTrigger id="sf-industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
              onClick={handleSubmit}
              disabled={isGeneratingPdf || !leadForm.name.trim() || !leadForm.email.trim()}
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PDF…
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Unlock & Download
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

export default OrchestrationSwipeFile;
