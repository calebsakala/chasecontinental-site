import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Leaf,
  Zap,
  Linkedin,
  Twitter,
  Unplug,
  Copy,
  EyeOff,
  Bot,
  Link2,
  Users,
  ShieldCheck,
  SlidersHorizontal,
  BarChart3,
  Library,
  Cpu,
  Eye,
  GitBranch,
  Target,
  Factory,
  Truck,
  Landmark,
  HardHat,
  Headphones,
  TrendingUp,
  ShoppingCart,
  Gamepad2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import InterventionMatrix from "@/components/InterventionMatrix";
import MeasurementLayers from "@/components/MeasurementLayers";

const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";
const CHASE_AGENTS_URL = "https://chaseagents.com";
const HERO_IMAGE = "/static/images/hero-ops.png";

const RESULTS = [
  { metric: "100+", label: "Business workflows automated" },
  { metric: "30+", label: "Countries with active deployments" },
  { metric: "90%", label: "Reduction in manual processing time" },
  { metric: "10.4×", label: "Productivity improvement" },
  { metric: "<$5/mo", label: "Operational cost per automation at scale" },
];

const PROBLEMS = [
  {
    icon: Unplug,
    title: "Disconnected Systems",
    desc: "Your CRM, ERP, spreadsheets, and internal tools operate independently, forcing people to become the integration layer.",
  },
  {
    icon: Copy,
    title: "Manual Operations",
    desc: "Employees repeatedly copy information between systems, introducing delays, inconsistencies, and avoidable errors.",
  },
  {
    icon: EyeOff,
    title: "Limited Visibility",
    desc: "Critical information arrives too late, making decisions reactive instead of operationally informed.",
  },
  {
    icon: Bot,
    title: "AI That Creates More Work",
    desc: "Copilots and chatbots require constant human instruction. If someone must prompt it to act, the tool hasn't solved the problem — it's added one.",
  },
];

const SOLUTIONS = [
  {
    icon: Link2,
    title: "Connect Every System",
    desc: "ERP, CRM, APIs, databases, spreadsheets, legacy platforms.",
  },
  {
    icon: Users,
    title: "Digital Employees",
    desc: "AI agents perform repetitive operational work around the clock.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability First",
    desc: "Deterministic execution with automated validation and exception handling.",
  },
  {
    icon: SlidersHorizontal,
    title: "Human Control",
    desc: "Run autonomously, require approvals, or keep humans involved wherever needed.",
  },
  {
    icon: BarChart3,
    title: "Built-In Measurement",
    desc: "Every automation includes monitoring, reporting, and measurable ROI.",
  },
  {
    icon: Library,
    title: "Institutional Knowledge",
    desc: "Every engagement produces a structured knowledge base — research taxonomy, process logic, reusable components. The asset outlasts the tools, the models, and any individual team member.",
  },
];

const PHASES = [
  {
    n: "01",
    title: "Diagnostic Framing",
    desc: "Map the operation end-to-end. Identify where judgment is genuinely required versus where people are doing mechanical work that logic can handle. The critical path becomes the build plan.",
  },
  {
    n: "02",
    title: "Intervention Classification",
    desc: "Every intervention is classified before anything is built.",
  },
  {
    n: "03",
    title: "Precision Intervention",
    desc: "Build the minimum viable automation at the highest-value bottleneck. Measure. Then expand. Never rebuild a workflow from scratch — insert into it.",
  },
];

const ARCH_FLOW = [
  "Business Systems",
  "Chase Agents",
  "AI Planning Layer",
  "Deterministic Actions",
  "Five-Layer Measurement",
  "Monitoring",
  "Business Outcomes",
];

const INDUSTRIES = [
  { icon: Factory, name: "Manufacturing" },
  { icon: Truck, name: "Logistics" },
  { icon: Landmark, name: "Government" },
  { icon: HardHat, name: "Mining" },
  { icon: Headphones, name: "BPO" },
  { icon: TrendingUp, name: "Sales Operations" },
  { icon: ShoppingCart, name: "E-commerce" },
  { icon: Gamepad2, name: "iGaming" },
];

const WHY = [
  {
    icon: Bot,
    title: "AI Must Not Create Work",
    desc: "If someone must prompt it to act, the system isn't finished. We design automation that observes, decides, and executes without human instruction — by default.",
  },
  {
    icon: ShieldCheck,
    title: "Production Ready",
    desc: "Designed for real operational environments from day one.",
  },
  {
    icon: Cpu,
    title: "Reliable AI",
    desc: "AI plans. Deterministic systems execute. The things that must be right, always are.",
  },
  {
    icon: Eye,
    title: "Observable",
    desc: "Every workflow is measurable and fully traceable.",
  },
  {
    icon: GitBranch,
    title: "Model-Independent",
    desc: "No vendor lock-in. Automations run across AI providers. When models change — and they will — your operations don't.",
  },
  {
    icon: Target,
    title: "Business Outcomes",
    desc: "Every deployment starts with a measurable operational baseline and ends with a documented result.",
  },
];

const TEAM = [
  {
    name: "Charles K. Chirongoma",
    role: "CEO · Product-led Transformation",
    bio: "Charles builds systems that make organisations run better. His background spans economics, data, and industrial development across complex, multi-regional environments. He focuses on turning slow, manual operations into faster, measurable execution.",
    image: "/static/images/team/charles.png",
    linkedin: "https://www.linkedin.com/in/charles-k-chirongoma-41327716b/",
    twitter: "https://x.com/tue_sday",
  },
  {
    name: "Caleb Sakala",
    role: "CTO · Product & Engineering",
    bio: "Caleb is a product and engineering leader who has delivered software and AI initiatives across the US, Brazil, and Cyprus. He builds high-quality systems that perform reliably in real-world business conditions. His focus is production reliability at scale.",
    image: "/static/images/team/caleb.jpg",
    linkedin: "https://www.linkedin.com/in/calebsakala",
    twitter: "https://x.com/bytecaleb",
  },
];

const TrustedRow = () => (
  <div className="mt-16 border-t border-border/60 pt-10">
    <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">
      Trusted by
    </p>
    <div className="flex flex-wrap items-end justify-center gap-x-12 gap-y-8 md:gap-x-16">
      {[
        { name: "CCID", industry: "Government", logo: "/static/images/ccid-logo.svg" },
        { name: "Heineken", industry: "Manufacturing", logo: "/static/images/heineken-logo.svg" },
        { name: "Moya App", industry: "Technology", logo: "/static/images/moya-logo.png" },
        { name: "Datafree", industry: "Connectivity", logo: "/static/images/datafree-logo.png" },
        { name: "HealthyMe Living", industry: "E-commerce", logo: "/static/images/healthymeliving-logo.png" },
      ].map((partner) => (
        <div key={partner.name} className="flex flex-col items-center text-center">
          <div className="flex h-10 md:h-11 items-center">
            <img src={partner.logo} alt={partner.name} className="h-full w-auto max-w-[170px] object-contain" />
          </div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mt-2">
            {partner.industry}
          </p>
        </div>
      ))}
    </div>

    <div className="mt-12 border-t border-border/40 pt-8">
      <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-7">
        Backed by
      </p>
      <div className="flex flex-wrap items-start justify-center gap-x-16 gap-y-8 md:gap-x-24">
        <div className="flex flex-col items-center">
          <div className="flex h-16 md:h-[72px] items-center">
            <img src="/static/images/google-cloud-logo.svg" alt="Google Cloud for Startups" className="h-[26px] md:h-[30px] w-auto" />
          </div>
          <p className="mt-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
            for Startups
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex h-16 md:h-[72px] items-center">
            <img src="/static/images/ms-startups-badge.png" alt="Microsoft for Startups Founders Hub" className="h-16 md:h-[72px] w-auto rounded-xl" />
          </div>
          <p className="mt-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
            Founders Hub
          </p>
        </div>
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Header />

      <main>
        {/* ── 1. HERO ── */}
        <section className="relative flex items-center overflow-hidden bg-background">
          <div className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-16 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  Building software that changes the way{" "}
                  <span className="text-teal">people work.</span>
                </motion.h1>

                <motion.p
                  className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  We design and build reliable AI systems that automate operations,
                  connect business software, and help teams execute faster — with
                  measurable outcomes, complete visibility, and enterprise-grade
                  reliability.
                </motion.p>

                <motion.p
                  className="mt-4 text-sm italic text-muted-foreground/70"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  The AI works. Nobody has to ask it to.
                </motion.p>

                <motion.div
                  className="mt-8 flex flex-wrap items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Button
                    size="lg"
                    className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold px-7 h-12 text-sm"
                    onClick={() => window.open(BOOK_CALL_URL, "_blank")}
                  >
                    Book a Strategy Call
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-border text-foreground hover:bg-accent font-semibold px-7 h-12 text-sm"
                    onClick={() => window.location.assign("/products")}
                  >
                    Explore Our Work
                  </Button>
                </motion.div>
              </div>

              {/* Right — enterprise UI panel */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="overflow-hidden rounded-2xl border border-border shadow-xl">
                  <img
                    src={HERO_IMAGE}
                    alt="Chase Continental team reviewing an automation architecture — data sources through to monitoring and insights"
                    className="w-full h-[320px] md:h-[420px] lg:h-[480px] object-cover object-[70%_center]"
                  />
                </div>
              </motion.div>
            </div>

            <TrustedRow />
          </div>
        </section>

        {/* ── 2. RESULTS ── */}
        <section id="results" className="bg-foreground py-16 md:py-20 px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="text-background text-center">Proven in production.</h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {RESULTS.map((r, i) => (
                <Reveal key={r.label} delay={i * 0.06}>
                  <div className="rounded-2xl border border-background/10 bg-background/[0.04] p-6 text-center h-full">
                    <span className="text-3xl md:text-[2.5rem] font-extrabold font-heading text-teal leading-none">
                      {r.metric}
                    </span>
                    <p className="mt-3 text-[11px] font-semibold text-background/55 uppercase tracking-[0.1em] leading-relaxed">
                      {r.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-8 text-center text-xs text-background/40">
              Measured across client engagements and production deployments.
            </p>
          </div>
        </section>

        {/* ── 3. PROBLEM ── */}
        <section className="bg-background py-16 md:py-20 px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="max-w-3xl">
                <h2 className="text-foreground">
                  Most companies don't have an AI problem.{" "}
                  <span className="text-teal">They have an operations problem.</span>
                </h2>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  AI isn't failing because the models aren't good enough. It's failing
                  because business systems don't communicate, manual work fills the gaps,
                  and every exception requires another person to intervene.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  The result is slower execution, hidden costs, inconsistent decisions,
                  and teams spending more time moving information than creating value.
                </p>
                <p className="mt-4 font-medium text-foreground leading-relaxed">
                  Most AI pilots make this worse — they create a new class of work:
                  prompting, checking, correcting, and rerunning.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {PROBLEMS.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="rounded-2xl border border-border bg-card p-7 h-full">
                    <div className="mb-4 inline-flex rounded-xl bg-destructive/10 p-3">
                      <p.icon className="h-5 w-5 text-destructive" />
                    </div>
                    <h4 className="text-base font-bold font-heading text-foreground mb-2">
                      {p.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. SOLUTION ── */}
        <section className="bg-secondary/40 py-16 md:py-20 px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="max-w-3xl">
                <h2 className="text-foreground">
                  We turn disconnected operations into{" "}
                  <span className="text-teal">one intelligent system.</span>
                </h2>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  We don't replace your existing software. We connect it. Then we automate
                  the work happening between every application, approval, report,
                  spreadsheet, email, and database.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  The result is an organisation that executes faster while remaining
                  completely observable and under your control.
                </p>
                <p className="mt-4 font-medium text-foreground leading-relaxed">
                  The system knows when to act. Nobody has to tell it to.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SOLUTIONS.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.06}>
                  <div className="rounded-2xl border border-border bg-card p-7 h-full">
                    <div className="mb-4 inline-flex rounded-xl bg-teal/10 p-3">
                      <s.icon className="h-5 w-5 text-teal" />
                    </div>
                    <h4 className="text-base font-bold font-heading text-foreground mb-2">
                      {s.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4.5 HOW WE WORK ── */}
        <section className="bg-background py-16 md:py-20 px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="max-w-3xl">
                <span className="inline-flex items-center rounded-full bg-teal/8 border border-teal/15 px-4 py-1.5 text-xs font-semibold text-teal tracking-wide">
                  How We Work
                </span>
                <h2 className="mt-6 text-foreground">
                  A methodology built for operational environments.
                </h2>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                  We don't start with AI. We start with the workflow.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PHASES.map((phase, i) => (
                <Reveal key={phase.n} delay={i * 0.1}>
                  <div className="h-full rounded-2xl border border-border bg-card p-7">
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-2xl font-extrabold text-teal">
                        {phase.n}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        Phase {phase.n.replace(/^0/, "")}
                      </span>
                    </div>
                    <h4 className="mt-4 font-heading text-lg font-bold text-foreground">
                      {phase.title}
                    </h4>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {phase.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-8">
                <p className="mb-5 text-sm font-semibold text-foreground">
                  Phase 2 — every intervention is classified before anything is built:
                </p>
                <InterventionMatrix />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 5. CHASE AGENTS ── */}
        <section id="products" className="bg-foreground py-16 md:py-20 px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="max-w-3xl">
                <span className="inline-flex items-center rounded-full bg-teal/10 border border-teal/20 px-4 py-1.5 text-xs font-semibold text-teal tracking-wide">
                  Enterprise Automation Platform
                </span>
                <h2 className="mt-6 text-background">Powered by Chase Agents.</h2>
                <p className="mt-5 text-background/70 leading-relaxed">
                  Every solution we deliver runs on Chase Agents — our enterprise
                  automation platform designed for reliability at scale. AI determines the
                  best approach. Deterministic workflows execute the work. Every action is
                  observable, traceable, and measurable.
                </p>
                <p className="mt-4 text-background/70 leading-relaxed">
                  Chase Agents is model-agnostic. Your automations run inside Claude,
                  ChatGPT, or any MCP-compatible environment.{" "}
                  <span className="font-semibold text-background">
                    No vendor lock-in. No single point of failure.
                  </span>
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-start">
              {/* Architecture flow */}
              <Reveal direction="left">
                <div className="flex flex-col items-center gap-2">
                  {ARCH_FLOW.map((node, i) => (
                    <div key={node} className="flex w-full flex-col items-center">
                      <div
                        className={`w-full max-w-xs rounded-xl border px-5 py-3 text-center text-sm font-semibold ${
                          node === "Chase Agents"
                            ? "border-teal/50 bg-teal/15 text-background"
                            : "border-background/10 bg-background/[0.05] text-background/85"
                        }`}
                      >
                        {node}
                      </div>
                      {i < ARCH_FLOW.length - 1 && (
                        <span className="my-0.5 h-4 w-px bg-background/20" />
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Five-Layer Measurement */}
              <Reveal direction="right" delay={0.1}>
                <div>
                  <p className="mb-5 text-sm font-bold uppercase tracking-[0.12em] text-teal">
                    How we measure impact
                  </p>
                  <MeasurementLayers />
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <div className="mt-12 text-center">
                <Button
                  size="lg"
                  className="rounded-full bg-teal text-teal-foreground hover:bg-teal/90 font-semibold px-8 h-12"
                  onClick={() => window.open(CHASE_AGENTS_URL, "_blank")}
                >
                  Explore Chase Agents
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 6. CASE STUDIES ── */}
        <section className="bg-secondary/40 py-16 md:py-20 px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="text-foreground text-center">
                Real deployments. <span className="text-teal">Measurable outcomes.</span>
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* CCID */}
              <Reveal delay={0}>
                <Link
                  to="/blog/case-study-building-practical-ai-capacity-with-the-ccid"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-lg"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-teal/10 p-2.5">
                      <Building2 className="h-4 w-4 text-teal" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      Government
                    </span>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-foreground group-hover:text-teal transition-colors">
                    CCID
                  </h4>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">
                    Digital transformation across organisational operations.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5">
                    {[
                      { m: "90%", l: "Faster processing" },
                      { m: "100%", l: "Paperless" },
                      { m: "4×", l: "Operational visibility" },
                      { m: "60%", l: "Lower operating costs" },
                    ].map((s) => (
                      <div key={s.l} className="text-center">
                        <span className="font-heading text-xl font-extrabold text-teal">{s.m}</span>
                        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-teal opacity-0 transition-opacity group-hover:opacity-100">
                    Read Case Study <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>

              {/* Moya (featured) */}
              <Reveal delay={0.1}>
                <a
                  href="/case-study/"
                  className="group flex h-full flex-col rounded-2xl border border-teal/30 bg-teal/[0.05] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal/50 hover:shadow-lg"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-teal/10 p-2.5">
                      <Zap className="h-4 w-4 text-teal" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      Technology
                    </span>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-foreground group-hover:text-teal transition-colors">
                    Moya
                  </h4>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    AI-enabled research operations at scale.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-teal/20 pt-5">
                    {[
                      { m: "10.4×", l: "Productivity" },
                      { m: "+18%", l: "Revenue increase" },
                      { m: "3wk→1hr", l: "Cycle time" },
                      { m: "<$5/mo", l: "Automation cost" },
                    ].map((s) => (
                      <div key={s.l} className="text-center">
                        <span className="font-heading text-xl font-extrabold text-teal">{s.m}</span>
                        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 flex-1 text-sm font-medium text-foreground leading-relaxed">
                    A four-person team now operates at the output capacity of a full department.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-teal opacity-0 transition-opacity group-hover:opacity-100">
                    Read Case Study <ArrowRight className="h-4 w-4" />
                  </span>
                </a>
              </Reveal>

              {/* Heineken */}
              <Reveal delay={0.2}>
                <Link
                  to="/case-study/heineken"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-lg"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-teal/10 p-2.5">
                      <Leaf className="h-4 w-4 text-teal" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      Manufacturing
                    </span>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-foreground group-hover:text-teal transition-colors">
                    Heineken
                  </h4>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">
                    Digital programme delivery &amp; performance reporting for a national
                    circular economy programme.
                  </p>
                  <div className="mt-5 space-y-2.5 border-t border-border pt-5">
                    {[
                      "ETL data pipeline & data quality",
                      "Standardised KPI reporting across regions",
                      "Executive operational dashboards",
                    ].map((r) => (
                      <div key={r} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                        <span className="text-sm text-muted-foreground">{r}</span>
                      </div>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-teal opacity-0 transition-opacity group-hover:opacity-100">
                    Read Case Study <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── 7. INDUSTRIES ── */}
        <section className="bg-background py-16 md:py-20 px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="text-foreground text-center max-w-3xl mx-auto">
                Built for operations-intensive organisations.
              </h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {INDUSTRIES.map((ind, i) => (
                <Reveal key={ind.name} delay={i * 0.05}>
                  <div className="flex h-full items-center gap-3 rounded-2xl border border-border bg-card p-5">
                    <div className="inline-flex rounded-lg bg-teal/8 p-2.5">
                      <ind.icon className="h-5 w-5 text-teal" />
                    </div>
                    <span className="font-heading text-sm font-bold text-foreground">
                      {ind.name}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. WHY CHASE CONTINENTAL ── */}
        <section className="bg-foreground py-16 md:py-20 px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="text-background text-center">
                Why enterprise teams choose Chase Continental.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WHY.map((w, i) => (
                <Reveal key={w.title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-background/10 bg-background/[0.04] p-7">
                    <div className="mb-4 inline-flex rounded-xl bg-teal/10 p-3">
                      <w.icon className="h-5 w-5 text-teal" />
                    </div>
                    <h4 className="font-heading text-base font-bold text-background mb-2">
                      {w.title}
                    </h4>
                    <p className="text-sm text-background/60 leading-relaxed">{w.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. LEADERSHIP ── */}
        <section className="bg-background py-16 md:py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-foreground">
                  Built by operators who ship production systems.
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                  We're a product-led AI studio focused on operational software that
                  businesses depend on every day.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {TEAM.map((member, i) => (
                <Reveal key={member.name} delay={i * 0.12}>
                  <div className="h-full rounded-2xl border border-border bg-card p-7">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-5 h-24 w-24 overflow-hidden rounded-full ring-2 ring-border">
                        <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-foreground">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-teal">{member.role}</p>
                      <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
                        {member.bio}
                      </p>
                      <div className="mt-5 flex gap-2">
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="inline-flex items-center justify-center rounded-full border border-border p-2.5 text-muted-foreground transition-colors hover:border-teal/30 hover:text-teal">
                          <Linkedin className="h-4 w-4" />
                        </a>
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer" aria-label="X" className="inline-flex items-center justify-center rounded-full border border-border p-2.5 text-muted-foreground transition-colors hover:border-teal/30 hover:text-teal">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 10. FINAL CTA ── */}
        <section className="bg-foreground py-20 md:py-24 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <h2 className="text-background text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em]">
                Ready to automate the work that's{" "}
                <span className="text-teal">slowing your business down?</span>
              </h2>
              <p className="mt-6 max-w-xl mx-auto text-lg text-background/60 leading-relaxed">
                Every successful transformation starts with one workflow. We'll map your
                critical path, classify the highest-impact interventions, build a pilot,
                and create a roadmap for broader adoption.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-teal text-teal-foreground hover:bg-teal/90 font-semibold px-8 h-12"
                  onClick={() => window.open(BOOK_CALL_URL, "_blank")}
                >
                  Book a Strategy Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-background/20 bg-transparent text-background hover:bg-background/10 font-semibold px-8 h-12"
                  onClick={() => window.location.assign("/#results")}
                >
                  See Case Studies
                </Button>
              </div>
              <p className="mt-5 text-sm text-background/40">
                30-minute consultation • No obligation • Implementation roadmap included
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
