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
  Phone,
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

import heroImage from "@/assets/pilot-challenge-hero.jpg";

/* ── helpers ── */
const trackEvent = async (eventType: string, signupId?: string, payload?: Record<string, unknown>) => {
  try {
    await (supabase as any).from("lm08_events").insert([{
      event_type: eventType,
      signup_id: signupId || null,
      event_payload: payload || {},
    }]);
  } catch (_) { /* silent */ }
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

/* ── day cards ── */
const dayCards = [
  {
    day: 1,
    title: "Pick the workflow",
    desc: "Identify repetitive, high-volume, rule-based tasks. Start with process mapping to find bottlenecks and manual errors. Examples: invoice processing, data entry, report generation.",
    stat: "Reduce processing time by up to 77%",
    icon: Target,
    color: "hsl(190, 95%, 45%)",
  },
  {
    day: 2,
    title: "Map the real steps",
    desc: "Document the current process step by step using flowcharts. Involve team members for accuracy to identify redundancies and inefficiencies.",
    stat: "Boost productivity by up to 90%",
    icon: GitBranch,
    color: "hsl(200, 100%, 50%)",
  },
  {
    day: 3,
    title: "Define exceptions + approvals",
    desc: "Identify potential exceptions—unusual cases, errors—and define approval workflows. Design for flexibility to handle real-world variations.",
    stat: "Reduce errors by up to 70%",
    icon: CheckCircle2,
    color: "hsl(160, 84%, 39%)",
  },
  {
    day: 4,
    title: "Define success metrics",
    desc: "Set measurable KPIs using SMART goals. Examples: cycle time reduction, error rates, cost savings, productivity increase.",
    stat: "ROI of 30–200% in year one",
    icon: BarChart3,
    color: "hsl(45, 80%, 55%)",
  },
  {
    day: 5,
    title: "Rollout plan + next steps",
    desc: "Develop a phased rollout: start small, gather feedback, scale up. Include training and change management. Book a call for expert help.",
    stat: "80% of finance tasks can be automated",
    icon: Rocket,
    color: "hsl(270, 60%, 55%)",
  },
];

/* ── FAQ ── */
const faqItems = [
  { q: "What is this challenge?", a: "A free 5-day email series to build your automation pilot plan. Each day you get a focused 10-minute task." },
  { q: "Do I need technical skills?", a: "No. The focus is on strategic planning—no coding required." },
  { q: "How much time does it take?", a: "About 10 minutes per day for 5 days." },
  { q: "When does it start?", a: "Immediately upon signup. You'll get your first task right away." },
  { q: "What if my industry is unique?", a: "Automation benefits apply across all sectors. 60% of companies are already using it." },
  { q: "Can I get help?", a: "Yes! On Day 5 you'll have the option to book a strategy call with our team." },
  { q: "Is there a cost?", a: "Completely free. No credit card required." },
  { q: "What tools are needed?", a: "None—this is strategic planning. Just a document or notepad." },
  { q: "How do I measure success?", a: "Day 4 covers success metrics like error reduction, time savings, and ROI." },
  { q: "What happens after Day 5?", a: "Implement your plan! Contact us for rollout support and expert guidance." },
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
    phone: "",
    challenges: "",
  });

  useEffect(() => {
    trackEvent("page_view", undefined, { page: "5-day-pilot-challenge" });
  }, []);

  const openSignup = () => {
    trackEvent("cta_click", undefined, { cta: "hero" });
    setShowModal(true);
  };

  const handleSignup = async () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.role || !form.industry) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const { data: existing } = await (supabase as any)
        .from("lm08_challenge_signups")
        .select("id")
        .eq("email", form.email.trim())
        .maybeSingle();

      let signupId = existing?.id;

      if (!signupId) {
        const { data: newSignup, error } = await (supabase as any)
          .from("lm08_challenge_signups")
          .insert([{
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            email: form.email.trim(),
            company: form.company.trim() || null,
            role: form.role,
            vertical: form.industry,
            phone: form.phone.trim() || null,
            challenges: form.challenges.trim() || null,
          }])
          .select("id")
          .single();
        if (error) throw error;
        signupId = newSignup.id;
      }

      // Also insert into main leads table
      await supabase.from("leads").insert([{
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        company: form.company.trim() || null,
        role: form.role,
        vertical: form.industry,
      }]).select("id").single();

      // Initialize email state for Day 0
      await (supabase as any).from("lm08_challenge_email_state").insert([{
        signup_id: signupId,
        day: 0,
        completed: false,
      }]);

      await trackEvent("challenge_signup", signupId, { source: "5-day-pilot-challenge" });

      // Trigger welcome email placeholder
      await supabase.functions.invoke("send-challenge-email", {
        body: { signupId, day: 0, email: form.email.trim(), name: form.firstName.trim() },
      });

      // Generate PDF guide
      const res = await supabase.functions.invoke("generate-challenge-pdf", {
        body: { signupId, name: `${form.firstName.trim()} ${form.lastName.trim()}`, email: form.email.trim() },
      });

      if (res.data) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "5-Day-Automation-Pilot-Challenge.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      toast.success("You're in! Check your email for Day 0.");
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
        <title>5-Day Automation Pilot Challenge (Free) | Chase Continental</title>
        <meta name="description" content="10 minutes per day. By day 5 you'll have a clear automation pilot plan and success metrics." />
      </Helmet>
      <Header />

      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="5-day pilot challenge calendar with day cards" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,50%,8%)]/60 via-[hsl(220,50%,8%)]/40 to-background/95" />
        </div>

        <div className="absolute top-24 right-16 w-52 h-52 rounded-full bg-[hsl(190,95%,50%)]/10 blur-[70px] animate-pulse" />
        <div className="absolute bottom-32 left-12 w-40 h-40 rounded-full bg-[hsl(45,80%,55%)]/10 blur-[60px] animate-pulse" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 mx-auto max-w-4xl text-center px-6 pt-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 rounded-full border border-[hsl(45,80%,55%)]/40 bg-[hsl(190,95%,30%)]/40 px-5 py-2 text-xs font-bold uppercase tracking-widest text-[hsl(45,80%,65%)]"
          >
            Free 5-Day Challenge
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading leading-tight mb-6 text-white"
          >
            Get your first automation plan{" "}
            <span className="bg-gradient-to-r from-[hsl(190,95%,55%)] to-[hsl(45,80%,55%)] bg-clip-text text-transparent">
              in 5 days.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
          >
            Daily 10-minute actions. By day 5 you'll have a workflow plan, success metrics, and rollout steps.
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
              Join the challenge <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <span className="text-sm text-white/50">Starts immediately.</span>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-16">
            <ChevronDown className="mx-auto h-6 w-6 text-white/30 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS STRIP ════════ */}
      <section className="py-8 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { icon: Clock, label: "10 min/day" },
              { icon: Calendar, label: "5 days" },
              { icon: Users, label: "No coding" },
              { icon: Phone, label: "Book a call on Day 5" },
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

      {/* ════════ DAY CARDS ════════ */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block mb-4 rounded-full border border-[hsl(190,95%,50%)]/20 bg-[hsl(190,95%,50%)]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(190,95%,50%)]">
              Your 5-Day Plan
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading">What you'll accomplish each day</h2>
          </motion.div>

          <div className="space-y-6">
            {dayCards.map((card, i) => (
              <motion.div
                key={card.day}
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
                        style={{ background: `linear-gradient(135deg, ${card.color}20, ${card.color}08)` }}
                      >
                        <div className="text-center">
                          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: card.color }}>Day</span>
                          <div className="text-4xl font-extrabold font-heading" style={{ color: card.color }}>{card.day}</div>
                        </div>
                      </div>
                      <div className="p-6 md:p-8 flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <card.icon className="h-5 w-5 mt-0.5 shrink-0" style={{ color: card.color }} />
                          <h3 className="text-lg font-bold font-heading">{card.title}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-3 ml-8">{card.desc}</p>
                        <div className="ml-8">
                          <span
                            className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                            style={{ backgroundColor: `${card.color}15`, color: card.color }}
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
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Calendar className="mx-auto h-12 w-12 text-[hsl(45,80%,55%)] mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Ready to build your automation plan?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of operations leaders who've used this challenge to launch successful automation pilots.
            </p>
            <Button
              size="lg"
              onClick={openSignup}
              className="bg-gradient-to-r from-[hsl(190,95%,45%)] to-[hsl(160,84%,39%)] hover:from-[hsl(190,95%,35%)] hover:to-[hsl(160,84%,29%)] text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg shadow-[hsl(190,95%,45%)]/25 transition-all hover:scale-105"
            >
              Join the challenge <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="py-24 px-6 bg-card/50">
        <div className="mx-auto max-w-3xl">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold font-heading text-center mb-12">
            Frequently Asked Questions
          </motion.h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border/50 rounded-xl px-6 bg-card shadow-sm">
                <AccordionTrigger className="text-left font-semibold hover:no-underline text-foreground">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
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
                  Join the 5-Day Challenge
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Fill in your details to start the challenge immediately.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="ch-first">First Name *</Label>
                    <Input id="ch-first" placeholder="First name" value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="ch-last">Last Name *</Label>
                    <Input id="ch-last" placeholder="Last name" value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="ch-email">Email *</Label>
                  <Input id="ch-email" type="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="ch-company">Company</Label>
                  <Input id="ch-company" placeholder="Your company" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} />
                </div>
                <div>
                  <Label>Role *</Label>
                  <Select value={form.role} onValueChange={(v) => setForm((p) => ({ ...p, role: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Industry *</Label>
                  <Select value={form.industry} onValueChange={(v) => setForm((p) => ({ ...p, industry: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select your industry" /></SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((ind) => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ch-phone">Phone (optional)</Label>
                  <Input id="ch-phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="ch-challenges">Current automation challenges (optional)</Label>
                  <Textarea id="ch-challenges" placeholder="Tell us about your current challenges..." value={form.challenges} onChange={(e) => setForm((p) => ({ ...p, challenges: e.target.value }))} rows={3} />
                </div>

                <Button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[hsl(190,95%,45%)] to-[hsl(160,84%,39%)] hover:from-[hsl(190,95%,35%)] hover:to-[hsl(160,84%,29%)] text-white font-bold py-5 rounded-xl"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining…</>
                  ) : (
                    <><ArrowRight className="mr-2 h-4 w-4" /> Join the Challenge</>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">Starts immediately. No spam.</p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FiveDayPilotChallenge;
