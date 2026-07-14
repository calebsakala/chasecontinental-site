import { Helmet } from "react-helmet-async";
import { ArrowLeft, CheckCircle2, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";

const META = [
  { label: "Partners", value: "Illinois Africa · HEINEKEN Beverages SA" },
  { label: "Sector", value: "Circular Economy · Manufacturing" },
  { label: "Scope", value: "Digital delivery & performance reporting" },
  { label: "Regions", value: "Alexandra · Soweto · KZN · Western Cape" },
];

const CHALLENGE_BULLETS = [
  "Performance across regions was difficult to compare.",
  "Data quality varied between reporting teams.",
  "Programme management relied on manual consolidation.",
  "Decision-makers lacked timely operational visibility.",
  "Measuring environmental and socioeconomic impact at scale became increasingly complex.",
];

const APPROACH_BULLETS = [
  "Designing the end-to-end data collection architecture.",
  "Building ETL pipelines that transformed raw field data into structured operational datasets.",
  "Standardising KPI definitions across all participating regions.",
  "Automating data validation and enrichment wherever possible.",
  "Eliminating repetitive manual reporting activities.",
  "Creating executive dashboards that updated from a single trusted source of operational data.",
];

const KPIS = [
  "Returnable bottles collected",
  "Glass recovered & processed",
  "Jobs created",
  "Youth participation",
  "Women's participation",
  "Income generated for collectors",
  "Buy-back centre performance",
  "Training delivery",
  "Partnership development",
  "Regional operational performance",
];

const IMPACT = [
  "Minimal manual data capture for frontline teams.",
  "Automated ETL pipelines that transformed operational data into trusted reporting datasets.",
  "Consistent KPI measurement across multiple provinces and implementation partners.",
  "Faster production of management reports and executive updates.",
  "AI-assisted operational insights built on verified programme data.",
  "Greater visibility into programme performance, enabling faster operational decisions.",
  "A digital reporting capability capable of scaling as the programme expanded.",
];

const HeinekenCaseStudy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>HEINEKEN Beverages Circular Economy Programme | Chase Continental</title>
        <meta
          name="description"
          content="Digital programme delivery and performance reporting for the HEINEKEN Beverages Circular Economy Programme — an ETL-first operational data pipeline that made programme performance measurable, governed, and largely self-driving."
        />
      </Helmet>
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-foreground text-background pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <span className="inline-block rounded-full border border-teal/40 bg-teal/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal">
            Case Study · Circular Economy
          </span>
          <h1 className="mt-6 font-heading text-3xl md:text-5xl font-extrabold tracking-[-0.03em] leading-[1.1]">
            HEINEKEN Beverages Circular Economy Programme
          </h1>
          <p className="mt-4 text-lg md:text-xl font-semibold text-teal">
            Digital Programme Delivery &amp; Performance Reporting
          </p>
          <p className="mt-5 max-w-2xl text-base text-background/70 leading-relaxed">
            We engineered the operational data layer behind a national circular economy
            programme — turning fragmented field data into a governed, largely automated
            reporting system that made performance measurable and manageable at scale.
          </p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-xl border border-background/15 bg-background/10">
            {META.map((m) => (
              <div key={m.label} className="bg-foreground p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.13em] text-background/45">
                  {m.label}
                </div>
                <div className="mt-1.5 text-sm font-medium text-background/90 leading-snug">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Overview ── */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Overview</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            In partnership with Illinois Africa and HEINEKEN Beverages South Africa, Chase
            Continental supported the digital delivery of a national circular economy
            programme focused on improving glass bottle recovery across multiple regions.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Our role was to ensure that programme performance could be measured, managed, and
            improved through reliable digital reporting, structured data collection, and
            operational visibility. Rather than treating reporting as an administrative task,
            we transformed it into a management system that enabled stakeholders to monitor
            performance, identify bottlenecks, and make better decisions throughout the
            programme lifecycle.
          </p>
        </div>
      </section>

      {/* ── The Challenge ── */}
      <section className="py-16 md:py-20 px-6 bg-secondary/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">The Challenge</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            The programme operated across multiple provinces, buy-back centres, cooperatives,
            and collection partners, each generating operational and social impact data that
            needed to be consolidated into a single reporting framework.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Success depended on more than collecting data — it required confidence that every
            KPI was consistently defined, accurately captured, and reported in a way that
            project leaders could use to drive execution.
          </p>
          <p className="mt-6 text-sm font-semibold text-foreground">
            Without structured digital reporting:
          </p>
          <ul className="mt-3 space-y-2.5">
            {CHALLENGE_BULLETS.map((b) => (
              <li key={b} className="flex items-start gap-3 text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Our Approach ── */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-teal">Our Approach</span>
          <h2 className="mt-3 font-heading text-2xl md:text-3xl font-bold">
            We started with the data, not the dashboards.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Working alongside Illinois Africa and HEINEKEN Beverages, we designed the
            operational data pipeline that powered the programme's reporting and
            decision-making.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Instead of asking field teams to complete large, complex forms, we redesigned the
            collection process around the minimum amount of information required. Every
            additional data point was derived, enriched, or calculated automatically
            downstream. This ETL-first approach reduced the reporting burden on frontline
            teams, improved data quality, and created a consistent foundation for automation
            across the programme.
          </p>
          <div className="mt-8 rounded-2xl border border-border bg-card p-7">
            <p className="text-sm font-semibold text-foreground">Our work included</p>
            <ul className="mt-4 space-y-3">
              {APPROACH_BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 font-medium text-foreground leading-relaxed">
            The objective wasn't simply to collect information — it was to build a reporting
            system that produced reliable operational intelligence with minimal manual effort.
          </p>
        </div>
      </section>

      {/* ── Intelligent Reporting & Operational Automation ── */}
      <section className="py-16 md:py-20 px-6 bg-secondary/40">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            Intelligent reporting &amp; operational automation
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Once the reporting pipeline was established, we automated the layers above it.
            Because the underlying data was clean and consistently structured, operational
            reporting became largely automated — the system generated performance dashboards,
            surfaced operational trends, and accelerated the production of programme reports
            that would previously have required significant manual effort.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            AI-assisted reporting further reduced turnaround times by transforming structured
            operational data into executive-ready summaries, allowing project leadership to
            review recommendations instead of manually compiling reports. AI was one component
            of the operating model — not the point of it. The result: stakeholders spent less
            time preparing information and more time improving programme delivery.
          </p>
        </div>
      </section>

      {/* ── Reporting Framework (KPIs) ── */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            One consolidated performance view
          </h2>
          <p className="mt-5 max-w-3xl text-muted-foreground leading-relaxed">
            The reporting framework consolidated operational data from multiple regions into a
            consistent monthly performance dashboard covering programme outcomes including:
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {KPIS.map((kpi) => (
              <div
                key={kpi}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3.5"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-teal" />
                <span className="text-sm font-medium text-foreground">{kpi}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-muted-foreground leading-relaxed">
            Detailed regional performance tracking across{" "}
            <span className="font-semibold text-foreground">
              Alexandra, Soweto, KwaZulu-Natal, and the Western Cape
            </span>{" "}
            allowed stakeholders to identify trends, monitor progress against targets, and
            allocate support where it was needed most.
          </p>
        </div>
      </section>

      {/* ── Business Impact ── */}
      <section className="py-16 md:py-20 px-6 bg-foreground text-background">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-background">
            Business impact
          </h2>
          <p className="mt-5 max-w-3xl text-background/70 leading-relaxed">
            By reducing the amount of information collected in the field while increasing the
            amount of intelligence generated centrally, the programme achieved a reporting
            process that was both more scalable and more reliable.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {IMPACT.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-background/10 bg-background/[0.04] p-6"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                <span className="text-sm text-background/80 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why It Matters ── */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Why it matters</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Large transformation programmes succeed when decisions are driven by reliable
            operational data. By strengthening the digital reporting capability behind the
            HEINEKEN Beverages Circular Economy Programme, Chase Continental helped create the
            visibility, governance, and performance measurement needed to support programme
            execution at scale.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            This reflects our broader approach to digital transformation: we design digital
            operating systems — reliable data pipelines, governance, and reporting — that turn
            data into better execution. AI is simply one component of that operating model.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-20 px-6 bg-secondary/40">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            Have a programme that needs a reliable operational data layer?
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="rounded-full bg-teal text-teal-foreground hover:bg-teal/90 gap-2"
              onClick={() => window.open(BOOK_CALL_URL, "_blank")}
            >
              <Phone className="h-4 w-4" /> Book a call
            </Button>
            <Button variant="outline" size="lg" asChild className="rounded-full gap-2">
              <Link to="/#results">
                <ArrowLeft className="h-4 w-4" /> Back to case studies
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HeinekenCaseStudy;
