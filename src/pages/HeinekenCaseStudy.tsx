import { Helmet } from "react-helmet-async";
import { ArrowLeft, CheckCircle2, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";

const RESULTS = [
  "Multi-region monitoring coverage",
  "Automated compliance reporting",
  "Executive operational visibility",
];

// Placeholder case-study page — full content to be supplied later.
const HeinekenCaseStudy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Heineken — Sustainability Monitoring | Chase Continental</title>
        <meta
          name="description"
          content="Regional sustainability monitoring and reporting automation for Heineken. Full case study coming soon."
        />
      </Helmet>
      <Header />

      <section className="relative overflow-hidden bg-foreground text-background pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <span className="inline-block rounded-full border border-teal/40 bg-teal/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal">
            Case Study · Manufacturing
          </span>
          <h1 className="mt-6 font-heading text-4xl md:text-5xl font-extrabold tracking-[-0.03em]">
            Heineken — Sustainability Monitoring
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-background/70 leading-relaxed">
            Regional sustainability monitoring and reporting automation across
            multi-region operations.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-2xl font-bold">Key outcomes</h2>
          <ul className="mt-6 space-y-4">
            {RESULTS.map((r) => (
              <li key={r} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                <span className="text-base text-card-foreground">{r}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-2xl border border-border bg-secondary/40 p-8 text-center">
            <p className="text-muted-foreground">
              The full Heineken case study is being prepared and will be published
              here soon.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                className="rounded-full bg-teal text-teal-foreground hover:bg-teal/90 gap-2"
                onClick={() => window.open(BOOK_CALL_URL, "_blank")}
              >
                <Phone className="h-4 w-4" /> Book a call
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-full gap-2"
              >
                <Link to="/#results">
                  <ArrowLeft className="h-4 w-4" /> Back to case studies
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HeinekenCaseStudy;
