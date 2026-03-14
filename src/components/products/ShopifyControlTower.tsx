/* Coded mock dashboards for Shopify Ops Control Tower gallery — 8 views */
import { 
  ShoppingCart, Package, Truck, RotateCcw, Headphones, DollarSign,
  AlertTriangle, CheckCircle2, Clock, TrendingUp, ArrowUpRight,
  ArrowDownRight, Settings, Eye, Filter, Search, Bell,
} from "lucide-react";

type ViewType = "overview" | "orders" | "inventory" | "fulfillment" | "returns" | "support" | "finance" | "settings";

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    healthy: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    critical: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    pending: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    open: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    escalated: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    review: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    active: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    paused: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${colors[status] || colors.pending}`}>
      {status}
    </span>
  );
};

const KpiCard = ({ label, value, change, positive }: { label: string; value: string; change: string; positive: boolean }) => (
  <div className="rounded-lg border border-border/60 bg-card p-3">
    <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
    <p className="text-lg font-bold font-heading">{value}</p>
    <p className={`text-[10px] flex items-center gap-0.5 ${positive ? "text-emerald-600" : "text-rose-500"}`}>
      {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {change}
    </p>
  </div>
);

const MiniBar = ({ value, max = 100, color = "bg-emerald-500" }: { value: number; max?: number; color?: string }) => (
  <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
    <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
  </div>
);

const TopBar = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5 bg-card/80">
    <div className="flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-emerald-500" />
      <span className="text-xs font-bold">{title}</span>
    </div>
    <div className="flex items-center gap-2">
      <Search className="h-3.5 w-3.5 text-muted-foreground" />
      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
      <Bell className="h-3.5 w-3.5 text-muted-foreground" />
    </div>
  </div>
);

/* ─── VIEWS ─── */

const OverviewView = () => (
  <div className="bg-background rounded-lg border border-border overflow-hidden text-foreground">
    <TopBar title="Ops Control Tower — Overview" />
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <KpiCard label="Orders today" value="847" change="+12% vs yesterday" positive />
        <KpiCard label="Exceptions" value="23" change="-8% vs avg" positive />
        <KpiCard label="Fulfillment rate" value="96.8%" change="+1.2pp" positive />
        <KpiCard label="CSAT (7d)" value="4.6" change="-0.1 vs last week" positive={false} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 rounded-lg border border-border/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Exception feed (live)</p>
          <div className="space-y-2">
            {[
              { icon: Truck, text: "3 shipments delayed > 48h — carrier: FedEx Ground", status: "critical", time: "2m ago" },
              { icon: Package, text: "SKU #4821 stock mismatch: Shopify 42, WMS 38", status: "warning", time: "8m ago" },
              { icon: RotateCcw, text: "High-value return ($349) flagged for manual review", status: "review", time: "15m ago" },
              { icon: DollarSign, text: "Payout reconciliation anomaly: $1,247 variance", status: "warning", time: "22m ago" },
              { icon: ShoppingCart, text: "Order #10847 — potential fraud signal (address mismatch)", status: "critical", time: "31m ago" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-card border border-border/40 hover:border-border transition-colors">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-[11px] flex-1 truncate">{item.text}</span>
                  <StatusBadge status={item.status} />
                  <span className="text-[9px] text-muted-foreground whitespace-nowrap">{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-lg border border-border/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">System health</p>
          <div className="space-y-3">
            {[
              { name: "Shopify Sync", status: "healthy", uptime: 99.9 },
              { name: "WMS Bridge", status: "healthy", uptime: 99.7 },
              { name: "FedEx API", status: "warning", uptime: 97.2 },
              { name: "Gorgias Webhook", status: "healthy", uptime: 99.8 },
              { name: "QuickBooks Sync", status: "healthy", uptime: 99.5 },
            ].map((sys, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[11px]">{sys.name}</span>
                <div className="flex items-center gap-2">
                  <MiniBar value={sys.uptime} color={sys.status === "healthy" ? "bg-emerald-500" : "bg-amber-500"} />
                  <StatusBadge status={sys.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OrdersView = () => (
  <div className="bg-background rounded-lg border border-border overflow-hidden text-foreground">
    <TopBar title="Order Queue — Risk & Hold Management" />
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <KpiCard label="Orders in queue" value="34" change="12 flagged" positive={false} />
        <KpiCard label="Auto-approved" value="813" change="96% approval rate" positive />
        <KpiCard label="Held for review" value="12" change="Avg hold: 4 min" positive />
        <KpiCard label="Fraud detected" value="3" change="$2,847 saved" positive />
      </div>
      <div className="rounded-lg border border-border/60 overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="text-left p-2.5">Order</th>
              <th className="text-left p-2.5">Customer</th>
              <th className="text-left p-2.5">Total</th>
              <th className="text-left p-2.5">Risk</th>
              <th className="text-left p-2.5">Flag</th>
              <th className="text-left p-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "#10847", customer: "J. Martinez", total: "$489.00", risk: "critical", flag: "Address mismatch", status: "held" },
              { id: "#10846", customer: "S. Chen", total: "$1,249.00", risk: "critical", flag: "Multiple cards declined", status: "held" },
              { id: "#10845", customer: "A. Williams", total: "$67.50", risk: "warning", flag: "New account, high qty", status: "review" },
              { id: "#10844", customer: "M. Johnson", total: "$234.00", risk: "healthy", flag: "—", status: "approved" },
              { id: "#10843", customer: "R. Davis", total: "$89.99", risk: "healthy", flag: "—", status: "approved" },
              { id: "#10842", customer: "L. Kim", total: "$1,799.00", risk: "warning", flag: "Shipping ≠ billing", status: "review" },
              { id: "#10841", customer: "P. Thompson", total: "$45.00", risk: "healthy", flag: "—", status: "approved" },
            ].map((order, i) => (
              <tr key={i} className="border-t border-border/30 text-[11px] hover:bg-muted/30 transition-colors">
                <td className="p-2.5 font-mono font-semibold">{order.id}</td>
                <td className="p-2.5">{order.customer}</td>
                <td className="p-2.5 font-semibold">{order.total}</td>
                <td className="p-2.5"><StatusBadge status={order.risk} /></td>
                <td className="p-2.5 text-muted-foreground">{order.flag}</td>
                <td className="p-2.5"><StatusBadge status={order.status === "held" ? "critical" : order.status === "review" ? "warning" : "approved"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const InventoryView = () => (
  <div className="bg-background rounded-lg border border-border overflow-hidden text-foreground">
    <TopBar title="Inventory Reconciliation" />
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <KpiCard label="Total SKUs" value="2,847" change="12 new this week" positive />
        <KpiCard label="Sync accuracy" value="98.6%" change="+0.4pp" positive />
        <KpiCard label="Mismatches" value="18" change="-6 vs yesterday" positive />
        <KpiCard label="Auto-hidden" value="4" change="OOS prevention" positive />
      </div>
      <div className="rounded-lg border border-border/60 overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="text-left p-2.5">SKU</th>
              <th className="text-left p-2.5">Product</th>
              <th className="text-right p-2.5">Shopify</th>
              <th className="text-right p-2.5">WMS</th>
              <th className="text-right p-2.5">3PL</th>
              <th className="text-left p-2.5">Δ</th>
              <th className="text-left p-2.5">Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              { sku: "BLK-TEE-L", product: "Classic Tee (L, Black)", shopify: 42, wms: 38, tpl: 38, delta: -4, action: "Auto-adjust queued" },
              { sku: "WHT-SNK-10", product: "Runner V2 (10, White)", shopify: 3, wms: 3, tpl: 0, delta: -3, action: "Hidden — OOS at 3PL" },
              { sku: "GRY-HOOD-M", product: "Zip Hoodie (M, Grey)", shopify: 156, wms: 156, tpl: 156, delta: 0, action: "Synced ✓" },
              { sku: "NVY-CAP-OS", product: "Dad Cap (OS, Navy)", shopify: 89, wms: 91, tpl: 91, delta: 2, action: "Review pending" },
              { sku: "RED-SOCK-S", product: "Crew Sock Pack (S)", shopify: 0, wms: 24, tpl: 24, delta: 24, action: "Relisting queued" },
              { sku: "BLU-JKT-XL", product: "Puffer Jacket (XL)", shopify: 12, wms: 12, tpl: 12, delta: 0, action: "Synced ✓" },
            ].map((item, i) => (
              <tr key={i} className="border-t border-border/30 text-[11px] hover:bg-muted/30 transition-colors">
                <td className="p-2.5 font-mono font-semibold">{item.sku}</td>
                <td className="p-2.5">{item.product}</td>
                <td className="p-2.5 text-right font-mono">{item.shopify}</td>
                <td className="p-2.5 text-right font-mono">{item.wms}</td>
                <td className="p-2.5 text-right font-mono">{item.tpl}</td>
                <td className="p-2.5">
                  <span className={`font-mono font-semibold ${item.delta !== 0 ? "text-rose-500" : "text-emerald-600"}`}>
                    {item.delta > 0 ? "+" : ""}{item.delta}
                  </span>
                </td>
                <td className="p-2.5 text-muted-foreground">{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const FulfillmentView = () => (
  <div className="bg-background rounded-lg border border-border overflow-hidden text-foreground">
    <TopBar title="Fulfillment Control Tower" />
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <KpiCard label="Shipped today" value="623" change="+8% vs target" positive />
        <KpiCard label="In transit" value="1,847" change="On track" positive />
        <KpiCard label="Exceptions" value="14" change="7 auto-resolved" positive />
        <KpiCard label="Avg delivery" value="2.4d" change="-0.3d vs last month" positive />
      </div>
      <div className="rounded-lg border border-border/60 overflow-hidden">
        <div className="bg-muted/50 p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Active exceptions</p>
        </div>
        <div className="divide-y divide-border/30">
          {[
            { tracking: "FX8294710", carrier: "FedEx Ground", order: "#10832", issue: "Delayed > 48h", eta: "Overdue 2d", status: "critical", action: "Claim filed auto" },
            { tracking: "UP7183920", carrier: "UPS", order: "#10829", issue: "Label failed", eta: "—", status: "warning", action: "Re-label queued" },
            { tracking: "US9471820", carrier: "USPS", order: "#10825", issue: "Lost in transit", eta: "—", status: "critical", action: "Claim + reship" },
            { tracking: "FX8294688", carrier: "FedEx Express", order: "#10821", issue: "Damaged scan", eta: "Delivered", status: "warning", action: "Customer notified" },
            { tracking: "DH2948710", carrier: "DHL eComm", order: "#10818", issue: "Customs hold", eta: "TBD", status: "warning", action: "Docs uploaded" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 text-[11px] hover:bg-muted/30 transition-colors">
              <span className="font-mono font-semibold w-24">{item.tracking}</span>
              <span className="w-24">{item.carrier}</span>
              <span className="font-mono w-16">{item.order}</span>
              <span className="flex-1">{item.issue}</span>
              <span className="text-muted-foreground w-20">{item.eta}</span>
              <StatusBadge status={item.status} />
              <span className="text-muted-foreground w-28 text-right">{item.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ReturnsView = () => (
  <div className="bg-background rounded-lg border border-border overflow-hidden text-foreground">
    <TopBar title="Returns & Refunds Hub" />
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <KpiCard label="Returns today" value="31" change="74% auto-approved" positive />
        <KpiCard label="Refunds issued" value="$4,289" change="-12% vs avg" positive />
        <KpiCard label="Pending review" value="8" change="Avg: 6 min" positive />
        <KpiCard label="Leakage flagged" value="$347" change="2 policy violations" positive={false} />
      </div>
      <div className="rounded-lg border border-border/60 overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="text-left p-2.5">RMA</th>
              <th className="text-left p-2.5">Type</th>
              <th className="text-left p-2.5">Product</th>
              <th className="text-right p-2.5">Value</th>
              <th className="text-left p-2.5">Risk</th>
              <th className="text-left p-2.5">Decision</th>
            </tr>
          </thead>
          <tbody>
            {[
              { rma: "RMA-4821", type: "Refund", product: "Runner V2 (9, Black)", value: "$149.00", risk: "healthy", decision: "Auto-approved" },
              { rma: "RMA-4820", type: "Exchange", product: "Zip Hoodie (L→XL)", value: "$0.00", decision: "Auto-approved", risk: "healthy" },
              { rma: "RMA-4819", type: "Damaged", product: "Puffer Jacket (M)", value: "$349.00", risk: "critical", decision: "Manual review" },
              { rma: "RMA-4818", type: "Refund", product: "Dad Cap (Navy)", value: "$34.00", risk: "healthy", decision: "Auto-approved" },
              { rma: "RMA-4817", type: "Missing item", product: "Crew Sock 3-Pack", value: "$24.00", risk: "warning", decision: "Reship queued" },
              { rma: "RMA-4816", type: "Refund", product: "Classic Tee (S, White)", value: "$29.00", risk: "warning", decision: "Policy flag — repeat" },
            ].map((item, i) => (
              <tr key={i} className="border-t border-border/30 text-[11px] hover:bg-muted/30 transition-colors">
                <td className="p-2.5 font-mono font-semibold">{item.rma}</td>
                <td className="p-2.5">{item.type}</td>
                <td className="p-2.5">{item.product}</td>
                <td className="p-2.5 text-right font-mono font-semibold">{item.value}</td>
                <td className="p-2.5"><StatusBadge status={item.risk} /></td>
                <td className="p-2.5 text-muted-foreground">{item.decision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const SupportView = () => (
  <div className="bg-background rounded-lg border border-border overflow-hidden text-foreground">
    <TopBar title="Support Ticket Routing" />
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <KpiCard label="Tickets today" value="127" change="68% auto-classified" positive />
        <KpiCard label="WISMO deflected" value="43" change="34% of total" positive />
        <KpiCard label="Avg handle time" value="3.2m" change="-1.4m vs manual" positive />
        <KpiCard label="CSAT (today)" value="4.7" change="+0.2 vs avg" positive />
      </div>
      <div className="rounded-lg border border-border/60 overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="text-left p-2.5">Ticket</th>
              <th className="text-left p-2.5">Category</th>
              <th className="text-left p-2.5">Customer</th>
              <th className="text-left p-2.5">Subject</th>
              <th className="text-left p-2.5">Routed to</th>
              <th className="text-left p-2.5">Draft</th>
              <th className="text-left p-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { ticket: "T-8471", cat: "WISMO", customer: "alex@mail.com", subject: "Where's my order?", route: "Auto-reply", draft: "✓ Sent", status: "resolved" },
              { ticket: "T-8470", cat: "Refund", customer: "sam@corp.com", subject: "Wrong size received", route: "Returns queue", draft: "✓ Pending", status: "open" },
              { ticket: "T-8469", cat: "Product Q", customer: "jordan@me.com", subject: "Sizing guide for hoodie?", route: "Auto-reply", draft: "✓ Sent", status: "resolved" },
              { ticket: "T-8468", cat: "Damage", customer: "chris@biz.co", subject: "Box arrived crushed", route: "Escalations", draft: "✓ Review", status: "escalated" },
              { ticket: "T-8467", cat: "Billing", customer: "pat@inc.com", subject: "Double charged", route: "Finance queue", draft: "✓ Pending", status: "open" },
            ].map((item, i) => (
              <tr key={i} className="border-t border-border/30 text-[11px] hover:bg-muted/30 transition-colors">
                <td className="p-2.5 font-mono font-semibold">{item.ticket}</td>
                <td className="p-2.5">{item.cat}</td>
                <td className="p-2.5 font-mono">{item.customer}</td>
                <td className="p-2.5 truncate max-w-[160px]">{item.subject}</td>
                <td className="p-2.5 text-muted-foreground">{item.route}</td>
                <td className="p-2.5">{item.draft}</td>
                <td className="p-2.5"><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const FinanceView = () => (
  <div className="bg-background rounded-lg border border-border overflow-hidden text-foreground">
    <TopBar title="Finance — Daily Ops Close" />
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <KpiCard label="Gross revenue" value="$47,891" change="+14% vs target" positive />
        <KpiCard label="Refunds" value="$4,289" change="9.0% of gross" positive={false} />
        <KpiCard label="Net revenue" value="$43,602" change="+11% vs avg" positive />
        <KpiCard label="Payout variance" value="$12.40" change="0.03% — healthy" positive />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Payout reconciliation</p>
          <div className="space-y-2">
            {[
              { label: "Shopify payout", amount: "$43,614.40", match: true },
              { label: "Calculated net", amount: "$43,602.00", match: true },
              { label: "Variance", amount: "$12.40", match: true },
              { label: "Processing fees", amount: "$1,436.22", match: true },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center text-[11px]">
                <span>{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold">{item.amount}</span>
                  {item.match && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border/60 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Leakage report</p>
          <div className="space-y-2">
            {[
              { type: "Unapproved discounts", amount: "$89.00", count: "3 instances" },
              { type: "Duplicate refunds", amount: "$149.00", count: "1 instance" },
              { type: "Free shipping override", amount: "$47.94", count: "6 instances" },
              { type: "Policy exceptions", amount: "$61.00", count: "2 instances" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center text-[11px]">
                <span>{item.type}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-muted-foreground">{item.count}</span>
                  <span className="font-mono font-semibold text-rose-500">{item.amount}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-border/40 flex justify-between text-[11px] font-semibold">
            <span>Total leakage</span>
            <span className="text-rose-500 font-mono">$346.94</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="bg-background rounded-lg border border-border overflow-hidden text-foreground">
    <TopBar title="Automation Rules & Workflows" />
    <div className="p-4 space-y-4">
      <div className="rounded-lg border border-border/60 overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="text-left p-2.5">Rule</th>
              <th className="text-left p-2.5">Trigger</th>
              <th className="text-left p-2.5">Action</th>
              <th className="text-left p-2.5">Approval</th>
              <th className="text-left p-2.5">Runs (7d)</th>
              <th className="text-left p-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { rule: "Fraud hold", trigger: "Risk score > 70", action: "Hold order, notify ops", approval: "Auto", runs: "47", status: "active" },
              { rule: "OOS auto-hide", trigger: "3PL stock = 0", action: "Hide product on Shopify", approval: "Auto", runs: "12", status: "active" },
              { rule: "Delayed shipment alert", trigger: "No scan > 48h", action: "File claim, notify customer", approval: "Manual", runs: "8", status: "active" },
              { rule: "Low-risk return approve", trigger: "Value < $50, repeat customer", action: "Auto-approve, issue label", approval: "Auto", runs: "89", status: "active" },
              { rule: "WISMO auto-reply", trigger: "Ticket tagged WISMO", action: "Send tracking + ETA", approval: "Auto", runs: "203", status: "active" },
              { rule: "Payout anomaly", trigger: "Variance > $100", action: "Alert finance team", approval: "Manual", runs: "2", status: "active" },
              { rule: "Discount audit", trigger: "Unapproved discount applied", action: "Flag for review", approval: "Manual", runs: "6", status: "active" },
              { rule: "Daily ops close", trigger: "6PM daily", action: "Generate summary report", approval: "Auto", runs: "7", status: "active" },
            ].map((item, i) => (
              <tr key={i} className="border-t border-border/30 text-[11px] hover:bg-muted/30 transition-colors">
                <td className="p-2.5 font-semibold">{item.rule}</td>
                <td className="p-2.5 text-muted-foreground">{item.trigger}</td>
                <td className="p-2.5">{item.action}</td>
                <td className="p-2.5"><StatusBadge status={item.approval === "Auto" ? "approved" : "review"} /></td>
                <td className="p-2.5 font-mono">{item.runs}</td>
                <td className="p-2.5"><StatusBadge status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const VIEWS: Record<ViewType, () => JSX.Element> = {
  overview: OverviewView,
  orders: OrdersView,
  inventory: InventoryView,
  fulfillment: FulfillmentView,
  returns: ReturnsView,
  support: SupportView,
  finance: FinanceView,
  settings: SettingsView,
};

const ShopifyControlTower = ({ view = "overview" }: { view?: ViewType }) => {
  const View = VIEWS[view];
  return <View />;
};

export default ShopifyControlTower;
