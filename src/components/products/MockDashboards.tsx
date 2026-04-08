import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  Search,
  Bell,
  Settings,
  ChevronDown,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Users,
  Package,
  MapPin,
  FileText,
  Shield,
  Activity,
} from "lucide-react";

/* ─── Reusable Building Blocks ─── */

interface MockProps {
  accent: string;
  className?: string;
}

const Dot = ({ color }: { color: string }) => (
  <span
    className="inline-block w-1.5 h-1.5 rounded-full"
    style={{ backgroundColor: color }}
  />
);

const KpiCard = ({
  label,
  value,
  change,
  positive,
  accent,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  accent: string;
}) => (
  <div className="bg-white dark:bg-white/5 rounded-lg border border-border/30 p-3 space-y-1">
    <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
      {label}
    </p>
    <p className="text-lg font-bold text-foreground leading-none">{value}</p>
    <p
      className={`text-[10px] font-medium flex items-center gap-0.5 ${positive ? "text-emerald-600" : "text-red-500"}`}
    >
      {positive ? (
        <ArrowUpRight className="w-2.5 h-2.5" />
      ) : (
        <ArrowDownRight className="w-2.5 h-2.5" />
      )}
      {change}
    </p>
  </div>
);

const MiniBar = ({ pct, accent }: { pct: number; accent: string }) => (
  <div className="h-1.5 rounded-full bg-border/40 w-full">
    <div
      className="h-full rounded-full transition-all"
      style={{ width: `${pct}%`, backgroundColor: accent }}
    />
  </div>
);

const StatusBadge = ({
  status,
  accent,
}: {
  status: string;
  accent: string;
}) => {
  const colors: Record<string, string> = {
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    pending: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    resolved:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  return (
    <span
      className={`text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded ${colors[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
};

const TableRow = ({
  cells,
  accent,
}: {
  cells: (string | { status: string })[];
  accent: string;
}) => (
  <div className="flex items-center gap-2 py-1.5 border-b border-border/20 text-[9px] text-muted-foreground">
    {cells.map((cell, i) => (
      <div
        key={i}
        className={`${i === 0 ? "flex-[2] font-medium text-foreground" : "flex-1"} truncate`}
      >
        {typeof cell === "string" ? (
          cell
        ) : (
          <StatusBadge status={cell.status} accent={accent} />
        )}
      </div>
    ))}
  </div>
);

const DashShell = ({
  accent,
  title,
  tabs,
  activeTab,
  sidebar,
  children,
}: {
  accent: string;
  title: string;
  tabs?: string[];
  activeTab?: number;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div
    className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm"
    style={{ fontSize: 0 }}
  >
    {/* Top bar */}
    <div className="flex items-center justify-between px-3 py-2 border-b border-border/30 bg-muted/30">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <span className="text-[10px] font-bold text-foreground ml-1">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Search className="w-3 h-3 text-muted-foreground" />
        <Bell className="w-3 h-3 text-muted-foreground" />
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>
    </div>
    {/* Tab bar */}
    {tabs && (
      <div className="flex gap-0 border-b border-border/30 px-3 bg-muted/10">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`text-[9px] font-medium px-3 py-1.5 border-b-2 transition-colors ${
              i === (activeTab ?? 0)
                ? "border-current text-foreground"
                : "border-transparent text-muted-foreground"
            }`}
            style={i === (activeTab ?? 0) ? { color: accent } : undefined}
          >
            {tab}
          </button>
        ))}
      </div>
    )}
    {/* Body */}
    <div className="flex min-h-[200px]">
      {sidebar && (
        <div className="w-[120px] shrink-0 border-r border-border/20 bg-muted/20 p-2 hidden sm:block">
          {sidebar}
        </div>
      )}
      <div className="flex-1 p-3">{children}</div>
    </div>
  </div>
);

/* ─── LOGISTICS DASHBOARDS ─── */
const LogisticsOverview = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Route Exception Control Tower"
    tabs={["Overview", "Exceptions", "Sync Health"]}
    activeTab={0}
    sidebar={
      <div className="space-y-2 text-[9px]">
        <p className="font-bold text-foreground text-[8px] uppercase tracking-wider">
          Routes
        </p>
        {["Active Routes", "Pending", "Exceptions", "Resolved"].map(
          (item, i) => (
            <div key={item} className="flex items-center gap-1.5">
              <Dot color={i === 2 ? "#dc2626" : i === 3 ? "#16a34a" : accent} />
              <span className="text-muted-foreground truncate">{item}</span>
              <span className="ml-auto font-medium text-foreground">
                {[142, 23, 7, 89][i]}
              </span>
            </div>
          ),
        )}
      </div>
    }
  >
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        <KpiCard
          label="Active Routes"
          value="142"
          change="+12% vs last week"
          positive
          accent={accent}
        />
        <KpiCard
          label="Exception Rate"
          value="4.9%"
          change="-0.8% vs avg"
          positive
          accent={accent}
        />
        <KpiCard
          label="Avg Resolution"
          value="1.5h"
          change="-63% vs baseline"
          positive
          accent={accent}
        />
        <KpiCard
          label="SLA Compliance"
          value="98.4%"
          change="+6.4% vs Q1"
          positive
          accent={accent}
        />
      </div>
      {/* Map placeholder */}
      <div className="rounded-lg bg-muted/30 border border-border/20 p-3 relative overflow-hidden h-[80px]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, " + accent + " 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <div className="relative flex items-center gap-1 text-[9px] text-muted-foreground">
          <MapPin className="w-3 h-3" style={{ color: accent }} />
          <span>Live route map — 142 active, 7 exceptions flagged</span>
        </div>
        {[
          { x: 20, y: 30 },
          { x: 55, y: 50 },
          { x: 75, y: 25 },
          { x: 40, y: 60 },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-pulse"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              backgroundColor: i === 1 ? "#dc2626" : accent,
              opacity: 0.8,
            }}
          />
        ))}
      </div>
    </div>
  </DashShell>
);

const LogisticsExceptions = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Route Exception Control Tower"
    tabs={["Overview", "Exceptions", "Sync Health"]}
    activeTab={1}
  >
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-foreground">Exception Queue</p>
        <div className="flex items-center gap-1 text-[8px] text-muted-foreground">
          <Filter className="w-3 h-3" /> Filter
        </div>
      </div>
      <div>
        <div className="flex gap-2 text-[8px] font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/30">
          <div className="flex-[2]">Exception</div>
          <div className="flex-1">Severity</div>
          <div className="flex-1">Status</div>
          <div className="flex-1">ETA</div>
        </div>
        {[
          [
            "Carrier delay — Route #4821",
            { status: "critical" },
            { status: "pending" },
            "2.1h",
          ],
          [
            "Address mismatch — ORD-9912",
            { status: "warning" },
            { status: "active" },
            "0.5h",
          ],
          [
            "Temp excursion — Cold chain #77",
            { status: "critical" },
            { status: "pending" },
            "1.8h",
          ],
          [
            "Weight discrepancy — WH-East",
            { status: "warning" },
            { status: "resolved" },
            "—",
          ],
          [
            "Customs hold — INT-3301",
            { status: "warning" },
            { status: "active" },
            "4.2h",
          ],
        ].map((row, i) => (
          <TableRow key={i} cells={row} accent={accent} />
        ))}
      </div>
      <div className="rounded-lg bg-muted/20 border border-border/20 p-2 text-[9px] space-y-1">
        <p className="font-bold text-foreground">AI Recommendation</p>
        <p className="text-muted-foreground">
          Reroute via Hub-Central for Route #4821. Confidence: 94%. Est. cost:
          +$12.
        </p>
        <div className="flex gap-2 mt-1">
          <button
            className="text-[8px] px-2 py-0.5 rounded text-white font-medium"
            style={{ backgroundColor: accent }}
          >
            Approve
          </button>
          <button className="text-[8px] px-2 py-0.5 rounded border border-border text-muted-foreground font-medium">
            Modify
          </button>
        </div>
      </div>
    </div>
  </DashShell>
);

const LogisticsSyncHealth = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Route Exception Control Tower"
    tabs={["Overview", "Exceptions", "Sync Health"]}
    activeTab={2}
  >
    <div className="space-y-3">
      <p className="text-[10px] font-bold text-foreground">
        Integration Health
      </p>
      {[
        {
          name: "WMS — Eastern DC",
          status: "active",
          latency: "120ms",
          uptime: 99.8,
        },
        {
          name: "Carrier API — FedEx",
          status: "active",
          latency: "340ms",
          uptime: 99.2,
        },
        {
          name: "Carrier API — UPS",
          status: "warning",
          latency: "890ms",
          uptime: 97.1,
        },
        {
          name: "OMS — Shopify Plus",
          status: "active",
          latency: "95ms",
          uptime: 99.9,
        },
        {
          name: "TMS — Oracle",
          status: "active",
          latency: "210ms",
          uptime: 98.7,
        },
      ].map((sys, i) => (
        <div
          key={i}
          className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/20"
        >
          <Activity
            className="w-3 h-3"
            style={{ color: sys.status === "active" ? "#16a34a" : "#d97706" }}
          />
          <span className="text-[9px] font-medium text-foreground flex-[2] truncate">
            {sys.name}
          </span>
          <StatusBadge status={sys.status} accent={accent} />
          <span className="text-[8px] text-muted-foreground flex-1">
            {sys.latency}
          </span>
          <MiniBar
            pct={sys.uptime}
            accent={sys.uptime > 98 ? "#16a34a" : "#d97706"}
          />
          <span className="text-[8px] font-medium text-foreground w-10 text-right">
            {sys.uptime}%
          </span>
        </div>
      ))}
    </div>
  </DashShell>
);

/* ─── BPO DASHBOARDS ─── */
const BpoWorkQueue = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Casework Orchestrator"
    tabs={["Work Queue", "QA Review", "Client Reporting"]}
    activeTab={0}
    sidebar={
      <div className="space-y-2 text-[9px]">
        <p className="font-bold text-foreground text-[8px] uppercase tracking-wider">
          Queues
        </p>
        {["Priority", "Standard", "Escalated", "Completed"].map((q, i) => (
          <div key={q} className="flex items-center gap-1.5">
            <Dot color={i === 2 ? "#dc2626" : i === 3 ? "#16a34a" : accent} />
            <span className="text-muted-foreground truncate">{q}</span>
            <span className="ml-auto font-medium text-foreground">
              {[18, 47, 3, 124][i]}
            </span>
          </div>
        ))}
      </div>
    }
  >
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        <KpiCard
          label="Open Cases"
          value="68"
          change="-14% vs last week"
          positive
          accent={accent}
        />
        <KpiCard
          label="Avg Cycle Time"
          value="4.0d"
          change="-52% vs baseline"
          positive
          accent={accent}
        />
        <KpiCard
          label="SLA Compliance"
          value="97%"
          change="+14% vs Q1"
          positive
          accent={accent}
        />
        <KpiCard
          label="First-Pass QA"
          value="94%"
          change="+23% vs baseline"
          positive
          accent={accent}
        />
      </div>
      <div>
        <div className="flex gap-2 text-[8px] font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/30">
          <div className="flex-[2]">Case</div>
          <div className="flex-1">Priority</div>
          <div className="flex-1">SLA</div>
          <div className="flex-1">Assigned</div>
        </div>
        {[
          [
            "INV-2847 — Billing dispute",
            { status: "critical" },
            "2h 14m",
            "J. Park",
          ],
          ["REQ-1093 — Onboarding", { status: "active" }, "1d 6h", "M. Chen"],
          [
            "ESC-0412 — Compliance flag",
            { status: "warning" },
            "4h 30m",
            "S. Gupta",
          ],
          [
            "INV-2901 — Refund request",
            { status: "pending" },
            "3d 2h",
            "Unassigned",
          ],
        ].map((row, i) => (
          <TableRow key={i} cells={row} accent={accent} />
        ))}
      </div>
    </div>
  </DashShell>
);

const BpoQaReview = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Casework Orchestrator"
    tabs={["Work Queue", "QA Review", "Client Reporting"]}
    activeTab={1}
  >
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard
          label="QA Pass Rate"
          value="94%"
          change="+23% vs baseline"
          positive
          accent={accent}
        />
        <KpiCard
          label="Sampling Rate"
          value="15%"
          change="Statistical target"
          positive
          accent={accent}
        />
        <KpiCard
          label="Avg Score"
          value="4.2/5"
          change="+0.8 vs Q1"
          positive
          accent={accent}
        />
      </div>
      <p className="text-[10px] font-bold text-foreground">Recent Reviews</p>
      {[
        { case: "INV-2841", agent: "J. Park", score: 4.5, pass: true },
        { case: "REQ-1088", agent: "M. Chen", score: 4.0, pass: true },
        { case: "INV-2839", agent: "A. Kim", score: 2.5, pass: false },
        { case: "REQ-1085", agent: "S. Gupta", score: 4.8, pass: true },
      ].map((r, i) => (
        <div
          key={i}
          className="flex items-center gap-2 p-1.5 rounded bg-muted/20 text-[9px]"
        >
          <span className="font-medium text-foreground flex-1">{r.case}</span>
          <span className="text-muted-foreground flex-1">{r.agent}</span>
          <span className="font-bold text-foreground">{r.score}</span>
          <StatusBadge
            status={r.pass ? "resolved" : "critical"}
            accent={accent}
          />
        </div>
      ))}
    </div>
  </DashShell>
);

const BpoClientReporting = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Casework Orchestrator"
    tabs={["Work Queue", "QA Review", "Client Reporting"]}
    activeTab={2}
  >
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        <KpiCard
          label="Cases Closed"
          value="124"
          change="+18% vs last week"
          positive
          accent={accent}
        />
        <KpiCard
          label="Avg Handle Time"
          value="3.2h"
          change="-44% vs baseline"
          positive
          accent={accent}
        />
        <KpiCard
          label="CSAT Score"
          value="4.6/5"
          change="+0.9 vs Q1"
          positive
          accent={accent}
        />
        <KpiCard
          label="Error Rate"
          value="2.1%"
          change="-71% vs baseline"
          positive
          accent={accent}
        />
      </div>
      <p className="text-[10px] font-bold text-foreground">
        Error Taxonomy — This Week
      </p>
      {[
        "Missing documentation",
        "Incorrect routing",
        "SLA miscalculation",
        "Data entry error",
      ].map((err, i) => (
        <div key={i} className="flex items-center gap-2 text-[9px]">
          <span className="text-muted-foreground flex-[2]">{err}</span>
          <MiniBar pct={[38, 24, 22, 16][i]} accent={accent} />
          <span className="text-foreground font-medium w-6 text-right">
            {[38, 24, 22, 16][i]}%
          </span>
        </div>
      ))}
    </div>
  </DashShell>
);

/* ─── ECOMMERCE DASHBOARDS ─── */
const EcommerceIntegrity = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Order Integrity Suite"
    tabs={["Integrity", "Comms Studio", "Root Cause"]}
    activeTab={0}
    sidebar={
      <div className="space-y-2 text-[9px]">
        <p className="font-bold text-foreground text-[8px] uppercase tracking-wider">
          Channels
        </p>
        {["Shopify", "Amazon", "Wholesale", "D2C Web"].map((ch, i) => (
          <div key={ch} className="flex items-center gap-1.5">
            <Dot color={accent} />
            <span className="text-muted-foreground truncate">{ch}</span>
          </div>
        ))}
      </div>
    }
  >
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        <KpiCard
          label="At-Risk Orders"
          value="23"
          change="-67% vs baseline"
          positive
          accent={accent}
        />
        <KpiCard
          label="Chargeback Rate"
          value="0.8%"
          change="-58% vs Q1"
          positive
          accent={accent}
        />
        <KpiCard
          label="Detection Time"
          value="26m"
          change="-89% vs baseline"
          positive
          accent={accent}
        />
        <KpiCard
          label="Support Load"
          value="↓45%"
          change="vs pre-deployment"
          positive
          accent={accent}
        />
      </div>
      <div>
        <div className="flex gap-2 text-[8px] font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/30">
          <div className="flex-[2]">Order</div>
          <div className="flex-1">Risk</div>
          <div className="flex-1">Issue</div>
          <div className="flex-1">Action</div>
        </div>
        {[
          ["ORD-88412", { status: "critical" }, "Inventory mismatch", "Hold"],
          ["ORD-88409", { status: "warning" }, "Carrier delay", "Notify"],
          ["ORD-88401", { status: "active" }, "Verified", "None"],
          ["ORD-88399", { status: "warning" }, "Address flag", "Review"],
        ].map((row, i) => (
          <TableRow key={i} cells={row} accent={accent} />
        ))}
      </div>
    </div>
  </DashShell>
);

const EcommerceComms = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Order Integrity Suite"
    tabs={["Integrity", "Comms Studio", "Root Cause"]}
    activeTab={1}
  >
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard
          label="Msgs Sent Today"
          value="47"
          change="94% auto-drafted"
          positive
          accent={accent}
        />
        <KpiCard
          label="Approval Rate"
          value="98%"
          change="2% modified"
          positive
          accent={accent}
        />
        <KpiCard
          label="Response Time"
          value="12m"
          change="-78% vs manual"
          positive
          accent={accent}
        />
      </div>
      <p className="text-[10px] font-bold text-foreground">Draft Queue</p>
      {[
        { order: "ORD-88412", type: "Delay notice", status: "draft" },
        { order: "ORD-88409", type: "Substitution offer", status: "pending" },
        { order: "ORD-88395", type: "Resolution confirm", status: "resolved" },
      ].map((msg, i) => (
        <div
          key={i}
          className="flex items-center gap-2 p-1.5 rounded bg-muted/20 text-[9px]"
        >
          <span className="font-medium text-foreground flex-1">
            {msg.order}
          </span>
          <span className="text-muted-foreground flex-1">{msg.type}</span>
          <StatusBadge status={msg.status} accent={accent} />
        </div>
      ))}
    </div>
  </DashShell>
);

const EcommerceRootCause = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Order Integrity Suite"
    tabs={["Integrity", "Comms Studio", "Root Cause"]}
    activeTab={2}
  >
    <div className="space-y-3">
      <p className="text-[10px] font-bold text-foreground">
        Refund Root Causes — Last 30 Days
      </p>
      {[
        "Inventory sync failure",
        "Carrier damage",
        "Wrong item shipped",
        "Late delivery",
        "Customer changed mind",
      ].map((cause, i) => (
        <div key={i} className="flex items-center gap-2 text-[9px]">
          <span className="text-muted-foreground flex-[2]">{cause}</span>
          <MiniBar pct={[32, 24, 18, 15, 11][i]} accent={accent} />
          <span className="text-foreground font-medium w-8 text-right">
            {[32, 24, 18, 15, 11][i]}%
          </span>
        </div>
      ))}
      <div className="rounded-lg bg-muted/20 border border-border/20 p-2 text-[9px] space-y-1 mt-2">
        <p className="font-bold text-foreground flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-500" /> Trend Alert
        </p>
        <p className="text-muted-foreground">
          Inventory sync failures increased 12% this week. Top SKUs:
          BLK-HOODIE-L, WHT-TEE-M. Supplier: Vendor #4.
        </p>
      </div>
    </div>
  </DashShell>
);

/* ─── FIELD OPERATIONS DASHBOARDS ─── */
const FieldDispatch = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Dispatch & Parts Optimizer"
    tabs={["Dispatch", "Job Packets", "Parts"]}
    activeTab={0}
  >
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        <KpiCard
          label="Jobs Today"
          value="38"
          change="6 unassigned"
          positive={false}
          accent={accent}
        />
        <KpiCard
          label="First-Fix Rate"
          value="89%"
          change="+17% vs baseline"
          positive
          accent={accent}
        />
        <KpiCard
          label="Utilization"
          value="81%"
          change="+13% vs Q1"
          positive
          accent={accent}
        />
        <KpiCard
          label="Missed Appts"
          value="2"
          change="-34% vs avg"
          positive
          accent={accent}
        />
      </div>
      <p className="text-[10px] font-bold text-foreground">Today's Schedule</p>
      {[
        { tech: "M. Rivera", jobs: 5, status: "active", area: "Zone A" },
        { tech: "K. Thompson", jobs: 4, status: "active", area: "Zone B" },
        { tech: "J. Lee", jobs: 6, status: "warning", area: "Zone A" },
        { tech: "S. Patel", jobs: 3, status: "active", area: "Zone C" },
      ].map((t, i) => (
        <div
          key={i}
          className="flex items-center gap-2 p-1.5 rounded bg-muted/20 text-[9px]"
        >
          <Users className="w-3 h-3 text-muted-foreground" />
          <span className="font-medium text-foreground flex-1">{t.tech}</span>
          <span className="text-muted-foreground">{t.jobs} jobs</span>
          <span className="text-muted-foreground">{t.area}</span>
          <StatusBadge status={t.status} accent={accent} />
        </div>
      ))}
    </div>
  </DashShell>
);

const FieldJobPackets = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Dispatch & Parts Optimizer"
    tabs={["Dispatch", "Job Packets", "Parts"]}
    activeTab={1}
  >
    <div className="space-y-3">
      <div className="rounded-lg border border-border/30 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-foreground">
            Job #FS-4821 — HVAC Compressor Replacement
          </p>
          <StatusBadge status="active" accent={accent} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[9px]">
          <div>
            <span className="text-muted-foreground">Customer:</span>{" "}
            <span className="text-foreground font-medium">
              Acme Corp — Building 3
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Window:</span>{" "}
            <span className="text-foreground font-medium">10:00–12:00</span>
          </div>
          <div>
            <span className="text-muted-foreground">Tech:</span>{" "}
            <span className="text-foreground font-medium">
              M. Rivera (Certified HVAC)
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Priority:</span>{" "}
            <span className="text-foreground font-medium">SLA Tier 1</span>
          </div>
        </div>
      </div>
      <p className="text-[10px] font-bold text-foreground">Procedure Steps</p>
      {[
        "Verify equipment model & serial",
        "Isolate refrigerant lines",
        "Remove old compressor",
        "Install replacement unit",
        "Pressure test & charge",
        "System verification & sign-off",
      ].map((step, i) => (
        <div key={i} className="flex items-center gap-2 text-[9px]">
          <span
            className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            {i + 1}
          </span>
          <span className="text-muted-foreground">{step}</span>
          {i < 2 && (
            <CheckCircle className="w-3 h-3 text-emerald-500 ml-auto" />
          )}
        </div>
      ))}
    </div>
  </DashShell>
);

const FieldParts = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Dispatch & Parts Optimizer"
    tabs={["Dispatch", "Job Packets", "Parts"]}
    activeTab={2}
  >
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard
          label="Parts Ready"
          value="91%"
          change="+14% vs Q1"
          positive
          accent={accent}
        />
        <KpiCard
          label="Stockouts"
          value="3"
          change="-71% vs avg"
          positive
          accent={accent}
        />
        <KpiCard
          label="Waste Rate"
          value="4.2%"
          change="-28% vs baseline"
          positive
          accent={accent}
        />
      </div>
      <p className="text-[10px] font-bold text-foreground">
        Predicted Needs — Next 48h
      </p>
      {[
        {
          part: "Compressor Unit CR-400",
          qty: 3,
          avail: "In stock",
          wh: "WH-Central",
        },
        {
          part: "Thermostat Sensor TS-12",
          qty: 7,
          avail: "In stock",
          wh: "WH-East",
        },
        {
          part: "Filter Assembly FA-8X",
          qty: 2,
          avail: "Low stock",
          wh: "WH-Central",
        },
        {
          part: "Control Board CB-200",
          qty: 1,
          avail: "Order placed",
          wh: "Supplier",
        },
      ].map((p, i) => (
        <div
          key={i}
          className="flex items-center gap-2 p-1.5 rounded bg-muted/20 text-[9px]"
        >
          <Package className="w-3 h-3 text-muted-foreground" />
          <span className="font-medium text-foreground flex-[2] truncate">
            {p.part}
          </span>
          <span className="text-muted-foreground">×{p.qty}</span>
          <StatusBadge
            status={
              p.avail === "In stock"
                ? "active"
                : p.avail === "Low stock"
                  ? "warning"
                  : "pending"
            }
            accent={accent}
          />
        </div>
      ))}
    </div>
  </DashShell>
);

/* ─── MANUFACTURING DASHBOARDS ─── */
const MfgEventInbox = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="NCR & CAPA System"
    tabs={["Events", "RCA Workspace", "CAPA Tracker"]}
    activeTab={0}
    sidebar={
      <div className="space-y-2 text-[9px]">
        <p className="font-bold text-foreground text-[8px] uppercase tracking-wider">
          Filters
        </p>
        {["All Events", "Critical", "Open CAPAs", "This Week"].map((f, i) => (
          <div key={f} className="flex items-center gap-1.5">
            <Circle
              className="w-2 h-2"
              style={{ color: i === 0 ? accent : undefined }}
            />
            <span className="text-muted-foreground truncate">{f}</span>
          </div>
        ))}
      </div>
    }
  >
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        <KpiCard
          label="Open NCRs"
          value="12"
          change="-64% backlog"
          positive
          accent={accent}
        />
        <KpiCard
          label="CAPA Closure"
          value="8d avg"
          change="-71% vs baseline"
          positive
          accent={accent}
        />
        <KpiCard
          label="Repeat Defects"
          value="↓53%"
          change="vs 6 months ago"
          positive
          accent={accent}
        />
        <KpiCard
          label="Audit Ready"
          value="Yes"
          change="Last updated 2d ago"
          positive
          accent={accent}
        />
      </div>
      <div>
        <div className="flex gap-2 text-[8px] font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/30">
          <div className="flex-[2]">Event</div>
          <div className="flex-1">Severity</div>
          <div className="flex-1">Line</div>
          <div className="flex-1">Status</div>
        </div>
        {[
          [
            "NCR-0891 — Dimensional variance",
            { status: "critical" },
            "Line 3",
            { status: "pending" },
          ],
          [
            "NCR-0890 — Surface finish defect",
            { status: "warning" },
            "Line 1",
            { status: "active" },
          ],
          [
            "NCR-0887 — Material cert missing",
            { status: "warning" },
            "Incoming",
            { status: "resolved" },
          ],
          [
            "NCR-0885 — Assembly torque OOS",
            { status: "critical" },
            "Line 2",
            { status: "active" },
          ],
        ].map((row, i) => (
          <TableRow key={i} cells={row} accent={accent} />
        ))}
      </div>
    </div>
  </DashShell>
);

const MfgRcaWorkspace = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="NCR & CAPA System"
    tabs={["Events", "RCA Workspace", "CAPA Tracker"]}
    activeTab={1}
  >
    <div className="space-y-3">
      <div className="rounded-lg border border-border/30 p-3">
        <p className="text-[10px] font-bold text-foreground mb-2">
          NCR-0891 — Root Cause Analysis
        </p>
        <p className="text-[9px] text-muted-foreground mb-2">5 Whys Analysis</p>
        {[
          "Why was dimension out of spec?  →  Tool wear exceeded threshold",
          "Why wasn't tool wear detected?  →  No automated monitoring",
          "Why no monitoring?  →  Legacy equipment lacks sensors",
          "Why not upgraded?  →  Deferred in Q2 budget review",
          "Root cause:  Capital planning gap for preventive maintenance",
        ].map((why, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-[9px] py-1 border-b border-border/10"
          >
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white"
              style={{ backgroundColor: i === 4 ? "#dc2626" : accent }}
            >
              {i + 1}
            </span>
            <span
              className={
                i === 4 ? "font-bold text-foreground" : "text-muted-foreground"
              }
            >
              {why}
            </span>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-muted/20 border border-border/20 p-2 text-[9px] space-y-1">
        <p className="font-bold text-foreground">AI Suggestion</p>
        <p className="text-muted-foreground">
          Similar pattern found in NCR-0812, NCR-0799. Consider systemic CAPA
          for tool monitoring across Lines 2–3.
        </p>
      </div>
    </div>
  </DashShell>
);

const MfgCapaTracker = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="NCR & CAPA System"
    tabs={["Events", "RCA Workspace", "CAPA Tracker"]}
    activeTab={2}
  >
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <KpiCard
          label="Open CAPAs"
          value="5"
          change="-3 this week"
          positive
          accent={accent}
        />
        <KpiCard
          label="Avg Closure"
          value="8 days"
          change="-71% vs baseline"
          positive
          accent={accent}
        />
        <KpiCard
          label="Overdue"
          value="0"
          change="100% on track"
          positive
          accent={accent}
        />
      </div>
      <p className="text-[10px] font-bold text-foreground">Active CAPAs</p>
      {[
        {
          id: "CAPA-221",
          desc: "Install tool wear sensors L2–L3",
          owner: "R. Kim",
          due: "Mar 15",
          pct: 65,
        },
        {
          id: "CAPA-219",
          desc: "Update incoming inspection SOP",
          owner: "J. Chen",
          due: "Mar 10",
          pct: 90,
        },
        {
          id: "CAPA-218",
          desc: "Retrain assembly team on torque spec",
          owner: "M. Patel",
          due: "Mar 20",
          pct: 30,
        },
      ].map((c, i) => (
        <div key={i} className="p-2 rounded bg-muted/20 space-y-1">
          <div className="flex items-center justify-between text-[9px]">
            <span className="font-bold text-foreground">
              {c.id} — {c.desc}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[8px] text-muted-foreground">
            <span>{c.owner}</span>
            <span>Due: {c.due}</span>
            <div className="flex-1">
              <MiniBar pct={c.pct} accent={accent} />
            </div>
            <span className="font-medium text-foreground">{c.pct}%</span>
          </div>
        </div>
      ))}
    </div>
  </DashShell>
);

/* ─── HEALTHCARE DASHBOARDS ─── */
const HealthIntake = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Referral & Auth Hub"
    tabs={["Intake", "Auth Timeline", "Ops Metrics"]}
    activeTab={0}
  >
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        <KpiCard
          label="Pending Refs"
          value="34"
          change="-22% vs last week"
          positive
          accent={accent}
        />
        <KpiCard
          label="Approval Rate"
          value="91%"
          change="+13% vs baseline"
          positive
          accent={accent}
        />
        <KpiCard
          label="Turnaround"
          value="2.2d"
          change="-58% vs baseline"
          positive
          accent={accent}
        />
        <KpiCard
          label="Missing Docs"
          value="↓73%"
          change="vs pre-deployment"
          positive
          accent={accent}
        />
      </div>
      <p className="text-[10px] font-bold text-foreground">
        Incoming Referrals
      </p>
      {[
        {
          patient: "J. Martinez",
          type: "Cardiology",
          complete: 100,
          status: "active",
        },
        {
          patient: "R. Thompson",
          type: "Orthopedic",
          complete: 75,
          status: "warning",
        },
        {
          patient: "A. Williams",
          type: "Neurology",
          complete: 100,
          status: "active",
        },
        {
          patient: "M. Chen",
          type: "Oncology",
          complete: 50,
          status: "critical",
        },
      ].map((r, i) => (
        <div
          key={i}
          className="flex items-center gap-2 p-1.5 rounded bg-muted/20 text-[9px]"
        >
          <FileText className="w-3 h-3 text-muted-foreground" />
          <span className="font-medium text-foreground flex-1">
            {r.patient}
          </span>
          <span className="text-muted-foreground flex-1">{r.type}</span>
          <div className="w-12">
            <MiniBar
              pct={r.complete}
              accent={r.complete === 100 ? "#16a34a" : "#d97706"}
            />
          </div>
          <StatusBadge status={r.status} accent={accent} />
        </div>
      ))}
    </div>
  </DashShell>
);

const HealthAuthTimeline = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Referral & Auth Hub"
    tabs={["Intake", "Auth Timeline", "Ops Metrics"]}
    activeTab={1}
  >
    <div className="space-y-3">
      <div className="rounded-lg border border-border/30 p-3">
        <p className="text-[10px] font-bold text-foreground mb-2">
          Auth Request — J. Martinez (Cardiology)
        </p>
        <div className="space-y-2">
          {[
            { step: "Referral received", time: "Mar 3, 9:12 AM", done: true },
            {
              step: "Documents extracted (AI)",
              time: "Mar 3, 9:14 AM",
              done: true,
            },
            {
              step: "Completeness verified",
              time: "Mar 3, 9:15 AM",
              done: true,
            },
            { step: "Submitted to payer", time: "Mar 3, 10:00 AM", done: true },
            { step: "Payer review", time: "Mar 4, pending", done: false },
            { step: "Authorization decision", time: "Est. Mar 5", done: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-[9px]">
              <div
                className={`w-3 h-3 rounded-full flex items-center justify-center ${s.done ? "" : "border border-border"}`}
                style={s.done ? { backgroundColor: accent } : undefined}
              >
                {s.done && <CheckCircle className="w-2 h-2 text-white" />}
              </div>
              <span
                className={
                  s.done
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }
              >
                {s.step}
              </span>
              <span className="ml-auto text-[8px] text-muted-foreground">
                {s.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashShell>
);

const HealthOpsMetrics = ({ accent }: MockProps) => (
  <DashShell
    accent={accent}
    title="Referral & Auth Hub"
    tabs={["Intake", "Auth Timeline", "Ops Metrics"]}
    activeTab={2}
  >
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        <KpiCard
          label="Avg Turnaround"
          value="2.2d"
          change="-58% vs baseline"
          positive
          accent={accent}
        />
        <KpiCard
          label="Denial Rate"
          value="9%"
          change="-13% vs baseline"
          positive
          accent={accent}
        />
        <KpiCard
          label="Staff Time Saved"
          value="62%"
          change="on status checks"
          positive
          accent={accent}
        />
        <KpiCard
          label="Clean Claims"
          value="94%"
          change="+19% vs Q1"
          positive
          accent={accent}
        />
      </div>
      <p className="text-[10px] font-bold text-foreground">
        Top Denial Reasons
      </p>
      {[
        "Missing clinical documentation",
        "Incorrect procedure code",
        "Out-of-network provider",
        "Duplicate request",
        "Expired referral",
      ].map((reason, i) => (
        <div key={i} className="flex items-center gap-2 text-[9px]">
          <span className="text-muted-foreground flex-[2]">{reason}</span>
          <MiniBar pct={[34, 22, 20, 14, 10][i]} accent={accent} />
          <span className="text-foreground font-medium w-8 text-right">
            {[34, 22, 20, 14, 10][i]}%
          </span>
        </div>
      ))}
    </div>
  </DashShell>
);

/* ─── DASHBOARD REGISTRY ─── */
export type DashboardKey = string;

interface DashboardConfig {
  component: React.FC<MockProps>;
}

const DASHBOARDS: Record<string, DashboardConfig[]> = {
  logistics: [
    { component: LogisticsOverview },
    { component: LogisticsExceptions },
    { component: LogisticsSyncHealth },
  ],
  bpo: [
    { component: BpoWorkQueue },
    { component: BpoQaReview },
    { component: BpoClientReporting },
  ],
  ecommerce: [
    { component: EcommerceIntegrity },
    { component: EcommerceComms },
    { component: EcommerceRootCause },
  ],
  fieldservice: [
    { component: FieldDispatch },
    { component: FieldJobPackets },
    { component: FieldParts },
  ],
  manufacturing: [
    { component: MfgEventInbox },
    { component: MfgRcaWorkspace },
    { component: MfgCapaTracker },
  ],
  healthcare: [
    { component: HealthIntake },
    { component: HealthAuthTimeline },
    { component: HealthOpsMetrics },
  ],
};

export const getDashboard = (
  studyId: string,
  tabIndex: number,
): React.FC<MockProps> | null => {
  const configs = DASHBOARDS[studyId];
  if (!configs || !configs[tabIndex]) return null;
  return configs[tabIndex].component;
};

export const getHeroDashboard = (
  studyId: string,
): React.FC<MockProps> | null => {
  return getDashboard(studyId, 0);
};
