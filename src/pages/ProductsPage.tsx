import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CaseStudyCard from "@/components/products/CaseStudyCard";
import CaseStudyModal from "@/components/products/CaseStudyModal";
import { CASE_STUDIES } from "@/components/products/caseStudyData";

const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";

const FEATURED_PRODUCTS = [
  {
    id: "chase-agents",
    name: "Chase Agents",
    label: "Flagship Product",
    description:
      "Agentic execution platform for operations teams that need AI planning with deterministic, auditable actions.",
    ctaLabel: "Try Chase Agents",
    href: "https://chaseagents.com",
  },
  {
    id: "optiweb",
    name: "OptiWeb",
    label: "Growth + Ops Product",
    description:
      "Productized web and workflow layer that improves conversion while tightening operational handoff and visibility.",
    ctaLabel: "Request OptiWeb Demo",
    href: "https://www.optiweb.it.com/",
  },
];

const ProductsPage = () => {
  const [activeStudy, setActiveStudy] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = activeStudy !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeStudy]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activeStudy === null) return;
      if (e.key === "Escape") setActiveStudy(null);
      if (e.key === "ArrowLeft" && activeStudy > 0)
        setActiveStudy(activeStudy - 1);
      if (e.key === "ArrowRight" && activeStudy < CASE_STUDIES.length - 1)
        setActiveStudy(activeStudy + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeStudy]);

  return (
    <>
      <Header />
      <main className="pt-20 sm:pt-24 pb-16 sm:pb-20">
        {/* Header */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-10 sm:mb-16 text-center">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3 sm:mb-4">
            What we build
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground leading-[1.1] mb-4 sm:mb-5">
            Built for the messy reality
            <br className="hidden md:block" /> of operations.
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-native systems that stay reliable when real-world conditions
            change. Custom platforms for ops teams who need control, not
            experiments.
          </p>
        </section>

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 sm:mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {FEATURED_PRODUCTS.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl sm:rounded-3xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm"
              >
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  {product.label}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mb-3">
                  {product.name}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>
                <button
                  onClick={() => window.open(product.href, "_blank")}
                  className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold px-6 h-10 text-sm transition-colors"
                >
                  {product.ctaLabel}
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Card Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Case Study Library
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {CASE_STUDIES.map((study, i) => (
              <CaseStudyCard
                key={study.id}
                study={study}
                index={i}
                onClick={() => setActiveStudy(i)}
              />
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-card border border-border/50 shadow-sm">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-foreground mb-2 sm:mb-3">
              Need a product walkthrough for your team?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 max-w-lg mx-auto">
              We will map your operating context to the right product, then walk
              you through a practical rollout path.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.open(BOOK_CALL_URL, "_blank")}
                className="w-full sm:w-auto rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold px-8 h-11 text-sm transition-colors"
              >
                Request Product Demo
              </button>
              <button
                onClick={() => window.location.assign("/resources")}
                className="w-full sm:w-auto rounded-full border border-border hover:bg-accent font-semibold px-8 h-11 text-sm text-foreground transition-colors"
              >
                Explore Product Resources
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-5 sm:mt-6">
              Product previews are tailored to your operating model and rollout
              constraints.
            </p>
          </div>
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {activeStudy !== null && (
          <CaseStudyModal
            study={CASE_STUDIES[activeStudy]}
            onClose={() => setActiveStudy(null)}
            onPrev={() => setActiveStudy(Math.max(0, activeStudy - 1))}
            onNext={() =>
              setActiveStudy(Math.min(CASE_STUDIES.length - 1, activeStudy + 1))
            }
            hasPrev={activeStudy > 0}
            hasNext={activeStudy < CASE_STUDIES.length - 1}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductsPage;
