/*
  LM06 — Peak Season Automation Survival Guide
  Slug: /resources/peak-season-survival-guide
  Accent: cobalt | Highlight: emerald/teal | Gold accents
*/

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Lock,
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  BarChart3,
  ChevronDown,
  Snowflake,
  Gift,
  ShieldCheck,
  TrendingUp,
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
import type { Database, Json } from "@/integrations/supabase/types";
import { queueResourceEmail } from "@/lib/resourceEmail";
import { toast } from "sonner";

import heroImage from "@/assets/peak-season-hero.jpg";

const ASSET_KEY = "peak-season-survival-guide";
const CHASE_AGENTS_URL = "https://chaseagents.com";

type Lm06EventInsert = Database["public"]["Tables"]["lm06_events"]["Insert"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type Lm06DownloadInsert =
  Database["public"]["Tables"]["lm06_downloads"]["Insert"];
type DownloadInsert = Database["public"]["Tables"]["downloads"]["Insert"];

/* ── session ── */
const getSessionId = () => {
  let sid = sessionStorage.getItem("peak_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("peak_session_id", sid);
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
  "Strategy / Operations Lead",
  "Business Analyst",
  "Team Lead / Senior Manager",
  "Other",
];

const industryOptions = [
  "E-commerce & Retail",
  "Healthcare & Life Sciences",
  "Financial Operations",
  "Manufacturing",
  "Logistics & Supply Chain",
  "BPO & Outsourcing",
  "Technology & SaaS",
  "Other",
];

const peakSeasonMonthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const peakChallengeOptions = [
  "Inventory sync",
  "Fulfillment throughput",
  "Shipping delays",
  "Returns volume",
  "Support ticket spikes",
  "Forecasting accuracy",
  "Other",
];

/* ── failure modes ── */
const failureModes = [
  {
    title: "Inventory Sync Failures",
    desc: "API lags and database bottlenecks cause real-time stock discrepancies, leading to overselling and stockouts under high volume.",
    icon: AlertTriangle,
  },
  {
    title: "Order Processing Delays",
    desc: "Manual or semi-automated systems get overwhelmed — picking, packing and labeling bottleneck as volume spikes.",
    icon: TrendingUp,
  },
  {
    title: "Shipping & Delivery Disruptions",
    desc: "Carrier integrations break under load: delayed label generation, routing errors and missed SLAs.",
    icon: AlertTriangle,
  },
  {
    title: "Staff & Labor Shortages",
    desc: "Even automated systems need human oversight. Shortages lead to unmonitored failures and slow resolutions.",
    icon: AlertTriangle,
  },
  {
    title: "Website & System Overloads",
    desc: "E-commerce platforms crash or slow down, abandoning carts. Poor load balancing in automation layers exacerbates this.",
    icon: BarChart3,
  },
  {
    title: "Returns Processing Overload",
    desc: "Increased returns flood systems — automation fails to handle exceptions like damaged goods or fraud.",
    icon: AlertTriangle,
  },
  {
    title: "Demand Forecasting Inaccuracies",
    desc: "AI forecasting tools mispredict spikes, causing imbalanced resources and cascading failures.",
    icon: TrendingUp,
  },
];

/* ── checklist ── */
const checklistItems = [
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
  "Connect predictive analytics for demand adjustments.",
  "Establish communication protocols for delays and updates.",
];

/* ── FAQ ── */
const faqItems = [
  {
    q: "What is peak season?",
    a: "High-demand periods like holidays when order volumes spike significantly — typically Black Friday through Q1 returns.",
  },
  {
    q: "Who is this guide for?",
    a: "Logistics and e-commerce operations leaders who need to keep automated workflows stable under extreme load.",
  },
  {
    q: "Is it really free?",
    a: "Yes, instant access after providing your email. No credit card required.",
  },
  {
    q: "How long is the guide?",
    a: "10 pages of practical advice covering failure modes, a 12-item checklist, and monitoring/escalation essentials.",
  },
];

/* ══════════════════════════════════════════ */
const PeakSeasonSurvivalGuide = () => {
  const [showOptIn, setShowOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    industry: "",
    peakSeasonMonth: "",
    peakChallenge: "",
  });

  /* track page view */
  useEffect(() => {
    const pageViewEvent: Lm06EventInsert = {
      event_type: "page_view",
      event_payload: {
        page: "peak-season-survival-guide",
        session: getSessionId(),
      },
    };

    supabase.from("lm06_events").insert([pageViewEvent]);
  }, []);

  const trackEvent = async (type: string, payload: Json = {}) => {
    const eventRecord: Lm06EventInsert = {
      event_type: type,
      event_payload:
        payload && typeof payload === "object" && !Array.isArray(payload)
          ? { ...payload, session: getSessionId() }
          : { session: getSessionId() },
    };

    await supabase.from("lm06_events").insert([eventRecord]);
  };

  const handleCta = () => {
    trackEvent("cta_click", { location: "hero" });
    setShowOptIn(true);
  };

  const handleSubmit = async () => {
    if (
      !leadForm.name.trim() ||
      !leadForm.email.trim() ||
      !leadForm.role ||
      !leadForm.industry
    ) {
      toast.error("Please fill in Name, Email, Role, and Industry.");
      return;
    }
    setLoading(true);
    try {
      const trimmedName = leadForm.name.trim();
      const normalizedEmail = leadForm.email.toLowerCase().trim();
      const company = leadForm.company.trim() || null;

      /* upsert lead */
      const { data: existingLead } = await supabase
        .from("lm06_leads")
        .select("id")
        .eq("email", normalizedEmail)
        .maybeSingle();

      let leadId: string;
      if (existingLead) {
        leadId = existingLead.id;
      } else {
        const { data: newLead, error } = await supabase
          .from("lm06_leads")
          .insert([
            {
              name: trimmedName,
              email: normalizedEmail,
              company,
              role: leadForm.role,
              vertical: leadForm.industry,
              peak_season_month: leadForm.peakSeasonMonth || null,
              peak_challenge: leadForm.peakChallenge || null,
            },
          ])
          .select("id")
          .single();
        if (error) throw error;
        leadId = newLead!.id;
      }

      /* also insert into main leads table */
      const { data: mainLead, error: mainLeadError } = await supabase
        .from("leads")
        .upsert(
          [
            {
              name: trimmedName,
              email: normalizedEmail,
              company,
              role: leadForm.role,
              vertical: leadForm.industry,
            },
          ],
          { onConflict: "email" },
        )
        .select("id")
        .single();
      if (mainLeadError) throw mainLeadError;
      const mainLeadId = mainLead!.id;

      /* log event */
      await trackEvent("lead_submit", { lead_id: leadId });
      const leadSubmitEvent: EventInsert = {
        event_name: "lead_submit",
        event_payload: {
          asset: ASSET_KEY,
          lead_id: mainLeadId,
          peak_season_month: leadForm.peakSeasonMonth || null,
          peak_challenge: leadForm.peakChallenge || null,
        },
        lead_id: mainLeadId,
      };

      await supabase
        .from("events")
        .insert([leadSubmitEvent], { ignoreDuplicates: true });

      /* generate PDF */
      toast.success("Generating your guide…");
      const { data, error } = await supabase.functions.invoke(
        "generate-peak-season-pdf",
        {
          body: {
            lead_id: mainLeadId,
            name: trimmedName,
            email: normalizedEmail,
            company,
          },
        },
      );

      if (error) throw new Error(error.message);

      const pdfUrl = data?.pdf_url;
      const filePath = data?.file_path;

      if (!pdfUrl || !filePath) {
        throw new Error(
          "Peak season guide generation returned an incomplete response.",
        );
      }

      const lm06Download: Lm06DownloadInsert = {
        lead_id: leadId,
        pdf_version: "1.0",
      };
      const downloadRecord: DownloadInsert = {
        asset_key: ASSET_KEY,
        lead_id: mainLeadId,
        file_path: filePath,
        downloaded_at: new Date().toISOString(),
      };
      const downloadEvent: EventInsert = {
        event_name: "download_start",
        event_payload: {
          asset: ASSET_KEY,
          file_path: filePath,
        },
        lead_id: mainLeadId,
      };

      await supabase.from("lm06_downloads").insert([lm06Download]);
      await supabase.from("downloads").insert([downloadRecord]);
      await supabase.from("events").insert([downloadEvent]);

      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "Peak-Season-Survival-Guide.pdf";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.click();

      queueResourceEmail({
        assetKey: ASSET_KEY,
        leadId: mainLeadId,
        name: trimmedName,
        email: normalizedEmail,
        company,
        filePath,
      });

      toast.success(
        "Your guide is downloading! Your email copy is on the way.",
      );
      setShowOptIn(false);
    } catch (err: unknown) {
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
          Peak Season Automation Survival Guide (Free) | Chase Agents
        </title>
        <meta
          name="description"
          content="Keep workflows stable when volume spikes with an operating-layer checklist for peak-season reliability."
        />
      </Helmet>
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Peak season volume surge dashboard"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background/95" />

        {/* subtle seasonal accents */}
        <Snowflake className="absolute top-20 left-[10%] w-6 h-6 text-white/10 animate-pulse" />
        <Snowflake className="absolute top-40 right-[15%] w-4 h-4 text-white/8 animate-pulse delay-700" />
        <Gift className="absolute bottom-32 left-[20%] w-5 h-5 text-white/8 animate-pulse delay-300" />
        <Snowflake className="absolute bottom-48 right-[25%] w-5 h-5 text-white/10 animate-pulse delay-1000" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 rounded-full bg-[hsl(var(--teal))]/90 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white"
          >
            Free Guide
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading text-white leading-tight mb-6"
          >
            Peak season breaks{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              weak automation.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Learn the failure modes that show up under volume — and the fixes
            that keep delivery stable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={handleCta}
              size="lg"
              className="bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/80 text-white text-lg px-10 py-6 rounded-xl shadow-lg shadow-[hsl(var(--teal))]/25"
            >
              Download the guide <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="mt-3 text-sm text-gray-400 italic">
              Instant access. No spam.
            </p>

            <div className="mt-5">
              <Button
                variant="outline"
                onClick={() => window.open(CHASE_AGENTS_URL, "_blank")}
                className="border-white/40 bg-white/5 text-white hover:border-white/60 hover:bg-white/15"
              >
                Explore Chase Agents
              </Button>
            </div>
          </motion.div>
        </div>

        {/* scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6 text-white/40" />
        </motion.div>
      </section>

      {/* ═══ WHAT YOU'LL LEARN ═══ */}
      <section className="py-24 px-6 bg-card">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              What you'll learn
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Practical strategies to bulletproof your workflows before the next
              volume surge.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: AlertTriangle,
                title: "7 Failure Modes at Peak",
                desc: "The exact breakpoints that surface when order volume spikes — and why most automation crumbles.",
              },
              {
                icon: ClipboardCheck,
                title: "A Pre-Peak Checklist",
                desc: "12 items to audit before the surge hits. From carrier capacity to returns workflows.",
              },
              {
                icon: BarChart3,
                title: "Monitoring + Escalation",
                desc: "How to set up dashboards, alerts and tiered escalation so nothing slips through.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card hover:shadow-lg transition-shadow group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[hsl(var(--teal))] to-[hsl(var(--cyan))]" />
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-[hsl(var(--teal))]/10 flex items-center justify-center mb-6">
                      <card.icon className="w-7 h-7 text-[hsl(var(--teal))]" />
                    </div>
                    <h3 className="text-xl font-bold font-heading mb-3">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {card.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7 FAILURE MODES ═══ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block mb-4 rounded-full border border-destructive/30 bg-destructive/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-destructive">
              Failure Points
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              7 ways peak season breaks automation
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {failureModes.map((mode, i) => (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full border-border/50 hover:border-destructive/30 transition-colors group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mt-1">
                        <span className="text-destructive font-bold text-sm">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold font-heading mb-2">
                          {mode.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRE-PEAK CHECKLIST TEASER ═══ */}
      <section className="py-24 px-6 bg-card relative overflow-hidden">
        {/* subtle seasonal border accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 via-[hsl(var(--teal))]/50 to-amber-500/50" />

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block mb-4 rounded-full border border-[hsl(var(--teal))]/30 bg-[hsl(var(--teal))]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--teal))]">
              Checklist Preview
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Pre-peak readiness checklist
            </h2>
            <p className="text-muted-foreground">
              5 of 12 items shown. Download the guide for the full list.
            </p>
          </motion.div>

          <div className="space-y-4 mb-8">
            {checklistItems.slice(0, 5).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-background"
              >
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--teal))]/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(var(--teal))]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Item {i + 1}
                  </span>
                  <p className="font-medium">{item}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* locked items */}
          <div className="relative">
            <div className="space-y-4 blur-[6px] select-none pointer-events-none">
              {checklistItems.slice(5, 9).map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-background"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      Item {i + 6}
                    </span>
                    <p className="font-medium">{item}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/60 backdrop-blur-sm rounded-2xl">
              <Lock className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-semibold text-center max-w-sm mb-4">
                Download the full guide to access the complete 12-item checklist
                and more.
              </p>
              <Button
                onClick={handleCta}
                className="bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/80 text-white"
              >
                <Download className="w-4 h-4 mr-2" /> Unlock the full guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OPT-IN + FAQ ═══ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* Opt-in form inline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-heading mb-2">
              Get the guide
            </h2>
            <p className="text-muted-foreground mb-8">
              Fill in your details for instant access.
            </p>

            <div className="space-y-5">
              <div>
                <Label htmlFor="peak-name">Name *</Label>
                <Input
                  id="peak-name"
                  placeholder="Jane Smith"
                  value={leadForm.name}
                  onChange={(e) =>
                    setLeadForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="peak-email">Work email *</Label>
                <Input
                  id="peak-email"
                  type="email"
                  placeholder="jane@company.com"
                  value={leadForm.email}
                  onChange={(e) =>
                    setLeadForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="peak-company">Company</Label>
                <Input
                  id="peak-company"
                  placeholder="Acme Inc."
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
                    {industryOptions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Primary peak month</Label>
                <Select
                  value={leadForm.peakSeasonMonth}
                  onValueChange={(v) =>
                    setLeadForm((p) => ({ ...p, peakSeasonMonth: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {peakSeasonMonthOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Biggest peak challenge</Label>
                <Select
                  value={leadForm.peakChallenge}
                  onValueChange={(v) =>
                    setLeadForm((p) => ({ ...p, peakChallenge: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select challenge" />
                  </SelectTrigger>
                  <SelectContent>
                    {peakChallengeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/80 text-white py-6 text-lg"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Download className="w-5 h-5 mr-2" />
                )}
                {loading ? "Generating…" : "Get the Guide"}
              </Button>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold font-heading mb-2">FAQ</h2>
            <p className="text-muted-foreground mb-8">
              Common questions about the guide.
            </p>

            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-border/50 rounded-xl px-5 overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ═══ OPT-IN DIALOG (from CTA buttons) ═══ */}
      <AnimatePresence>
        {showOptIn && (
          <Dialog open={showOptIn} onOpenChange={setShowOptIn}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">
                  Download the Survival Guide
                </DialogTitle>
                <DialogDescription>
                  Enter your details for instant access to the PDF.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="modal-name">Name *</Label>
                  <Input
                    id="modal-name"
                    placeholder="Jane Smith"
                    value={leadForm.name}
                    onChange={(e) =>
                      setLeadForm((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="modal-email">Work email *</Label>
                  <Input
                    id="modal-email"
                    type="email"
                    placeholder="jane@company.com"
                    value={leadForm.email}
                    onChange={(e) =>
                      setLeadForm((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="modal-company">Company</Label>
                  <Input
                    id="modal-company"
                    placeholder="Acme Inc."
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
                      {industryOptions.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Primary peak month</Label>
                  <Select
                    value={leadForm.peakSeasonMonth}
                    onValueChange={(v) =>
                      setLeadForm((p) => ({ ...p, peakSeasonMonth: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {peakSeasonMonthOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Biggest peak challenge</Label>
                  <Select
                    value={leadForm.peakChallenge}
                    onValueChange={(v) =>
                      setLeadForm((p) => ({ ...p, peakChallenge: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select challenge" />
                    </SelectTrigger>
                    <SelectContent>
                      {peakChallengeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[hsl(var(--teal))] hover:bg-[hsl(var(--teal))]/80 text-white py-6 text-lg"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Download className="w-5 h-5 mr-2" />
                  )}
                  {loading ? "Generating…" : "Get the Guide"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default PeakSeasonSurvivalGuide;
