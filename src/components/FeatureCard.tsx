import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon?: LucideIcon;
  iconSrc?: string;
  title: string;
  description: string;
  className?: string;
  variant?: "default" | "premium" | "minimal";
}

const FeatureCard = ({
  icon: Icon,
  iconSrc,
  title,
  description,
  className,
  variant = "default",
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover-border-snake snake-variant-thin-2xl",
        variant === "premium" && "glow-gold-hover",
        variant === "minimal" && "border-transparent bg-transparent shadow-none",
        className
      )}
    >
      <svg className="snake-svg" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" />
      </svg>

      <div className="mb-4">
        {Icon && (
          <div className="inline-flex rounded-xl bg-secondary p-3">
            <Icon className="h-6 w-6 text-gold" />
          </div>
        )}
        {iconSrc && (
          <img src={iconSrc} alt="" className="h-10 w-10" />
        )}
      </div>
      <h3 className="mb-2 text-lg font-semibold font-heading text-card-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
