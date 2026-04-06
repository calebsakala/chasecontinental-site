/*
  LEAD MAGNET #3 — Ops-Led AI Transformation Playbook
  Slug: /resources/transformation-playbook
  Accent: emerald/teal | Highlight: gold
*/

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Target,
  Workflow,
  BarChart3,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Users,
  Lightbulb,
  Shield,
  Zap,
  Calendar,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { queueResourceEmail } from "@/lib/resourceEmail";

import playbookCover from "@/assets/playbook/playbook-cover.jpg";
import playbookPages from "@/assets/playbook/playbook-pages.jpg";
import workflowLines from "@/assets/playbook/workflow-lines.jpg";

/* ─── Constants ─── */
const META_TITLE = "AI Transformation Playbook (Free) | Chase Continental";
const META_DESC =
  "A practical guide to ship reliable AI automation—without failed pilots, wasted budget, or chaos.";
const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";
const ASSET_KEY = "transformation-playbook";
const PLAYBOOK_FILE_PATH =
  "transformation-playbook/AI-Transformation-Playbook.pdf";

const getSessionId = () => {
  let sid = sessionStorage.getItem("cc_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("cc_session_id", sid);
  }
  return sid;
};

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
  "Manufacturing",
  "Financial Services",
  "Healthcare",
  "Professional Services",
  "Technology",
  "Other",
];

const WHATS_INSIDE = [
  {
    icon: AlertTriangle,
    text: "The 5 reasons AI pilots fail in production (and how to prevent each)",
  },
  {
    icon: CheckCircle2,
    text: "A simple workflow selection checklist (what to automate first)",
  },
  {
    icon: Shield,
    text: 'The "exceptions + approvals" design pattern (so it doesn\'t break)',
  },
  { icon: Workflow, text: "Implementation checklist (from build to rollout)" },
  { icon: BarChart3, text: "Measurement: how to prove ROI and reliability" },
];

const WHY_THIS_WORKS = [
  {
    icon: Workflow,
    title: "We start with the workflow, not the tool",
    desc: "Most transformations fail because teams buy tools first. We map the workflow, identify exceptions, then select the right automation approach.",
  },
  {
    icon: Shield,
    title: "We design for edge cases up front",
    desc: "Exceptions kill automation. We build approval flows, fallback paths, and human escalation into the design—before you hit production.",
  },
  {
    icon: BarChart3,
    title: "We measure outcomes, then expand",
    desc: "Ship fast, prove value, expand systematically. Every automation has clear success metrics tracked from day one.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Is this technical?",
    a: "No. This playbook is written for operations leaders and transformation leads—not engineers. It focuses on strategy, process design, and execution frameworks.",
  },
  {
    q: "How long is it?",
    a: "About 25 pages. It's designed to be actionable, not academic. You can read it in one sitting and start applying it the same day.",
  },
  {
    q: "Who is it for?",
    a: "Operations leaders, transformation managers, and senior executives who want AI automation that actually works—without failed pilots or wasted budget.",
  },
  {
    q: "What if we have messy data?",
    a: "The playbook specifically addresses this. We show you how to identify data dependencies, work around quality issues, and build validation into your workflows.",
  },
  {
    q: "Do you implement this?",
    a: "Yes. Chase Continental implements the exact approach described in this playbook. If you want help, book a call after downloading.",
  },
  {
    q: "What happens after download?",
    a: "You'll get immediate access to the PDF. Optionally, you can book a free strategy call to discuss how this applies to your specific workflows.",
  },
];

const trackEvent = async (
  eventName: string,
  payload: Record<string, unknown> = {},
  leadId?: string,
) => {
  try {
    await supabase.from("events").insert({
      event_name: eventName,
      session_id: getSessionId(),
      lead_id: leadId || null,
      event_payload: { ...payload, asset_key: ASSET_KEY },
    });
  } catch (e) {
    console.error("Event tracking error:", e);
  }
};

/* ─── Component ─── */
const TransformationPlaybook = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<"landing" | "complete">("landing");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Lead form
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    vertical: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    trackEvent("page_view");
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Bot trap
    if (!leadForm.name || !leadForm.email) {
      toast({
        title: "Please fill in your name and email",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const trimmedName = leadForm.name.trim();
      const normalizedEmail = leadForm.email.toLowerCase().trim();
      const company = leadForm.company.trim() || null;
      let browserDownloadStarted = false;

      // Check existing lead
      const { data: existing } = await supabase
        .from("leads")
        .select("id")
        .eq("email", normalizedEmail)
        .maybeSingle();

      let finalLeadId = existing?.id;

      if (!existing) {
        const { data: newLead, error: leadErr } = await supabase
          .from("leads")
          .insert({
            name: trimmedName,
            email: normalizedEmail,
            company,
            role: leadForm.role || null,
            vertical: leadForm.vertical || null,
          })
          .select("id")
          .single();

        if (leadErr) throw leadErr;
        finalLeadId = newLead.id;
      }

      setLeadId(finalLeadId);
      await trackEvent("lead_submit", { lead_id: finalLeadId }, finalLeadId);

      // Get signed URL for PDF
      await trackEvent("download_start", {}, finalLeadId);
      const { data: signedData, error: signErr } = await supabase.storage
        .from("lead-magnets")
        .createSignedUrl(PLAYBOOK_FILE_PATH, 3600);

      if (signErr || !signedData?.signedUrl) {
        console.error("Signed URL error:", signErr);
      } else {
        setPdfUrl(signedData.signedUrl);
        try {
          const pdfResponse = await fetch(signedData.signedUrl);
          if (!pdfResponse.ok) throw new Error("PDF download failed");
          const pdfBlob = await pdfResponse.blob();
          const downloadUrl = URL.createObjectURL(pdfBlob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = "AI-Transformation-Playbook.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
          browserDownloadStarted = true;
        } catch (downloadError) {
          console.error("Browser download fallback triggered:", downloadError);
        }
      }

      // Record download
      await supabase.from("downloads").insert({
        lead_id: finalLeadId,
        asset_key: ASSET_KEY,
        file_path: PLAYBOOK_FILE_PATH,
        downloaded_at: new Date().toISOString(),
      });

      await trackEvent("download_complete", {}, finalLeadId);
      queueResourceEmail({
        assetKey: ASSET_KEY,
        leadId: finalLeadId,
        name: trimmedName,
        email: normalizedEmail,
        company,
      });
      setPhase("complete");

      toast({
        title: "Success!",
        description: browserDownloadStarted
          ? "Your playbook is ready. Your browser download should start automatically."
          : "Your playbook is ready. If the download did not start, use the private link we send by email.",
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Please try again.";

      console.error("Submit error:", err);
      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookCall = () => {
    trackEvent("book_call_click", {}, leadId || undefined);
    window.open(BOOK_CALL_URL, "_blank");
  };

  return (
    <>
      <Helmet>
        <title>{META_TITLE}</title>
        <meta name="description" content={META_DESC} />
        <meta property="og:title" content={META_TITLE} />
        <meta property="og:description" content={META_DESC} />
        <meta name="twitter:title" content={META_TITLE} />
        <meta name="twitter:description" content={META_DESC} />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {/* ─── Hero Section ─── */}
        <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <img
              src={workflowLines}
              alt=""
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          </div>

          <div className="mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Copy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block mb-4 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Free Playbook
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
                  A practical playbook to ship AI automation—
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    without failed pilots.
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
                  The step-by-step approach we use to move from manual work to
                  reliable automation that teams actually adopt.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={scrollToForm}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download the playbook
                  </Button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground/70">
                  Instant access. No spam.
                </p>
              </motion.div>

              {/* Right: Playbook Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl" />

                  {/* Main playbook cover */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm">
                    <img
                      src={playbookCover}
                      alt="AI Transformation Playbook Cover"
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Floating pages preview */}
                  <motion.div
                    className="absolute -bottom-8 -right-8 w-2/3 rounded-xl overflow-hidden shadow-xl border border-white/10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <img
                      src={playbookPages}
                      alt="Playbook interior pages"
                      className="w-full h-auto"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Stats Band ─── */}
        <section className="py-12 border-y border-border/50 bg-muted/30">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-amber-400">
                  48%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  of digital initiatives meet outcomes
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  — Gartner, 2024
                </p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-amber-400">
                  $4T
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  global DX spend by 2027
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">— IDC</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-3xl md:text-4xl font-bold text-amber-400">
                  70%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  of AI pilots never reach production
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  — Industry estimate
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── What's Inside ─── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block mb-3 text-emerald-400 font-semibold text-sm uppercase tracking-wider">
                What's inside
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading">
                Everything you need to ship automation that works
              </h2>
            </motion.div>

            <div className="grid gap-4">
              {WHATS_INSIDE.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-xl bg-card/50 border border-border/50 hover:border-emerald-400/30 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-lg font-medium pt-1.5">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Why This Works ─── */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block mb-3 text-emerald-400 font-semibold text-sm uppercase tracking-wider">
                Why this works
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading">
                The approach that makes transformation stick
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {WHY_THIS_WORKS.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-emerald-400/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/5 to-teal-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center mb-4">
                      <card.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                    <p className="text-muted-foreground">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Opt-in Form / Thank You ─── */}
        <section ref={formRef} className="py-20 md:py-28" id="download">
          <div className="mx-auto max-w-4xl px-6">
            <AnimatePresence mode="wait">
              {phase === "landing" ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative"
                >
                  {/* Glow */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-2xl -z-10" />

                  <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 md:p-12">
                    <div className="text-center mb-8">
                      <BookOpen className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                      <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">
                        Get your free playbook
                      </h2>
                      <p className="text-muted-foreground">
                        Enter your details below for instant access.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <input
                        type="text"
                        name="website"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        className="hidden"
                        tabIndex={-1}
                        autoComplete="off"
                      />

                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            value={leadForm.name}
                            onChange={(e) =>
                              setLeadForm({ ...leadForm, name: e.target.value })
                            }
                            required
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Work email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            value={leadForm.email}
                            onChange={(e) =>
                              setLeadForm({
                                ...leadForm,
                                email: e.target.value,
                              })
                            }
                            required
                            className="mt-1.5"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          placeholder="Your company"
                          value={leadForm.company}
                          onChange={(e) =>
                            setLeadForm({
                              ...leadForm,
                              company: e.target.value,
                            })
                          }
                          className="mt-1.5"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <select
                            id="role"
                            value={leadForm.role}
                            onChange={(e) =>
                              setLeadForm({ ...leadForm, role: e.target.value })
                            }
                            className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="">Select your role</option>
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="vertical">Industry</Label>
                          <select
                            id="vertical"
                            value={leadForm.vertical}
                            onChange={(e) =>
                              setLeadForm({
                                ...leadForm,
                                vertical: e.target.value,
                              })
                            }
                            className="mt-1.5 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <option value="">Select your industry</option>
                            {VERTICAL_OPTIONS.map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                      >
                        {submitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-5 w-5" />
                            Download the playbook
                          </>
                        )}
                      </Button>

                      <p className="text-center text-xs text-muted-foreground/70">
                        By downloading, you agree to receive occasional emails
                        from Chase Continental. Unsubscribe anytime.
                      </p>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  {/* Glow */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-2xl -z-10" />

                  <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 md:p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">
                      Your playbook is ready!
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      Your browser download should start automatically. We are
                      also sending a private access link to your inbox so you
                      can reopen the playbook later.
                    </p>

                    {pdfUrl && (
                      <Button
                        size="lg"
                        asChild
                        className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                      >
                        <a
                          href={pdfUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="mr-2 h-5 w-5" />
                          Download PDF
                        </a>
                      </Button>
                    )}

                    {!pdfUrl && (
                      <p className="mb-8 text-sm text-muted-foreground">
                        The browser download did not start automatically. Use
                        the emailed link once it arrives, or submit the form
                        again from this page if you need a fresh attempt.
                      </p>
                    )}

                    {/* 3-Step Start Here */}
                    <div className="border-t border-border/50 pt-8 mt-8">
                      <h3 className="text-lg font-bold mb-6">Start here:</h3>
                      <div className="grid md:grid-cols-3 gap-6 text-left">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-400/10 flex items-center justify-center text-emerald-400 font-bold text-sm">
                            1
                          </div>
                          <div>
                            <p className="font-medium">Read the playbook</p>
                            <p className="text-sm text-muted-foreground">
                              ~30 min to understand the full approach
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-400/10 flex items-center justify-center text-emerald-400 font-bold text-sm">
                            2
                          </div>
                          <div>
                            <p className="font-medium">Pick one workflow</p>
                            <p className="text-sm text-muted-foreground">
                              Use the selection checklist on page 8
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-400/10 flex items-center justify-center text-emerald-400 font-bold text-sm">
                            3
                          </div>
                          <div>
                            <p className="font-medium">Book a strategy call</p>
                            <p className="text-sm text-muted-foreground">
                              We'll help you apply it to your context
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Book Call CTA */}
                    <div className="mt-8 pt-8 border-t border-border/50">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={handleBookCall}
                        className="border-emerald-400/30 hover:bg-emerald-400/10 hover:border-emerald-400/50"
                      >
                        <Calendar className="mr-2 h-5 w-5" />
                        Book a free strategy call
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="mx-auto max-w-3xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading">
                Frequently asked questions
              </h2>
            </motion.div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-border/50 rounded-xl overflow-hidden bg-card/50"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium pr-4">{item.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
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
                        <div className="px-5 pb-5 text-muted-foreground">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
                Ready to ship automation that actually works?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Download the playbook and start building reliable AI automation
                today.
              </p>
              <Button
                size="lg"
                onClick={scrollToForm}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
              >
                <Download className="mr-2 h-5 w-5" />
                Get the free playbook
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TransformationPlaybook;
