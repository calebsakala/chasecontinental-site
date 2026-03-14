import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Cloud,
  Settings,
  BarChart3,
  Rocket,
  Building2,
  Leaf,
  Star,
  ShieldCheck,
  Linkedin,
  Twitter,
  Shield,
  Lightbulb,
  Plug,
  AlertTriangle,
  UserX,
  Link2,
  Target,
  Users,
  Truck,
  Headphones,
  ShoppingCart,
  TrendingUp,
  HardHat,
  Gamepad2,
  Factory,
  Landmark,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import heroRobot from "@/assets/hero-robot.png";
import industryAutomation from "@/assets/industry-automation.jpg";

const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";

const services = [
  { icon: Settings, title: "AI Automation", description: "We automate workflows that consume time and create mistakes—then measure the results." },
  { icon: Cloud, title: "Custom Software Development", description: "When your tools don't fit, we build what does: internal apps, dashboards, portals, and systems." },
  { icon: Plug, title: "Systems Integration", description: "Connect your existing tools so information flows automatically instead of people moving it manually." },
  { icon: Lightbulb, title: "Process Improvement", description: "Before automating, we remove unnecessary steps so you don't automate the mess." },
  { icon: BarChart3, title: "Reporting & Analytics", description: "Faster reporting with fewer manual steps—so leadership gets visibility without delays." },
  { icon: Rocket, title: "Deployment & Support", description: "We implement, test, train your team, and provide ongoing improvements." },
];

const values = [
  { icon: Zap, title: "Practical", description: "We build things that work in real conditions—not demos that impress in a meeting and break in production." },
  { icon: ShieldCheck, title: "Reliable", description: "Every system we deliver is tested, monitored, and built to run without hand-holding." },
  { icon: Star, title: "Clear", description: "No jargon, no hidden complexity. We communicate plainly and build transparently." },
  { icon: Shield, title: "Secure", description: "Security and data integrity are non-negotiable in everything we ship." },
];

const industries = [
  {
    icon: Truck,
    title: "Logistics & Supply Chain",
    description: "Automated exception handling, document validation, SLA monitoring, and shipment tracking across 3PLs, freight, and warehousing.",
  },
  {
    icon: Headphones,
    title: "BPO & Customer Operations",
    description: "AI-assisted agent workflows, automated QA sampling, intake-to-resolution pipelines, and real-time SLA risk detection.",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce & Marketplaces",
    description: "AI triage for support, automated returns processing, inventory alerts, and lower cost-to-serve across high-volume operations.",
  },
  {
    icon: TrendingUp,
    title: "Sales & Revenue Operations",
    description: "Faster lead routing, automated pipeline hygiene, seamless handoffs between teams, and forecasting with anomaly detection.",
  },
  {
    icon: HardHat,
    title: "Mining & Natural Resources",
    description: "Operational automation for safety compliance, resource tracking, maintenance scheduling, and field-to-office data flows.",
  },
  {
    icon: Gamepad2,
    title: "iGaming & Digital Entertainment",
    description: "AI agents for advanced analytics, player behavior modeling, compliance automation, and uncovering new revenue streams from data.",
  },
  {
    icon: Factory,
    title: "Manufacturing",
    description: "Supply chain visibility, sustainability monitoring, quality control automation, and multi-regional operational reporting.",
  },
  {
    icon: Landmark,
    title: "Government & Public Sector",
    description: "Digital transformation of manual workflows, paperless operations, citizen service automation, and cross-department visibility.",
  },
];

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Header />

      <main>
        {/* ═══════════════════════════ HERO ═══════════════════════════ */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal/5 rounded-full blur-[200px] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-16 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left — Text */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.06] border border-border px-4 py-1.5 text-xs font-semibold text-muted-foreground tracking-wide">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal" />
                    </span>
                    AI Automation Studio
                  </span>
                </motion.div>

                <motion.h1
                  className="mt-8 text-4xl md:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  Reliable AI Automation at Scale.{" "}
                  <span className="text-teal">Guaranteed.</span>
                </motion.h1>

                <motion.p
                  className="mt-6 max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  We build production-grade AI automation that runs reliably inside real operations—across messy data, multiple tools, and edge cases.
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
                    Book a Free Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-border text-foreground hover:bg-accent font-semibold px-7 h-12 text-sm transition-all duration-300"
                    onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    See Our Work
                  </Button>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  className="mt-8 flex flex-wrap items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {["Shortened time to value", "Measurable outcomes", "Built to survive exceptions"].map((badge) => (
                    <span key={badge} className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-teal" />
                      {badge}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Right — Hero Image */}
              <motion.div
                className="relative flex justify-center lg:justify-end"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute top-[35%] right-0 lg:right-[-10px] z-20 rounded-2xl bg-background/90 backdrop-blur-xl border border-border shadow-lg px-4 py-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-teal/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-teal" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium">System Status</p>
                    <p className="text-xs font-bold text-foreground">Automation Active</p>
                  </div>
                </div>

                <img
                  src={heroRobot}
                  alt="AI automation robot assistant"
                  className="w-full max-w-md lg:max-w-lg xl:max-w-xl drop-shadow-2xl"
                />
              </motion.div>
            </div>

            {/* Trusted By */}
            <motion.div
              className="mt-16 border-t border-border/60 pt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">Trusted by</p>
              <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                {[
                  { name: "CCID", industry: "Government" },
                  { name: "Heineken", industry: "Manufacturing" },
                ].map((partner) => (
                  <div key={partner.name} className="text-center">
                    <span className="text-lg font-bold font-heading text-foreground">{partner.name}</span>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mt-0.5">{partner.industry}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════ PAIN SECTION ═══════════════════════════ */}
        <section className="relative overflow-hidden bg-foreground">
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-20">
            <Reveal>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full bg-destructive/15 border border-destructive/20 px-4 py-1.5 text-xs font-semibold text-destructive mb-6 tracking-wide">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Sound Familiar?
                </span>
                <h2 className="text-background max-w-3xl mx-auto">
                  Your tools don't talk to each other.{" "}
                  <span className="text-destructive">Your team pays the price.</span>
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-background/60 leading-relaxed">
                  Data lives in silos. People copy-paste between systems. Reports take days to compile. Errors compound silently. And when something breaks, nobody knows until it's too late.
                </p>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-5 mb-16">
              {[
                { icon: Plug, number: "01", title: "Siloed systems, zero flow", desc: "Your CRM doesn't talk to your ERP. Your ERP doesn't talk to your spreadsheets. Your team is the glue holding it all together—manually." },
                { icon: AlertTriangle, number: "02", title: "Manual work, invisible errors", desc: "People re-key data across tools. Mistakes pile up. By the time you spot them, the damage is done and nobody knows where it started." },
                { icon: UserX, number: "03", title: "No visibility until it's too late", desc: "Leadership asks for a report and it takes days. By the time numbers arrive, they're already stale. Decisions get made on gut feel, not data." },
              ].map((item, i) => (
                <Reveal key={item.title} delay={i * 0.1}>
                  <div className="relative rounded-2xl border border-background/10 bg-background/[0.04] p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-background/[0.07] h-full">
                    <span className="text-5xl font-black text-background/[0.04] font-heading absolute top-3 right-5 select-none">{item.number}</span>
                    <div className="h-10 w-10 rounded-xl bg-destructive/15 flex items-center justify-center mb-5">
                      <item.icon className="h-5 w-5 text-destructive" />
                    </div>
                    <h4 className="text-sm font-bold text-background mb-2">{item.title}</h4>
                    <p className="text-sm text-background/50 leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Industry stats */}
            <Reveal>
              <p className="text-center text-xs font-semibold text-background/40 uppercase tracking-[0.15em] mb-6">And the numbers confirm it</p>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { number: "42%", label: "of companies abandoned most AI initiatives in 2025", source: "S&P Global" },
                { number: "46%", label: "of AI proof-of-concepts scrapped before production", source: "S&P Global" },
                { number: "95%", label: "of enterprise AI projects fail to deliver ROI", source: "MIT 2025" },
                { number: "$40B", label: "spent on AI in 2024 with near-zero measurable impact", source: "MIT" },
              ].map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08}>
                  <div className="rounded-2xl border border-background/10 bg-background/[0.04] p-5 text-center transition-all duration-300 hover:bg-background/[0.07] h-full">
                    <span className="text-2xl md:text-3xl font-extrabold font-heading text-teal">
                      {stat.number}
                    </span>
                    <p className="mt-2 text-xs text-background/50 leading-relaxed">{stat.label}</p>
                    <p className="mt-1.5 text-[10px] text-background/30 uppercase tracking-wider font-bold">{stat.source}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ OUR APPROACH ═══════════════════════════ */}
        <section className="relative overflow-hidden bg-secondary/50">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-20">
            <Reveal>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal/8 border border-teal/15 px-4 py-1.5 text-xs font-semibold text-teal mb-6 tracking-wide">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  What We Actually Do
                </span>
                <h2 className="text-foreground max-w-4xl mx-auto">
                  We don't replace your tools.{" "}
                  <span className="text-teal">We make them 10× more powerful.</span>
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-muted-foreground leading-relaxed">
                  We install automation that connects your existing systems into one coordinated flow. Your tools stay. The manual work disappears. You get digital employees and agentic automations running inside your current platform—reliably, measurably.
                </p>
              </div>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <Reveal direction="left">
                <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
                  <img
                    src={industryAutomation}
                    alt="Industrial automation with AI-powered analytics and robotic systems in a modern warehouse"
                    className="w-full h-auto"
                  />
                </div>
              </Reveal>

              <Reveal direction="right" delay={0.15}>
                <div className="space-y-3">
                  {[
                    { icon: Link2, title: "Connect every system you already use", desc: "ERP, CRM, databases, spreadsheets, legacy tools—we wire them together so data flows automatically instead of your team moving it by hand." },
                    { icon: Zap, title: "Build digital employees", desc: "Agentic automations that handle repetitive tasks 24/7—processing, checking, routing, reporting—without human intervention unless you want it." },
                    { icon: Shield, title: "Reliability built in from day one", desc: "Automated error checks, exception queues, and monitoring. When something unexpected happens, the system catches it—not your team three days later." },
                    { icon: Users, title: "Built for adoption, not IT dependency", desc: "Frontline workers use the tools directly. No IT bottleneck for maintenance. When people leave, the system keeps running—knowledge stays in the workflow, not in someone's head." },
                    { icon: Target, title: "Measurable outcomes, not promises", desc: "Every automation ships with reporting and KPIs. You see exactly what changed, what improved, and where to go next." },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-background/50 transition-all duration-300">
                      <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-teal/10 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-teal" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ INDUSTRIES ═══════════════════════════ */}
        <section className="relative overflow-hidden bg-background">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-20">
            <Reveal>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.06] border border-border px-4 py-1.5 text-xs font-semibold text-muted-foreground mb-6 tracking-wide">
                  Industries We Serve
                </span>
                <h2 className="text-foreground max-w-3xl mx-auto">
                  Proven across sectors where{" "}
                  <span className="text-teal">operations matter most</span>
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-muted-foreground leading-relaxed">
                  We work with operations-heavy businesses that need reliability, not experiments. From logistics to iGaming, we automate the workflows that slow teams down.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {industries.map((ind, i) => (
                <Reveal key={ind.title} delay={i * 0.06}>
                  <div className="relative rounded-2xl border border-border bg-card p-6 group hover:shadow-md hover:-translate-y-1 transition-all duration-300 hover-border-snake snake-variant-thin-2xl glow-teal-hover h-full">
                    <svg className="snake-svg" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" />
                    </svg>
                    <div className="mb-4 inline-flex rounded-xl bg-teal/8 p-3 group-hover:bg-teal/12 transition-colors duration-300">
                      <ind.icon className="h-5 w-5 text-teal" />
                    </div>
                    <h4 className="text-sm mb-2 font-bold font-heading text-foreground">{ind.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ind.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ IMPACT STATS ═══════════════════════════ */}
        <section className="relative overflow-hidden bg-foreground">
          <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20">
            <Reveal>
              <div className="text-center mb-14">
                <h2 className="text-background">
                  Built for impact.{" "}
                  <span className="text-background/50">Measured by results.</span>
                </h2>
                <p className="text-background/60 max-w-2xl mx-auto mt-5 leading-relaxed">
                  We build AI automation and custom software that delivers real, measurable business outcomes.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { number: "7+", label: "Years combined experience" },
                { number: "100+", label: "Businesses automated" },
                { number: "30+", label: "Countries with active presence" },
                { number: "3×", label: "Faster turnaround on repetitive work" },
                { number: "89%", label: "Less errors with automated checks" },
              ].map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08}>
                  <div className="rounded-2xl border border-background/10 bg-background/[0.04] p-6 text-center transition-all duration-300 hover:bg-background/[0.07] hover:-translate-y-1 h-full">
                    <span className="text-3xl md:text-4xl font-extrabold font-heading text-teal">
                      {stat.number}
                    </span>
                    <p className="mt-2 text-[11px] font-semibold text-background/50 uppercase tracking-[0.1em] leading-relaxed">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ PRODUCT — CHASE AGENTS ═══════════════════════════ */}
        <section id="products" className="relative py-16 md:py-20 px-6 overflow-hidden bg-secondary/40">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <Reveal>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal/8 border border-teal/15 px-4 py-1.5 text-xs font-semibold text-teal mb-6 tracking-wide">
                  Our Product
                </span>
                <h2 className="text-foreground">Chase Agents</h2>
                <p className="mx-auto mt-5 max-w-2xl text-muted-foreground leading-relaxed">
                  Reliable AI automation. Built for scale. The intelligence of AI with the reliability of a computer.
                </p>
              </div>
            </Reveal>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal direction="left">
                <div className="rounded-2xl overflow-hidden border border-border shadow-sm bg-card">
                  <img
                    src="/static/images/product-chase-agents.png"
                    alt="Chase Agents Automation Platform"
                    className="w-full"
                  />
                </div>
              </Reveal>
              <Reveal direction="right" delay={0.15}>
                <div>
                  <span className="inline-block rounded-full bg-foreground/[0.06] border border-border px-3.5 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.12em] mb-5">
                    Automation Platform
                  </span>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    The business standard for agentic AI. Chase Agents combines the flexibility of AI with the reliability of code—deploying automations that execute complex enterprise workflows with zero hallucinations and full observability. Define your tools, let AI plan the work, and deterministic actions execute it. Every time. The same way.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Connect to any API, database, or internal system—you control the scope",
                      "AI plans the work, deterministic actions execute it—zero hallucinations",
                      "Full transparency: see every decision, every tool call, every cost",
                      "Measurable ROI & cost control in real-time",
                      "Autonomous, human-in-the-loop, or co-pilot execution modes",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-teal flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold transition-all duration-300"
                    onClick={() => window.open(BOOK_CALL_URL, "_blank")}
                  >
                    Deploy Chase Agents <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">Start with one workflow. Expand once it's proven.</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ SERVICES ═══════════════════════════ */}
        <section id="services" className="relative py-16 md:py-20 px-6 overflow-hidden bg-background">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <Reveal>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.06] border border-border px-4 py-1.5 text-xs font-semibold text-muted-foreground mb-6 tracking-wide">
                  What We Do
                </span>
                <h2 className="text-foreground">
                  AI Automation, Custom Software &{" "}
                  <span className="text-muted-foreground">Integration</span>
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-muted-foreground leading-relaxed">
                  From identifying what to automate, to building the software, to rolling it out—we handle the full delivery.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.08}>
                  <div className="relative rounded-2xl border border-border bg-card p-7 group hover:shadow-md hover:-translate-y-1 transition-all duration-300 hover-border-snake snake-variant-thin-2xl glow-teal-hover h-full">
                    <svg className="snake-svg" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" />
                    </svg>
                    <div className="mb-5 inline-flex rounded-xl bg-teal/8 p-3 group-hover:bg-teal/12 transition-colors duration-300">
                      <s.icon className="h-5 w-5 text-teal" />
                    </div>
                    <h4 className="text-base mb-2 font-bold font-heading text-foreground">{s.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ RESULTS / CASE STUDIES ═══════════════════════════ */}
        <section id="results" className="relative py-16 md:py-20 px-6 overflow-hidden bg-foreground">
          <div className="relative z-10 mx-auto max-w-6xl">
            <Reveal>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal/10 border border-teal/20 px-4 py-1.5 text-xs font-semibold text-teal mb-6 tracking-wide">
                  Case Studies
                </span>
                <h2 className="text-background">
                  Proven results{" "}
                  <span className="text-teal">in production</span>
                </h2>
              </div>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {/* CCID Case Study */}
              <Reveal delay={0}>
                <Link to="/blog/case-study-building-practical-ai-capacity-with-the-ccid" className="group block h-full">
                  <div className="rounded-2xl border border-background/10 bg-background/[0.04] p-7 transition-all duration-300 hover:border-teal/25 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="rounded-xl bg-teal/10 p-2.5">
                        <Building2 className="h-4 w-4 text-teal" />
                      </div>
                      <span className="text-[11px] font-bold text-background/60 uppercase tracking-[0.15em]">Government</span>
                    </div>
                    <h4 className="text-lg mb-3 text-background group-hover:text-teal transition-colors font-bold">CCID Digital Transformation</h4>
                    <p className="text-sm text-background/60 leading-relaxed mb-5 flex-1">
                      Migrated manual workflows into a modern operational system with automation and visibility across the entire organisation.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-5 border-t border-background/[0.08] mb-5">
                      {[
                        { metric: "100%", label: "Paperless transition" },
                        { metric: "90%", label: "Faster processing" },
                        { metric: "4×", label: "Operational visibility" },
                        { metric: "60%", label: "Cost reduction" },
                      ].map((r) => (
                        <div key={r.label} className="text-center">
                          <span className="text-xl font-extrabold font-heading text-teal">{r.metric}</span>
                          <p className="text-[10px] text-background/50 mt-0.5 uppercase tracking-wider">{r.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-teal opacity-0 group-hover:opacity-100 transition-all duration-300">
                      Read Full Case Study <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </Reveal>

              {/* Heineken Case Study */}
              <Reveal delay={0.12}>
                <div className="group block h-full">
                  <div className="rounded-2xl border border-background/10 bg-background/[0.04] p-7 transition-all duration-300 hover:border-teal/25 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="rounded-xl bg-teal/10 p-2.5">
                        <Leaf className="h-4 w-4 text-teal" />
                      </div>
                      <span className="text-[11px] font-bold text-background/60 uppercase tracking-[0.15em]">Manufacturing</span>
                    </div>
                    <h4 className="text-lg mb-3 text-background group-hover:text-teal transition-colors font-bold">Heineken Sustainability Monitoring</h4>
                    <p className="text-sm text-background/60 leading-relaxed mb-5 flex-1">
                      Real-time monitoring and automated reporting across multi-regional operations for sustainability compliance.
                    </p>
                    <div className="space-y-2.5 pt-5 border-t border-background/[0.08]">
                      <p className="text-[10px] font-bold text-background/60 uppercase tracking-[0.15em]">Key Results</p>
                      {["Multi-region monitoring coverage", "Automated sustainability reporting", "Better visibility for executive decisions"].map((r) => (
                        <div key={r} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal mt-0.5" />
                          <span className="text-sm text-background/60">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ VALUES ═══════════════════════════ */}
        <section className="relative py-16 md:py-20 px-6 bg-secondary/40 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="relative z-10 mx-auto max-w-6xl">
            <Reveal>
              <div className="text-center mb-14">
                <h2 className="text-foreground">
                  Our <span className="text-teal">Values</span>
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-muted-foreground leading-relaxed">
                  How we build work that lasts—and gets adopted.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.1}>
                  <div className="relative rounded-2xl border border-border bg-card p-7 group hover:shadow-md hover:-translate-y-1 transition-all duration-300 hover-border-snake snake-variant-thin-2xl glow-teal-hover">
                    <svg className="snake-svg" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" />
                    </svg>
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-teal/8 p-3 group-hover:bg-teal/12 transition-colors duration-300 shrink-0">
                        <v.icon className="h-5 w-5 text-teal" />
                      </div>
                      <div>
                        <h4 className="text-base mb-1.5 font-bold font-heading text-foreground">{v.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════ LEADERSHIP ═══════════════════════════ */}
        <section className="relative py-16 md:py-20 px-6 overflow-hidden bg-background">
          <div className="relative z-10 mx-auto max-w-6xl">
            <Reveal>
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.06] border border-border px-4 py-1.5 text-xs font-semibold text-muted-foreground mb-6 tracking-wide">
                  Product company. Enterprise focus.
                </span>
                <h2 className="text-foreground">Leadership Team</h2>
                <p className="mx-auto mt-5 max-w-2xl text-muted-foreground leading-relaxed">
                  We build automation with a product mindset: reliability, usability, and measurable outcomes.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {[
                {
                  name: "Charles K. Chirongoma",
                  role: "CEO, CX, Product-led Transformation",
                  bio: "Charles builds systems that make organisations run better. With a background spanning economics, data, and industrial development, he has led digital transformation work across complex, multi-regional environments—focused on turning slow, manual operations into faster, measurable execution.",
                  image: "/static/images/team/charles.png",
                  linkedin: "https://www.linkedin.com/in/charles-k-chirongoma-41327716b/",
                  twitter: "https://x.com/tue_sday",
                },
                {
                  name: "Caleb Sakala",
                  role: "CTO, Product & Engineering",
                  bio: "Caleb is a product and engineering leader who has delivered software and AI initiatives across the US, Brazil, and Cyprus. He focuses on building high-quality systems that perform reliably in real-world business conditions.",
                  image: "/static/images/team/caleb.jpg",
                  linkedin: "https://www.linkedin.com/in/calebsakala",
                  twitter: "https://x.com/bytecaleb",
                },
              ].map((member, i) => (
                <Reveal key={member.name} delay={i * 0.15}>
                  <div className="relative rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:shadow-md hover-border-snake snake-variant-thin-2xl glow-teal-hover">
                    <svg className="snake-svg" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" />
                    </svg>
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-5 h-28 w-28 overflow-hidden rounded-full ring-2 ring-border">
                        <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                      </div>
                      <h3 className="text-xl font-bold font-heading text-foreground">{member.name}</h3>
                      <p className="text-teal font-semibold mt-1 text-sm">{member.role}</p>
                      <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">{member.bio}</p>
                      <div className="mt-5 flex gap-2">
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-border p-2.5 text-muted-foreground hover:text-teal hover:border-teal/30 transition-colors duration-200" aria-label="LinkedIn">
                          <Linkedin className="h-4 w-4" />
                        </a>
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-border p-2.5 text-muted-foreground hover:text-teal hover:border-teal/30 transition-colors duration-200" aria-label="Twitter">
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

        {/* ═══════════════════════════ CTA ═══════════════════════════ */}
        <section className="relative overflow-hidden bg-foreground">
          <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 md:py-24 text-center">
            <Reveal>
              <h2 className="text-background text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em]">
                Ready to automate the work that's{" "}
                <span className="text-teal">slowing your team down?</span>
              </h2>
              <p className="mt-6 text-lg text-background/60 leading-relaxed max-w-xl mx-auto">
                Book a call. We'll identify the best workflow to automate first and show you a clear path to implementation.
              </p>
              <div className="mt-8">
                <Button
                  size="lg"
                  className="rounded-full bg-teal text-teal-foreground hover:bg-teal/90 font-semibold px-8 h-12 transition-all duration-300"
                  onClick={() => window.open(BOOK_CALL_URL, "_blank")}
                >
                  Book a Free Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="mt-5 text-sm text-background/40">
                No commitment required · 30-minute strategy call · 100% free
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
