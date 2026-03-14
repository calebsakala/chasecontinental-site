import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ShoppingCart, Package, Truck, RotateCcw, Headphones, DollarSign,
  ShieldCheck, AlertTriangle, CheckCircle2, BarChart3, Clock, Zap, Bot,
  ChevronDown, ChevronUp, Eye, Users, X, ChevronLeft, ChevronRight, ExternalLink,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import ShopifyControlTower from "@/components/products/ShopifyControlTower";

import shopifyHero from "@/assets/shopify/shopify-hero.jpg";
import orderFulfillment from "@/assets/shopify/order-fulfillment.jpg";
import inventoryManagement from "@/assets/shopify/inventory-management.jpg";
import supportAutomation from "@/assets/shopify/support-automation.jpg";
import financeReconciliation from "@/assets/shopify/finance-reconciliation.jpg";
import shippingLogistics from "@/assets/shopify/shipping-logistics.jpg";
import returnsProcessing from "@/assets/shopify/returns-processing.jpg";

const CHASE_AGENTS_URL = "https://chaseagents.com";
const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";

/* ─── Use Cases ─── */
const USE_CASES = [
  {
    id: "order-fulfillment",
    icon: ShoppingCart,
    title: "Order & Fraud Management",
    subtitle: "From checkout to fulfillment — zero manual handoffs",
    image: orderFulfillment,
    description: "Automatically flag high-risk orders, route fraud signals to review queues, and sync holds across Shopify and your WMS — before a single package ships.",
    automations: [
      "Auto-hold orders with fraud signals (address mismatch, velocity, card patterns)",
      "Route flagged orders to a review queue with pre-built evidence packs",
      "Sync order edits, cancellations, and holds to WMS/3PL in real-time",
      "Auto-tag chargeback-prone patterns and generate dispute-ready documentation",
    ],
    stats: { metric: "96%", label: "Fraud detection accuracy" },
    dashboardView: "orders" as const,
  },
  {
    id: "inventory",
    icon: Package,
    title: "Inventory Reconciliation",
    subtitle: "One source of truth across every channel",
    image: inventoryManagement,
    description: "Reconcile stock levels across Shopify, your WMS, and 3PL partners automatically. Prevent overselling and hide products before customers find out-of-stock items.",
    automations: [
      "Continuous stock reconciliation: Shopify ↔ WMS ↔ 3PL",
      "Auto-hide products or switch to pre-order when stock is unsafe",
      "Detect SKU mapping errors and generate fix tasks for ops",
      "Low-stock alerts with automated reorder triggers",
    ],
    stats: { metric: "99.2%", label: "Inventory accuracy" },
    dashboardView: "inventory" as const,
  },
  {
    id: "fulfillment",
    icon: Truck,
    title: "Fulfillment & Shipping Control",
    subtitle: "Catch exceptions before your customers do",
    image: shippingLogistics,
    description: "A unified control tower for every shipment. Delayed packages, failed labels, lost parcels — surfaced and acted on automatically, not discovered by angry customers.",
    automations: [
      "Exception control tower: delayed, failed, lost — all in one view",
      "Auto-open carrier claims with pre-filled shipment details",
      "Proactive customer notifications for delayed shipments",
      "SLA monitoring and 'what is late right now' reporting",
    ],
    stats: { metric: "4x", label: "Faster issue resolution" },
    dashboardView: "fulfillment" as const,
  },
  {
    id: "returns",
    icon: RotateCcw,
    title: "Returns & Refunds Control",
    subtitle: "Auto-approve the easy ones. Escalate the rest.",
    image: returnsProcessing,
    description: "Classify every return request automatically. Low-risk returns get instant approval. High-value or suspicious returns get routed for manual review — with full context.",
    automations: [
      "Auto-classify: refund, exchange, damaged, missing item",
      "Low-risk auto-approval with instant label generation",
      "High-risk escalation with customer history and order context",
      "Refund and discount leakage tracking and alerting",
    ],
    stats: { metric: "74%", label: "Returns auto-approved" },
    dashboardView: "returns" as const,
  },
  {
    id: "support",
    icon: Headphones,
    title: "Support Ticket Routing",
    subtitle: "Classify, route, draft — before an agent touches it",
    image: supportAutomation,
    description: "Every incoming ticket is classified by type, routed to the right queue, and presented with an AI-drafted, policy-safe response template — ready for agent approval.",
    automations: [
      "Auto-classify tickets: WISMO, refund, product question, billing",
      "Route to specialised queues (returns, escalations, VIP)",
      "AI-drafted responses with policy-safe templates and approval gates",
      "WISMO deflection with proactive tracking automation",
    ],
    stats: { metric: "68%", label: "Tickets auto-deflected" },
    dashboardView: "support" as const,
  },
  {
    id: "finance",
    icon: DollarSign,
    title: "Finance & Reconciliation",
    subtitle: "Close the day in minutes, not hours",
    image: financeReconciliation,
    description: "Automated payout reconciliation, refund tracking, and leakage detection. A daily ops-close summary generated automatically — so finance never chases ops for numbers.",
    automations: [
      "Shopify payout reconciliation against orders, refunds, and fees",
      "Anomaly detection and variance alerting",
      "Refund and discount leakage reports",
      "Daily 'ops close' summary — fulfillment, exceptions, revenue",
    ],
    stats: { metric: "< 2 hrs", label: "Daily ops close (from 6+ hrs)" },
    dashboardView: "finance" as const,
  },
];

/* ─── Gallery Frames ─── */
const GALLERY_FRAMES = [
  { id: "overview", label: "Ops Overview", view: "overview" as const },
  { id: "orders", label: "Order Queue", view: "orders" as const },
  { id: "inventory", label: "Inventory Sync", view: "inventory" as const },
  { id: "fulfillment", label: "Fulfillment Tracker", view: "fulfillment" as const },
  { id: "returns", label: "Returns Hub", view: "returns" as const },
  { id: "support", label: "Support Routing", view: "support" as const },
  { id: "finance", label: "Finance Close", view: "finance" as const },
  { id: "settings", label: "Automation Rules", view: "settings" as const },
];

/* ─── FAQ ─── */
const FAQ_ITEMS = [
  { q: "Do we need to replace our existing Shopify apps?", a: "No. Chase Agents layers automation on top of your existing stack — Shopify, your WMS, 3PL, helpdesk, and accounting tools stay in place. We connect and orchestrate them." },
  { q: "How is this different from Shopify Flow?", a: "Shopify Flow is great for simple triggers. Chase Agents builds production-grade, cross-system workflows with exception handling, monitoring, audit logs, and deterministic execution — the kind that actually survive in production." },
  { q: "Is AI going to make decisions without human oversight?", a: "AI suggests, humans approve, workflows execute deterministically. Every decision point that matters has an approval gate, audit trail, and rollback mechanism." },
  { q: "How long does it take to get started?", a: "Most use cases are live within 2–4 weeks. We start with one high-impact workflow, measure the result, and expand from there." },
  { q: "What does it cost?", a: "Paid pilots start at $5K–$10K. You get a working, measurable automation — not a strategy deck." },
];

/* ─── Component ─── */
const ShopifyOpsAutomation = () => {
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    document.title = "Shopify Automation — AI-Powered Ops for Shopify | Chase Continental";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Production-grade Shopify automation: orders, inventory, fulfillment, returns, support, and finance — all orchestrated by Chase Agents.");
  }, []);

  // Auto-rotate use cases every 5 seconds
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setActiveUseCase(prev => (prev + 1) % USE_CASES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const currentUseCase = USE_CASES[activeUseCase];

  return (
    <div className="min-h-screen bg-background">
      <Header variant="transparent" />

      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={shopifyHero} alt="Shopify operations dashboard" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(7,12,25,0.95) 0%, rgba(7,12,25,0.8) 50%, rgba(7,12,25,0.5) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,12,25,0.95) 0%, transparent 50%)" }} />
        </div>

        <motion.div
          className="absolute top-1/4 right-[10%] w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(142 71% 45% / 0.6), transparent)" }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 w-full">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 mb-6 rounded-full border border-emerald-400/30 bg-emerald-400/10 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-400"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Shopify + Chase Agents
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading text-white mb-6"
              style={{ lineHeight: 1.08 }}
            >
              Automate every layer of{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-[hsl(var(--teal))] bg-clip-text text-transparent">
                Shopify operations
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed"
            >
              Orders, inventory, fulfillment, returns, support, and finance — connected end-to-end with deterministic AI automation that doesn't break in production.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href={CHASE_AGENTS_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="group text-base font-semibold px-8 py-6 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                >
                  Explore Chase Agents
                  <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </a>
              <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base font-semibold px-8 py-6 rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/40"
                >
                  Book a scoping call
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── WHAT WE AUTOMATE ─── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Use cases</span>
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Everything you can automate on Shopify</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Six automation pillars. Each one connects to your existing tools — no rip-and-replace.</p>
            </div>
          </Reveal>

          {/* Use case tabs with progress indicator */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {USE_CASES.map((uc, i) => {
              const Icon = uc.icon;
              return (
                <button
                  key={uc.id}
                  onClick={() => { setActiveUseCase(i); setIsAutoRotating(false); }}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden ${
                    i === activeUseCase
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Icon className="h-4 w-4 relative z-10" />
                  <span className="hidden sm:inline relative z-10">{uc.title}</span>
                  {i === activeUseCase && isAutoRotating && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-[3px] bg-white/40"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      key={`progress-${activeUseCase}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active use case detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeUseCase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-10 items-start"
            >
              {/* Left: Image + stats */}
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-border/60">
                  <img
                    src={currentUseCase.image}
                    alt={currentUseCase.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="inline-flex items-center gap-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 px-5 py-3">
                      <span className="text-3xl font-bold font-heading text-white">{currentUseCase.stats.metric}</span>
                      <span className="text-xs text-white/80">{currentUseCase.stats.label}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <currentUseCase.icon className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-heading">{currentUseCase.title}</h3>
                      <p className="text-sm text-muted-foreground">{currentUseCase.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{currentUseCase.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60 mb-4">What Chase Agents automates</h4>
                  <ul className="space-y-3">
                    {currentUseCase.automations.map((item, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: j * 0.08 }}
                        className="flex gap-3 text-sm"
                      >
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <a href={CHASE_AGENTS_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="mt-4 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl px-6 py-5 text-sm font-semibold">
                    See this in Chase Agents <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── HOW IT WORKS (Reliability) ─── */}
      <section className="py-24 px-6 bg-card/50">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center mb-14">
              <span className="inline-block mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">How it works</span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">AI that doesn't break in production</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">We don't rely on AI for execution. We use AI for assistance and deterministic workflows for correctness.</p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Bot, title: "AI-assisted", desc: "Classification, drafting, summarization — AI handles the fuzzy work" },
              { icon: ShieldCheck, title: "Deterministic execution", desc: "Refunds, holds, inventory — workflows that must be correct run deterministically" },
              { icon: Eye, title: "Full audit trail", desc: "Every action logged, every decision traceable, rollback on every workflow" },
              { icon: Users, title: "Human approvals", desc: "Approval gates on every high-stakes decision — nothing ships without oversight" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal key={i}>
                  <div className="text-center p-6 rounded-xl border border-border/60 bg-card h-full">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-emerald-500" />
                    </div>
                    <h3 className="font-bold font-heading mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CONTROL TOWER GALLERY ─── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="text-center mb-14">
              <span className="inline-block mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Platform preview</span>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">The Shopify Ops Control Tower</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">A unified view of every order, shipment, return, and exception — across every tool in your stack. Powered by Chase Agents.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GALLERY_FRAMES.map((frame, i) => (
              <motion.button
                key={frame.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                className="group relative rounded-xl border border-border/60 bg-card overflow-hidden aspect-[4/3] hover:border-emerald-500/40 transition-all hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <div className="absolute inset-0 p-2 overflow-hidden">
                  <div className="w-full h-full rounded-lg overflow-hidden transform scale-[0.5] origin-top-left" style={{ width: "200%", height: "200%" }}>
                    <ShopifyControlTower view={frame.view} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-card via-card/80 to-transparent p-3 pt-8">
                  <p className="text-xs font-semibold">{frame.label}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl bg-card rounded-2xl border border-border overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-bold font-heading">{GALLERY_FRAMES[lightboxIndex].label}</h3>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" onClick={() => setLightboxIndex(i => (i - 1 + GALLERY_FRAMES.length) % GALLERY_FRAMES.length)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">{lightboxIndex + 1} / {GALLERY_FRAMES.length}</span>
                  <Button size="icon" variant="ghost" onClick={() => setLightboxIndex(i => (i + 1) % GALLERY_FRAMES.length)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setLightboxOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 h-[60vh] overflow-auto">
                <ShopifyControlTower view={GALLERY_FRAMES[lightboxIndex].view} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── STATS BAND ─── */}
      <section className="py-16 px-6 bg-card/50 border-y border-border/40">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "90%", label: "Reduction in manual exception handling" },
            { value: "4x", label: "Faster fulfillment issue resolution" },
            { value: "68%", label: "Support tickets auto-deflected" },
            { value: "< 2 hrs", label: "Daily ops close (from 6+ hrs)" },
          ].map((stat, i) => (
            <Reveal key={i}>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold font-heading text-emerald-500">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── WHY CHASE AGENTS ─── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-card to-emerald-500/5 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block mb-3 text-xs font-bold uppercase tracking-widest text-emerald-500">Why Chase Agents</span>
                <h2 className="text-3xl font-bold font-heading mb-4">Production-grade automation for ops-led brands</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Chase Agents is the orchestration platform that connects Shopify to your entire ops stack — WMS, 3PL, helpdesk, email/SMS, and accounting — with deterministic reliability.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Neutral control layer — works with every tool, no rip-and-replace",
                    "Deterministic workflows for the parts that must be correct",
                    "AI assistance for classification, drafting, and summarization",
                    "Full audit logs, permissions, rollback, and monitoring",
                    "Ops-owned — your team controls the workflows",
                    "Live in 2–4 weeks with measurable KPIs",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href={CHASE_AGENTS_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-emerald-500 text-white hover:bg-emerald-600 text-base font-semibold px-8 py-6 rounded-xl">
                    Explore Chase Agents <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Zap, title: "Fast deployment", desc: "2–4 week pilots" },
                  { icon: ShieldCheck, title: "Reliable", desc: "Deterministic execution" },
                  { icon: BarChart3, title: "Measurable", desc: "KPI-driven ROI" },
                  { icon: Clock, title: "Ops-led", desc: "No IT dependency" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="rounded-xl border border-emerald-500/20 bg-card p-5 text-center">
                      <Icon className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 px-6 bg-card/50">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold font-heading text-center mb-10">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-5 text-left"
                >
                  <span className="font-semibold text-sm pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />}
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
                      <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Ready to automate{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-[hsl(var(--teal))] bg-clip-text text-transparent">Shopify ops?</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Master AI agents. Eliminate tool silos. Deliver reliability.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={CHASE_AGENTS_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-base font-semibold px-8 py-6 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600">
                Explore Chase Agents <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-base font-semibold px-8 py-6 rounded-xl border-foreground/30 text-foreground hover:bg-foreground/10">
                Book a scoping call
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShopifyOpsAutomation;
