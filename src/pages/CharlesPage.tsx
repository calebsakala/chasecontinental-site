/*
  Charles, Personal profile & thesis.
  Content authored by Charles; consistent with the main site's light theme.
*/

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Linkedin,
  Building2,
  Leaf,
  Zap,
  Brain,
  Cpu,
  Layers,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import charlesPhoto from "/static/images/team/charles.png";

const LINKEDIN_URL = "https://www.linkedin.com/in/charles-k-chirongoma-41327716b/";
const EMAIL = "charles@chasecontinental.com";

const HOW_I_BUILD = [
  {
    n: "01",
    title: "Encode judgement",
    desc: "The most valuable asset in any organization is rarely its data, it's the judgement experienced people develop over years of operating. I build systems that capture that judgement and make it available whenever it's needed.",
  },
  {
    n: "02",
    title: "Automate what should be automated",
    desc: "Not every decision deserves AI. Routing, validation, scheduling, classification, and orchestration should be deterministic wherever possible. AI is introduced only where interpretation, reasoning, or genuine uncertainty exists. Reliable systems outperform impressive demos.",
  },
  {
    n: "03",
    title: "Design for compounding",
    desc: "The first implementation is always the hardest, that's where workflows are mapped, decisions classified, and knowledge structured. Every deployment after that is faster. Every new customer improves the platform. Every improvement benefits the next organization.",
  },
];

const SYSTEMS = [
  {
    icon: Cpu,
    name: "Chase Agents",
    desc: "An execution platform that turns organizational knowledge into operational systems. Rather than another chatbot, Chase Agents embeds intelligence directly into existing workflows across WhatsApp, Slack, Microsoft Teams, and other business systems. The objective isn't conversation, it's execution.",
    href: "https://chaseagents.com",
    image: "/static/images/chase-agents-hero.png",
  },
  {
    icon: Layers,
    name: "OptiWeb",
    desc: "A platform for organizations that need their digital presence and internal operations to work as one system rather than separate projects.",
    href: "https://www.optiweb.it.com/",
    image: "/static/images/optiweb-og.webp",
  },
  {
    icon: Building2,
    name: "Precinct",
    desc: "Technology for organizations responsible for managing physical environments, combining operational data with spatial intelligence to improve decision-making.",
    href: null,
    image: null,
  },
];

const SELECTED_WORK = [
  {
    icon: Building2,
    tag: "Public Infrastructure",
    name: "CCID",
    desc: "Institutional knowledge as infrastructure.",
    href: "/blog/case-study-building-practical-ai-capacity-with-the-ccid",
    external: false,
  },
  {
    icon: Leaf,
    tag: "Enterprise Operations",
    name: "Heineken",
    desc: "Sustainability reporting and operational intelligence.",
    href: "/resources/heineken-case-study",
    external: false,
  },
  {
    icon: Zap,
    tag: "Research & AI",
    name: "Moya Research Operations",
    desc: "Scaling research through intelligent systems.",
    href: "/case-study/",
    external: true,
  },
];

const PRINCIPLES = [
  {
    title: "Organizations should become more capable over time.",
    desc: "Every deployment should leave behind structured knowledge that survives people, projects, and technology changes.",
  },
  {
    title: "AI should reduce work, not create it.",
    desc: "If someone has to constantly prompt a system to keep work moving, the architecture is incomplete. The best systems quietly observe, decide, and act.",
  },
  {
    title: "Deterministic systems deserve more respect.",
    desc: "Most operational work doesn't require intelligence. It requires consistency. Rules outperform models whenever judgement isn't necessary.",
  },
  {
    title: "Fractal Fit comes before automation.",
    desc: "Digital systems should mirror reality before attempting to improve it. Organizations don't fail because people resist technology, they fail because the technology doesn't reflect how work actually happens.",
  },
  {
    title: "Build once. Compound forever.",
    desc: "Every implementation should increase the value of the next one. Organizations shouldn't keep paying to solve the same problem twice.",
  },
];

const WRITING = [
  { title: "Why Most AI Projects Fail Inside Organizations", slug: "why-most-ai-projects-fail-inside-organizations" },
  { title: "The Shift From Tools to Agent Systems", slug: "the-shift-from-tools-to-agent-systems" },
  { title: "Why Reliable AI Matters More Than Powerful AI", slug: "why-reliable-ai-matters-more-than-powerful-ai" },
  { title: "The Production Possibility Frontier of Organizations", slug: "the-production-possibility-frontier-of-organizations" },
  { title: "Intelligence as Operating Expenditure", slug: "intelligence-as-operating-expenditure" },
  { title: "Designing Organizations That Think", slug: "designing-organizations-that-think" },
];

const SectionRule = () => (
  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
);

const CharlesPage = () => {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = async () => {
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
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
      toast({ title: "Message sent!", description: "Thanks for reaching out. I'll get back to you soon." });
      setContactForm({ name: "", email: "", message: "" });
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Helmet>
        <title>Charles K. Chirongoma: Building organizations that think</title>
        <meta
          name="description"
          content="I design how organizations make decisions, then build the systems that execute them. Chase Agents, OptiWeb, Precinct, and the thesis behind them."
        />
      </Helmet>
      <Header />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-secondary/25 to-background px-6 pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="pointer-events-none absolute top-1/3 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-teal/5 blur-[160px]" />
          <div className="relative z-10 mx-auto max-w-5xl">
            <div className="grid items-center gap-10 md:grid-cols-[1.3fr_0.7fr]">
              <div>
                <motion.span
                  className="text-xs font-bold uppercase tracking-[0.25em] text-teal"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Charles K. Chirongoma
                </motion.span>
                <motion.h1
                  className="mt-4 text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-foreground md:text-5xl lg:text-[3.4rem]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Building organizations <span className="text-teal">that think.</span>
                </motion.h1>
                <motion.p
                  className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  I design how organizations make decisions, then build the systems that execute
                  them.
                </motion.p>
                <motion.p
                  className="mt-4 max-w-xl leading-relaxed text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  The companies that outperform over the next decade won't simply adopt AI.
                  They'll redesign how work happens. That's the work I do.
                </motion.p>
                <motion.div
                  className="mt-8 flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Button
                    size="lg"
                    className="h-12 rounded-full bg-foreground px-7 text-sm font-semibold text-background hover:bg-foreground/90"
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Get in touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:border-teal/40 hover:text-teal"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </motion.div>
              </div>
              <motion.div
                className="relative flex justify-center md:justify-end"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="h-48 w-48 overflow-hidden rounded-3xl ring-2 ring-border md:h-56 md:w-56">
                  <img src={charlesPhoto} alt="Charles K. Chirongoma" className="h-full w-full object-cover" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Recognition ── */}
        <section className="relative bg-background px-6 pb-8">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="grid items-center gap-6 rounded-2xl border border-border bg-secondary/40 p-6 sm:grid-cols-[auto_1fr] md:p-7">
                <img
                  src="/static/images/charles-capetalk.jpg"
                  alt="Charles K. Chirongoma on CapeTalk for Nedbank Business Ignite"
                  className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-1 ring-border sm:h-28 sm:w-28"
                />
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-teal">Recognition</span>
                  <p className="mt-2 font-heading text-lg font-bold text-foreground">
                    2024 Nedbank Business Ignite finalist
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    A finalist in the 2024 Nedbank Business Ignite (Nedbank &amp; CapeTalk),
                    South Africa's premier SME growth campaign, featured on <em>Good Morning
                    Cape Town with Lester Kiewit</em>. I was honoured to take this work to air.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── The Thesis ── */}
        <section className="relative bg-foreground px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal">The Thesis</span>
              <h2 className="mt-5 text-background">
                Organizations don't have a software problem.{" "}
                <span className="text-teal">They have an execution problem.</span>
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-background/70">
                <p>
                  Most organizations already know what they should do. The challenge is turning
                  decisions into consistent action. Knowledge sits inside individuals instead of
                  systems. Processes drift. Work is recreated. Valuable expertise walks out the
                  door every evening.
                </p>
                <p>
                  Technology alone doesn't solve this. In many cases, it adds another layer of
                  complexity. I believe organizations should operate differently: knowledge should
                  compound, decisions should be repeatable, and execution should improve as the
                  organization learns.
                </p>
                <p className="font-medium text-background">
                  Artificial intelligence makes this possible, but only when it's built into the
                  operating model rather than layered on top of it.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Why I Care ── */}
        <section className="relative bg-background px-6 py-16 md:py-20">
          <SectionRule />
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal">Why I Care</span>
              <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  I began my career in management consulting, working on industrial development,
                  operational redesign, and large-scale transformation programmes across South
                  Africa, from redesigning waste management systems to helping manufacturers
                  coordinate around shared operational goals.
                </p>
                <p>
                  Every engagement followed the same pattern. We diagnosed the problem. We designed
                  a better operating model. The engagement ended. The knowledge left with us. And
                  the organization slowly returned to its previous state.
                </p>
                <p className="font-medium text-foreground">
                  The real deliverable isn't a presentation. It's an organization that becomes more
                  capable after you've left. I've spent my career trying to build that instead.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── How I Think: Fractal Fit ── */}
        <section className="relative bg-secondary/40 px-6 py-16 md:py-20">
          <SectionRule />
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-teal">
                <Brain className="h-4 w-4" /> How I Think
              </span>
              <h2 className="mt-5 text-foreground">Fractal Fit.</h2>
              <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  Organizations are information-processing systems. Every workflow is a sequence of
                  observations, decisions, and actions. Before software exists, that system already
                  exists inside people, the conversations they have, the approvals they make, the
                  judgement they apply, the exceptions they recognise.
                </p>
                <p>
                  Technology should never invent a new way of working simply because it can. It
                  should first understand how the organization naturally operates, then replicate
                  that structure digitally. When the digital system reflects reality, adoption
                  becomes natural, the software feels obvious because it behaves the way the
                  organization already thinks.
                </p>
                <p className="font-medium text-foreground">
                  Only then do I automate it. The goal isn't digital transformation. The goal is
                  organizational transformation through software.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── How I Build ── */}
        <section className="relative bg-background px-6 py-16 md:py-20">
          <SectionRule />
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal">How I Build</span>
                <h2 className="mt-5 text-foreground">Every engagement follows the same philosophy.</h2>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {HOW_I_BUILD.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <span className="font-heading text-3xl font-extrabold text-teal">{s.n}</span>
                    <h4 className="mt-4 font-heading text-lg font-bold text-foreground">{s.title}</h4>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Systems ── */}
        <section className="relative bg-foreground px-6 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal">The Systems</span>
                <h2 className="mt-5 text-background">What I'm building.</h2>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {SYSTEMS.map((s, i) => {
                const inner = (
                  <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-background/10 bg-background/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:bg-background/[0.07]">
                    <div className="aspect-[16/9] overflow-hidden border-b border-background/10 bg-[#0d1526]">
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
                          <s.icon className="h-6 w-6 text-teal/70" />
                          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-background/40">Coming soon</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <div className="mb-4 inline-flex w-fit rounded-xl bg-teal/10 p-3">
                        <s.icon className="h-5 w-5 text-teal" />
                      </div>
                      <h4 className="flex items-center gap-1.5 font-heading text-lg font-bold text-background">
                        {s.name}
                        {s.href && <ArrowUpRight className="h-4 w-4 text-teal opacity-0 transition-opacity group-hover:opacity-100" />}
                      </h4>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-background/60">{s.desc}</p>
                    </div>
                  </div>
                );
                return (
                  <Reveal key={s.name} delay={i * 0.08}>
                    {s.href ? (
                      <a href={s.href} target="_blank" rel="noopener noreferrer">{inner}</a>
                    ) : (
                      inner
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Selected Work ── */}
        <section className="relative bg-background px-6 py-16 md:py-20">
          <SectionRule />
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal">Selected Work</span>
                <h2 className="mt-5 text-foreground">Theory only matters when it survives contact with reality.</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  How these ideas have been applied across public infrastructure, enterprise
                  operations, and research.
                </p>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {SELECTED_WORK.map((w, i) => {
                const inner = (
                  <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-teal/30 hover:shadow-md">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="rounded-xl bg-teal/10 p-2.5"><w.icon className="h-4 w-4 text-teal" /></div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{w.tag}</span>
                    </div>
                    <h4 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-teal">{w.name}</h4>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-teal opacity-0 transition-opacity group-hover:opacity-100">
                      Read case study <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                );
                return (
                  <Reveal key={w.name} delay={i * 0.08}>
                    {w.external ? (
                      <a href={w.href}>{inner}</a>
                    ) : (
                      <Link to={w.href}>{inner}</Link>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Principles ── */}
        <section className="relative bg-secondary/40 px-6 py-16 md:py-20">
          <SectionRule />
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal">Principles</span>
            </Reveal>
            <div className="mt-8 space-y-5">
              {PRINCIPLES.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.06}>
                  <div className="flex gap-5 rounded-2xl border border-border bg-card p-6">
                    <span className="font-heading text-xl font-extrabold text-teal">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h4 className="font-heading text-base font-bold text-foreground">{p.title}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Writing ── */}
        <section className="relative bg-background px-6 py-16 md:py-20">
          <SectionRule />
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal">Writing</span>
              <h2 className="mt-5 text-foreground">On organizational design, AI, and the future of execution.</h2>
            </Reveal>
            <div className="mt-8 divide-y divide-border/70 border-y border-border/70">
              {WRITING.map((item, i) => (
                <Reveal key={item.slug} delay={i * 0.04}>
                  <Link to={`/blog/${item.slug}`} className="group flex items-center justify-between gap-4 py-4">
                    <span className="font-medium text-foreground transition-colors group-hover:text-teal">{item.title}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-teal" />
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── What I'm Building Toward ── */}
        <section className="relative bg-foreground px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal">What I'm Building Toward</span>
              <div className="mt-5 space-y-4 leading-relaxed text-background/70">
                <p>
                  My work today is focused on helping organizations become more intelligent. But my
                  ambition is larger than building software.
                </p>
                <p>
                  Over time, I see this evolving into an operating-focused investment firm that
                  acquires and grows companies by redesigning how they work, not through financial
                  engineering, but through operational engineering: encoding institutional
                  knowledge, removing friction, and building systems that let organizations improve
                  continuously.
                </p>
                <p className="font-medium text-background">
                  The software is one part of that vision. The organizations it enables are the real
                  product.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className="relative scroll-mt-20 bg-background px-6 py-16 md:py-20">
          <SectionRule />
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal">Contact</span>
                <h2 className="mt-5 text-foreground">Building something difficult?</h2>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  I work with a small number of organizations willing to rethink how they operate , 
                  not just adopt new technology. If you're dealing with complex workflows, large
                  volumes of structured information, or institutional knowledge that's difficult to
                  scale, I'd like to hear about it.
                </p>
                <div className="mt-8 space-y-3">
                  <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-3 text-sm font-medium text-foreground transition-colors hover:text-teal">
                    <span className="inline-flex rounded-lg border border-border p-2.5"><Mail className="h-4 w-4" /></span>
                    {EMAIL}
                  </a>
                  <br />
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-sm font-medium text-foreground transition-colors hover:text-teal">
                    <span className="inline-flex rounded-lg border border-border p-2.5"><Linkedin className="h-4 w-4" /></span>
                    LinkedIn
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border bg-card p-7">
                <p className="text-sm font-semibold text-foreground">Leave your details and I'll reach out.</p>
                <div className="mt-5 space-y-4">
                  <Input
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                  />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                  />
                  <Textarea
                    placeholder="What are you working on?"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                  />
                  <Button
                    className="h-12 w-full rounded-full bg-teal font-semibold text-teal-foreground hover:bg-teal/90"
                    onClick={handleContactSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "Sending…" : "Send message"}
                    {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Or email me directly at {EMAIL}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CharlesPage;
