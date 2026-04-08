/*
  Charles — Personal Profile & Thought Leadership Page
  Premium dark theme: Apple × OpenAI × Stripe aesthetic
*/

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Workflow,
  Shield,
  BarChart3,
  Cpu,
  Sparkles,
  BookOpen,
  Mail,
  Linkedin,
  Send,
  Lightbulb,
  Network,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import heroBg from "@/assets/charles-hero-bg.jpg";
import charlesPhoto from "/static/images/team/charles.png";
import ccLogoWhite from "@/assets/cc-logo-glass-white.png";

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Data ── */
const workAreas = [
  {
    icon: Cpu,
    title: "AI Product Architecture",
    desc: "Designing reliable AI products that run inside day-to-day operations and hold up under real usage.",
  },
  {
    icon: Network,
    title: "Agent Platforms",
    desc: "Building agent systems with clear guardrails, observability, and deterministic execution paths.",
  },
  {
    icon: Workflow,
    title: "Execution Workflows",
    desc: "Restructuring how work flows across teams so AI and people operate as one system.",
  },
  {
    icon: Sparkles,
    title: "Product-Led Transformation",
    desc: "Replacing fragmented tooling with coherent platforms teams can adopt quickly and trust long-term.",
  },
  {
    icon: BarChart3,
    title: "Decision Infrastructure",
    desc: "Turning operational data into visible, actionable systems that improve strategic decisions.",
  },
];

const thinkingCards = [
  {
    icon: Brain,
    text: "AI should not replace people. It should improve how decisions are made.",
  },
  {
    icon: Shield,
    text: "Automation without oversight creates risk. Reliable AI requires governance and supervision.",
  },
  {
    icon: Workflow,
    text: "The real transformation happens in workflows, not tools.",
  },
  {
    icon: Lightbulb,
    text: "Organizations need intelligence infrastructure, not isolated AI features.",
  },
  {
    icon: Lock,
    text: "AI systems must prioritize trust, transparency, and reliability above all.",
  },
];

const skills = [
  "AI Systems Design",
  "Agent Architecture",
  "Automation Strategy",
  "Workflow Engineering",
  "Product-Led Transformation",
  "Operational Intelligence",
  "Enterprise AI Implementation",
  "Data Quality & Reporting",
  "Decision Intelligence",
  "AI Product Strategy",
];

const builtProducts = [
  {
    title: "Chase Agents",
    label: "Flagship AI Platform",
    description:
      "An agentic execution platform for operations teams that combines AI planning with deterministic actions, observability, and governance.",
    ctaLabel: "Visit Chase Agents",
    href: "https://chaseagents.com",
  },
  {
    title: "OptiWeb",
    label: "Conversion + Operations Layer",
    description:
      "A productized web and workflow system designed to improve conversion, reduce operational drag, and give teams clearer control of growth execution.",
    ctaLabel: "Request OptiWeb Demo",
    href: "https://www.optiweb.it.com/",
  },
];

const articles = [
  {
    title: "Why Most AI Projects Fail Inside Organizations",
    desc: "The gap between AI capability and organizational readiness is where most implementations break down.",
    date: "March 2026",
  },
  {
    title: "The Shift From Tools to Agent Systems",
    desc: "Moving beyond point tools to interconnected agent architectures that compound value.",
    date: "February 2026",
  },
  {
    title: "Why Reliable AI Matters More Than Powerful AI",
    desc: "Enterprise AI needs consistency and governance, not just raw capability.",
    date: "January 2026",
  },
  {
    title: "Designing Workflows for Human-AI Collaboration",
    desc: "The art of building systems where human judgment and machine intelligence amplify each other.",
    date: "December 2025",
  },
  {
    title: "The Future of Decision Intelligence",
    desc: "How structured data, AI agents, and operational workflows converge to create a new operating model.",
    date: "November 2025",
  },
];

const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";

const CharlesPage = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = async () => {
    if (
      !contactForm.name.trim() ||
      !contactForm.email.trim() ||
      !contactForm.message.trim()
    ) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await supabase.from("leads").insert({
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        role: "Contact from Charles page",
      });
      await supabase.from("events").insert({
        event_name: "charles_contact_form",
        event_payload: {
          message: contactForm.message.trim(),
          name: contactForm.name.trim(),
          email: contactForm.email.trim(),
        },
      });
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      setContactForm({ name: "", email: "", message: "" });
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(220,50%,4%)] text-[hsl(210,20%,96%)] overflow-x-hidden">
      <Helmet>
        <title>Charles — AI Product Builder & Founder</title>
        <meta
          name="description"
          content="I build AI products and execution systems that run inside real operations. Founder, systems thinker, and product-led transformation operator."
        />
      </Helmet>

      {/* ═══════════════════════════════════════════
          TOP NAV BAR
      ═══════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(220,50%,4%)]/80 backdrop-blur-2xl border-b border-white/5">
        <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-6 md:px-12">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={ccLogoWhite}
              alt="Chase Continental"
              className="h-9 w-auto opacity-70 group-hover:opacity-100 transition-opacity"
            />
            <span className="text-sm font-semibold text-[hsl(210,20%,70%)] group-hover:text-white transition-colors">
              Chase Continental
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/resources"
              className="text-xs font-medium text-[hsl(210,20%,60%)] hover:text-[hsl(190,100%,50%)] transition-colors"
            >
              Resources
            </Link>
            <Link
              to="/products"
              className="text-xs font-medium text-[hsl(210,20%,60%)] hover:text-[hsl(190,100%,50%)] transition-colors"
            >
              Products
            </Link>
            <Link
              to="/blogs"
              className="text-xs font-medium text-[hsl(210,20%,60%)] hover:text-[hsl(190,100%,50%)] transition-colors"
            >
              Blog
            </Link>
            <Button
              size="sm"
              onClick={() => window.open(BOOK_CALL_URL, "_blank")}
              className="rounded-full bg-[hsl(190,100%,50%)]/10 border border-[hsl(190,100%,50%)]/30 text-[hsl(190,100%,50%)] hover:bg-[hsl(190,100%,50%)]/20 text-xs font-medium px-4 h-8"
            >
              Book a Call
            </Button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,50%,4%)] via-[hsl(220,50%,4%)]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,50%,4%)] via-transparent to-[hsl(220,50%,4%)]/50" />
        </div>

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(190,100%,50%)]/[0.03] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(270,80%,60%)]/[0.04] blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 md:px-12 pt-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <span className="inline-block text-xs font-mono uppercase tracking-[0.3em] text-[hsl(190,100%,50%)]/70 border border-[hsl(190,100%,50%)]/20 rounded-full px-4 py-1.5 backdrop-blur-sm">
                  AI Product Builder · Founder
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold font-heading leading-[0.9] mb-8 tracking-tight"
              >
                Charles
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-xl md:text-2xl font-light leading-relaxed text-[hsl(210,20%,80%)] mb-6 max-w-xl"
              >
                I build AI products and systems that run inside real operations.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-base text-[hsl(215,16%,58%)] leading-relaxed mb-10 max-w-lg"
              >
                Most teams can ship pilots. Few can run AI in production with
                consistency. My work focuses on productizing agent systems,
                operational workflows, and decision infrastructure that teams
                can trust every day.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                <Button
                  onClick={() =>
                    document
                      .getElementById("articles")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-[hsl(190,100%,50%)]/10 border border-[hsl(190,100%,50%)]/30 text-[hsl(190,100%,50%)] hover:bg-[hsl(190,100%,50%)]/20 px-6 py-5 rounded-xl font-medium backdrop-blur-sm"
                >
                  Read My Articles <BookOpen className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    document
                      .getElementById("built")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-[hsl(210,20%,70%)] hover:text-white hover:bg-white/5 px-6 py-5 rounded-xl"
                >
                  What I Have Built <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-[hsl(210,20%,70%)] hover:text-white hover:bg-white/5 px-6 py-5 rounded-xl"
                >
                  Contact <Mail className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            {/* Right — Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex justify-end"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[hsl(190,100%,50%)]/20 via-transparent to-[hsl(270,80%,60%)]/20 blur-xl" />
                <div className="relative w-[380px] h-[460px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                  <img
                    src={charlesPhoto}
                    alt="Charles"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,50%,4%)]/60 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[hsl(190,100%,50%)]/30 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          ABOUT
      ═══════════════════════════════════════════ */}
      <section id="about" className="py-32 px-6 md:px-12 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(190,100%,50%)]/10 to-transparent" />
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-xs font-mono uppercase tracking-[0.3em] text-[hsl(190,100%,50%)]/60 mb-4 block"
            >
              About
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl font-bold font-heading mb-12 tracking-tight"
            >
              About Charles
            </motion.h2>

            <div className="space-y-6 text-lg text-[hsl(215,16%,65%)] leading-relaxed">
              <motion.p variants={fadeUp} custom={2}>
                Charles is a founder building AI products, agent systems, and
                software that changes how teams execute work.
              </motion.p>
              <motion.p variants={fadeUp} custom={3}>
                His work centers on a simple idea:{" "}
                <span className="text-[hsl(210,20%,90%)] font-medium">
                  AI fails less because of model quality and more because
                  execution systems are not redesigned to run it inside everyday
                  operations.
                </span>
              </motion.p>
              <motion.p variants={fadeUp} custom={4}>
                Instead of isolated features, Charles builds full products and
                workflow infrastructure that connect data, people, and automated
                agents into one operating system.
              </motion.p>
            </div>

            <motion.div
              variants={fadeUp}
              custom={5}
              className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4"
            >
              {[
                "Reliability",
                "Governance",
                "Data Integrity",
                "Operational Intelligence",
                "Practical Implementation",
              ].map((p) => (
                <div
                  key={p}
                  className="text-center px-4 py-5 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm"
                >
                  <span className="text-sm font-medium text-[hsl(190,100%,50%)]/80">
                    {p}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHAT I WORK ON
      ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-xs font-mono uppercase tracking-[0.3em] text-[hsl(190,100%,50%)]/60 mb-4 block"
            >
              Focus Areas
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl font-bold font-heading mb-16 tracking-tight"
            >
              What I Build
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {workAreas.map((area, i) => (
              <motion.div key={area.title} variants={fadeUp} custom={i}>
                <div className="group h-full p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-[hsl(190,100%,50%)]/20 transition-all duration-500">
                  <div className="w-12 h-12 rounded-2xl bg-[hsl(190,100%,50%)]/[0.08] flex items-center justify-center mb-6 group-hover:bg-[hsl(190,100%,50%)]/[0.15] transition-colors">
                    <area.icon className="h-6 w-6 text-[hsl(190,100%,50%)]/70" />
                  </div>
                  <h3 className="text-xl font-bold font-heading mb-3 tracking-tight">
                    {area.title}
                  </h3>
                  <p className="text-[hsl(215,16%,58%)] text-sm leading-relaxed">
                    {area.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHAT I HAVE BUILT
      ═══════════════════════════════════════════ */}
      <section id="built" className="py-32 px-6 md:px-12 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-xs font-mono uppercase tracking-[0.3em] text-[hsl(190,100%,50%)]/60 mb-4 block"
            >
              Products
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight"
            >
              What I Have Built
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-[hsl(215,16%,58%)] text-lg max-w-3xl mb-14"
            >
              Two products currently anchor my work: one focused on agent
              execution and one focused on digital growth operations.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-6"
          >
            {builtProducts.map((product, i) => (
              <motion.div key={product.title} variants={fadeUp} custom={i}>
                <div className="h-full p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-[hsl(190,100%,50%)]/20 transition-all duration-500">
                  <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[hsl(190,100%,50%)]/70 mb-3">
                    {product.label}
                  </p>
                  <h3 className="text-2xl font-bold font-heading tracking-tight mb-3">
                    {product.title}
                  </h3>
                  <p className="text-[hsl(215,16%,58%)] text-sm leading-relaxed mb-7">
                    {product.description}
                  </p>
                  <Button
                    onClick={() => window.open(product.href, "_blank")}
                    className="bg-[hsl(190,100%,50%)]/10 border border-[hsl(190,100%,50%)]/30 text-[hsl(190,100%,50%)] hover:bg-[hsl(190,100%,50%)]/20 px-5 py-4 rounded-xl font-medium"
                  >
                    {product.ctaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CORE THINKING
      ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(270,80%,60%)]/[0.02] blur-[150px]" />

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-xs font-mono uppercase tracking-[0.3em] text-[hsl(270,80%,60%)]/60 mb-4 block"
            >
              Philosophy
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl font-bold font-heading mb-16 tracking-tight"
            >
              How I Think About AI
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-4"
          >
            {thinkingCards.map((card, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <div className="flex items-start gap-6 p-8 rounded-2xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] hover:border-[hsl(270,80%,60%)]/15 transition-all duration-500 group">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(270,80%,60%)]/[0.1] flex items-center justify-center shrink-0 group-hover:bg-[hsl(270,80%,60%)]/[0.2] transition-colors">
                    <card.icon className="h-5 w-5 text-[hsl(270,80%,60%)]/70" />
                  </div>
                  <p className="text-lg md:text-xl font-light text-[hsl(210,20%,80%)] leading-relaxed">
                    {card.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SKILLS
      ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-xs font-mono uppercase tracking-[0.3em] text-[hsl(190,100%,50%)]/60 mb-4 block"
            >
              Expertise
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl font-bold font-heading mb-16 tracking-tight"
            >
              Skills & Expertise
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-wrap gap-3"
          >
            {skills.map((skill, i) => (
              <motion.div key={skill} variants={fadeUp} custom={i}>
                <div className="px-6 py-3.5 rounded-full border border-white/8 bg-white/[0.02] text-sm font-medium text-[hsl(210,20%,80%)] hover:border-[hsl(190,100%,50%)]/25 hover:text-[hsl(190,100%,50%)] hover:bg-[hsl(190,100%,50%)]/[0.05] transition-all duration-300 cursor-default">
                  {skill}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ARTICLES
      ═══════════════════════════════════════════ */}
      <section id="articles" className="py-32 px-6 md:px-12 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-[hsl(190,100%,50%)]/[0.02] blur-[120px]" />

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-xs font-mono uppercase tracking-[0.3em] text-[hsl(190,100%,50%)]/60 mb-4 block"
            >
              Insights
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl font-bold font-heading mb-16 tracking-tight"
            >
              Insights & Writing
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-4"
          >
            {articles.map((article, i) => (
              <motion.div key={article.title} variants={fadeUp} custom={i}>
                <div className="group flex items-start justify-between gap-8 p-8 rounded-2xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.04] hover:border-[hsl(190,100%,50%)]/15 transition-all duration-500 cursor-pointer">
                  <div className="flex-1">
                    <span className="text-xs font-mono text-[hsl(215,16%,48%)] mb-2 block">
                      {article.date}
                    </span>
                    <h3 className="text-xl font-bold font-heading mb-2 group-hover:text-[hsl(190,100%,50%)] transition-colors tracking-tight">
                      {article.title}
                    </h3>
                    <p className="text-[hsl(215,16%,55%)] text-sm leading-relaxed">
                      {article.desc}
                    </p>
                  </div>
                  <div className="shrink-0 mt-2">
                    <ArrowRight className="h-5 w-5 text-[hsl(215,16%,40%)] group-hover:text-[hsl(190,100%,50%)] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PHILOSOPHY
      ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-xs font-mono uppercase tracking-[0.3em] text-[hsl(270,80%,60%)]/60 mb-4 block"
            >
              Vision
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-8 tracking-tight leading-tight"
            >
              Building the Future of Intelligent Organizations
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-[hsl(215,16%,60%)] leading-relaxed mb-6"
            >
              The next generation of organizations will not run purely on
              software or people. They will run on{" "}
              <span className="text-[hsl(210,20%,90%)] font-medium">
                systems of intelligence
              </span>{" "}
              — where humans, data, and AI agents collaborate.
            </motion.p>
            <motion.p
              variants={fadeUp}
              custom={3}
              className="text-lg text-[hsl(215,16%,55%)] leading-relaxed"
            >
              The objective is not to chase trends, but to design infrastructure
              that enables better decisions, faster execution, and resilient
              operations.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CONTACT
      ═══════════════════════════════════════════ */}
      <section id="contact" className="py-32 px-6 md:px-12 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(190,100%,50%)]/10 to-transparent" />
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="text-xs font-mono uppercase tracking-[0.3em] text-[hsl(190,100%,50%)]/60 mb-4 block"
            >
              Connect
            </motion.span>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight"
            >
              Get in Touch
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-[hsl(215,16%,58%)] text-lg"
            >
              If you're exploring how AI can be implemented reliably within your
              organization, feel free to reach out.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {/* Social links */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex justify-center gap-4 mb-12"
            >
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/8 bg-white/[0.02] text-sm font-medium text-[hsl(210,20%,70%)] hover:border-[hsl(190,100%,50%)]/30 hover:text-[hsl(190,100%,50%)] transition-all"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href="mailto:charles@chasecontinental.com"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/8 bg-white/[0.02] text-sm font-medium text-[hsl(210,20%,70%)] hover:border-[hsl(190,100%,50%)]/30 hover:text-[hsl(190,100%,50%)] transition-all"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
            </motion.div>

            {/* Contact form */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm"
            >
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-[hsl(215,16%,48%)] mb-2 block">
                      Name
                    </label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Your name"
                      className="bg-white/[0.03] border-white/8 text-white placeholder:text-[hsl(215,16%,35%)] focus:border-[hsl(190,100%,50%)]/40 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-[hsl(215,16%,48%)] mb-2 block">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="you@company.com"
                      className="bg-white/[0.03] border-white/8 text-white placeholder:text-[hsl(215,16%,35%)] focus:border-[hsl(190,100%,50%)]/40 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[hsl(215,16%,48%)] mb-2 block">
                    Message
                  </label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="Tell me about your project or challenge..."
                    rows={5}
                    className="bg-white/[0.03] border-white/8 text-white placeholder:text-[hsl(215,16%,35%)] focus:border-[hsl(190,100%,50%)]/40 rounded-xl resize-none"
                  />
                </div>
                <Button
                  onClick={handleContactSubmit}
                  disabled={submitting}
                  className="w-full bg-[hsl(190,100%,50%)]/10 border border-[hsl(190,100%,50%)]/30 text-[hsl(190,100%,50%)] hover:bg-[hsl(190,100%,50%)]/20 py-5 rounded-xl font-medium"
                >
                  {submitting ? (
                    "Sending…"
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="py-12 px-6 md:px-12 border-t border-white/5">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
          <a href="/" className="flex items-center gap-2.5 group">
            <img
              src={ccLogoWhite}
              alt="Chase Continental"
              className="h-9 w-auto opacity-60 group-hover:opacity-100 transition-opacity"
            />
            <span className="text-xs text-[hsl(215,16%,40%)] group-hover:text-[hsl(190,100%,50%)] transition-colors">
              Chase Continental
            </span>
          </a>
          <div className="flex items-center gap-6">
            <p className="text-xs text-[hsl(215,16%,40%)]">
              © 2026 Charles. All rights reserved.
            </p>
            <a
              href="/privacy"
              className="text-xs text-[hsl(215,16%,40%)] hover:text-[hsl(190,100%,50%)] transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CharlesPage;
