import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, CheckSquare, Calculator, BookOpen, Activity, Layers, Shield, FileText, Zap, FileBarChart, Scale, ShoppingCart, User } from "lucide-react";

const resources = [
  {
    slug: "silo-audit-checklist",
    title: "2026 AI Agent Silo Audit Checklist",
    badge: "Free Checklist",
    description: "Run a 10-minute audit to spot lock-in risk and workflow breakpoints before they cost you.",
    icon: CheckSquare,
    accent: "from-cyan-500 to-cyan-300",
    status: "coming-soon" as const,
  },
  {
    slug: "automation-roi-calculator",
    title: "AI ROI Calculator (2026 Benchmarks)",
    badge: "Free Calculator",
    description: "Pick sector + size to get projected savings, ROI, and payback in seconds—benchmarks do the work.",
    icon: Calculator,
    accent: "from-violet-500 to-fuchsia-400",
    status: "coming-soon" as const,
  },
  {
    slug: "transformation-playbook",
    title: "Ops-Led AI Transformation Playbook",
    badge: "Free Playbook",
    description: "A step-by-step guide to move from manual workflows to reliable automation your team trusts.",
    icon: BookOpen,
    accent: "from-emerald-500 to-teal-400",
    status: "coming-soon" as const,
  },
  {
    slug: "reliability-assessment",
    title: "Production Reliability Assessment",
    badge: "Free Assessment",
    description: "Answer 10 questions. Get a reliability score and a prioritized fix list.",
    icon: Activity,
    accent: "from-amber-500 to-orange-400",
    status: "coming-soon" as const,
  },
  {
    slug: "orchestration-swipe-file",
    title: "Neutral Orchestration Swipe File",
    badge: "Swipe File",
    description: "Real patterns you can adapt across logistics, BPO, and e-commerce.",
    icon: Layers,
    accent: "from-blue-600 to-blue-400",
    status: "coming-soon" as const,
  },
  {
    slug: "peak-season-survival-guide",
    title: "Peak Season Automation Survival Guide",
    badge: "Free Guide",
    description: "A survival guide for keeping workflows stable when volume spikes.",
    icon: Shield,
    accent: "from-pink-500 to-rose-400",
    status: "coming-soon" as const,
  },
  {
    slug: "deterministic-blueprint",
    title: "Deterministic Mastery Protocol™ Blueprint",
    badge: "Template",
    description: "Define steps, exceptions, and checkpoints—so automation stays consistent.",
    icon: FileText,
    accent: "from-purple-600 to-indigo-400",
    status: "coming-soon" as const,
  },
  {
    slug: "5-day-pilot-challenge",
    title: "5-Day Pilot Challenge",
    badge: "5-Day Challenge",
    description: "10 minutes per day. By day 5 you'll have a clear plan and success metrics.",
    icon: Zap,
    accent: "from-sky-400 to-sky-300",
    status: "coming-soon" as const,
  },
  {
    slug: "ccid-case-study",
    title: "CCID Case Study Deep Dive + ROI",
    badge: "Case Study",
    description: "A real team cut errors and sped up reporting. Get the deep dive.",
    icon: FileBarChart,
    accent: "from-teal-500 to-cyan-400",
    status: "coming-soon" as const,
  },
  {
    slug: "neutral-vs-proprietary-scorecard",
    title: "Neutral vs Proprietary Scorecard",
    badge: "Scorecard",
    description: "Score your tools in 5 minutes. Get a clear recommendation.",
    icon: Scale,
    accent: "from-slate-400 to-cyan-400",
    status: "coming-soon" as const,
  },
  {
    slug: "shopify-ops-automation",
    title: "Shopify Ops Automation",
    badge: "Use Cases",
    description: "See how Chase Agents automates orders, inventory, fulfillment, returns, support, and finance on Shopify.",
    icon: ShoppingCart,
    accent: "from-green-500 to-emerald-400",
    status: "coming-soon" as const,
  },
  {
    slug: "charles",
    title: "Charles — AI Systems Builder",
    badge: "Profile",
    description: "Meet the founder building reliable AI systems and intelligent workflows for real organizations.",
    icon: User,
    accent: "from-indigo-500 to-violet-400",
    status: "coming-soon" as const,
  },
];

const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-block mb-4 rounded-full border border-teal/30 bg-teal/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal">
            Resources & Tools
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-heading leading-tight mb-4">
            Free resources to help you ship
            <br />
            <span className="text-teal">reliable automation</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Checklists, calculators, playbooks, and templates—built from real engagements, backed by industry research.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="relative pb-24 px-6">
        <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => {
            const Icon = r.icon;
            return (
              <Link
                key={r.slug}
                to={`/resources/${r.slug}`}
                className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 hover:border-teal/40 transition-all duration-300 hover:shadow-lg hover:shadow-teal/5"
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${r.accent} mb-4`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">
                  {r.badge}
                </span>
                <h3 className="text-lg font-bold font-heading mb-2 group-hover:text-teal transition-colors">
                  {r.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {r.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-teal opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResourcesPage;
