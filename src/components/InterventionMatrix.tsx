// Intervention Classification Framework — a 3-column matrix, not a bullet list.
// Progression reads certainty (deterministic) → judgment (AI-assisted).

const COLUMNS = [
  {
    label: "Deterministic Automation",
    bar: "bg-teal",
    tag: "text-teal",
    definition: "Rule-based. No model. Zero hallucination risk.",
    examples: "Scheduling, routing, formatting, validation.",
  },
  {
    label: "Hybrid",
    bar: "bg-muted-foreground/50",
    tag: "text-muted-foreground",
    definition: "Model-assisted with a human review gate.",
    examples: "Analysis drafts, anomaly flagging, risk scoring.",
  },
  {
    label: "AI-Assisted Judgment",
    bar: "bg-gold",
    tag: "text-gold",
    definition: "Model informs. Human decides.",
    examples: "Strategy, relationship, interpretation.",
  },
];

const InterventionMatrix = () => {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
        <span>More certain</span>
        <span aria-hidden className="mx-4 h-px flex-1 bg-gradient-to-r from-teal/40 via-border to-gold/40" />
        <span>More judgment</span>
      </div>
      <div className="grid overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3 gap-px">
        {COLUMNS.map((col) => (
          <div key={col.label} className="flex flex-col bg-card p-6 md:p-7">
            <span className={`mb-5 block h-1 w-10 rounded-full ${col.bar}`} />
            <span
              className={`text-[11px] font-bold uppercase tracking-[0.12em] ${col.tag}`}
            >
              {col.label}
            </span>
            <p className="mt-3 text-[15px] font-semibold leading-snug text-foreground">
              {col.definition}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {col.examples}
            </p>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
        This classification determines where AI adds value and where deterministic
        execution is safer, cheaper, and more reliable.
      </p>
    </div>
  );
};

export default InterventionMatrix;
