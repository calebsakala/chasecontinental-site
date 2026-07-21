import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  Building2,
  Leaf,
  Star,
  ShieldCheck,
  Linkedin,
  Twitter,
  Shield,
  Plug,
  AlertTriangle,
  UserX,
  Bot,
  Link2,
  Compass,
  Users,
  Wrench,
  Library,
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
import heroVision from "@/assets/hero-vision.webp";
import heroRobot from "@/assets/hero-robot.png";

const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";
const CHASE_AGENTS_URL = "https://chaseagents.com";

const HERO_CHIPS = ["Shortened time to value", "Measurable outcomes", "Built to survive exceptions"];

const PROBLEMS = [
  {
    icon: Plug,
    title: "Siloed systems, zero flow",
    description:
      "Your CRM doesn't talk to your ERP. Your ERP doesn't talk to your spreadsheets. Your team is the glue holding it all together, manually.",
  },
  {
    icon: AlertTriangle,
    title: "Manual work, invisible errors",
    description:
      "People re-key data across tools. Mistakes pile up. By the time you spot them, the damage is done and nobody knows where it started.",
  },
  {
    icon: UserX,
    title: "No visibility until it's too late",
    description:
      "Leadership asks for a report and it takes days. By the time numbers arrive, they're stale. Decisions get made on gut feel, not data.",
  },
  {
    icon: Bot,
    title: "AI that added work, not results",
    description:
      "You tried a copilot or a pilot. It needed constant prompting, never made it to production, and quietly became one more thing to manage.",
  },
];

const INDUSTRY_STATS = [
  { number: "42%", label: "of companies abandoned most AI initiatives in 2025", source: "S&P Global" },
  { number: "46%", label: "of AI proof-of-concepts scrapped before production", source: "S&P Global" },
  { number: "95%", label: "of enterprise AI projects fail to deliver ROI", source: "MIT 2025" },
  { number: "$40B", label: "spent on AI in 2024 with near-zero measurable impact", source: "MIT" },
];

const WHAT_WE_DO = [
  {
    icon: Compass,
    title: "AI strategy",
    description: "Where AI belongs, and where it doesn't.",
  },
  {
    icon: Wrench,
    title: "The right tooling",
    description: "Deterministic reliability, AI flexibility, no lock-in.",
  },
  {
    icon: Link2,
    title: "Connected systems",
    description: "ERP, CRM, and databases in one live flow.",
  },
  {
    icon: Users,
    title: "Digital employees",
    description: "Agents that run the repetitive work, around the clock.",
  },
  {
    icon: Library,
    title: "Institutional knowledge",
    description: "How your business runs, kept in the system, not in someone's head.",
  },
  {
    icon: ShieldCheck,
    title: "Resilience & results",
    description: "Exception handling, monitoring, and measurable ROI, built in.",
  },
];

const PROCESS = [
  {
    n: "01",
    title: "Understand the business",
    description:
      "Before a single tool is chosen, we map your operation end to end: the processes, the context, where data originates and moves, and where human judgment actually matters.",
  },
  {
    n: "02",
    title: "Map value & redesign the process",
    description:
      "We fix the process before we automate it. Every workflow is mapped from first brief to final delivery, then prioritised by where automation creates the most value.",
  },
  {
    n: "03",
    title: "Structure the information",
    description:
      "We get your data and knowledge foundations right. The limiting factor is rarely the technology, it's whether the business is structured to support automation at all.",
  },
  {
    n: "04",
    title: "Build, deploy & measure",
    description:
      "Only now does technology enter: the smallest automation at the biggest bottleneck, tested against live work, scaled once it's reliable, and reported at every layer.",
  },
];

const AGENT_FEATURES = [
  "Connect to any API, database, or internal system. You control the scope.",
  "AI plans the work, deterministic actions execute it: zero hallucinations.",
  "Full transparency: see every decision, every tool call, every cost.",
  "Measurable ROI and cost control in real time.",
  "Autonomous, human-in-the-loop, or co-pilot execution modes.",
];

const IMPACT_STATS = [
  { number: "100+", label: "Businesses automated" },
  { number: "30+", label: "Countries with active presence" },
  { number: "10.4×", label: "Productivity gain" },
  { number: "89%", label: "Fewer errors with automated checks" },
];

const CASE_STUDIES = [
  {
    href: "/blog/case-study-building-practical-ai-capacity-with-the-ccid",
    external: false,
    featured: false,
    icon: Building2,
    tag: "Government",
    name: "CCID Digital Transformation",
    description:
      "Migrated manual workflows into a modern operational system with automation and visibility across the entire organisation.",
    metrics: [
      { m: "100%", l: "Paperless transition" },
      { m: "90%", l: "Faster processing" },
      { m: "4×", l: "Operational visibility" },
      { m: "60%", l: "Cost reduction" },
    ],
  },
  {
    href: "/case-study/",
    external: true,
    featured: true,
    icon: Zap,
    tag: "Technology",
    name: "Moya App: AI Enablement",
    description:
      "Compressed a three-week market-research delivery cycle to under an hour and lifted revenue, running the full stack for under $5 a month.",
    metrics: [
      { m: "10.4×", l: "Efficiency gain" },
      { m: "+18%", l: "Revenue increase" },
      { m: "3wk→1hr", l: "Cycle time" },
      { m: "<$5", l: "Monthly cost" },
    ],
  },
  {
    href: "/resources/heineken-case-study",
    external: false,
    featured: false,
    icon: Leaf,
    tag: "Manufacturing",
    name: "Heineken Glass Bottle Recovery",
    description:
      "Digital delivery and reporting for Heineken's circular economy programme with Greenway Africa: field data cleaned, structured, and tracked to a monthly executive dashboard.",
    metrics: [
      { m: "252k t", l: "Glass recovered" },
      { m: "4", l: "Regions tracked" },
      { m: "14", l: "KPIs reported monthly" },
      { m: "1", l: "Trusted data source" },
    ],
  },
];

const INDUSTRIES = [
  { icon: Truck, title: "Logistics & Supply Chain", description: "Exception handling, document validation, SLA monitoring, and shipment tracking." },
  { icon: Headphones, title: "BPO & Customer Operations", description: "AI-assisted agent workflows, automated QA sampling, and real-time SLA risk detection." },
  { icon: ShoppingCart, title: "E-commerce & Marketplaces", description: "AI support triage, automated returns, inventory alerts, and lower cost-to-serve." },
  { icon: TrendingUp, title: "Sales & Revenue Operations", description: "Faster lead routing, pipeline hygiene, clean handoffs, and anomaly-aware forecasting." },
  { icon: HardHat, title: "Mining & Natural Resources", description: "Safety compliance, resource tracking, maintenance scheduling, and field-to-office data." },
  { icon: Gamepad2, title: "iGaming & Digital Entertainment", description: "Advanced analytics, player behaviour modelling, and compliance automation." },
  { icon: Factory, title: "Manufacturing", description: "Supply chain visibility, quality control automation, and multi-regional reporting." },
  { icon: Landmark, title: "Government & Public Sector", description: "Paperless operations, citizen support automation, and cross-department visibility." },
];

const VALUES = [
  { icon: Zap, title: "Practical", description: "We build things that work in real conditions, not demos that impress in a meeting and break in production." },
  { icon: ShieldCheck, title: "Reliable", description: "Every system we deliver is tested, monitored, and built to run without hand-holding." },
  { icon: Star, title: "Clear", description: "No jargon, no hidden complexity. We communicate plainly and build transparently." },
  { icon: Shield, title: "Secure", description: "Security and data integrity are non-negotiable in everything we ship." },
];

const TEAM = [
  {
    name: "Charles K. Chirongoma",
    role: "CEO · Product-led Transformation",
    bio: "Charles builds systems that make organisations run better. With a background spanning economics, data, and industrial development, he has led digital transformation across complex, multi-regional environments, turning slow, manual operations into fast, measurable execution.",
    image: "/static/images/team/charles.png",
    linkedin: "https://www.linkedin.com/in/charles-k-chirongoma-41327716b/",
    twitter: "https://x.com/tue_sday",
  },
  {
    name: "Caleb Sakala",
    role: "CTO · Product & Engineering",
    bio: "Caleb is a product and engineering leader who has delivered software and AI initiatives across the US, Brazil, and Cyprus. He builds high-quality systems that perform reliably in real-world business conditions.",
    image: "/static/images/team/caleb.jpg",
    linkedin: "https://www.linkedin.com/in/calebsakala",
    twitter: "https://x.com/bytecaleb",
  },
];

const SectionRule = () => (
  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
);

/* ── Hero glow: a soft, living light over the augmented screens.
   No floating cards, just the image, made to feel alive. ── */
const HeroGlow = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen">
    <motion.div
      className="absolute left-[12%] top-[16%] h-[46%] w-[58%] rounded-full bg-teal/25 blur-3xl"
      animate={{ opacity: [0.35, 0.7, 0.35], scale: [1, 1.06, 1] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute left-[20%] top-[26%] h-[34%] w-[40%] rounded-full bg-amber-400/25 blur-3xl"
      animate={{ opacity: [0.25, 0.6, 0.25], scale: [1.05, 1, 1.05] }}
      transition={{ duration: 6.5, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute left-[8%] top-[44%] h-[26%] w-[34%] rounded-full bg-orange-400/20 blur-3xl"
      animate={{ opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 7, delay: 1.4, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

const TRUSTED_LOGOS = [
  { name: "CCID", industry: "Government", logo: "/static/images/ccid-logo.svg" },
  { name: "Heineken", industry: "Manufacturing", logo: "/static/images/heineken-logo.svg" },
  { name: "Moya App", industry: "Technology", logo: "/static/images/moya-logo.png" },
  { name: "Datafree", industry: "Connectivity", logo: "/static/images/datafree-logo.png" },
  { name: "HealthyMe Living", industry: "E-commerce", logo: "/static/images/healthymeliving-logo.png" },
];

/* Compact trust + backed band that fits at the bottom of the hero, in full
   colour, with each logo captioned by industry and the two groups separated. */
const HeroTrust = () => (
  <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
    <div className="flex flex-col items-center gap-x-8 gap-y-4 sm:flex-row lg:items-center">
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Trusted by</span>
      <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-4">
        {TRUSTED_LOGOS.map((p) => (
          <div key={p.name} className="flex flex-col items-center text-center">
            <div className="flex h-8 items-center transition-transform duration-300 hover:scale-105">
              <img src={p.logo} alt={p.name} className="h-full w-auto max-w-[120px] object-contain" />
            </div>
            <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">{p.industry}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="hidden h-12 w-px shrink-0 bg-black/10 lg:block" aria-hidden />

    <div className="flex flex-col items-center gap-x-8 gap-y-4 sm:flex-row lg:items-center">
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Backed by</span>
      <div className="flex items-center gap-x-8">
        <img src="/static/images/google-cloud-startups.webp" alt="Google Cloud for Startups" className="h-9 w-auto" />
        <img src="/static/images/ms-startups-badge.png" alt="Microsoft for Startups Founders Hub" className="h-9 w-auto rounded-md" />
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Header />

      <main>
        {/* ── 1. HERO (copy + image + trust band, all on one screen) ── */}
        <section className="relative flex flex-col overflow-hidden bg-[#e2e2e2] lg:min-h-screen">
          {/* upper region: copy on the left, image on the right */}
          <div className="relative flex flex-1 flex-col justify-center">
            {/* the vision image: full-bleed to the right edge, bottom-anchored */}
            <motion.div
              className="pointer-events-none absolute bottom-0 right-0 top-16 hidden w-[58%] max-w-[1040px] lg:block"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={heroVision}
                alt="Operator with an augmented view of connected business systems"
                className="h-full w-full object-cover object-[right_bottom]"
              />
              <HeroGlow />
            </motion.div>
            {/* solid ground under the text so the copy is always crisp */}
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-3/5 bg-gradient-to-r from-[#e2e2e2] via-[#e2e2e2] to-transparent lg:block" />

            <div className="relative z-10 mx-auto w-full max-w-[90rem] px-6 pt-28 pb-10 lg:pt-20">
              <div className="w-full lg:max-w-xl">
                <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/50 px-4 py-1.5 text-xs font-semibold tracking-wide text-slate-600">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal" />
                  </span>
                  AI Studio
                </span>
              </motion.div>

              <motion.h1
                className="mt-8 text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-slate-900 md:text-5xl lg:text-[3.6rem]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                We build software that changes{" "}
                <span className="text-teal">the way people work.</span>
              </motion.h1>

              <motion.p
                className="mt-6 max-w-lg text-base leading-relaxed text-slate-700 md:text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                Growth shouldn't require more manual work. For organisations ready
                to scale, we build reliable AI systems that unlock efficiency and
                take operations to the next stage.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-slate-900 px-7 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800"
                  onClick={() => window.location.assign("/products")}
                >
                  See Our Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-slate-400/60 bg-white/40 px-7 text-sm font-semibold text-slate-800 transition-all duration-300 hover:bg-white/70"
                  onClick={() => window.open(CHASE_AGENTS_URL, "_blank")}
                >
                  Try Chase Agents
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/80 bg-white/50 px-3 py-1.5 text-xs font-medium text-slate-600"
                  >
                    <CheckCircle2 className="h-3 w-3 text-teal" />
                    {chip}
                  </span>
                ))}
              </motion.div>
              </div>

                {/* mobile: the same image, in flow below the copy */}
                <motion.div
                  className="relative mt-12 overflow-hidden rounded-2xl lg:hidden"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src={heroVision}
                    alt="Operator with an augmented view of connected business systems"
                    className="w-full"
                  />
                  <HeroGlow />
                </motion.div>
              </div>
            </div>
          </div>

          {/* trusted + backed, folded into the bottom of the hero */}
          <div className="relative z-10 border-t border-black/10 bg-[#e2e2e2]/80 px-6 py-6 backdrop-blur-sm">
            <div className="mx-auto max-w-[90rem]">
              <HeroTrust />
            </div>
          </div>
        </section>

        {/* ── 3. THE PROBLEM ── */}
        <section className="relative bg-background px-6 py-12 md:py-20">
          <SectionRule />
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full border border-destructive/20 bg-destructive/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-destructive">
                  Does this sound like you?
                </span>
                <h2 className="mt-6 text-foreground">
                  Your tools don't talk to each other.{" "}
                  <span className="text-teal">Your team pays the price.</span>
                </h2>
                <p className="mt-6 leading-relaxed text-muted-foreground">
                  Data lives in silos. People copy-paste between systems. Reports take days to
                  compile, errors compound silently, and the AI you tried only added more
                  prompting and checking. If a pilot quietly stalled, you're not alone.
                </p>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {PROBLEMS.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-destructive/25 hover:shadow-md">
                    <div className="mb-4 inline-flex rounded-xl bg-destructive/10 p-3 transition-colors group-hover:bg-destructive/15">
                      <p.icon className="h-5 w-5 text-destructive" />
                    </div>
                    <h4 className="mb-2 font-heading text-base font-bold text-foreground">{p.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <p className="mt-14 text-center text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
                And this is why most AI fails
              </p>
            </Reveal>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {INDUSTRY_STATS.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-border bg-card p-5 text-center">
                    <span className="font-heading text-2xl font-extrabold text-teal md:text-3xl">{stat.number}</span>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stat.label}</p>
                    <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">{stat.source}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. HOW WE WORK (PROCESS) ── */}
        <section className="relative bg-secondary/40 px-6 py-12 md:py-20">
          <SectionRule />
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center rounded-full border border-teal/15 bg-teal/8 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal">
                  How We Work
                </span>
                <h2 className="mt-6 text-foreground">
                  We don't start with technology.{" "}
                  <span className="text-teal">We start with your business.</span>
                </h2>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  Most AI projects fail because the tools get chosen before the problem is
                  understood. We do it the other way around: understand the business, fix the
                  process, structure the information, and only then automate. We don't just sell
                  you technology, we help you get the whole thing right.
                </p>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.08}>
                  <div className="group relative h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-3xl font-extrabold text-teal">{step.n}</span>
                      {i < PROCESS.length - 1 && (
                        <span className="hidden h-px flex-1 bg-gradient-to-r from-teal/40 to-transparent lg:block" aria-hidden />
                      )}
                    </div>
                    <h4 className="mt-4 font-heading text-base font-bold text-foreground">{step.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <p className="mx-auto mt-10 max-w-2xl text-center text-sm font-medium text-foreground">
                The limiting factor is rarely the technology. It's whether the business has
                structured its processes and knowledge to support automation in the first place.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── 5. WHAT WE ACTUALLY DO ── */}
        <section className="relative bg-background px-6 py-12 md:py-20">
          <SectionRule />
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <Reveal direction="left">
                <div>
                  <span className="inline-flex items-center rounded-full border border-teal/15 bg-teal/8 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal">
                    What We Actually Do
                  </span>
                  <h2 className="mt-6 text-foreground">
                    We don't replace your tools.{" "}
                    <span className="text-teal">We make them 10× more powerful.</span>
                  </h2>
                  <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
                    From strategy to tooling to the automations themselves, we handle the whole
                    thing, and the knowledge stays in the system, so it outlasts the team.
                  </p>
                </div>
              </Reveal>
              <Reveal direction="right" delay={0.1}>
                <div className="relative flex justify-center">
                  <motion.img
                    src={heroRobot}
                    alt="Digital employee"
                    className="w-full max-w-xs drop-shadow-2xl lg:max-w-sm"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute right-0 top-[36%] z-10 flex items-center gap-3 rounded-2xl border border-border bg-background/90 px-4 py-3 shadow-lg backdrop-blur-xl"
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
                </div>
              </Reveal>
            </div>

            {/* animated capability cards */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-3">
              {WHAT_WE_DO.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.07}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors duration-300 hover:border-teal/40 hover:shadow-lg"
                  >
                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-teal/[0.07] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="mb-4 inline-flex rounded-xl bg-teal/10 p-3 transition-all duration-300 group-hover:bg-teal group-hover:scale-105">
                      <s.icon className="h-5 w-5 text-teal transition-colors duration-300 group-hover:text-teal-foreground" />
                    </div>
                    <h4 className="font-heading text-base font-bold text-foreground">{s.title}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. FLAGSHIP PRODUCT: CHASE AGENTS ── */}
        <section id="products" className="scroll-mt-16 bg-foreground px-6 py-12 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal direction="left">
                <div className="relative lg:-ml-4 lg:scale-[1.04]">
                  {/* soft product glow */}
                  <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-teal/20 blur-3xl" />
                  {/* browser-window mockup frame */}
                  <div className="relative overflow-hidden rounded-2xl border border-background/15 bg-[#0d1526] shadow-2xl ring-1 ring-white/5">
                    <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
                      <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                      <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                      <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                      <div className="ml-3 flex-1">
                        <div className="mx-auto max-w-[220px] rounded-md bg-white/[0.06] px-3 py-1 text-center text-[11px] font-medium text-background/50">
                          chaseagents.com
                        </div>
                      </div>
                    </div>
                    <img
                      src="/static/images/chase-agents-hero.png"
                      alt="Chase Agents automation platform"
                      className="w-full"
                      style={{ imageRendering: "auto" }}
                    />
                  </div>
                </div>
              </Reveal>
              <Reveal direction="right" delay={0.1}>
                <div>
                  <span className="inline-flex items-center rounded-full border border-teal/20 bg-teal/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal">
                    Our Flagship Product
                  </span>
                  <h2 className="mt-6 text-background">Meet Chase Agents.</h2>
                  <p className="mt-3 text-lg font-medium text-teal">
                    The flexibility of AI with the reliability of code.
                  </p>
                  <p className="mt-4 leading-relaxed text-background/70">
                    Reliable AI automation, built for scale. Define your tools, let AI plan
                    the work, and deterministic code execute it. Every time. The same way.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {AGENT_FEATURES.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                        <span className="text-sm leading-relaxed text-background/75">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Button
                      size="lg"
                      className="h-12 rounded-full bg-teal px-8 font-semibold text-teal-foreground transition-all duration-300 hover:bg-teal/90"
                      onClick={() => window.open(CHASE_AGENTS_URL, "_blank")}
                    >
                      Try Chase Agents
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <p className="text-sm text-background/50">
                      Start with one workflow. Expand once it's proven.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── 6. PROOF: IMPACT + CASE STUDIES ── */}
        <section id="results" className="relative scroll-mt-16 bg-background px-6 py-12 md:py-20">
          <SectionRule />
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center rounded-full border border-teal/15 bg-teal/8 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal">
                  Case Studies
                </span>
                <h2 className="mt-6 text-foreground">
                  Built for impact. <span className="text-teal">Measured by results.</span>
                </h2>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  We build AI automation and custom software that delivers real,
                  measurable business outcomes.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {IMPACT_STATS.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <span className="font-heading text-3xl font-extrabold leading-none text-teal md:text-[2.5rem]">{stat.number}</span>
                    <p className="mt-3 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.1em] text-muted-foreground">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {CASE_STUDIES.map((cs, i) => {
                const CardBody = (
                  <>
                    <div className="mb-5 flex items-center gap-3">
                      <div className={`rounded-xl p-2.5 ${cs.featured ? "bg-teal/15" : "bg-teal/10"}`}>
                        <cs.icon className="h-4 w-4 text-teal" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{cs.tag}</span>
                    </div>
                    <h4 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-teal">{cs.name}</h4>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{cs.description}</p>
                    <div className={`mt-5 grid grid-cols-2 gap-3 border-t pt-5 ${cs.featured ? "border-teal/20" : "border-border"}`}>
                      {cs.metrics.map((s) => (
                        <div key={s.l} className="text-center">
                          <span className="font-heading text-xl font-extrabold text-teal">{s.m}</span>
                          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/70">{s.l}</p>
                        </div>
                      ))}
                    </div>
                    {cs.href && (
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-teal opacity-0 transition-opacity group-hover:opacity-100">
                        Read Full Case Study <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </>
                );
                const cardClass = `group flex h-full flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                  cs.featured
                    ? "border border-teal/40 bg-teal/[0.06] hover:border-teal/60 hover:shadow-md"
                    : "border border-border bg-card hover:border-teal/30 hover:shadow-md"
                }`;
                return (
                  <Reveal key={cs.name} delay={i * 0.1}>
                    {cs.href ? (
                      cs.external ? (
                        <a href={cs.href} className={cardClass}>{CardBody}</a>
                      ) : (
                        <Link to={cs.href} className={cardClass}>{CardBody}</Link>
                      )
                    ) : (
                      <div className={cardClass}>{CardBody}</div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 7. INDUSTRIES ── */}
        <section className="relative bg-secondary/40 px-6 py-12 md:py-20">
          <SectionRule />
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center rounded-full border border-teal/15 bg-teal/8 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal">
                  Industries We Serve
                </span>
                <h2 className="mt-6 text-foreground">Proven across sectors where operations matter most.</h2>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  We work with operations-heavy businesses that need reliability, not
                  experiments. We automate the workflows that slow teams down.
                </p>
              </div>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4">
              {INDUSTRIES.map((ind, i) => (
                <Reveal key={ind.title} delay={i * 0.05}>
                  <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-md">
                    <div className="mb-4 inline-flex rounded-xl bg-teal/10 p-3 transition-colors group-hover:bg-teal/15">
                      <ind.icon className="h-5 w-5 text-teal" />
                    </div>
                    <h4 className="mb-2 font-heading text-sm font-bold text-foreground">{ind.title}</h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">{ind.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. WHO WE ARE: VALUES + LEADERSHIP ── */}
        <section className="relative bg-background px-6 py-12 md:py-20">
          <SectionRule />
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <span className="inline-flex items-center rounded-full border border-teal/15 bg-teal/8 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal">
                  Product Company. Enterprise Focus.
                </span>
                <h2 className="mt-6 text-foreground">How we build work that lasts.</h2>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  We build automation with a product mindset: reliability, usability,
                  and measurable outcomes.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-4 inline-flex rounded-xl bg-teal/10 p-3">
                      <v.icon className="h-5 w-5 text-teal" />
                    </div>
                    <h4 className="mb-2 font-heading text-base font-bold text-foreground">{v.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {TEAM.map((member, i) => (
                <Reveal key={member.name} delay={i * 0.12}>
                  <div className="h-full rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-5 h-24 w-24 overflow-hidden rounded-full ring-2 ring-border">
                        <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-foreground">{member.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-teal">{member.role}</p>
                      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
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

        {/* ── 9. FINAL CTA ── */}
        <section className="relative overflow-hidden bg-foreground px-6 py-14 md:py-24">
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/10 blur-[160px]" />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <Reveal>
              <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-background md:text-4xl lg:text-5xl">
                Ready to automate the work{" "}
                <span className="text-teal">slowing your team down?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-background/60">
                Start with a focused pilot. We'll find the workflow holding back your
                growth and show you a clear path to automating it.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-teal px-8 font-semibold text-teal-foreground transition-all duration-300 hover:bg-teal/90"
                  onClick={() => window.open(BOOK_CALL_URL, "_blank")}
                >
                  Start a Pilot
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-background/20 bg-transparent px-8 font-semibold text-background transition-all duration-300 hover:bg-background/10"
                  onClick={() => window.location.assign("/#results")}
                >
                  See Case Studies
                </Button>
              </div>
              <p className="mt-5 text-sm text-background/40">30-minute strategy call · No obligation</p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
