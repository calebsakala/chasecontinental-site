import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { jsPDF } from "https://esm.sh/jspdf@2.5.2";
import { drawBrandHeader } from "../_shared/pdf-branding.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AssessmentAnswer {
  question_id: number;
  question_text: string;
  selected_option: string;
  score: number;
  max_score: number;
}

interface AssessmentRequest {
  lead_id?: string;
  name: string;
  email: string;
  company?: string;
  answers: AssessmentAnswer[];
  score: number;
  band: string; // "high-risk" | "medium-risk" | "strong"
}

/* ─── In-depth analysis per question per answer tier ─── */
const QUESTION_ANALYSIS: Record<
  number,
  {
    title: string;
    why: string;
    insights: Record<
      string,
      { diagnosis: string; impact: string; action: string }
    >;
  }
> = {
  1: {
    title: "How many tools does a single workflow touch?",
    why: "More tools mean more integration points, increasing the risk of failures in data handoffs or API changes.",
    insights: {
      "10": {
        diagnosis:
          "Your workflow operates within a tight integration boundary (1–2 tools). This minimises API surface area, reduces latency between steps, and limits the blast radius of any single tool failure.",
        impact:
          "Organisations with minimal tool sprawl experience 73% fewer integration-related incidents (Gartner 2025). Your compact architecture makes debugging straightforward and reduces vendor dependency risk.",
        action:
          "Maintain this discipline as you scale. Document integration contracts between tools so new team members understand data flows. Consider API versioning strategies to protect against upstream changes.",
      },
      "5": {
        diagnosis:
          "Your workflow spans 3–5 tools — a common pattern for mid-complexity automation. Each additional tool introduces authentication, data mapping, and failure mode complexity. At this level, a single API change can cascade through dependent steps.",
        impact:
          "Research shows that each additional integration point increases failure probability by 18% (Forrester). With 3–5 tools, you're in a manageable but watchful zone — one more tool could tip into fragility.",
        action:
          "Map every data handoff between tools. Identify which integrations are the most fragile (hint: it's usually the ones with the least standardised APIs). Consider middleware or an orchestration layer to decouple direct tool-to-tool dependencies.",
      },
      "0": {
        diagnosis:
          "Your workflow touches 6+ tools — a significant reliability risk. Each tool has its own failure modes, authentication mechanisms, rate limits, and data formats. The combinatorial complexity means failures are difficult to diagnose and reproduce.",
        impact:
          "Organisations with 6+ tool workflows report 3.2× more production incidents and 2.4× longer mean-time-to-resolution (McKinsey). Every tool outage becomes your outage. API deprecations can break chains you didn't know existed.",
        action:
          "Urgently consolidate. Identify which tools perform overlapping functions and eliminate redundancy. Implement an orchestration layer (e.g., workflow engine) that abstracts tool interactions. Target reducing to 3–4 tools within 90 days.",
      },
      "3": {
        diagnosis:
          "You're unsure how many tools your workflow touches — which is itself a risk signal. Without visibility into your integration landscape, you can't assess failure modes, plan for outages, or optimise data flows.",
        impact:
          "Lack of integration visibility correlates with 40% higher unplanned downtime (Deloitte). Shadow integrations — tools connected by individuals without central knowledge — are a common source of silent failures.",
        action:
          "Conduct an immediate integration audit. Map every system that sends or receives data in your workflow. Create a dependency diagram. This single exercise often reveals 2–3 unknown failure points.",
      },
    },
  },
  2: {
    title: "How often do inputs arrive incomplete?",
    why: "AI automations rely on clean, complete data; incomplete inputs lead to errors, hallucinations, or stalled processes.",
    insights: {
      "10": {
        diagnosis:
          "Your inputs are consistently complete — a strong foundation for reliable automation. This suggests robust upstream data collection, validation, and standardisation processes are in place.",
        impact:
          "Complete inputs reduce AI error rates by up to 60% (MIT Sloan). When models receive what they expect, hallucination risk drops dramatically and output confidence increases.",
        action:
          "Document your input validation patterns as a reusable template. Monitor for drift — what's complete today may degrade as upstream systems change. Implement automated data quality checks at ingestion.",
      },
      "7": {
        diagnosis:
          "Inputs arrive incomplete in less than 10% of cases. While this seems manageable, at scale even 10% incompleteness translates to significant error volume. For example, 10,000 daily transactions × 10% = 1,000 potential failures.",
        impact:
          "Partial input issues compound downstream. An incomplete address field may not just fail delivery — it may trigger incorrect tax calculations, wrong warehouse routing, and customer service escalations. Each incomplete input touches 3–5 downstream processes on average.",
        action:
          "Implement input validation with fallback logic: default values for non-critical fields, queue-and-alert for critical ones. Track which specific fields are most often incomplete and address the root cause upstream.",
      },
      "3": {
        diagnosis:
          "10–30% incomplete inputs is a serious reliability concern. At this rate, your automation is essentially operating with degraded inputs a third of the time. AI models trained on complete data will produce unreliable outputs when inputs are missing.",
        impact:
          "Organisations with 20%+ incomplete inputs report 2.8× higher rework rates (BCG). The cost isn't just the immediate error — it's the cascading trust erosion. Teams start manually checking AI outputs, negating the automation benefit.",
        action:
          "This is a priority fix. Implement required field validation at the point of entry. For existing workflows, add a pre-processing step that checks completeness before AI processing. Route incomplete cases to a human review queue rather than letting the AI guess.",
      },
      "0": {
        diagnosis:
          "Over 30% of your inputs arrive incomplete — your automation is operating on fundamentally unreliable data. At this rate, the AI is essentially improvising a third of the time, leading to unpredictable and often incorrect outputs.",
        impact:
          "This level of data incompleteness makes any AI output suspect. Teams lose trust in the automation, manual overrides become the norm, and the ROI case for automation collapses. McKinsey reports that data quality issues are the #1 reason AI pilots fail to scale.",
        action:
          "Stop expanding automation until input quality is addressed. Audit your data sources and identify why inputs are incomplete. Implement hard validation — reject or queue incomplete submissions rather than processing them. This single change can improve reliability by 40–60%.",
      },
    },
  },
  3: {
    title: "How often are there approvals or exceptions in the workflow?",
    why: "Human-in-the-loop approvals or exceptions can introduce delays and inconsistencies, making full automation brittle.",
    insights: {
      "10": {
        diagnosis:
          "Your workflow rarely requires human intervention — an ideal state for scalable automation. Rules are well-defined, edge cases are handled programmatically, and the process runs autonomously.",
        impact:
          "Fully autonomous workflows achieve 5–8× throughput versus human-in-the-loop alternatives (Deloitte). Consistency is near-perfect because human variability is removed from the equation.",
        action:
          "Monitor for edge cases that emerge as volume grows. What works at 100 transactions may surface exceptions at 10,000. Build automated exception detection that flags novel patterns before they become failures.",
      },
      "7": {
        diagnosis:
          "Less than 5% exception rate is manageable but worth monitoring. These exceptions often represent legitimate edge cases — unusual transactions, regulatory requirements, or high-value decisions that warrant human judgment.",
        impact:
          "A 5% exception rate at high volume still creates significant human workload. More importantly, the delay introduced by human approval creates bottlenecks. If the approver is unavailable, the entire workflow stalls.",
        action:
          "Categorise your exceptions. Are they genuinely novel, or are they recurring patterns that could be automated with additional rules? Implement SLAs for human approvals and escalation paths for when approvers are unavailable.",
      },
      "3": {
        diagnosis:
          "5–20% exception rate means your automation is partially automated at best. One in five cases requires human intervention, creating inconsistent processing times, variable quality, and dependency on specific individuals.",
        impact:
          "At this exception rate, you're paying for automation infrastructure while still requiring significant human capacity. The ROI case weakens because you can't reduce headcount or reallocate staff — they're needed for exceptions.",
        action:
          "Analyse your top 10 exception types. For each, determine: can this be automated with additional rules? Is this a data quality issue masquerading as an exception? Can approval authority be delegated to lower thresholds? Target reducing exceptions to <5% within 60 days.",
      },
      "0": {
        diagnosis:
          "Over 20% exception rate means your workflow isn't truly automated — it's human-assisted at best. The AI handles the straightforward cases while humans manage the complex, high-value, or unusual ones.",
        impact:
          "High exception rates create a 'worst of both worlds' scenario: the cost of automation infrastructure plus the cost of human exception handling. Throughput is limited by human capacity. Quality varies by who handles the exception.",
        action:
          "Fundamentally reassess whether this workflow is ready for automation. Consider: 1) Are the rules well-defined enough? 2) Is the data clean enough? 3) Is the process standardised enough? Address root causes before adding more automation.",
      },
    },
  },
  4: {
    title: "Do you have a single source of truth for workflow status?",
    why: "Without a centralized status tracker, debugging failures becomes chaotic, leading to longer downtimes.",
    insights: {
      "10": {
        diagnosis:
          "A single, authoritative source for workflow status is a hallmark of mature automation. Everyone — from operators to executives — can see what's happening, where things are stuck, and what needs attention.",
        impact:
          "Centralised status tracking reduces mean-time-to-resolution (MTTR) by 65% (PwC). When an issue occurs, you're not asking 'where is this?' or 'what happened?' — the answer is visible immediately.",
        action:
          "Enhance your single source of truth with predictive indicators. Beyond 'what is the status now,' can you surface 'what is likely to fail next'? Add SLA tracking and trend analysis to move from reactive to proactive.",
      },
      "5": {
        diagnosis:
          "Partial implementation — some tools or stages have status tracking, but gaps exist. This creates a frustrating experience where you can see part of the workflow but are blind to other parts.",
        impact:
          "Partial visibility is often worse than no visibility because it creates false confidence. Teams assume they have the full picture when they're actually missing critical status information from untracked systems.",
        action:
          "Map the gaps. Which systems or stages aren't feeding into your status tracker? Prioritise connecting the highest-risk stages first. A webhook or polling integration can often close these gaps within days, not weeks.",
      },
      "0": {
        diagnosis:
          "No single source of truth means every debugging session starts with 'let me check in this system... and this one... and maybe this spreadsheet...' It's archaeology, not engineering.",
        impact:
          "Without centralised status, MTTR increases 3× and team frustration compounds. When workflows fail, you spend more time finding the problem than fixing it. Cross-functional workflows are especially impacted — no one knows the full picture.",
        action:
          "This is a foundational fix. Implement a simple status dashboard that aggregates state from all workflow tools. Even a shared spreadsheet updated via API is better than nothing. Target: every workflow stage should be visible in one place within 30 days.",
      },
      "3": {
        diagnosis:
          "You're planning to implement centralised status tracking — which shows awareness of the problem. However, without it in place, you're currently operating blind during incidents.",
        impact:
          "Every day without centralised status increases your exposure to extended outages. The cost of building it now is a fraction of the cost of a major incident where you can't quickly identify the failure point.",
        action:
          "Accelerate implementation. Start with the MVP: a single dashboard showing the status of your top 5 workflows. Don't over-engineer — a simple API aggregation is better than a perfect system that takes months to build.",
      },
    },
  },
  5: {
    title: "How do you currently measure error rate?",
    why: "Without measurement, you can't detect drifts or improvements, allowing silent failures to compound.",
    insights: {
      "10": {
        diagnosis:
          "Automated monitoring with dashboards is the gold standard. You can detect anomalies in real-time, track trends over time, and set alerts for threshold breaches — all without manual effort.",
        impact:
          "Automated error monitoring catches issues 12× faster than manual spot-checks (Gartner). Early detection means smaller blast radius — a problem caught in 5 minutes affects 50 transactions; caught in 5 hours, it affects 5,000.",
        action:
          "Enhance your monitoring with anomaly detection. Static thresholds miss gradual drifts. Machine learning-based anomaly detection can surface 'slow leaks' — error rates creeping up 0.5% per week — that manual reviews miss.",
      },
      "5": {
        diagnosis:
          "Manual spot-checks mean you're sampling error rate rather than measuring it comprehensively. You'll catch systemic issues but miss intermittent failures, edge cases, and gradual drifts between check intervals.",
        impact:
          "Spot-checking creates a 'measurement gap' — the time between checks is a blind spot. A study by MIT found that manual monitoring misses 40% of incidents that automated monitoring catches. The incidents it misses are often the subtle, high-impact ones.",
        action:
          "Automate your spot-checks. If you're already checking specific metrics, scripting those checks and running them continuously is often a small effort. Start with your top 3 error-prone areas and expand from there.",
      },
      "0": {
        diagnosis:
          "No systematic error measurement means you're flying blind. You don't know your current error rate, whether it's improving or degrading, or which workflows are the most unreliable. You only learn about errors when they cause visible failures.",
        impact:
          "Without measurement, silent failures compound. A 2% error rate sounds small, but over 10,000 daily transactions that's 200 errors per day — potentially 73,000 per year. Each one has a cost, and you can't manage what you can't measure.",
        action:
          "Implement basic error tracking immediately. Start simple: log every error with timestamp, workflow, and error type. Create a daily error rate metric. This alone will transform your ability to prioritise reliability improvements.",
      },
      "3": {
        diagnosis:
          "Basic logging captures what happened but doesn't surface patterns. Logs sit in files until someone manually searches them — usually after a major incident has already occurred.",
        impact:
          "Logging without monitoring is like having a security camera that nobody watches. The data exists but isn't being used proactively. When you do need it, searching through logs is time-consuming and often incomplete.",
        action:
          "Turn your logs into metrics. Use a log aggregation tool to create dashboards from your existing log data. Set up alerts for error rate thresholds. Your logs already contain the information — you just need to make it visible and actionable.",
      },
    },
  },
  6: {
    title: "How often do rules or requirements change?",
    why: "Frequent changes can obsolete AI models or logic, causing outputs to drift without retraining.",
    insights: {
      "10": {
        diagnosis:
          "Stable rules (changing less than quarterly) provide a reliable foundation for automation. Your AI models and business logic have time to be tested, optimised, and trusted before the next change cycle.",
        impact:
          "Stable environments see 2.5× higher automation ROI because the investment in building and testing automation has a longer payback period (BCG). Trust in AI outputs is higher because rules don't shift under people's feet.",
        action:
          "Use this stability as an advantage — invest in more sophisticated automation knowing that the rules won't obsolete your work quickly. Build change management processes so that when rules do change, updates are systematic rather than ad-hoc.",
      },
      "5": {
        diagnosis:
          "Quarterly rule changes are manageable but require disciplined change management. Each change cycle means reviewing AI logic, updating rules, testing, and validating outputs — a non-trivial effort that must be planned for.",
        impact:
          "Without proper change management, quarterly updates create quarterly risk windows. The period immediately after a rule change is when most errors occur — new rules haven't been fully tested, edge cases haven't been discovered, and teams are still adjusting.",
        action:
          "Build a rule change playbook: 1) Document current rules in a centralised repository, 2) Create a testing protocol for rule changes, 3) Implement a staged rollout with monitoring during the first week, 4) Set a review cadence to catch issues early.",
      },
      "0": {
        diagnosis:
          "Monthly or more frequent rule changes create a fundamentally unstable environment for automation. By the time you've adapted to one change, another is incoming. AI models trained on previous rules may be producing incorrect outputs under new ones.",
        impact:
          "Frequent changes make automation ROI nearly impossible to achieve. Every change requires re-testing, re-validation, and often re-training. Teams lose trust in AI outputs because 'the rules just changed again.' Manual overrides become the default.",
        action:
          "Address rule volatility at the source. Are rules changing because the business is genuinely dynamic, or because processes aren't well-defined? If the former, build modular automation that can absorb changes. If the latter, stabilise processes before automating them.",
      },
      "3": {
        diagnosis:
          "You're unsure how often rules change — indicating either that changes happen without your awareness or that the boundary between 'rules' and 'ad-hoc adjustments' isn't clear.",
        impact:
          "Untracked rule changes are a silent automation killer. Your AI may be operating on outdated logic without anyone realising it. Outputs drift, accuracy degrades, and by the time someone notices, the damage has compounded.",
        action:
          "Create a rule registry. Document every business rule that your automation depends on, who owns it, and when it was last changed. Set up notifications for changes. This visibility alone will help you assess whether your automation is operating on current logic.",
      },
    },
  },
  7: {
    title: "Who owns the workflow end-to-end?",
    why: "Clear ownership ensures accountability for fixes; fragmented ownership leads to finger-pointing and delays.",
    insights: {
      "10": {
        diagnosis:
          "A dedicated owner for the end-to-end workflow is the single strongest predictor of automation reliability. This person or team has full visibility, accountability, and authority to make changes across the entire process.",
        impact:
          "Owned workflows have 4× faster incident resolution and 60% fewer recurring issues (McKinsey). The owner catches problems early, prioritises fixes based on business impact, and maintains institutional knowledge that prevents regression.",
        action:
          "Empower your workflow owner with the authority to make changes without multi-team approval for routine fixes. Ensure they have dashboards, alerts, and tools to monitor the workflow proactively. Document their knowledge to mitigate key-person risk.",
      },
      "5": {
        diagnosis:
          "Shared ownership across departments with clear roles can work, but it requires exceptional coordination. In practice, 'shared' often means 'nobody's primary responsibility' — especially during incidents when everyone assumes someone else is handling it.",
        impact:
          "Shared ownership increases coordination cost by 40% and slows decision-making during incidents (Deloitte). Cross-department priorities may conflict — one team's urgent fix is another team's low-priority request.",
        action:
          "Designate a 'first responder' — even in a shared model, one person should be the primary point of contact for incidents. Create clear escalation paths and SLAs between departments. Hold regular cross-team reviews to prevent ownership gaps.",
      },
      "0": {
        diagnosis:
          "No clear owner is the root cause of chronic automation reliability issues. When nobody owns the workflow, nobody is responsible for monitoring it, fixing it, or improving it. Issues accumulate until they cause visible failures.",
        impact:
          "Ownerless workflows have 5× higher failure rates and 8× longer resolution times. When an incident occurs, the first 30 minutes are often spent figuring out who should handle it — time that should be spent fixing the problem.",
        action:
          "Assign an owner immediately. This is the single highest-impact change you can make. Choose someone with cross-functional authority and give them explicit accountability for workflow uptime, error rates, and throughput.",
      },
      "3": {
        diagnosis:
          "Ownership is being defined — a positive signal that you've recognised the gap. However, until ownership is formalised with accountability and authority, you're in the same position as having no owner.",
        impact:
          "The definition process itself can stall if not driven to completion. Organisations often spend months 'defining ownership' while workflows continue to operate without accountability.",
        action:
          "Set a 2-week deadline to finalise ownership. Don't let perfect be the enemy of good — assign an interim owner now and refine the structure later. The interim owner should immediately establish monitoring and an incident response process.",
      },
    },
  },
  8: {
    title: "Can you audit what happened and why in a workflow?",
    why: "Auditability allows root-cause analysis; without it, fixing issues is guesswork, eroding trust.",
    insights: {
      "10": {
        diagnosis:
          "Full logging and traceability means you can reconstruct exactly what happened in any workflow execution — every input, decision, transformation, and output. This is the foundation of both reliability engineering and regulatory compliance.",
        impact:
          "Full auditability reduces MTTR by 75% because root-cause analysis goes from 'guessing and testing' to 'reading the log.' It also enables proactive pattern detection — you can identify failure patterns before they become incidents.",
        action:
          "Leverage your audit logs for continuous improvement. Analyse patterns: which steps fail most often? Which inputs correlate with errors? Use this data to prioritise reliability investments. Consider AI-assisted log analysis for large-volume workflows.",
      },
      "5": {
        diagnosis:
          "Partial auditing — covering key steps but not all — leaves blind spots. You can see the highlights but miss the details. When failures occur between audited steps, root-cause analysis becomes speculative.",
        impact:
          "Partial auditing catches 60% of issues but misses the other 40% — and those tend to be the most complex and impactful ones. The failures that occur in unaudited steps are the hardest to diagnose and the most likely to recur.",
        action:
          "Extend auditing to cover all steps, not just key ones. Modern logging frameworks make comprehensive auditing lightweight. Prioritise auditing the steps between your currently audited checkpoints — that's where the gap is.",
      },
      "0": {
        diagnosis:
          "No auditing capability means every failure investigation starts from scratch. You can't determine what happened, when, or why. Fixes are based on hypotheses rather than evidence, leading to incomplete solutions and recurring issues.",
        impact:
          "Without auditing, the same issues recur because you never truly identify root causes. Teams develop workarounds instead of fixes. Regulatory risk increases — many industries require process traceability that you can't provide.",
        action:
          "Implement logging immediately. Start with structured logs at input, decision points, and output for your highest-volume workflows. Use a standardised format (JSON) so logs are machine-parseable. This is a foundational capability — everything else builds on it.",
      },
      "3": {
        diagnosis:
          "Basic timestamps tell you when things happened but not what happened or why. You can establish a timeline but can't understand causality. It's like having a security camera with no audio and low resolution.",
        impact:
          "Timestamp-only auditing extends diagnosis time by 3–4× because you have to infer what happened between timestamps from other evidence. It's better than nothing but far from sufficient for reliable automation at scale.",
        action:
          "Enrich your timestamps with context. For each logged timestamp, add: what action was taken, what data was involved, what the outcome was. This transforms timestamps from a timeline into a narrative.",
      },
    },
  },
  9: {
    title: "What's the cost of a single error?",
    why: "High-cost errors amplify risk; understanding this helps prioritize reliability investments.",
    insights: {
      "10": {
        diagnosis:
          "Low error cost provides a safety margin for experimentation and learning. Errors are annoying but not harmful — you can afford to iterate, test, and improve without catastrophic consequences.",
        impact:
          "Low-cost error environments are ideal for building automation confidence. Teams can deploy, learn, and improve rapidly because the cost of failure is manageable. This accelerates the path to reliable automation.",
        action:
          "Use your low error cost as a competitive advantage. Move faster than organisations paralysed by high error costs. Implement automated testing and canary deployments — if something goes wrong, the cost is manageable.",
      },
      "5": {
        diagnosis:
          "Medium error costs mean each failure is noticeable but recoverable. The business impact is real — customer dissatisfaction, rework costs, operational delays — but doesn't threaten the organisation.",
        impact:
          "At medium cost, errors are tolerated individually but accumulate. 100 medium-cost errors per month may equal the impact of one high-cost error. The danger is normalisation — teams stop treating medium errors as serious because each one seems manageable.",
        action:
          "Track total error cost, not just individual incidents. Set a monthly error cost budget and treat exceeding it as seriously as a single catastrophic failure. This prevents the 'death by a thousand cuts' pattern.",
      },
      "0": {
        diagnosis:
          "High error cost means each failure causes significant business harm — financial losses, regulatory penalties, reputation damage, or customer churn. The stakes are real and the margin for error is slim.",
        impact:
          "High-cost errors demand high reliability. A single failure can wipe out months of automation ROI. The psychological impact is also significant — teams become risk-averse, slowing innovation and creating excessive manual checks.",
        action:
          "Invest proportionally in reliability. If a single error costs $10K, spending $50K on error prevention and detection has a clear payback. Implement automated safeguards: validation checks, rollback mechanisms, and human-in-the-loop for high-risk decisions.",
      },
      "0_catastrophic": {
        diagnosis:
          "Catastrophic error costs — where a single failure could cause existential business harm — require the highest level of automation discipline. Every workflow must be tested, monitored, and validated with zero tolerance for error.",
        impact:
          "At this risk level, the question isn't whether to invest in reliability but how much. Regulatory bodies, customers, and stakeholders expect near-perfect execution. A single failure can trigger investigations, lawsuits, or permanent reputation damage.",
        action:
          "Implement defence-in-depth: multiple independent checks, mandatory human approval for high-risk actions, automated rollback, and real-time monitoring with immediate alerting. Consider whether full automation is appropriate — some high-cost processes may be better served by AI-assisted human decision-making.",
      },
    },
  },
  10: {
    title: "How often do you rework the same tasks due to errors?",
    why: "High rework indicates underlying unreliability, wasting resources and highlighting automation gaps.",
    insights: {
      "10": {
        diagnosis:
          "Less than 5% rework rate indicates that your automation produces correct outputs the vast majority of the time. Errors are rare, identified quickly, and don't require re-processing entire batches.",
        impact:
          "Low rework means your automation ROI is realised fully — you're not paying for the same work twice. Team morale is higher because they're working on new value, not fixing repeated mistakes.",
        action:
          "Investigate your remaining 5% rework. Are these truly novel edge cases, or recurring patterns that could be eliminated? Even reducing rework from 5% to 2% at scale represents significant operational savings.",
      },
      "5": {
        diagnosis:
          "5–15% rework rate means 1 in 10 to 1 in 7 tasks needs to be done again. This isn't catastrophic but it's a significant drag on efficiency and team morale. It suggests that your automation handles the common cases but struggles with variations.",
        impact:
          "At 10% rework, you're effectively operating at 90% efficiency — your automation ROI is reduced proportionally. Additionally, rework tasks often require senior team members, creating bottleneck dependencies.",
        action:
          "Analyse your rework by category. What types of tasks are most often redone? Is it always the same step that fails? Build targeted fixes for the top 3 rework causes. Often, 80% of rework comes from 20% of error types.",
      },
      "0": {
        diagnosis:
          "Over 15% rework rate is a critical reliability issue. You're essentially paying 1.15× or more for every task — and the rework itself is often more expensive than the original work because it requires diagnosis, correction, and re-validation.",
        impact:
          "High rework is a symptom of deeper issues: poor input quality, inadequate rules, insufficient testing, or fundamental misalignment between the automation and the actual process. It also erodes team trust — if 1 in 6 outputs is wrong, people stop trusting any output.",
        action:
          "Declare rework reduction a priority initiative. Conduct a root-cause analysis of your last 50 rework incidents. You'll likely find 3–5 patterns that account for the majority. Fix those patterns and your rework rate will drop dramatically.",
      },
      "3": {
        diagnosis:
          "You're unsure about your rework rate — which means you're not tracking it. Without measurement, you can't assess whether reliability is improving or degrading, and you can't prioritise fixes based on actual impact.",
        impact:
          "Untracked rework is often higher than people estimate. In surveys, organisations that 'guessed' their rework rate and then measured it found actual rates were 40–60% higher than estimated (Deloitte).",
        action:
          "Start tracking rework immediately. Tag every task that requires re-processing, log the reason, and calculate the rate weekly. This data will be your most valuable input for prioritising reliability improvements.",
      },
    },
  },
};

/* ─── Band-level strategic analysis ─── */
const BAND_STRATEGY: Record<
  string,
  {
    summary: string;
    risk_profile: string;
    investment_thesis: string;
    timeline: string;
  }
> = {
  "high-risk": {
    summary:
      "Your automation has significant reliability vulnerabilities across multiple dimensions. Production failures are likely frequent and costly. The priority is stabilisation — building foundational reliability before expanding automation scope.",
    risk_profile:
      "Critical exposure. Multiple failure modes are active simultaneously, creating compounding risk. A single incident can trigger cascading failures across interconnected workflows. Manual overrides are likely consuming significant team capacity.",
    investment_thesis:
      "Focus investment on the 3 lowest-scoring areas first. Foundational reliability improvements (monitoring, ownership, input validation) typically deliver 3–5× ROI within 90 days because they prevent the most common and costly failure modes.",
    timeline:
      "Expect 60–90 days to achieve baseline stability. Full reliability transformation typically takes 6–9 months. Quick wins (monitoring, ownership assignment) can be achieved within 2 weeks.",
  },
  "medium-risk": {
    summary:
      "Your automation has a solid foundation but specific gaps that could cause issues under stress or at scale. You're past the basics but haven't yet achieved the resilience needed for enterprise-grade reliability.",
    risk_profile:
      "Moderate exposure. Your strongest areas provide genuine value, but weaker areas create vulnerability windows. Failures tend to occur in predictable patterns — which means they're fixable with targeted investment.",
    investment_thesis:
      "Your ROI case is compelling because you're close to reliable. Addressing 2–3 specific gaps can shift you from 'works most of the time' to 'works reliably at scale.' The marginal cost of these improvements is low relative to the value unlock.",
    timeline:
      "Targeted improvements can be implemented in 30–60 days. Full gap closure typically takes 3–4 months. The key is prioritisation — focus on the gaps that create the most risk.",
  },
  strong: {
    summary:
      "Your automation foundation is solid with strong practices across most reliability dimensions. The focus now shifts from building reliability to optimising and extending it — catching edge cases, reducing the last 5% of errors, and scaling confidently.",
    risk_profile:
      "Low exposure with residual risks. Your main threats are complacency (assuming reliability will maintain itself) and edge cases that emerge as volume increases. Monitor for gradual drift rather than sudden failures.",
    investment_thesis:
      "Your reliability investment has paid off. The next phase is optimisation — extracting more value from your reliable foundation. Consider advanced capabilities: predictive monitoring, automated remediation, and cross-workflow orchestration.",
    timeline:
      "Continuous improvement is the model. Monthly reviews to catch drift, quarterly capability expansions. Major reliability incidents should be rare — when they occur, treat them as learning opportunities.",
  },
};

/* ─── Scoring thresholds for per-question recommendations ─── */
const QUESTION_RECS: Record<number, string> = {
  1: "Simplify your workflow by reducing the number of integrated tools to minimize failure points.",
  2: "Add robust input validation to handle incomplete data and prevent automation stalls.",
  3: "Streamline approvals by automating low-risk exceptions or clarifying human intervention rules.",
  4: "Establish a single source of truth (e.g., a dashboard) for real-time status tracking.",
  5: "Implement automated error monitoring to catch issues early.",
  6: "Build in flexibility for rule changes, like modular logic or frequent retraining.",
  7: "Assign clear end-to-end ownership to a team for faster issue resolution.",
  8: "Enhance auditing with comprehensive logging to enable quick debugging.",
  9: "Mitigate high-error costs by adding safeguards like rollback mechanisms.",
  10: "Reduce rework by identifying root causes through better testing and iteration.",
};

const BAND_COLORS: Record<string, [number, number, number]> = {
  "high-risk": [220, 60, 60],
  "medium-risk": [245, 158, 11],
  strong: [40, 160, 100],
};

const BAND_LABELS: Record<string, string> = {
  "high-risk": "HIGH RISK",
  "medium-risk": "MEDIUM RISK",
  strong: "STRONG",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as AssessmentRequest;
    const { lead_id, name, email, company, answers, score, band } = body;

    const bandColor = BAND_COLORS[band] || BAND_COLORS["medium-risk"];

    // Sort answers by score ascending to find weakest areas
    const sortedByScore = [...answers].sort((a, b) => a.score - b.score);
    const weakAreas = sortedByScore.filter((a) => a.score < 7).slice(0, 3);
    const strongAreas = sortedByScore.filter((a) => a.score >= 7);

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pw = 210;
    const ph = 297;
    const m = 20;
    const cw = pw - m * 2;
    let y = 0;

    // ─── HELPERS ───
    const checkPage = (need: number) => {
      if (y + need > 272) {
        doc.addPage();
        y = 28;
        drawPageHeader();
      }
    };

    const drawPageHeader = () => {
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pw, 14, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.text("Production Reliability Assessment  |  Chase Agents", m, 9);
      doc.text(company || name, pw - m, 9, { align: "right" });
    };

    const drawWrapped = (
      text: string,
      fontSize: number,
      font: string,
      color: [number, number, number],
      indent = 0,
      lineH = 5,
      maxW?: number,
    ) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", font);
      doc.setTextColor(color[0], color[1], color[2]);
      const w = maxW || cw - indent;
      const lines = doc.splitTextToSize(text, w);
      for (const line of lines) {
        checkPage(lineH + 1);
        doc.text(line, m + indent, y);
        y += lineH;
      }
    };

    const drawSectionTitle = (title: string) => {
      checkPage(16);
      doc.setFillColor(240, 242, 246);
      doc.roundedRect(m, y - 1, cw, 10, 2, 2, "F");
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(title.toUpperCase(), m + 4, y + 5.5);
      y += 15;
    };

    // ═══════════════════════════════════════
    // PAGE 1: COVER
    // ═══════════════════════════════════════
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pw, ph, "F");

    // Geometric accents
    doc.setFillColor(20, 30, 55);
    doc.circle(pw + 20, -20, 120, "F");
    doc.setFillColor(22, 35, 60);
    doc.circle(-30, ph + 10, 90, "F");

    // Amber accent line
    doc.setFillColor(245, 158, 11);
    doc.rect(m, 30, 40, 1.5, "F");

    // Branding
    const branding = await drawBrandHeader(doc, {
      margin: m,
      top: 22,
      textColor: [245, 158, 11],
      fontSize: 12,
      logoHeight: 10,
      gap: 4,
    });
    doc.setTextColor(100, 115, 140);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Enterprise AI Studio", branding.textStartX, branding.bottomY + 6);

    // Main title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text("Production Reliability", m, 78);
    doc.text("Assessment", m, 93);

    // Subtitle
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 175, 200);
    doc.text("Diagnostic Report & Action Plan", m, 110);

    // Divider
    doc.setFillColor(40, 55, 80);
    doc.rect(m, 120, cw, 0.3, "F");

    // Client info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(130, 145, 170);
    doc.text("PREPARED FOR", m, 136);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(name, m, 146);
    if (company) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(160, 175, 200);
      doc.text(company, m, 155);
    }

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 115, 140);
    doc.text(
      new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      m,
      168,
    );

    // Score card
    const cardY = 188;
    doc.setFillColor(25, 38, 65);
    doc.roundedRect(m, cardY, cw, 55, 4, 4, "F");
    doc.setFillColor(bandColor[0], bandColor[1], bandColor[2]);
    doc.roundedRect(m, cardY, cw, 4, 4, 4, "F");
    doc.setFillColor(25, 38, 65);
    doc.rect(m, cardY + 3, cw, 2, "F");

    // Score number
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(48);
    doc.setFont("helvetica", "bold");
    doc.text(`${score}`, m + 12, cardY + 30);
    doc.setFontSize(18);
    doc.setTextColor(100, 115, 140);
    doc.text(
      "/ 100",
      m + (score >= 100 ? 55 : score >= 10 ? 45 : 30),
      cardY + 30,
    );

    // Band label
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(bandColor[0], bandColor[1], bandColor[2]);
    doc.text(BAND_LABELS[band] || "MEDIUM RISK", m + 12, cardY + 43);

    // Per-question mini scores on right side
    const miniY = cardY + 12;
    const miniPerCol = 5;
    for (let i = 0; i < Math.min(answers.length, 10); i++) {
      const col = i < miniPerCol ? 0 : 1;
      const row = i % miniPerCol;
      const mx = pw - m - (col === 0 ? 70 : 25);
      const my = miniY + row * 8;

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(130, 145, 170);
      doc.text(`Q${answers[i].question_id}`, mx, my);

      const qScore = answers[i].score;
      const qColor: [number, number, number] =
        qScore >= 7
          ? [40, 160, 100]
          : qScore >= 4
            ? [245, 158, 11]
            : [220, 60, 60];
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(qColor[0], qColor[1], qColor[2]);
      doc.text(`${qScore}/10`, mx + 12, my);

      // Mini bar
      const barW = 20;
      const barX = mx + 25;
      doc.setFillColor(35, 48, 75);
      doc.roundedRect(barX, my - 3, barW, 3, 1, 1, "F");
      doc.setFillColor(qColor[0], qColor[1], qColor[2]);
      doc.roundedRect(
        barX,
        my - 3,
        Math.max(1, (qScore / 10) * barW),
        3,
        1,
        1,
        "F",
      );
    }

    // Footer
    doc.setTextColor(60, 75, 100);
    doc.setFontSize(7.5);
    doc.text("Confidential — For internal use only", m, 272);
    doc.text("chaseagents.com", pw - m, 278, { align: "right" });

    // ═══════════════════════════════════════
    // PAGE 2: EXECUTIVE SUMMARY
    // ═══════════════════════════════════════
    doc.addPage();
    drawPageHeader();
    y = 28;

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Executive Summary", m, y);
    y += 10;

    doc.setFillColor(245, 158, 11);
    doc.rect(m, y, 30, 1, "F");
    y += 8;

    const strat = BAND_STRATEGY[band] || BAND_STRATEGY["medium-risk"];
    drawWrapped(strat.summary, 10, "normal", [40, 45, 55], 0, 5);
    y += 6;

    // Key metrics grid
    drawSectionTitle("Key Metrics at a Glance");

    const metricsY = y;
    const mw = (cw - 6) / 4;
    const avgScore = answers.reduce((s, a) => s + a.score, 0) / answers.length;
    const minQ = sortedByScore[0];
    const maxQ = sortedByScore[sortedByScore.length - 1];

    const metrics = [
      { label: "Total Score", value: `${score}/100`, color: bandColor },
      {
        label: "Average / Question",
        value: `${avgScore.toFixed(1)}/10`,
        color:
          avgScore >= 7
            ? ([40, 160, 100] as [number, number, number])
            : avgScore >= 4
              ? ([245, 158, 11] as [number, number, number])
              : ([220, 60, 60] as [number, number, number]),
      },
      {
        label: "Weakest Area",
        value: `Q${minQ.question_id}`,
        color: [220, 60, 60] as [number, number, number],
      },
      {
        label: "Strongest Area",
        value: `Q${maxQ.question_id}`,
        color: [40, 160, 100] as [number, number, number],
      },
    ];

    for (let i = 0; i < 4; i++) {
      const mx = m + i * (mw + 2);
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(mx, metricsY, mw, 24, 2, 2, "F");
      doc.setFillColor(
        metrics[i].color[0],
        metrics[i].color[1],
        metrics[i].color[2],
      );
      doc.roundedRect(mx, metricsY, mw, 2.5, 2, 2, "F");
      doc.setFillColor(245, 247, 250);
      doc.rect(mx, metricsY + 2, mw, 1, "F");

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(metrics[i].value, mx + mw / 2, metricsY + 13, {
        align: "center",
      });
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 105, 120);
      doc.text(metrics[i].label.toUpperCase(), mx + mw / 2, metricsY + 20, {
        align: "center",
      });
    }
    y = metricsY + 30;

    // Risk Profile
    drawSectionTitle("Risk Profile");
    drawWrapped(strat.risk_profile, 9.5, "normal", [40, 45, 55], 0, 4.8);
    y += 4;

    // Investment Thesis
    drawSectionTitle("Investment Thesis");
    drawWrapped(strat.investment_thesis, 9.5, "normal", [40, 45, 55], 0, 4.8);
    y += 4;

    // Timeline
    drawSectionTitle("Expected Timeline");
    drawWrapped(strat.timeline, 9.5, "normal", [40, 45, 55], 0, 4.8);
    y += 4;

    // Score bar chart
    drawSectionTitle("Question Performance");

    for (const answer of answers) {
      checkPage(16);
      const qColor: [number, number, number] =
        answer.score >= 7
          ? [40, 160, 100]
          : answer.score >= 4
            ? [245, 158, 11]
            : [220, 60, 60];

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      const shortQ = `Q${answer.question_id}: ${answer.question_text}`;
      const truncQ =
        shortQ.length > 65 ? shortQ.substring(0, 62) + "..." : shortQ;
      doc.text(truncQ, m, y);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(qColor[0], qColor[1], qColor[2]);
      doc.text(`${answer.score}/10`, pw - m, y, { align: "right" });
      y += 3;

      // Bar
      const barH = 5;
      doc.setFillColor(230, 233, 238);
      doc.roundedRect(m, y, cw, barH, 2, 2, "F");
      const fillW = Math.max(2, (answer.score / 10) * cw);
      doc.setFillColor(qColor[0], qColor[1], qColor[2]);
      doc.roundedRect(m, y, fillW, barH, 2, 2, "F");

      y += barH + 6;
    }

    // ═══════════════════════════════════════
    // PAGES: QUESTION DEEP-DIVES
    // ═══════════════════════════════════════
    for (const answer of answers) {
      doc.addPage();
      drawPageHeader();
      y = 28;

      const qa = QUESTION_ANALYSIS[answer.question_id];
      if (!qa) continue;

      const qColor: [number, number, number] =
        answer.score >= 7
          ? [40, 160, 100]
          : answer.score >= 4
            ? [245, 158, 11]
            : [220, 60, 60];

      // Question title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      const titleLines = doc.splitTextToSize(
        `Q${answer.question_id}: ${qa.title}`,
        cw,
      );
      doc.text(titleLines, m, y);
      y += titleLines.length * 7 + 3;

      // Score badge
      doc.setFillColor(qColor[0], qColor[1], qColor[2]);
      const scoreTxt = `${answer.score} / 10  —  ${answer.selected_option}`;
      const badgeW = Math.min(doc.getTextWidth(scoreTxt) * 0.37 + 10, cw);
      doc.roundedRect(m, y, badgeW, 8, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.text(scoreTxt, m + 3, y + 5.5);
      y += 14;

      // Amber accent
      doc.setFillColor(245, 158, 11);
      doc.rect(m, y, 25, 0.8, "F");
      y += 6;

      // Why it matters
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 85, 100);
      doc.text("WHY IT MATTERS", m, y);
      y += 5;
      drawWrapped(qa.why, 9.5, "normal", [40, 45, 55], 0, 4.8);
      y += 6;

      // Get the appropriate insight
      let insightKey = answer.score.toString();
      // Handle Q9 catastrophic case
      if (
        answer.question_id === 9 &&
        answer.score === 0 &&
        answer.selected_option.toLowerCase().includes("catastrophic")
      ) {
        insightKey = "0_catastrophic";
      }
      const insight =
        qa.insights[insightKey] || qa.insights[Object.keys(qa.insights)[0]];

      if (insight) {
        // Diagnosis
        drawSectionTitle("Diagnosis");
        drawWrapped(insight.diagnosis, 9.5, "normal", [40, 45, 55], 0, 4.8);
        y += 6;

        // Impact
        drawSectionTitle("Business Impact");
        drawWrapped(insight.impact, 9.5, "normal", [40, 45, 55], 0, 4.8);
        y += 6;

        // Recommended Action
        drawSectionTitle("Recommended Action");

        // Action box
        checkPage(30);
        doc.setFillColor(248, 249, 252);
        const actionLines = doc.splitTextToSize(insight.action, cw - 16);
        const boxH = actionLines.length * 4.5 + 10;
        doc.roundedRect(m, y - 2, cw, boxH, 2, 2, "F");
        doc.setFillColor(qColor[0], qColor[1], qColor[2]);
        doc.roundedRect(m, y - 2, 2.5, boxH, 1, 1, "F");

        doc.setFontSize(9.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40, 45, 55);
        let ay = y + 4;
        for (const line of actionLines) {
          checkPage(5);
          doc.text(line, m + 8, ay);
          ay += 4.5;
        }
        y = ay + 6;
      }

      // Priority recommendation if low-scoring
      if (answer.score < 5 && QUESTION_RECS[answer.question_id]) {
        checkPage(22);
        doc.setFillColor(15, 23, 42);
        const recLines = doc.splitTextToSize(
          QUESTION_RECS[answer.question_id],
          cw - 16,
        );
        const recH = recLines.length * 4.5 + 14;
        doc.roundedRect(m, y, cw, recH, 3, 3, "F");
        doc.setFillColor(bandColor[0], bandColor[1], bandColor[2]);
        doc.roundedRect(m, y, cw, 3, 3, 3, "F");
        doc.setFillColor(15, 23, 42);
        doc.rect(m, y + 2, cw, 2, "F");

        doc.setTextColor(245, 158, 11);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text("⚠ PRIORITY RECOMMENDATION", m + 6, y + 10);

        doc.setTextColor(220, 225, 240);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        let ry = y + 16;
        for (const line of recLines) {
          doc.text(line, m + 6, ry);
          ry += 4.5;
        }
        y = ry + 6;
      }
    }

    // ═══════════════════════════════════════
    // ROADMAP PAGE
    // ═══════════════════════════════════════
    doc.addPage();
    drawPageHeader();
    y = 28;

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Reliability Roadmap", m, y);
    y += 10;
    doc.setFillColor(245, 158, 11);
    doc.rect(m, y, 30, 1, "F");
    y += 8;

    const weakNames = weakAreas.map((a) => `Q${a.question_id}`).join(", ");
    drawWrapped(
      `Based on your assessment results, the following phased roadmap targets your highest-impact improvement areas. Priority has been given to your weakest areas (${weakNames || "general improvements"}) based on current scores. Each phase builds on the previous.`,
      10,
      "normal",
      [40, 45, 55],
      0,
      5,
    );
    y += 6;

    const phases = [
      {
        title: "Phase 1: Stabilise",
        timeline: "0–30 days",
        color: [220, 60, 60] as [number, number, number],
        actions: [
          weakAreas[0]
            ? `Address Q${weakAreas[0].question_id} (${weakAreas[0].question_text}): ${QUESTION_RECS[weakAreas[0].question_id] || "Implement immediate improvements."}`
            : "Conduct a full workflow reliability audit — catalogue every failure point.",
          "Assign clear end-to-end ownership for each automated workflow.",
          "Implement basic error monitoring and alerting for production workflows.",
          "Create an incident response playbook for automation failures.",
        ],
      },
      {
        title: "Phase 2: Strengthen",
        timeline: "30–90 days",
        color: [245, 158, 11] as [number, number, number],
        actions: [
          weakAreas[1]
            ? `Address Q${weakAreas[1].question_id} (${weakAreas[1].question_text}): ${QUESTION_RECS[weakAreas[1].question_id] || "Implement targeted improvements."}`
            : "Implement comprehensive input validation and data quality checks.",
          "Build audit trails for all critical workflow decision points.",
          "Standardise exception handling procedures across all automated workflows.",
          "Implement automated testing for workflow changes before production deployment.",
        ],
      },
      {
        title: "Phase 3: Optimise",
        timeline: "90–180 days",
        color: [40, 160, 100] as [number, number, number],
        actions: [
          weakAreas[2]
            ? `Address Q${weakAreas[2].question_id} (${weakAreas[2].question_text}): ${QUESTION_RECS[weakAreas[2].question_id] || "Implement optimisation improvements."}`
            : "Implement predictive monitoring to catch issues before they impact production.",
          "Reduce rework rates through root-cause analysis and systematic fixes.",
          "Build cross-workflow orchestration for complex multi-step processes.",
          "Establish continuous improvement cadence with monthly reliability reviews.",
        ],
      },
    ];

    for (const phase of phases) {
      checkPage(45);

      doc.setFillColor(phase.color[0], phase.color[1], phase.color[2]);
      doc.roundedRect(m, y, cw, 4, 2, 2, "F");
      doc.setFillColor(248, 249, 252);
      doc.roundedRect(m, y + 2, cw, 2, 0, 0, "F");

      y += 6;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(phase.title, m + 2, y + 2);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(phase.color[0], phase.color[1], phase.color[2]);
      doc.text(phase.timeline, pw - m, y + 2, { align: "right" });
      y += 8;

      for (let i = 0; i < phase.actions.length; i++) {
        checkPage(12);
        doc.setFillColor(phase.color[0], phase.color[1], phase.color[2]);
        doc.circle(m + 5, y - 1, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "bold");
        doc.text(`${i + 1}`, m + 5, y, { align: "center" });

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(40, 45, 55);
        const aLines = doc.splitTextToSize(phase.actions[i], cw - 14);
        doc.text(aLines, m + 10, y);
        y += aLines.length * 4.5 + 3;
      }
      y += 5;
    }

    // ═══════════════════════════════════════
    // NEXT STEPS / CTA PAGE
    // ═══════════════════════════════════════
    doc.addPage();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pw, ph, "F");

    doc.setFillColor(20, 30, 55);
    doc.circle(pw + 30, ph - 40, 100, "F");
    doc.setFillColor(22, 35, 60);
    doc.circle(-40, 30, 80, "F");

    doc.setFillColor(245, 158, 11);
    doc.rect(m, 50, 35, 1.5, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Next Steps", m, 68);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 175, 200);
    const nLines = doc.splitTextToSize(
      "This assessment is a starting point, not a destination. The insights in this report are most valuable when acted on within 30 days — before organisational momentum shifts.",
      cw,
    );
    doc.text(nLines, m, 82);

    const nextSteps = [
      {
        num: "01",
        text: "Review your question-by-question analysis — understand why each area scored as it did.",
      },
      {
        num: "02",
        text: "Share this report with your team to align on reliability priorities and ownership.",
      },
      {
        num: "03",
        text: "Start with Phase 1 of the roadmap — focus on your weakest area first for maximum impact.",
      },
      {
        num: "04",
        text: "Explore Chase Agents and book a scoping call to get workflow-specific implementation guidance.",
      },
    ];

    let nsY = 110;
    for (const step of nextSteps) {
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(245, 158, 11);
      doc.text(step.num, m, nsY);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(200, 210, 225);
      const sLines = doc.splitTextToSize(step.text, cw - 20);
      doc.text(sLines, m + 18, nsY - 2);
      nsY += sLines.length * 5 + 12;
    }

    // CTA block
    nsY += 10;
    doc.setFillColor(25, 40, 70);
    doc.roundedRect(m, nsY, cw, 35, 4, 4, "F");
    doc.setFillColor(245, 158, 11);
    doc.roundedRect(m, nsY, cw, 3, 4, 4, "F");
    doc.setFillColor(25, 40, 70);
    doc.rect(m, nsY + 2, cw, 2, "F");

    doc.setTextColor(245, 158, 11);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Explore Chase Agents + book a scoping call", m + 8, nsY + 14);
    doc.setTextColor(180, 190, 210);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("https://chaseagents.com", m + 8, nsY + 22);
    doc.text("https://calendar.app.google/8oZYnnuHcaiH64Ky8", m + 8, nsY + 27);
    doc.setTextColor(100, 115, 140);
    doc.setFontSize(8);
    doc.text(
      "Scoping call  •  No obligation  •  Tailored to your assessment results",
      m + 8,
      nsY + 32,
    );

    // Bottom branding
    doc.setTextColor(60, 75, 100);
    doc.setFontSize(8);
    doc.text("Chase Agents — Operating Layer", m, 272);
    doc.text("chaseagents.com", m, 279);

    // ═══════════════════════════════════════
    // FOOTER ON ALL PAGES (except cover & last)
    // ═══════════════════════════════════════
    const totalPages = doc.getNumberOfPages();
    for (let p = 2; p <= totalPages - 1; p++) {
      doc.setPage(p);
      doc.setFillColor(245, 246, 248);
      doc.rect(0, 287, pw, 10, "F");
      doc.setTextColor(120, 125, 140);
      doc.setFontSize(7);
      doc.text(
        "Chase Agents  |  Production Reliability Assessment  |  Confidential",
        pw / 2,
        292,
        { align: "center" },
      );
      doc.text(`${p} / ${totalPages}`, pw - m, 292, { align: "right" });
    }

    // ═══════════════════════════════════════
    // UPLOAD & RETURN
    // ═══════════════════════════════════════
    const pdfOutput = doc.output("arraybuffer");
    const pdfBuffer = new Uint8Array(pdfOutput);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const fileId = lead_id || `anon-${Date.now()}`;
    const filePath = `reliability-assessment/${fileId}-${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("lead-magnets")
      .upload(filePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("lead-magnets")
        .createSignedUrl(filePath, 3600);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      throw (
        signedUrlError ??
        new Error("Could not create a signed URL for the assessment report.")
      );
    }

    return new Response(
      JSON.stringify({ pdf_url: signedUrlData.signedUrl, file_path: filePath }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err) {
    console.error("PDF generation error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
