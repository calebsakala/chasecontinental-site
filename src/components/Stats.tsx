import { cn } from "@/lib/utils";

interface StatsProps {
  stats: { number: string; label: string }[];
  className?: string;
}

const Stats = ({ stats, className }: StatsProps) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-8", className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-4xl font-bold font-heading text-gold">{stat.number}</div>
          <div className="mt-1 text-sm text-primary-foreground/70">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
