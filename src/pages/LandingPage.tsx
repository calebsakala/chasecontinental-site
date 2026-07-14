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
import heroRobot from "@/assets/hero-robot.png";
import industryAutomation from "@/assets/industry-automation.jpg";

const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";
const CHASE_AGENTS_URL = "https://chaseagents.com";

const HERO_CHIPS = ["Measurable outcomes", "Complete visibility", "Enterprise-grade reliability"];

const RESULTS = [
  { metric: "100+", label: "Workflows automated" },
  { metric: "30+", label: "Countries deployed" },
  { metric: "90%", label: "Less manual processing" },
  { metric: "10.4×", label: "Productivity gain" },
  { metric: "<$5", label: "Monthly cost per automation" },
];

const PROBLEMS = [
  { icon: Unplug, title: "Disconnected Systems", desc: "CRM, ERP, and spreadsheets run in isolation. People become the integration layer." },
  { icon: Copy, title: "Manual Operations", desc: "Teams re-key data between systems, adding delays and errors." },
  { icon: EyeOff, title: "Limited Visibility", desc: "Information arrives too late. Decisions turn reactive." },
  { icon: Bot, title: "AI That Creates More Work", desc: "Copilots need constant prompting. If you must ask it to act, it added work." },
];

const SOLUTIONS = [
  { icon: Link2, title: "Connect Every System", desc: "ERP, CRM, APIs, databases, and legacy tools in one flow." },
  { icon: Users, title: "Digital Employees", desc: "AI agents run repetitive operational work around the clock." },
  { icon: ShieldCheck, title: "Reliability First", desc: "Deterministic execution with validation and exception handling." },
  { icon: SlidersHorizontal, title: "Human Control", desc: "Autonomous, approval-gated, or human-in-the-loop. Your call." },
  { icon: BarChart3, title: "Built-In Measurement", desc: "Monitoring, reporting, and measurable ROI in every automation." },
  { icon: Library, title: "Institutional Knowledge", desc: "A knowledge base of process logic and reusable components. It outlasts the tools and the team." },
];

const PHASES = [
  { n: "01", title: "Diagnostic Framing", desc: "Map the operation end to end. Separate real judgment from mechanical work. The critical path becomes the build plan." },
  { n: "02", title: "Intervention Classification", desc: "Every intervention is classified before we build, so the right tool fits the right task." },
  { n: "03", title: "Precision Intervention", desc: "Build the smallest automation at the biggest bottleneck. Measure, then expand. We insert into workflows, never rebuild them." },
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
  { icon: Bot, title: "AI Must Not Create Work", desc: "If you must prompt it, it isn't finished. Our systems observe, decide, and act on their own." },
  { icon: ShieldCheck, title: "Production Ready", desc: "Built for real operations from day one." },
  { icon: Cpu, title: "Reliable AI", desc: "AI plans. Deterministic systems execute. What must be right, is." },
  { icon: Eye, title: "Observable", desc: "Every workflow is measurable and traceable." },
  { icon: GitBranch, title: "Model-Independent", desc: "No lock-in. When models change, your operations don't." },
  { icon: Target, title: "Business Outcomes", desc: "Start with a baseline. End with a documented result." },
];

const TEAM = [
  {
    name: "Charles K. Chirongoma",
    role: "CEO · Product-led Transformation",
    bio: "Charles builds systems that make organisations run better, across economics, data, and industrial development. He turns slow, manual operations into fast, measurable execution.",
    image: "/static/images/team/charles.png",
    linkedin: "https://www.linkedin.com/in/charles-k-chirongoma-41327716b/",
    twitter: "https://x.com/tue_sday",
  },
  {
    name: "Caleb Sakala",
    role: "CTO · Product & Engineering",
    bio: "Caleb has shipped software and AI across the US, Brazil, and Cyprus. He builds systems that stay reliable in real business conditions.",
    image: "/static/images/team/caleb.jpg",
    linkedin: "https://www.linkedin.com/in/calebsakala",
    twitter: "https://x.com/bytecaleb",
  },
];

const SectionRule = () => (
  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
);

const TrustedRow = () => (
  <div className="mt-20 border-t border-border/60 pt-10">
    <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">Trusted by</p>
    <div className="flex flex-wrap items-end justify-center gap-x-12 gap-y-8 md:gap-x-16">
      {[
        { name: "CCID", industry: "Government", logo: "/static/images/ccid-logo.svg" },
        { name: "Heineken", industry: "Manufacturing", logo: "/static/images/heineken-logo.svg" },
        { name: "Moya App", industry: "Technology", logo: "/static/images/moya-logo.png" },
        { name: "Datafree", industry: "Connectivity", logo: "/static/images/datafree-logo.png" },
        { name: "HealthyMe Living", industry: "E-commerce", logo: "/static/images/healthymeliving-logo.png" },
      ].map((partner) => (
        <div key={partner.name} className="flex flex-col items-center text-center">
          <div className="flex h-10 md:h-11 items-center opacity-80 transition-opacity hover:opacity-100">
            <img src={partner.logo} alt={partner.name} className="h-full w-auto max-w-[170px] object-contain" />
          </div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mt-2">{partner.industry}</p>
        </div>
      ))}
    </div>
    <div className="mt-12 border-t border-border/40 pt-8">
      <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-7">Backed by</p>
      <div className="flex flex-wrap items-start justify-center gap-x-16 gap-y-8 md:gap-x-24">
        <div className="flex flex-col items-center">
          <div className="flex h-16 md:h-[72px] items-center">
            <img src="/static/images/google-cloud-logo.svg" alt="Google Cloud for Startups" className="h-[26px] md:h-[30px] w-auto" />
          </div>
          <p className="mt-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">for Startups</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex h-16 md:h-[72px] items-center">
            <img src="/static/images/ms-startups-badge.png" alt="Microsoft for Startups Founders Hub" className="h-16 md:h-[72px] w-auto rounded-xl" />
          </div>
          <p className="mt-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Founders Hub</p>
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
        <section className="relative flex items-center overflow-hidden bg-gradient-to-b from-secondary/25 to-background">
          <div className="pointer-events-none absolute top-1/3 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-teal/5 blur-[180px]" />
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
                  className="mt-6 max-w-md text-base md:text-lg text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  Reliable AI systems that automate operations and connect the software your
                  business already runs on.
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
                    className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold px-7 h-12 text-sm transition-all duration-300"
                    onClick={() => window.open(BOOK_CALL_URL, "_blank")}
                  >
                    Book a Strategy Call
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-border text-foreground hover:bg-accent font-semibold px-7 h-12 text-sm transition-all duration-300"
                    onClick={() => window.location.assign("/products")}
                  >
                    Explore Our Work
                  </Button>
                </motion.div>

                <motion.div
                  className="mt-8 flex flex-wrap items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {HERO_CHIPS.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3 text-teal" />
                      {chip}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Right side: robot hero image */}
              <motion.div
                className="relative flex justify-center lg:justify-end"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="absolute top-[34%] right-0 lg:right-[-8px] z-20 flex items-center gap-3 rounded-2xl border border-border bg-background/90 px-4 py-3 shadow-lg backdrop-blur-xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/10">
                    <CheckCircle2 className="h-4 w-4 text-teal" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground">System Status</p>
                    <p className="text-xs font-bold text-foreground">Automation Active</p>
                  </div>
                </motion.div>
                <img src={heroRobot} alt="AI automation assistant" className="w-full max-w-md lg:max-w-lg xl:max-w-xl drop-shadow-2xl" />
              </motion.div>
            </div>

            <TrustedRow />
          </div>
        </section>

        {/* ── 2. RESULTS ── */}
        <section id="results" className="bg-foreground py-16 md:py-20 px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="text-background text-center">
                Proven <span className="text-teal">in production.</span>
              </h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {RESULTS.map((r, i) => (
                <Reveal key={r.label} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-background/10 bg-background/[0.04] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-background/[0.07]">
                    <span className="font-heading text-3xl md:text-[2.5rem] font-extrabold leading-none text-teal">{r.metric}</span>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.1em] leading-relaxed text-background/55">{r.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-8 text-center text-xs text-background/40">Across client engagements and production deployments.</p>
          </div>
        </section>

        {/* ── 3. PROBLEM ── */}
        <section className="relative bg-background py-16 md:py-20 px-6">
          <SectionRule />
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full bg-destructive/10 border border-destructive/20 px-4 py-1.5 text-xs font-semibold text-destructive tracking-wide">
                  The Real Problem
                </span>
                <h2 className="mt-6 text-foreground">
                  It's not an AI problem.{" "}
                  <span className="text-teal">It's an operations problem.</span>
                </h2>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  AI doesn't fail because the models are weak. It fails because your systems
                  don't talk to each other, manual work fills the gaps, and every exception
                  needs a person. Most pilots make it worse: they add prompting, checking,
                  correcting, and rerunning.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PROBLEMS.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-destructive/25 hover:shadow-md">
                    <div className="mb-4 inline-flex rounded-xl bg-destructive/10 p-3 transition-colors group-hover:bg-destructive/15">
                      <p.icon className="h-5 w-5 text-destructive" />
                    </div>
                    <h4 className="mb-2 font-heading text-base font-bold text-foreground">{p.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. SOLUTION ── */}
        <section className="relative bg-secondary/40 py-16 md:py-20 px-6">
          <SectionRule />
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal direction="left">
                <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
                  <img src={industryAutomation} alt="AI-powered operational automation" className="w-full h-auto" />
                </div>
              </Reveal>
              <Reveal direction="right" delay={0.1}>
                <div>
                  <span className="inline-flex items-center rounded-full bg-teal/8 border border-teal/15 px-4 py-1.5 text-xs font-semibold text-teal tracking-wide">
                    Our Solution
                  </span>
                  <h2 className="mt-6 text-foreground">
                    One intelligent system, from{" "}
                    <span className="text-teal">disconnected operations.</span>
                  </h2>
                  <p className="mt-5 text-muted-foreground leading-relaxed">
                    We don't replace your software. We connect it, then automate the work
                    between every app, approval, report, and database. Everything stays
                    observable and under your control.
                  </p>
                  <p className="mt-4 font-medium text-foreground leading-relaxed">
                    The system knows when to act. Nobody has to tell it to.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SOLUTIONS.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.06}>
                  <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-md">
                    <div className="mb-4 inline-flex rounded-xl bg-teal/10 p-3 transition-colors group-hover:bg-teal/15">
                      <s.icon className="h-5 w-5 text-teal" />
                    </div>
                    <h4 className="mb-2 font-heading text-base font-bold text-foreground">{s.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4.5 HOW WE WORK ── */}
        <section className="relative bg-background py-16 md:py-20 px-6">
          <SectionRule />
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full bg-teal/8 border border-teal/15 px-4 py-1.5 text-xs font-semibold text-teal tracking-wide">
                  How We Work
                </span>
                <h2 className="mt-6 text-foreground">A methodology built for operations.</h2>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                  We don't start with AI. We start with the workflow.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PHASES.map((phase, i) => (
                <Reveal key={phase.n} delay={i * 0.1}>
                  <div className="h-full rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-2xl font-extrabold text-teal">{phase.n}</span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Phase {phase.n.replace(/^0/, "")}</span>
                    </div>
                    <h4 className="mt-4 font-heading text-lg font-bold text-foreground">{phase.title}</h4>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{phase.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-8">
                <p className="mb-5 text-sm font-semibold text-foreground">Phase 2: classify before you build.</p>
                <InterventionMatrix />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 5. CHASE AGENTS ── */}
        <section id="products" className="bg-foreground py-16 md:py-20 px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full bg-teal/10 border border-teal/20 px-4 py-1.5 text-xs font-semibold text-teal tracking-wide">
                  Enterprise Automation Platform
                </span>
                <h2 className="mt-6 text-background">Powered by Chase Agents.</h2>
                <p className="mt-5 text-background/70 leading-relaxed">
                  Every solution runs on Chase Agents, built for reliability at scale. AI plans
                  the approach. Deterministic workflows do the work. Every action is observable
                  and measurable.
                </p>
                <p className="mt-4 text-background/70 leading-relaxed">
                  Model-agnostic: run inside Claude, ChatGPT, or any MCP-compatible environment.{" "}
                  <span className="font-semibold text-background">No lock-in. No single point of failure.</span>
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center">
              <Reveal direction="left">
                <div className="overflow-hidden rounded-2xl border border-background/15 bg-background/[0.03] shadow-xl">
                  <img src="/static/images/chase-agents-hero.png" alt="Chase Agents automation platform dashboard" className="w-full" />
                </div>
              </Reveal>
              <Reveal direction="right" delay={0.1}>
                <div className="flex flex-col items-center gap-2">
                  {ARCH_FLOW.map((node, i) => (
                    <div key={node} className="flex w-full flex-col items-center">
                      <div
                        className={`w-full max-w-sm rounded-xl border px-5 py-3 text-center text-sm font-semibold transition-colors ${
                          node === "Chase Agents"
                            ? "border-teal/50 bg-teal/15 text-background"
                            : "border-background/10 bg-background/[0.05] text-background/85"
                        }`}
                      >
                        {node}
                      </div>
                      {i < ARCH_FLOW.length - 1 && <span className="my-0.5 h-4 w-px bg-background/20" />}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <div className="mx-auto mt-16 max-w-2xl">
                <p className="mb-6 text-center text-sm font-bold uppercase tracking-[0.14em] text-teal">How we measure impact</p>
                <MeasurementLayers />
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-12 text-center">
                <Button
                  size="lg"
                  className="rounded-full bg-teal text-teal-foreground hover:bg-teal/90 font-semibold px-8 h-12 transition-all duration-300"
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
        <section className="relative bg-secondary/40 py-16 md:py-20 px-6">
          <SectionRule />
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="text-center">
                <span className="inline-flex items-center rounded-full bg-teal/8 border border-teal/15 px-4 py-1.5 text-xs font-semibold text-teal tracking-wide">Case Studies</span>
                <h2 className="mt-6 text-foreground">
                  Real deployments. <span className="text-teal">Measurable outcomes.</span>
                </h2>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* CCID */}
              <Reveal delay={0}>
                <Link
                  to="/blog/case-study-building-practical-ai-capacity-with-the-ccid"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-lg"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-teal/10 p-2.5"><Building2 className="h-4 w-4 text-teal" /></div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Government</span>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-teal">CCID</h4>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">Digital transformation across operations.</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5">
                    {[
                      { m: "90%", l: "Faster processing" },
                      { m: "100%", l: "Paperless" },
                      { m: "4×", l: "Visibility" },
                      { m: "60%", l: "Lower costs" },
                    ].map((s) => (
                      <div key={s.l} className="text-center">
                        <span className="font-heading text-xl font-extrabold text-teal">{s.m}</span>
                        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-teal opacity-0 transition-opacity group-hover:opacity-100">Read Case Study <ArrowRight className="h-4 w-4" /></span>
                </Link>
              </Reveal>

              {/* Moya */}
              <Reveal delay={0.1}>
                <a
                  href="/case-study/"
                  className="group flex h-full flex-col rounded-2xl border border-teal/30 bg-teal/[0.05] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal/50 hover:shadow-lg"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-teal/10 p-2.5"><Zap className="h-4 w-4 text-teal" /></div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Technology</span>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-teal">Moya</h4>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">AI-enabled research operations at scale.</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-teal/20 pt-5">
                    {[
                      { m: "10.4×", l: "Productivity" },
                      { m: "+18%", l: "Revenue" },
                      { m: "3wk→1hr", l: "Cycle time" },
                      { m: "<$5", l: "Monthly cost" },
                    ].map((s) => (
                      <div key={s.l} className="text-center">
                        <span className="font-heading text-xl font-extrabold text-teal">{s.m}</span>
                        <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 flex-1 text-sm font-medium leading-relaxed text-foreground">A four-person team now runs at the capacity of a full department.</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-teal opacity-0 transition-opacity group-hover:opacity-100">Read Case Study <ArrowRight className="h-4 w-4" /></span>
                </a>
              </Reveal>

              {/* Heineken */}
              <Reveal delay={0.2}>
                <Link
                  to="/case-study/heineken"
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-lg"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-teal/10 p-2.5"><Leaf className="h-4 w-4 text-teal" /></div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Manufacturing</span>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-teal">Heineken</h4>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">Digital programme delivery and performance reporting for a national circular economy programme.</p>
                  <div className="mt-5 space-y-2.5 border-t border-border pt-5">
                    {["ETL data pipeline & data quality", "Standardised KPI reporting", "Executive dashboards"].map((r) => (
                      <div key={r} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                        <span className="text-sm text-muted-foreground">{r}</span>
                      </div>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-teal opacity-0 transition-opacity group-hover:opacity-100">Read Case Study <ArrowRight className="h-4 w-4" /></span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── 7. INDUSTRIES ── */}
        <section className="relative bg-background py-16 md:py-20 px-6">
          <SectionRule />
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="mx-auto max-w-2xl text-center text-foreground">Built for operations-intensive teams.</h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {INDUSTRIES.map((ind, i) => (
                <Reveal key={ind.name} delay={i * 0.05}>
                  <div className="group flex h-full items-center gap-3 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-md">
                    <div className="inline-flex rounded-lg bg-teal/8 p-2.5 transition-colors group-hover:bg-teal/15">
                      <ind.icon className="h-5 w-5 text-teal" />
                    </div>
                    <span className="font-heading text-sm font-bold text-foreground">{ind.name}</span>
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
              <h2 className="text-center text-background">Why teams choose Chase Continental.</h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WHY.map((w, i) => (
                <Reveal key={w.title} delay={i * 0.06}>
                  <div className="group h-full rounded-2xl border border-background/10 bg-background/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-background/[0.07]">
                    <div className="mb-4 inline-flex rounded-xl bg-teal/10 p-3 transition-colors group-hover:bg-teal/15">
                      <w.icon className="h-5 w-5 text-teal" />
                    </div>
                    <h4 className="mb-2 font-heading text-base font-bold text-background">{w.title}</h4>
                    <p className="text-sm leading-relaxed text-background/60">{w.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. LEADERSHIP ── */}
        <section className="relative bg-background py-16 md:py-20 px-6">
          <SectionRule />
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-foreground">Built by operators who ship production systems.</h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">A product-led AI studio building operational software businesses depend on every day.</p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {TEAM.map((member, i) => (
                <Reveal key={member.name} delay={i * 0.12}>
                  <div className="h-full rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-5 h-24 w-24 overflow-hidden rounded-full ring-2 ring-border">
                        <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-foreground">{member.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-teal">{member.role}</p>
                      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
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
        <section className="relative overflow-hidden bg-foreground py-20 md:py-24 px-6">
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/10 blur-[160px]" />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <Reveal>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-background">
                Ready to automate the work{" "}
                <span className="text-teal">slowing you down?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-background/60">
                Every transformation starts with one workflow. We map your critical path, build
                a pilot, and hand you the roadmap.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-teal text-teal-foreground hover:bg-teal/90 font-semibold px-8 h-12 transition-all duration-300"
                  onClick={() => window.open(BOOK_CALL_URL, "_blank")}
                >
                  Book a Strategy Call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-background/20 bg-transparent text-background hover:bg-background/10 font-semibold px-8 h-12 transition-all duration-300"
                  onClick={() => window.location.assign("/#results")}
                >
                  See Case Studies
                </Button>
              </div>
              <p className="mt-5 text-sm text-background/40">30-minute consultation • No obligation • Roadmap included</p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
