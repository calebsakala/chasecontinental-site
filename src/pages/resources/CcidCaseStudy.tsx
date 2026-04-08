import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FileText,
  ArrowRight,
  CheckCircle,
  Clock,
  BarChart3,
  TrendingDown,
  Eye,
  Phone,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { queueResourceEmail } from "@/lib/resourceEmail";
import heroImg from "@/assets/cape-town-hero.jpg";

const CHASE_AGENTS_URL = "https://chaseagents.com";
const BOOK_SCOPING_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";
const CASE_STUDY_FILE_PATH = "ccid-case-study/ccid-case-study.pdf";
const CASE_STUDY_ASSET_KEY = "ccid-case-study";

const ROLE_OPTIONS = [
  "C-Suite (CEO, COO, CTO, CIO)",
  "SVP / VP Operations",
  "Director of Operations",
  "Director of Digital Transformation",
  "Head of IT / Technology",
  "Operations Manager",
  "Programme / Project Manager",
  "Process Improvement Lead",
  "Strategy / Operations Lead",
  "Business Analyst",
  "Team Lead / Senior Manager",
  "Other",
];

const VERTICAL_OPTIONS = [
  "Logistics & Supply Chain",
  "BPO & Customer Operations",
  "E-commerce & Marketplaces",
  "Sales & Revenue Operations",
  "Mining & Natural Resources",
  "iGaming & Digital Entertainment",
  "Manufacturing",
  "Government & Public Sector",
  "Financial Operations",
  "Healthcare",
  "Other",
];

const fade = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const CHALLENGE_BULLETS = [
  {
    icon: Clock,
    text: "Manual reporting consumed 20+ hours per week across the team.",
  },
  {
    icon: TrendingDown,
    text: "Error rates in data entry exceeded 12%, causing downstream rework.",
  },
  {
    icon: Eye,
    text: "Leadership lacked real-time visibility into operational performance.",
  },
];

const WHAT_CHANGED_BULLETS = [
  {
    icon: CheckCircle,
    text: "Deterministic automation replaced manual data aggregation and validation.",
  },
  {
    icon: CheckCircle,
    text: "Structured workflows enforced data integrity at every handoff point.",
  },
  {
    icon: CheckCircle,
    text: "A unified dashboard gave leadership live KPIs without waiting for reports.",
  },
];

const KPI_TILES = [
  {
    number: "90%",
    label: "Faster Processing",
    desc: "Report turnaround compressed from days to minutes.",
  },
  {
    number: "60%",
    label: "Cost Reduction",
    desc: "Operational spend dropped through automation.",
  },
  {
    number: "4×",
    label: "Visibility Gain",
    desc: "Real-time dashboards replaced weekly spreadsheets.",
  },
];

const TIMELINE_STEPS = [
  {
    week: "Week 1–2",
    title: "Discovery & Mapping",
    desc: "Audited existing workflows and identified automation candidates.",
  },
  {
    week: "Week 3–4",
    title: "System Design",
    desc: "Designed deterministic pipelines with built-in validation.",
  },
  {
    week: "Week 5–8",
    title: "Build & Connect",
    desc: "Deployed automation agents and connected live data sources.",
  },
  {
    week: "Week 9–10",
    title: "Launch & Measure",
    desc: "Went live with full reporting dashboard and KPI tracking.",
  },
];

const CcidCaseStudy = () => {
  const { toast } = useToast();
  const [phase, setPhase] = useState<"browse" | "form" | "done">("browse");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    vertical: "",
    useCaseFit: "",
  });
  const [loading, setLoading] = useState(false);

  const handleDownloadCaseStudy = async () => {
    const { data, error } = await supabase.storage
      .from("lead-magnets")
      .createSignedUrl(CASE_STUDY_FILE_PATH, 3600);

    const fallbackPublicUrl = supabase.storage
      .from("lead-magnets")
      .getPublicUrl(CASE_STUDY_FILE_PATH).data.publicUrl;

    const downloadUrl = data?.signedUrl || fallbackPublicUrl;

    if ((error && !fallbackPublicUrl) || !downloadUrl) return;

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "CCID-Case-Study.pdf";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  const scrollToOptIn = () => {
    setPhase("form");
    setTimeout(
      () =>
        document
          .getElementById("ccid-optin")
          ?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setLoading(true);
    try {
      // Save lead
      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .upsert(
          {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            company: form.company.trim() || null,
            role: form.role || null,
            vertical: form.vertical || null,
          },
          { onConflict: "email" },
        )
        .select("id")
        .single();

      if (leadError) throw leadError;

      const leadId = lead?.id ?? null;

      // Track download
      await supabase.from("downloads").insert({
        asset_key: CASE_STUDY_ASSET_KEY,
        lead_id: leadId,
        file_path: CASE_STUDY_FILE_PATH,
        downloaded_at: new Date().toISOString(),
      });

      // Track event
      await supabase.from("events").insert({
        event_name: "ccid_case_study_download",
        lead_id: leadId,
        event_payload: {
          source: "ccid-case-study-page",
          use_case_fit: form.useCaseFit || null,
        },
      });

      await handleDownloadCaseStudy();

      const emailResult = await queueResourceEmail({
        assetKey: CASE_STUDY_ASSET_KEY,
        leadId: leadId,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        company: form.company.trim() || null,
        filePath: CASE_STUDY_FILE_PATH,
        allowResend: true,
      });

      if (emailResult === null) {
        throw new Error("Case study email trigger failed.");
      }

      if (!emailResult.success) {
        throw new Error(
          emailResult.errorMessage || "Case study email trigger failed.",
        );
      }

      if (emailResult.skipped && !emailResult.unsubscribed) {
        throw new Error(
          emailResult.errorMessage ||
            "Case study email was skipped instead of being sent.",
        );
      }

      setPhase("done");
      toast({
        title: "Success!",
        description: emailResult.unsubscribed
          ? "Your case study is ready to download. Email delivery is disabled for this address."
          : "Your case study is ready to download, and we sent a backup copy to your email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>CCID Case Study (Download) | Chase Agents</title>
        <meta
          name="description"
          content="See how CCID achieved faster processing and stronger visibility with Chase Agents as the operating layer."
        />
      </Helmet>
      <Header />

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="CCID Case Study cover with KPI charts"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.span
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fade}
            className="inline-block mb-5 rounded-full border border-gold/40 bg-gold/10 px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-gold"
          >
            Chase Agents Case Study
          </motion.span>
          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fade}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground mb-5 leading-[1.1]"
          >
            How CCID achieved 90% faster processing with Chase Agents.
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fade}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8"
          >
            See exactly how CCID connected fragmented workflows with the Chase
            Agents operating layer to improve speed, cost, and visibility.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fade}
          >
            <Button
              size="lg"
              onClick={scrollToOptIn}
              className="bg-teal hover:bg-teal/90 text-teal-foreground gap-2 text-base px-8"
            >
              <FileText className="w-5 h-5" /> Download the case study
            </Button>
            <p className="mt-3 text-xs text-primary-foreground/50">
              Instant access.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── The Challenge ── */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fade}
            className="text-3xl md:text-4xl font-heading font-bold mb-10 text-center"
          >
            The Challenge
          </motion.h2>
          <div className="space-y-6">
            {CHALLENGE_BULLETS.map((b, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fade}
                className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border"
              >
                <b.icon className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                <p className="text-base text-card-foreground">{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Changed ── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fade}
            className="text-3xl md:text-4xl font-heading font-bold mb-10 text-center"
          >
            What Changed
          </motion.h2>
          <div className="space-y-6">
            {WHAT_CHANGED_BULLETS.map((b, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fade}
                className="flex items-start gap-4 p-5 rounded-xl bg-card border border-teal/20"
              >
                <b.icon className="w-6 h-6 text-teal shrink-0 mt-0.5" />
                <p className="text-base text-card-foreground">{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results KPI Tiles ── */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fade}
            className="text-3xl md:text-4xl font-heading font-bold mb-12 text-center"
          >
            Results
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {KPI_TILES.map((kpi, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fade}
              >
                <Card className="bg-primary-foreground/5 border-primary-foreground/10 text-center p-8">
                  <CardContent className="p-0">
                    <div className="text-5xl font-heading font-bold text-gold mb-2">
                      {kpi.number}
                    </div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-teal mb-3">
                      {kpi.label}
                    </div>
                    <p className="text-sm text-primary-foreground/70">
                      {kpi.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fade}
            className="text-3xl md:text-4xl font-heading font-bold mb-12 text-center"
          >
            Implementation Timeline
          </motion.h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-10">
              {TIMELINE_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fade}
                  className="flex gap-6 items-start"
                >
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-teal/10 border-2 border-teal flex items-center justify-center">
                    <span className="text-sm font-bold text-teal">{i + 1}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                      {step.week}
                    </span>
                    <h3 className="text-xl font-heading font-bold mt-1 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Opt-in ── */}
      <section id="ccid-optin" className="py-20 px-6 bg-secondary/30">
        <div className="mx-auto max-w-lg">
          {phase === "done" ? (
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fade}
              className="text-center"
            >
              <CheckCircle className="w-16 h-16 text-teal mx-auto mb-4" />
              <h3 className="text-2xl font-heading font-bold mb-3">
                You're all set!
              </h3>
              <p className="text-muted-foreground mb-6">
                Your case study PDF is ready.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button
                  size="lg"
                  className="bg-teal hover:bg-teal/90 text-teal-foreground gap-2"
                  onClick={handleDownloadCaseStudy}
                >
                  <FileText className="w-5 h-5" /> Download PDF
                </Button>
                <Button
                  size="lg"
                  onClick={() => window.open(CHASE_AGENTS_URL, "_blank")}
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  Explore Chase Agents
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              variants={fade}
            >
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-center mb-2">
                Get the Full Case Study
              </h3>
              <p className="text-center text-muted-foreground mb-8">
                Enter your details for instant access to the CCID deep dive +
                ROI projection.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Full name *"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
                <Input
                  type="email"
                  placeholder="Work email *"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                />
                <Input
                  placeholder="Company"
                  value={form.company}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, company: e.target.value }))
                  }
                />
                <div>
                  <Label className="text-sm text-muted-foreground mb-1.5 block">
                    Role
                  </Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) => setForm((p) => ({ ...p, role: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-1.5 block">
                    Industry
                  </Label>
                  <Select
                    value={form.vertical}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, vertical: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {VERTICAL_OPTIONS.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-1.5 block">
                    Use-case fit
                  </Label>
                  <Select
                    value={form.useCaseFit}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, useCaseFit: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How close is this to your use case?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes — same use case</SelectItem>
                      <SelectItem value="similar">
                        Similar — adjacent use case
                      </SelectItem>
                      <SelectItem value="different">
                        Different vertical
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-teal hover:bg-teal/90 text-teal-foreground gap-2"
                >
                  {loading ? (
                    "Submitting…"
                  ) : (
                    <>
                      <FileText className="w-5 h-5" /> Download the case study
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Book a Call CTA ── */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fade}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Want results like CCID's?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Explore Chase Agents to see how the same operating layer can run in
            your environment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              size="lg"
              className="bg-gold hover:bg-gold/90 text-gold-foreground gap-2 text-base px-8"
              onClick={() => window.open(CHASE_AGENTS_URL, "_blank")}
            >
              Explore Chase Agents
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base px-8"
              onClick={() => window.open(BOOK_SCOPING_CALL_URL, "_blank")}
            >
              <Phone className="w-5 h-5" /> Book a scoping call
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default CcidCaseStudy;
