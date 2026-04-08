export interface WalkthroughPage {
  title: string;
  description: string;
  features: string[];
}

export interface CaseStudy {
  id: string;
  industry: string;
  platformName: string;
  outcome: string;
  accentColor: string;
  problem: string;
  fix: string;
  results: { label: string; value: string }[];
  walkthrough: WalkthroughPage[];
  aiNativeCallout: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "logistics",
    industry: "Logistics & Supply Chain",
    platformName: "Route Exception Control Tower",
    outcome: "41% fewer failed deliveries in 90 days",
    accentColor: "hsl(210, 100%, 56%)",
    problem:
      "Route and order changes break downstream automations daily. Carrier updates arrive via EDI, email, and portal — each in different formats. Operations teams firefight exceptions manually, burning 6+ hours per shift on calls and spreadsheets. Downstream warehouse prep, customer notifications, and billing all lag behind.",
    fix: "A control tower that ingests live changes from carriers, WMS, and OMS. It detects exceptions automatically, classifies severity, and triggers deterministic resolution workflows. AI suggests next-best actions and drafts carrier/customer comms, but approvals and execution follow rule-based paths with full audit trails.",
    results: [
      { label: "Failed deliveries", value: "↓ 41%" },
      { label: "Exception resolution", value: "↓ 63%" },
      { label: "Manual handoffs", value: "↓ 78%" },
      { label: "SLA compliance", value: "98.4%" },
    ],
    walkthrough: [
      {
        title: "Control Tower Overview",
        description:
          "Live map with active routes, color-coded exception pins, and a prioritized exceptions queue. KPI cards show real-time failed delivery rate, resolution backlog, and carrier health scores.",
        features: [
          "Real-time route visualization",
          "Exception severity classification",
          "Carrier health scoring",
          "SLA countdown timers",
        ],
      },
      {
        title: "Exception Detail",
        description:
          "Timeline of the exception from detection to resolution. Root cause analysis with linked events, recommended actions ranked by confidence, and approve/execute controls.",
        features: [
          "Event timeline reconstruction",
          "AI-suggested resolutions",
          "One-click approve & execute",
          "Audit log with timestamps",
        ],
      },
      {
        title: "Sync Health",
        description:
          "SLA dashboard showing integration health across carriers and warehouse partners. Latency metrics, error rates, and data freshness indicators.",
        features: [
          "Integration health monitoring",
          "SLA breach predictions",
          "Data freshness indicators",
          "Partner performance rankings",
        ],
      },
    ],
    aiNativeCallout:
      "AI classifies exception types and drafts resolution actions, but every execution follows deterministic rules. Carrier comms are AI-drafted, human-approved. Escalation paths are rule-based with configurable thresholds. All AI suggestions include confidence scores and fallback options.",
  },
  {
    id: "bpo",
    industry: "BPO / Shared Operations",
    platformName: "Casework Orchestrator",
    outcome: "52% faster cycle time, 94% first-pass QA",
    accentColor: "hsl(270, 80%, 56%)",
    problem:
      "High-volume requests arrive via email, portal, and phone — then get stuck across spreadsheets, ticketing systems, and shared inboxes. Quality drifts as teams apply inconsistent standards. SLA breaches increase during volume spikes, and clients lose visibility into case status.",
    fix: "Structured intake → AI-assisted triage → deterministic task routing → QA workflow. Incoming requests are classified and routed based on complexity, skill match, and SLA tier. AI drafts responses for review; deterministic checklists enforce quality standards. Full audit trail from intake to close.",
    results: [
      { label: "Cycle time", value: "↓ 52%" },
      { label: "First-pass QA", value: "94%" },
      { label: "SLA compliance", value: "97%" },
      { label: "Onboarding time", value: "↓ 60%" },
    ],
    walkthrough: [
      {
        title: "Work Queue",
        description:
          "Priority-sorted queue with SLA timers, assignment status, complexity tags, and real-time progress. Managers see team load distribution and bottleneck alerts.",
        features: [
          "Priority-based sorting",
          "SLA countdown timers",
          "Skill-based auto-assignment",
          "Load balancing alerts",
        ],
      },
      {
        title: "QA Review",
        description:
          "Structured review workspace with configurable checklists, sampling rules, rubric-based scoring, and inline feedback. Tracks QA pass rates by agent and category.",
        features: [
          "Configurable QA checklists",
          "Statistical sampling rules",
          "Rubric-based scoring",
          "Agent performance tracking",
        ],
      },
      {
        title: "Client Reporting",
        description:
          "Weekly output dashboards with error taxonomy, volume trends, SLA performance, and exportable reports. Clients get self-serve access to their case metrics.",
        features: [
          "Automated weekly reports",
          "Error taxonomy breakdown",
          "Client self-serve portal",
          "Exportable analytics",
        ],
      },
    ],
    aiNativeCallout:
      "AI classifies incoming requests and drafts initial responses, but routing rules are deterministic and configurable. QA checklists are human-defined. Sampling rates follow statistical rules, not AI judgment. Every AI-drafted response requires human approval before send.",
  },
  {
    id: "ecommerce",
    industry: "E-commerce Operations",
    platformName: "Order Integrity Suite",
    outcome: "67% fewer refunds, 45% lower support volume",
    accentColor: "hsl(24, 95%, 53%)",
    problem:
      "Inventory mismatches between storefront, WMS, and carriers cause oversells and shipment gaps. Customers discover problems before support does. Refunds and chargebacks spike, and support teams waste hours on preventable issues.",
    fix: "Cross-system reconciliation engine that continuously compares storefront, WMS, carrier, and payment data. AI flags anomaly clusters and predicts at-risk orders. Deterministic workflows trigger holds, customer updates, or re-ship actions based on configurable rules.",
    results: [
      { label: "Preventable refunds", value: "↓ 67%" },
      { label: "Chargebacks", value: "↓ 58%" },
      { label: "Support tickets", value: "↓ 45%" },
      { label: "Detection time", value: "26 min" },
    ],
    walkthrough: [
      {
        title: "Integrity Dashboard",
        description:
          "Risk-scored order pipeline with anomaly detection cards. Shows real-time reconciliation status across storefront, WMS, and carriers.",
        features: [
          "Order risk scoring",
          "Cross-system reconciliation",
          "Anomaly clustering",
          "Intervention queue",
        ],
      },
      {
        title: "Comms Studio",
        description:
          "AI-drafted customer communications with approval workflows. Templates for delay notices, substitution offers, and resolution confirmations.",
        features: [
          "AI-drafted templates",
          "Approval workflows",
          "Send log with tracking",
          "A/B tested messaging",
        ],
      },
      {
        title: "Root Cause Explorer",
        description:
          "Trend analysis by supplier, SKU, carrier, and time period. Surfaces systematic issues vs. one-off problems.",
        features: [
          "Multi-dimensional analysis",
          "Pattern detection",
          "Supplier scorecards",
          "Actionable recommendations",
        ],
      },
    ],
    aiNativeCallout:
      "AI identifies anomaly patterns and predicts at-risk orders, but holds, re-ships, and customer notifications follow deterministic rules with approval gates. Risk thresholds are configurable. AI comms are drafted, never auto-sent.",
  },
  {
    id: "fieldservice",
    industry: "Field Operations",
    platformName: "Dispatch & Parts Optimizer",
    outcome: "89% first-time fix rate, 34% fewer missed visits",
    accentColor: "hsl(145, 63%, 42%)",
    problem:
      "Missed appointments and repeat visits due to poor dispatching and parts readiness. Schedulers juggle technician skills, travel windows, SLA tiers, and parts availability across disconnected systems.",
    fix: "AI recommends optimal schedules and predicts parts needs based on job type, equipment history, and failure patterns. Deterministic rules enforce constraints — skills, certifications, travel windows, SLA tiers. Job packets auto-generate with steps, parts, and safety checklists.",
    results: [
      { label: "First-time fix", value: "89%" },
      { label: "Missed appts", value: "↓ 34%" },
      { label: "Utilization", value: "81%" },
      { label: "Parts waste", value: "↓ 28%" },
    ],
    walkthrough: [
      {
        title: "Dispatch Board",
        description:
          "Day view with technician assignments, constraint indicators, and conflict alerts. Map overlay showing coverage zones and travel optimization.",
        features: [
          "Constraint-aware scheduling",
          "Conflict detection",
          "Travel optimization",
          "Skill matching",
        ],
      },
      {
        title: "Job Packets",
        description:
          "Auto-generated job packets with repair steps, required parts, safety checklists, and equipment history. Technicians get mobile-optimized briefings.",
        features: [
          "Auto-generated procedures",
          "Parts pre-staging alerts",
          "Safety checklists",
          "Equipment history context",
        ],
      },
      {
        title: "Parts Readiness",
        description:
          "Predicted parts needs by job type, availability status across warehouses, substitution options, and escalation paths for stockouts.",
        features: [
          "Predictive parts planning",
          "Multi-warehouse availability",
          "Substitution matching",
          "Stockout escalation",
        ],
      },
    ],
    aiNativeCallout:
      "AI predicts parts needs and recommends schedules, but dispatch assignments enforce hard constraints — certifications, SLA tiers, travel limits. Job packets are template-based with AI-suggested additions flagged for review.",
  },
  {
    id: "manufacturing",
    industry: "Manufacturing / Quality Ops",
    platformName: "NCR & CAPA Automation System",
    outcome: "71% faster CAPA closure, 53% fewer repeat defects",
    accentColor: "hsl(35, 95%, 50%)",
    problem:
      "Nonconformance handling is slow and paper-heavy. CAPAs get lost in email chains. Recurring defects persist because root cause analysis is inconsistent and corrective actions aren't tracked to verification.",
    fix: "Structured workflows for NCR → containment → root cause analysis → CAPA with AI-assisted root cause suggestions and document drafting. Deterministic gates and approvals enforce process discipline. Evidence attachments and verification steps create audit-ready records.",
    results: [
      { label: "CAPA closure", value: "↓ 71%" },
      { label: "Repeat defects", value: "↓ 53%" },
      { label: "Audit prep", value: "↓ 80%" },
      { label: "NCR backlog", value: "↓ 64%" },
    ],
    walkthrough: [
      {
        title: "Quality Event Inbox",
        description:
          "Severity-sorted inbox with line, product, and trend context. New events auto-classified by type. Historical pattern matching surfaces potential repeat issues.",
        features: [
          "Auto-classification",
          "Severity scoring",
          "Trend context",
          "Pattern matching",
        ],
      },
      {
        title: "RCA Workspace",
        description:
          "Structured root cause analysis with 5 Whys templates, fishbone diagrams, evidence attachment, and AI-suggested contributing factors.",
        features: [
          "5 Whys templates",
          "Fishbone diagrams",
          "Evidence management",
          "Similar event linking",
        ],
      },
      {
        title: "CAPA Tracker",
        description:
          "Action items with owners, due dates, verification steps, and effectiveness reviews. Dashboard shows closure rates and aging.",
        features: [
          "Owner accountability",
          "Verification workflows",
          "Effectiveness reviews",
          "Aging dashboard",
        ],
      },
    ],
    aiNativeCallout:
      "AI suggests root causes based on historical patterns and drafts CAPA descriptions, but every gate requires human approval. Classification uses configurable rules. Audit trails capture every approval, edit, and verification step.",
  },
  {
    id: "healthcare",
    industry: "Healthcare Provider Ops",
    platformName: "Referral & Auth Workflow Hub",
    outcome: "58% faster turnaround, 91% approval rate",
    accentColor: "hsl(205, 78%, 50%)",
    problem:
      "Referrals and prior authorization processes are fragmented across fax, portal, and EHR. Delays cause patient leakage and frustration. Missing documents trigger denials.",
    fix: "Central hub that tracks each referral and prior auth request end-to-end. AI extracts data from incoming documents and drafts payer submissions. Deterministic checklists ensure completeness. Compliance logging enforces correctness.",
    results: [
      { label: "Turnaround", value: "↓ 58%" },
      { label: "Approval rate", value: "91%" },
      { label: "Doc rework", value: "↓ 73%" },
      { label: "Staff time saved", value: "62%" },
    ],
    walkthrough: [
      {
        title: "Intake Checker",
        description:
          "Incoming referral parser with completeness scoring. AI extracts patient data, diagnosis codes, and required attachments. Missing items flagged before submission.",
        features: [
          "Document parsing",
          "Completeness scoring",
          "Missing item detection",
          "Payer requirement matching",
        ],
      },
      {
        title: "Auth Timeline",
        description:
          "End-to-end status tracking with payer-specific steps, next actions, and estimated timelines. Escalation triggers for aging requests.",
        features: [
          "Payer-specific workflows",
          "Status tracking",
          "Aging alerts",
          "Escalation triggers",
        ],
      },
      {
        title: "Ops Metrics",
        description:
          "Turnaround times, approval rates, denial reasons, and bottleneck analysis. Surfaces systemic issues by payer and procedure type.",
        features: [
          "Turnaround analytics",
          "Denial reason taxonomy",
          "Bottleneck identification",
          "Payer comparison",
        ],
      },
    ],
    aiNativeCallout:
      "AI extracts document data and drafts payer submissions, but completeness checklists are rule-based and payer-specific. No submission goes out without human review. Compliance logging is deterministic.",
  },
];
