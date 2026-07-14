import { useState } from "react";

// Five-layer measurement model. Designed for a DARK section (bg-foreground):
// text is `background`, surfaces are background/[opacity]. Layer 5 (top) is the
// narrowest, Layer 1 (bottom) the widest. Hover / focus / tap a layer to reveal it.

const LAYERS = [
  { n: 5, title: "Technical Performance", desc: "Model accuracy, latency, error rates.", width: "56%" },
  { n: 4, title: "Adoption", desc: "Usage frequency, tool diversity, workflow coverage.", width: "67%" },
  { n: 3, title: "Operational KPIs", desc: "Cycle time, completion rates, rework reduction.", width: "78%" },
  { n: 2, title: "Strategic Outcomes", desc: "Capacity freed for judgment, new capabilities unlocked.", width: "89%" },
  { n: 1, title: "Financial Impact", desc: "Revenue lift, cost avoidance, cost elimination.", width: "100%" },
];

const MeasurementLayers = () => {
  const [active, setActive] = useState<number>(1);

  return (
    <div>
      <div className="flex flex-col items-center gap-2.5">
        {LAYERS.map((layer) => {
          const isActive = active === layer.n;
          return (
            <button
              key={layer.n}
              type="button"
              style={{ width: layer.width }}
              onMouseEnter={() => setActive(layer.n)}
              onFocus={() => setActive(layer.n)}
              onClick={() => setActive(layer.n)}
              aria-pressed={isActive}
              className={`group relative rounded-xl border px-5 py-4 text-left transition-all duration-300 ${
                isActive
                  ? "border-teal/50 bg-teal/15"
                  : "border-background/10 bg-background/[0.05] hover:bg-background/[0.08]"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-background">
                  <span className={`mr-2 font-mono text-xs ${isActive ? "text-teal" : "text-background/40"}`}>
                    L{layer.n}
                  </span>
                  {layer.title}
                </span>
                <span
                  className={`hidden shrink-0 text-right text-xs leading-snug text-background/70 transition-opacity duration-300 sm:block ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {layer.desc}
                </span>
              </div>
              {/* Mobile: description below (only when active) */}
              <p
                className={`mt-1.5 text-xs leading-snug text-background/70 sm:hidden ${
                  isActive ? "block" : "hidden"
                }`}
              >
                {layer.desc}
              </p>
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-center text-sm text-background/60">
        Most vendors stop at Layer 5.{" "}
        <span className="font-semibold text-background">
          We start there and report at Layer 1.
        </span>
      </p>
    </div>
  );
};

export default MeasurementLayers;
