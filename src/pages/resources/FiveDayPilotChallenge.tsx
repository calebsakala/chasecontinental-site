/*
  LM08 — 5-Day Automation Pilot Challenge
  Slug: /resources/5-day-pilot-challenge
  Accent: teal/cyan | Highlight: gold | Deep navy base
*/

import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  ChevronDown,
  Calendar,
  Target,
  GitBranch,
  BarChart3,
  Rocket,
  CheckCircle2,
  Clock,
  Users,
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

import heroImage from "@/assets/pilot-challenge-hero.jpg";

type ChallengeSignupInsert =
  Database["public"]["Tables"]["lm08_challenge_signups"]["Insert"];
type ChallengeSignupUpdate =
  Database["public"]["Tables"]["lm08_challenge_signups"]["Update"];
type ChallengeProgressInsert =
  Database["public"]["Tables"]["lm08_challenge_progress"]["Insert"];
type DownloadInsert = Database["public"]["Tables"]["downloads"]["Insert"];
type Lm08EventInsert = Database["public"]["Tables"]["lm08_events"]["Insert"];

/* ── helpers ── */
const trackEvent = async (
  eventType: string,
  signupId?: string,
  payload?: Json,
) => {
  try {
    const eventRecord: Lm08EventInsert = {
      event_type: eventType,
      signup_id: signupId || null,
      event_payload: payload || {},
    };

    await supabase.from("lm08_events").insert([
      {
        ...eventRecord,
      },
    ]);
  } catch (_) {
    /* silent */
  }
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

/* ── guide sections ── */
const guideSectionCards = [
  {
    section: 1,
    title: "Pick the workflow",
    desc: "Identify repetitive, high-volume, rule-based tasks. Start with process mapping to find bottlenecks and manual errors. Examples: invoice processing, data entry, report generation.",
    stat: "Reduce processing time by up to 77%",
    icon: Target,
    color: "hsl(190, 95%, 45%)",
  },
  {
    section: 2,
    title: "Map the real steps",
    desc: "Document the current process step by step using flowcharts. Involve team members for accuracy to identify redundancies and inefficiencies.",
    stat: "Boost productivity by up to 90%",
    icon: GitBranch,
    color: "hsl(200, 100%, 50%)",
  },
  {
    section: 3,
    title: "Define exceptions + approvals",
    desc: "Identify potential exceptions—unusual cases, errors—and define approval workflows. Design for flexibility to handle real-world variations.",
    stat: "Reduce errors by up to 70%",
    icon: CheckCircle2,
    color: "hsl(160, 84%, 39%)",
  },
  {
    section: 4,
    title: "Define success metrics",
    desc: "Set measurable KPIs using SMART goals. Examples: cycle time reduction, error rates, cost savings, productivity increase.",
    stat: "ROI of 30–200% in year one",
    icon: BarChart3,
    color: "hsl(45, 80%, 55%)",
  },
  {
    section: 5,
    title: "Rollout plan + next steps",
    desc: "Develop a phased rollout: start small, gather feedback, scale up. Include training and change management. Book a call for expert help.",
    stat: "80% of finance tasks can be automated",
    icon: Rocket,
    color: "hsl(270, 60%, 55%)",
  },
];

/* ── FAQ ── */
const faqItems = [
  {
    q: "What do I get after signing up?",
    a: "You get the full 5-Day Automation Pilot Guide immediately by email and browser download, plus one follow-up email 5 days later.",
  },
  {
    q: "Do I need technical skills?",
    a: "No. The focus is on strategic planning—no coding required.",
  },
  {
    q: "How much time does it take?",
    a: "The guide is designed as five focused planning sections you can work through in short sessions of about 10 minutes each.",
  },
  {
    q: "When does it start?",
    a: "Immediately. As soon as you sign up, we generate the guide, open it for you, and send the same guide to your inbox.",
  },
  {
    q: "What if my industry is unique?",
    a: "Automation benefits apply across all sectors. 60% of companies are already using it.",
  },
  {
    q: "Can I get help?",
    a: "Yes. The guide points you to the next step, and the follow-up email includes the same website and booking options if you want to talk through your pilot plan.",
  },
  { q: "Is there a cost?", a: "Completely free. No credit card required." },
  {
    q: "What tools are needed?",
    a: "None—this is strategic planning. Just a document or notepad.",
  },
  {
    q: "How do I measure success?",
    a: "Section 4 of the guide covers success metrics like error reduction, time savings, and ROI.",
  },
  {
    q: "What happens after I finish the guide?",
    a: "Use your pilot outline to move into rollout planning, and use the follow-up email if you want support pressure-testing the next step.",
  },
];

const FiveDayPilotChallenge = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    industry: "",
  });

  useEffect(() => {
    trackEvent("page_view", undefined, { page: "5-day-pilot-challenge" });
  }, []);

  const openSignup = () => {
    trackEvent("cta_click", undefined, { cta: "hero" });
    setShowModal(true);
  };

  const handleSignup = async () => {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.role ||
      !form.industry
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const firstName = form.firstName.trim();
      const lastName = form.lastName.trim();
      const normalizedEmail = form.email.trim().toLowerCase();
      const company = form.company.trim() || null;
      const fullName = `${firstName} ${lastName}`.trim();
      const nowIso = new Date().toISOString();
      const nextFollowUpAt = new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .upsert(
          [
            {
              name: fullName,
              email: normalizedEmail,
              company,
              role: form.role,
              vertical: form.industry,
            },
          ],
          { onConflict: "email" },
        )
        .select("id")
        .single();

      if (leadError) throw leadError;

      const { data: existing } = await supabase
        .from("lm08_challenge_signups")
        .select("id, lead_id")
        .eq("email", normalizedEmail)
        .maybeSingle();

      let signupId = existing?.id;
      let progressStatus = "active";

      if (!signupId) {
        const signupRecord: ChallengeSignupInsert = {
          first_name: firstName,
          last_name: lastName,
          email: normalizedEmail,
          company,
          role: form.role,
          vertical: form.industry,
          signup_date: nowIso,
          lead_id: lead.id,
          updated_at: nowIso,
        };

        const { data: newSignup, error } = await supabase
          .from("lm08_challenge_signups")
          .insert([signupRecord])
          .select("id")
          .single();
        if (error) throw error;
        signupId = newSignup.id;
      } else {
        const signupUpdate: ChallengeSignupUpdate = {
          lead_id: lead.id,
          first_name: firstName,
          last_name: lastName,
          company,
          role: form.role,
          vertical: form.industry,
          signup_date: nowIso,
          updated_at: nowIso,
        };

        await supabase
          .from("lm08_challenge_signups")
          .update(signupUpdate)
          .eq("id", signupId);
      }

      const { data: existingProgress } = await supabase
        .from("lm08_challenge_progress")
        .select("status")
        .eq("signup_id", signupId)
        .maybeSingle();

      progressStatus =
        existingProgress?.status === "unsubscribed" ? "unsubscribed" : "active";

      await trackEvent("challenge_signup", signupId, {
        source: "5-day-pilot-challenge",
      });

      await supabase.from("events").insert({
        lead_id: lead.id,
        event_name:
          existingProgress?.status === "active"
            ? "challenge_reengaged"
            : "challenge_signup",
        event_payload: {
          signup_id: signupId,
        },
      });

      const res = await supabase.functions.invoke("generate-challenge-pdf", {
        body: { signupId, name: fullName, email: normalizedEmail },
      });

      if (res.error) throw res.error;

      const pdfUrl = res.data?.pdf_url;
      const filePath = res.data?.file_path;

      if (!pdfUrl || !filePath) {
        throw new Error(
          "Challenge guide generation returned an incomplete response.",
        );
      }

      const downloadRecord: DownloadInsert = {
        lead_id: lead.id,
        asset_key: "5-day-pilot-challenge-guide",
        file_path: filePath,
        downloaded_at: nowIso,
      };

      await supabase.from("downloads").insert(downloadRecord);

      const emailResult = await queueResourceEmail({
        assetKey: "5-day-pilot-challenge-guide",
        leadId: lead.id,
        name: firstName,
        email: normalizedEmail,
        company,
        filePath,
        allowResend: true,
      });

      if (emailResult === null) {
        throw new Error("Challenge guide email trigger failed.");
      }

      if (emailResult.unsubscribed) {
        progressStatus = "unsubscribed";
      }

      if (!emailResult.success) {
        throw new Error(
          emailResult.errorMessage || "Challenge guide email trigger failed.",
        );
      }

      if (emailResult.skipped && !emailResult.unsubscribed) {
        throw new Error(
          emailResult.errorMessage ||
            "Challenge guide email was skipped instead of being sent.",
        );
      }

      const progressRecord: ChallengeProgressInsert = {
        signup_id: signupId,
        lead_id: lead.id,
        current_day: 0,
        last_sent_day: 0,
        status: progressStatus,
        next_send_at: progressStatus === "unsubscribed" ? null : nextFollowUpAt,
        completed_at: null,
        last_error: null,
        updated_at: nowIso,
      };

      await supabase
        .from("lm08_challenge_progress")
        .upsert([progressRecord], { onConflict: "signup_id" });

      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "5-Day-Automation-Pilot-Challenge.pdf";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.click();

      await trackEvent("challenge_guide_download", signupId, {
        file_path: filePath,
      });

      toast.success(
        progressStatus === "unsubscribed"
          ? "Your guide is ready. We reopened it for you."
          : emailResult.resent
            ? "Your guide is ready and we resent the email. We will follow up in 5 days."
            : "Your guide is ready and the email is on the way. We will follow up in 5 days.",
      );

      setShowModal(false);
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
        <title>5-Day Automation Pilot Guide (Free) | Chase Continental</title>
        <meta
          name="description"
          content="Get the 5-Day Automation Pilot Guide instantly, map one workflow, define your metrics, and receive one follow-up email after 5 days."
        />
      </Helmet>
      <Header />

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Automation pilot guide preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,50%,8%)]/60 via-[hsl(220,50%,8%)]/40 to-background/95" />
        </div>

        <div className="absolute top-24 right-16 w-52 h-52 rounded-full bg-[hsl(190,95%,50%)]/10 blur-[70px] animate-pulse" />
        <div
          className="absolute bottom-32 left-12 w-40 h-40 rounded-full bg-[hsl(45,80%,55%)]/10 blur-[60px] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center px-6 pt-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 rounded-full border border-[hsl(45,80%,55%)]/40 bg-[hsl(190,95%,30%)]/40 px-5 py-2 text-xs font-bold uppercase tracking-widest text-[hsl(45,80%,65%)]"
          >
            Free 5-Part Guide
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading leading-tight mb-6 text-white"
          >
            Get your first automation pilot plan{" "}
            <span className="bg-gradient-to-r from-[hsl(190,95%,55%)] to-[hsl(45,80%,55%)] bg-clip-text text-transparent">
              with one practical guide.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
          >
            Get the full 5-part guide immediately, work through each planning
            section at your own pace, and receive one follow-up email in 5 days.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-3"
          >
            <Button
              size="lg"
              onClick={openSignup}
              className="bg-gradient-to-r from-[hsl(190,95%,45%)] to-[hsl(160,84%,39%)] hover:from-[hsl(190,95%,35%)] hover:to-[hsl(160,84%,29%)] text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg shadow-[hsl(190,95%,45%)]/25 transition-all hover:scale-105"
            >
              Get the guide <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <span className="text-sm text-white/50">
              Instant download. One follow-up in 5 days.
            </span>
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

      {/* ════════ HOW IT WORKS STRIP ════════ */}
      <section className="py-8 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { icon: Clock, label: "10 min per section" },
              { icon: Calendar, label: "Instant guide" },
              { icon: Users, label: "No coding" },
              { icon: CheckCircle2, label: "1 follow-up after 5 days" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <item.icon className="h-5 w-5 text-[hsl(190,95%,45%)]" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ GUIDE SECTIONS ════════ */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block mb-4 rounded-full border border-[hsl(190,95%,50%)]/20 bg-[hsl(190,95%,50%)]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(190,95%,50%)]">
              Inside the Guide
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading">
              The 5 guide sections you will work through
            </h2>
          </motion.div>

          <div className="space-y-6">
            {guideSectionCards.map((card, i) => (
              <motion.div
                key={card.section}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div
                        className="flex items-center justify-center p-6 md:p-8 md:w-32 shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${card.color}20, ${card.color}08)`,
                        }}
                      >
                        <div className="text-center">
                          <span
                            className="text-xs font-bold uppercase tracking-widest"
                            style={{ color: card.color }}
                          >
                            Part
                          </span>
                          <div
                            className="text-4xl font-extrabold font-heading"
                            style={{ color: card.color }}
                          >
                            {card.section}
                          </div>
                        </div>
                      </div>
                      <div className="p-6 md:p-8 flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <card.icon
                            className="h-5 w-5 mt-0.5 shrink-0"
                            style={{ color: card.color }}
                          />
                          <h3 className="text-lg font-bold font-heading">
                            {card.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-3 ml-8">
                          {card.desc}
                        </p>
                        <div className="ml-8">
                          <span
                            className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              backgroundColor: `${card.color}15`,
                              color: card.color,
                            }}
                          >
                            {card.stat}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA BAND ════════ */}
      <section className="py-24 px-6 bg-gradient-to-b from-background via-[hsl(190,20%,96%)] to-background">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Calendar className="mx-auto h-12 w-12 text-[hsl(45,80%,55%)] mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Ready to get the pilot guide?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Download the guide now, map one workflow properly, and use the
              follow-up in 5 days to decide your next move.
            </p>
            <Button
              size="lg"
              onClick={openSignup}
              className="bg-gradient-to-r from-[hsl(190,95%,45%)] to-[hsl(160,84%,39%)] hover:from-[hsl(190,95%,35%)] hover:to-[hsl(160,84%,29%)] text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg shadow-[hsl(190,95%,45%)]/25 transition-all hover:scale-105"
            >
              Get the guide <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
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

      {/* ════════ SIGNUP MODAL ════════ */}
      <AnimatePresence>
        {showModal && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="sm:max-w-lg border-border/50 bg-card max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-heading flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[hsl(190,95%,45%)]" />
                  Get the 5-Day Pilot Guide
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Fill in your details to receive the guide immediately and one
                  follow-up email in 5 days.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="ch-first">First Name *</Label>
                    <Input
                      id="ch-first"
                      placeholder="First name"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, firstName: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="ch-last">Last Name *</Label>
                    <Input
                      id="ch-last"
                      placeholder="Last name"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, lastName: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="ch-email">Email *</Label>
                  <Input
                    id="ch-email"
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="ch-company">Company</Label>
                  <Input
                    id="ch-company"
                    placeholder="Your company"
                    value={form.company}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, company: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Role *</Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) => setForm((p) => ({ ...p, role: v }))}
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
                    value={form.industry}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, industry: v }))
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
                <Button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[hsl(190,95%,45%)] to-[hsl(160,84%,39%)] hover:from-[hsl(190,95%,35%)] hover:to-[hsl(160,84%,29%)] text-white font-bold py-5 rounded-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Preparing…
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" /> Get the Guide
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Instant guide delivery. No spam.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FiveDayPilotChallenge;
