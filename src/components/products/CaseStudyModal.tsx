import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "./caseStudyData";
import { getDashboard } from "./MockDashboards";

const BOOK_CALL_URL = "https://calendar.app.google/8oZYnnuHcaiH64Ky8";

interface CaseStudyModalProps {
  study: CaseStudy;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const CaseStudyModal = ({
  study,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: CaseStudyModalProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Auto-rotate walkthrough tabs
  useEffect(() => {
    if (!isAutoRotating || !study.walkthrough.length) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % study.walkthrough.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoRotating, study.walkthrough.length]);

  const DashboardComponent = getDashboard(study.id, activeTab);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-3 sm:mx-4 my-4 sm:my-8 bg-background rounded-2xl sm:rounded-3xl overflow-hidden border border-border/50 shadow-2xl"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-background/90 backdrop-blur-xl border-b border-border/40">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span
              className="text-[9px] sm:text-[11px] font-semibold tracking-wide uppercase px-2 sm:px-3 py-1 rounded-full shrink-0"
              style={{
                background: `${study.accentColor}15`,
                color: study.accentColor,
                border: `1px solid ${study.accentColor}25`,
              }}
            >
              {study.industry}
            </span>
            <h2 className="text-sm sm:text-lg font-bold font-heading text-foreground truncate">
              {study.platformName}
            </h2>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className="p-1.5 sm:p-2 rounded-full hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground"
              aria-label="Previous case study"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="p-1.5 sm:p-2 rounded-full hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground"
              aria-label="Next case study"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground ml-0.5 sm:ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 md:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Outcome badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-card border border-border/60 shadow-sm">
            <Zap
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
              style={{ color: study.accentColor }}
            />
            <span className="text-xs sm:text-sm font-semibold text-foreground">
              {study.outcome}
            </span>
          </div>

          {/* Problem / Fix grid */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border/50">
              <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3">
                The Problem
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-foreground/90">
                {study.problem}
              </p>
            </div>
            <div
              className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border"
              style={{
                background: `${study.accentColor}06`,
                borderColor: `${study.accentColor}20`,
              }}
            >
              <h3
                className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 sm:mb-3"
                style={{ color: study.accentColor }}
              >
                The Fix
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-foreground/90">
                {study.fix}
              </p>
            </div>
          </div>

          {/* Results */}
          <div>
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 sm:mb-4">
              Example Outcomes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {study.results.map((r) => (
                <div
                  key={r.label}
                  className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-card border border-border/50 text-center"
                >
                  <div className="text-base sm:text-xl font-bold font-heading text-foreground">
                    {r.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                    {r.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Walkthrough with Dashboard */}
          <div>
            <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 sm:mb-4">
              Platform Walkthrough
            </h3>
            <div className="flex gap-1 mb-4 sm:mb-5 overflow-x-auto pb-1 -mx-1 px-1">
              {study.walkthrough.map((page, i) => (
                <button
                  key={page.title}
                  onClick={() => {
                    setActiveTab(i);
                    setIsAutoRotating(false);
                  }}
                  className={`relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 overflow-hidden ${
                    activeTab === i
                      ? "text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground bg-accent/50"
                  }`}
                  style={
                    activeTab === i
                      ? { backgroundColor: study.accentColor }
                      : undefined
                  }
                >
                  <span className="relative z-10">{page.title}</span>
                  {activeTab === i && isAutoRotating && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-[3px] bg-white/40"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                      key={`progress-${activeTab}`}
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Dashboard mockup with browser chrome */}
                {DashboardComponent && (
                  <div className="rounded-xl border border-border/50 overflow-hidden shadow-lg">
                    {/* Browser chrome bar */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/80 border-b border-border/40">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                      </div>
                      <div className="flex-1 mx-3">
                        <div className="bg-background/60 rounded-md px-3 py-1 text-[10px] text-muted-foreground font-mono truncate max-w-xs">
                          app.chaseagents.com/{study.id}/dashboard
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-[9px] text-emerald-500 font-semibold uppercase tracking-wide">
                          Live
                        </span>
                      </div>
                    </div>
                    <DashboardComponent accent={study.accentColor} />
                  </div>
                )}

                {/* Description + features */}
                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border/50">
                  <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 mb-3 sm:mb-4">
                    {study.walkthrough[activeTab].description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {study.walkthrough[activeTab].features.map((f) => (
                      <div
                        key={f}
                        className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
                      >
                        <CheckCircle2
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0"
                          style={{ color: study.accentColor }}
                        />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* AI-native callout */}
          <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-foreground/[0.03] border border-border/50">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground shrink-0" />
              <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-foreground">
                AI-native with deterministic reliability
              </h3>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {study.aiNativeCallout}
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 sm:pt-4">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold px-8"
              onClick={() => window.open(BOOK_CALL_URL, "_blank")}
            >
              Request Product Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-full font-semibold px-8"
              onClick={() => window.open(BOOK_CALL_URL, "_blank")}
            >
              Plan Implementation
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CaseStudyModal;
