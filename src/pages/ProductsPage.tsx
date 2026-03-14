import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CaseStudyCard from "@/components/products/CaseStudyCard";
import CaseStudyModal from "@/components/products/CaseStudyModal";
import { CASE_STUDIES } from "@/components/products/caseStudyData";

const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";

const ProductsPage = () => {
  const [activeStudy, setActiveStudy] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = activeStudy !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeStudy]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activeStudy === null) return;
      if (e.key === "Escape") setActiveStudy(null);
      if (e.key === "ArrowLeft" && activeStudy > 0) setActiveStudy(activeStudy - 1);
      if (e.key === "ArrowRight" && activeStudy < CASE_STUDIES.length - 1) setActiveStudy(activeStudy + 1);
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
            Built for the messy reality<br className="hidden md:block" /> of operations.
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-native systems that stay reliable when real-world conditions change.
            Custom platforms for ops teams who need control, not experiments.
          </p>
        </section>

        {/* Card Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
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
              Have a workflow that needs fixing?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 max-w-lg mx-auto">
              Tell us what breaks, what's manual, and what you wish just worked.
              We'll show you what it looks like automated.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.open(BOOK_CALL_URL, "_blank")}
                className="w-full sm:w-auto rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold px-8 h-11 text-sm transition-colors"
              >
                Describe your workflow
              </button>
              <button
                onClick={() => window.open(BOOK_CALL_URL, "_blank")}
                className="w-full sm:w-auto rounded-full border border-border hover:bg-accent font-semibold px-8 h-11 text-sm text-foreground transition-colors"
              >
                See how pilots work
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-5 sm:mt-6">
              Examples are conceptual to protect client confidentiality. Backend: Supabase. No Lovable Cloud.
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
            onNext={() => setActiveStudy(Math.min(CASE_STUDIES.length - 1, activeStudy + 1))}
            hasPrev={activeStudy > 0}
            hasNext={activeStudy < CASE_STUDIES.length - 1}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductsPage;
