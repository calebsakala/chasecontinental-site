import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "./caseStudyData";
import { getHeroDashboard } from "./MockDashboards";

interface CaseStudyCardProps {
  study: CaseStudy;
  index: number;
  onClick: () => void;
}

const CaseStudyCard = ({ study, index, onClick }: CaseStudyCardProps) => {
  const HeroDashboard = getHeroDashboard(study.id);

  return (
    <motion.button
      onClick={onClick}
      className="group relative text-left rounded-2xl overflow-hidden border border-border/60 bg-card hover:border-border transition-all duration-500 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {/* Dashboard Preview */}
      <div className="relative overflow-hidden bg-muted/30 p-3 pb-0">
        {/* Industry Badge */}
        <span
          className="absolute top-3 left-3 z-10 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full backdrop-blur-xl"
          style={{
            background: `${study.accentColor}18`,
            color: study.accentColor,
            border: `1px solid ${study.accentColor}25`,
          }}
        >
          {study.industry}
        </span>

        {/* Arrow */}
        <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-foreground/5 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight className="w-3.5 h-3.5 text-foreground" />
        </div>

        {/* Scaled-down dashboard */}
        <div className="transform scale-[0.65] origin-top-left w-[154%] pointer-events-none select-none max-h-[200px] overflow-hidden" aria-hidden="true">
          {HeroDashboard && <HeroDashboard accent={study.accentColor} />}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 pt-3 space-y-1.5">
        <h3 className="text-sm font-bold font-heading text-foreground leading-tight">
          {study.platformName}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {study.outcome}
        </p>
      </div>
    </motion.button>
  );
};

export default CaseStudyCard;
