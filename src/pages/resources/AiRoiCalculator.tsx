import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Calculator,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  ChevronDown,
  Download,
  ArrowRight,
  Sparkles,
  BarChart3,
  Building2,
  Users,
  Zap,
  Shield,
  CheckCircle2,
  X,
  Mail,
  Factory,
  ShoppingCart,
  Stethoscope,
  Truck,
  Briefcase,
  Landmark,
  Server,
  Leaf,
  Scale,
  HardHat,
  Headphones,
  Package,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { queueResourceEmail } from "@/lib/resourceEmail";
import heroImage from "@/assets/roi-hero-financial.jpg";

const ASSET_KEY = "ai-roi-calculator";

// ============================================================================
// SECTOR CONFIGURATIONS - 12+ Industries with Research-Backed Benchmarks
// ============================================================================
const SECTORS = [
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    icon: Stethoscope,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "financial_services",
    name: "Financial Services & Banking",
    icon: Landmark,
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Industrial",
    icon: Factory,
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "retail",
    name: "Retail & E-commerce",
    icon: ShoppingCart,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "logistics",
    name: "Logistics & Supply Chain",
    icon: Truck,
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "technology",
    name: "Technology & SaaS",
    icon: Server,
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "bpo",
    name: "BPO & Shared Services",
    icon: Headphones,
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    id: "legal",
    name: "Legal & Professional Services",
    icon: Scale,
    color: "from-slate-500 to-gray-600",
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: Shield,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "energy",
    name: "Energy & Utilities",
    icon: Leaf,
    color: "from-lime-500 to-green-500",
  },
  {
    id: "construction",
    name: "Construction & Real Estate",
    icon: HardHat,
    color: "from-amber-500 to-yellow-500",
  },
  {
    id: "cpg",
    name: "CPG & Distribution",
    icon: Package,
    color: "from-red-500 to-orange-500",
  },
];

// Sector benchmark data from 2025-2026 research (McKinsey, Deloitte, PwC, Gartner)
const SECTOR_BENCHMARKS: Record<
  string,
  {
    baseTimeReduction: number;
    baseErrorReduction: number;
    avgHourlyRate: number;
    automationPotential: number;
    avgProcessesPerEmployee: number;
    avgErrorCostMultiplier: number;
    implementationFactor: number;
    insight: string;
    keyMetric: string;
    source: string;
  }
> = {
  healthcare: {
    baseTimeReduction: 0.42,
    baseErrorReduction: 0.55,
    avgHourlyRate: 125,
    automationPotential: 0.36,
    avgProcessesPerEmployee: 850,
    avgErrorCostMultiplier: 2500,
    implementationFactor: 1.15,
    insight:
      "AI-powered diagnostic workflows reduce clinical documentation time by 42%",
    keyMetric: "42% documentation time saved",
    source: "McKinsey Health 2025",
  },
  financial_services: {
    baseTimeReduction: 0.38,
    baseErrorReduction: 0.62,
    avgHourlyRate: 175,
    automationPotential: 0.43,
    avgProcessesPerEmployee: 1200,
    avgErrorCostMultiplier: 5000,
    implementationFactor: 1.25,
    insight:
      "Intelligent automation in compliance achieves 62% error reduction",
    keyMetric: "62% compliance error reduction",
    source: "Deloitte Banking 2025",
  },
  manufacturing: {
    baseTimeReduction: 0.35,
    baseErrorReduction: 0.48,
    avgHourlyRate: 85,
    automationPotential: 0.52,
    avgProcessesPerEmployee: 650,
    avgErrorCostMultiplier: 3500,
    implementationFactor: 1.1,
    insight: "Predictive maintenance AI reduces unplanned downtime by 48%",
    keyMetric: "48% downtime reduction",
    source: "PwC Manufacturing 2026",
  },
  retail: {
    baseTimeReduction: 0.32,
    baseErrorReduction: 0.45,
    avgHourlyRate: 55,
    automationPotential: 0.48,
    avgProcessesPerEmployee: 1500,
    avgErrorCostMultiplier: 150,
    implementationFactor: 0.95,
    insight:
      "AI inventory optimization cuts stockouts by 45% while reducing overstock",
    keyMetric: "45% stockout reduction",
    source: "McKinsey Retail 2025",
  },
  logistics: {
    baseTimeReduction: 0.45,
    baseErrorReduction: 0.52,
    avgHourlyRate: 65,
    automationPotential: 0.55,
    avgProcessesPerEmployee: 2000,
    avgErrorCostMultiplier: 350,
    implementationFactor: 1.0,
    insight: "Route optimization AI delivers 45% faster delivery scheduling",
    keyMetric: "45% scheduling efficiency",
    source: "Gartner Supply Chain 2025",
  },
  technology: {
    baseTimeReduction: 0.4,
    baseErrorReduction: 0.5,
    avgHourlyRate: 145,
    automationPotential: 0.38,
    avgProcessesPerEmployee: 400,
    avgErrorCostMultiplier: 2000,
    implementationFactor: 0.85,
    insight: "AI code assistants accelerate development cycles by 40%",
    keyMetric: "40% faster development",
    source: "Stanford AI Index 2025",
  },
  bpo: {
    baseTimeReduction: 0.55,
    baseErrorReduction: 0.58,
    avgHourlyRate: 45,
    automationPotential: 0.65,
    avgProcessesPerEmployee: 2500,
    avgErrorCostMultiplier: 200,
    implementationFactor: 0.9,
    insight:
      "Process automation achieves 55% handling time reduction in contact centers",
    keyMetric: "55% handling time reduction",
    source: "Deloitte BPO 2025",
  },
  legal: {
    baseTimeReduction: 0.35,
    baseErrorReduction: 0.42,
    avgHourlyRate: 250,
    automationPotential: 0.28,
    avgProcessesPerEmployee: 300,
    avgErrorCostMultiplier: 8000,
    implementationFactor: 1.2,
    insight:
      "Contract analysis AI reduces review time by 35% with higher accuracy",
    keyMetric: "35% review time saved",
    source: "Thomson Reuters 2025",
  },
  insurance: {
    baseTimeReduction: 0.4,
    baseErrorReduction: 0.55,
    avgHourlyRate: 95,
    automationPotential: 0.45,
    avgProcessesPerEmployee: 900,
    avgErrorCostMultiplier: 3000,
    implementationFactor: 1.1,
    insight:
      "Claims processing AI reduces cycle time by 40% with improved accuracy",
    keyMetric: "40% faster claims processing",
    source: "McKinsey Insurance 2025",
  },
  energy: {
    baseTimeReduction: 0.32,
    baseErrorReduction: 0.45,
    avgHourlyRate: 105,
    automationPotential: 0.35,
    avgProcessesPerEmployee: 500,
    avgErrorCostMultiplier: 6000,
    implementationFactor: 1.15,
    insight:
      "Grid optimization AI achieves 32% improvement in demand forecasting",
    keyMetric: "32% forecast accuracy gain",
    source: "Deloitte Energy 2025",
  },
  construction: {
    baseTimeReduction: 0.28,
    baseErrorReduction: 0.38,
    avgHourlyRate: 75,
    automationPotential: 0.32,
    avgProcessesPerEmployee: 400,
    avgErrorCostMultiplier: 4500,
    implementationFactor: 1.05,
    insight: "Project management AI reduces scheduling conflicts by 38%",
    keyMetric: "38% fewer scheduling conflicts",
    source: "McKinsey Construction 2025",
  },
  cpg: {
    baseTimeReduction: 0.38,
    baseErrorReduction: 0.48,
    avgHourlyRate: 70,
    automationPotential: 0.45,
    avgProcessesPerEmployee: 1100,
    avgErrorCostMultiplier: 400,
    implementationFactor: 0.95,
    insight: "Demand sensing AI improves forecast accuracy by 48%",
    keyMetric: "48% forecast improvement",
    source: "Gartner CPG 2025",
  },
};

// Revenue brackets with scaling factors
const REVENUE_BRACKETS = [
  {
    id: "startup",
    label: "$1M - $10M",
    min: 1000000,
    max: 10000000,
    factor: 0.6,
    investmentBase: 75000,
  },
  {
    id: "small",
    label: "$10M - $50M",
    min: 10000000,
    max: 50000000,
    factor: 0.8,
    investmentBase: 150000,
  },
  {
    id: "medium",
    label: "$50M - $250M",
    min: 50000000,
    max: 250000000,
    factor: 1.0,
    investmentBase: 350000,
  },
  {
    id: "large",
    label: "$250M - $1B",
    min: 250000000,
    max: 1000000000,
    factor: 1.3,
    investmentBase: 750000,
  },
  {
    id: "enterprise",
    label: "$1B - $10B",
    min: 1000000000,
    max: 10000000000,
    factor: 1.6,
    investmentBase: 1500000,
  },
  {
    id: "mega",
    label: "$10B+",
    min: 10000000000,
    max: 100000000000,
    factor: 2.0,
    investmentBase: 3500000,
  },
];

// Headcount brackets
const HEADCOUNT_BRACKETS = [
  { id: "micro", label: "10 - 50", min: 10, max: 50, factor: 0.5 },
  { id: "small", label: "50 - 200", min: 50, max: 200, factor: 0.75 },
  { id: "medium", label: "200 - 1,000", min: 200, max: 1000, factor: 1.0 },
  { id: "large", label: "1,000 - 5,000", min: 1000, max: 5000, factor: 1.35 },
  {
    id: "enterprise",
    label: "5,000 - 25,000",
    min: 5000,
    max: 25000,
    factor: 1.7,
  },
  { id: "mega", label: "25,000+", min: 25000, max: 100000, factor: 2.2 },
];

// ============================================================================
// CALCULATION ENGINE
// ============================================================================
interface CalculationInputs {
  sector: string;
  revenueId: string;
  headcountId: string;
}

interface CalculationResults {
  // Core metrics
  annualSavings: number;
  monthlySavings: number;
  hoursSavedPerYear: number;
  errorsPreventedPerYear: number;

  // ROI metrics
  roiPercentage: number;
  paybackMonths: number;
  threeYearValue: number;
  estimatedInvestment: number;

  // Breakdown
  timeSavings: number;
  errorSavings: number;
  productivityGain: number;

  // Sector-specific
  sectorInsight: string;
  keyMetric: string;
  source: string;

  // For charts
  projectionData: { year: string; savings: number; cumulative: number }[];
  breakdownData: { name: string; value: number; color: string }[];
}

function calculateROI(inputs: CalculationInputs): CalculationResults {
  const benchmark = SECTOR_BENCHMARKS[inputs.sector];
  const revenueBracket = REVENUE_BRACKETS.find(
    (r) => r.id === inputs.revenueId,
  )!;
  const headcountBracket = HEADCOUNT_BRACKETS.find(
    (h) => h.id === inputs.headcountId,
  )!;

  // Base calculations
  const avgHeadcount = (headcountBracket.min + headcountBracket.max) / 2;
  const avgRevenue = (revenueBracket.min + revenueBracket.max) / 2;

  // Revenue per employee efficiency factor (higher = more efficient, less automation benefit per person)
  const revenuePerEmployee = avgRevenue / avgHeadcount;
  const efficiencyFactor = Math.min(
    1.5,
    Math.max(0.7, 1000000 / revenuePerEmployee),
  );

  // Hours calculations
  const annualHoursPerEmployee = 2080; // 40 hrs/week * 52 weeks
  const automatableHours =
    annualHoursPerEmployee * benchmark.automationPotential;
  const hoursSavedPerEmployee = automatableHours * benchmark.baseTimeReduction;
  const totalHoursSaved =
    hoursSavedPerEmployee * avgHeadcount * headcountBracket.factor;

  // Time savings in dollars
  const timeSavings = totalHoursSaved * benchmark.avgHourlyRate;

  // Error reduction savings
  const totalProcesses = avgHeadcount * benchmark.avgProcessesPerEmployee;
  const baseErrorRate = 0.05; // 5% baseline error rate
  const errorsPreventedPerYear =
    totalProcesses * baseErrorRate * benchmark.baseErrorReduction;
  const errorSavings =
    errorsPreventedPerYear * benchmark.avgErrorCostMultiplier;

  // Productivity gain (additional output from same workforce)
  const productivityGain = timeSavings * 0.25; // 25% of time savings converts to additional output

  // Total annual savings
  const annualSavings =
    (timeSavings + errorSavings + productivityGain) *
    revenueBracket.factor *
    efficiencyFactor;
  const monthlySavings = annualSavings / 12;

  // Investment calculation
  const estimatedInvestment =
    revenueBracket.investmentBase *
    benchmark.implementationFactor *
    headcountBracket.factor;

  // ROI calculations
  const roiPercentage =
    ((annualSavings - estimatedInvestment) / estimatedInvestment) * 100;
  const paybackMonths = Math.max(1, estimatedInvestment / monthlySavings);
  const threeYearValue = annualSavings * 3 - estimatedInvestment;

  // Projection data for charts
  const projectionData = [
    {
      year: "Year 1",
      savings: Math.round(annualSavings),
      cumulative: Math.round(annualSavings - estimatedInvestment),
    },
    {
      year: "Year 2",
      savings: Math.round(annualSavings * 1.15),
      cumulative: Math.round(annualSavings * 2.15 - estimatedInvestment),
    },
    {
      year: "Year 3",
      savings: Math.round(annualSavings * 1.25),
      cumulative: Math.round(annualSavings * 3.4 - estimatedInvestment),
    },
    {
      year: "Year 4",
      savings: Math.round(annualSavings * 1.3),
      cumulative: Math.round(annualSavings * 4.7 - estimatedInvestment),
    },
    {
      year: "Year 5",
      savings: Math.round(annualSavings * 1.35),
      cumulative: Math.round(annualSavings * 6.05 - estimatedInvestment),
    },
  ];

  // Breakdown data
  const breakdownData = [
    {
      name: "Time Savings",
      value: Math.round(timeSavings * revenueBracket.factor * efficiencyFactor),
      color: "hsl(var(--primary))",
    },
    {
      name: "Error Reduction",
      value: Math.round(
        errorSavings * revenueBracket.factor * efficiencyFactor,
      ),
      color: "hsl(280, 85%, 60%)",
    },
    {
      name: "Productivity Gain",
      value: Math.round(
        productivityGain * revenueBracket.factor * efficiencyFactor,
      ),
      color: "hsl(160, 85%, 45%)",
    },
  ];

  return {
    annualSavings: Math.round(annualSavings),
    monthlySavings: Math.round(monthlySavings),
    hoursSavedPerYear: Math.round(totalHoursSaved),
    errorsPreventedPerYear: Math.round(errorsPreventedPerYear),
    roiPercentage: Math.round(roiPercentage),
    paybackMonths: Math.round(paybackMonths * 10) / 10,
    threeYearValue: Math.round(threeYearValue),
    estimatedInvestment: Math.round(estimatedInvestment),
    timeSavings: Math.round(
      timeSavings * revenueBracket.factor * efficiencyFactor,
    ),
    errorSavings: Math.round(
      errorSavings * revenueBracket.factor * efficiencyFactor,
    ),
    productivityGain: Math.round(
      productivityGain * revenueBracket.factor * efficiencyFactor,
    ),
    sectorInsight: benchmark.insight,
    keyMetric: benchmark.keyMetric,
    source: benchmark.source,
    projectionData,
    breakdownData,
  };
}

// ============================================================================
// COMPONENT
// ============================================================================
const AiRoiCalculator = () => {
  const [sector, setSector] = useState<string>("");
  const [revenueId, setRevenueId] = useState<string>("");
  const [headcountId, setHeadcountId] = useState<string>("");
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // Lead form state
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleCalculate = async () => {
    if (!sector || !revenueId || !headcountId) {
      toast({
        title: "Missing inputs",
        description: "Please select sector, revenue bracket, and headcount.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);

    const calculatedResults = calculateROI({ sector, revenueId, headcountId });

    // Store run in database
    try {
      const sessionId =
        localStorage.getItem("session_id") || crypto.randomUUID();
      localStorage.setItem("session_id", sessionId);

      const { data: runData, error: runError } = await supabase
        .from("lm02_calculator_runs")
        .insert([
          {
            sector,
            session_id: sessionId,
            inputs: JSON.parse(
              JSON.stringify({ sector, revenueId, headcountId }),
            ),
            outputs: JSON.parse(JSON.stringify(calculatedResults)),
            payback: calculatedResults.paybackMonths,
          },
        ])
        .select()
        .single();

      if (runError) {
        console.error("Error saving run:", runError);
      } else {
        setRunId(runData.id);
      }

      // Track event
      await supabase.from("events").insert({
        event_name: "roi_calculated",
        session_id: sessionId,
        event_payload: {
          sector,
          revenueId,
          headcountId,
          roiPercentage: calculatedResults.roiPercentage,
        },
      });
    } catch (err) {
      console.error("Database error:", err);
    }

    setTimeout(() => {
      setResults(calculatedResults);
      setIsCalculating(false);
    }, 600);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const trimmedName = leadForm.name.trim();
      const normalizedEmail = leadForm.email.toLowerCase().trim();
      const company = leadForm.company.trim() || null;

      if (!runId) {
        throw new Error(
          "Please calculate your ROI before requesting the report.",
        );
      }

      // Insert lead
      const { data: leadData, error: leadError } = await supabase
        .from("leads")
        .upsert(
          {
            name: trimmedName,
            email: normalizedEmail,
            company,
            role: leadForm.role.trim() || null,
          },
          { onConflict: "email" },
        )
        .select()
        .single();

      if (leadError) throw leadError;

      await supabase
        .from("lm02_calculator_runs")
        .update({ lead_id: leadData.id })
        .eq("id", runId);

      setPdfGenerating(true);

      const { data: pdfData, error: pdfError } =
        await supabase.functions.invoke("generate-roi-pdf", {
          body: { run_id: runId, lead_id: leadData.id },
        });

      if (pdfError) throw pdfError;

      const reportUrl = pdfData?.pdf_url ?? pdfData?.report_url;
      const filePath = pdfData?.file_path;

      if (!reportUrl || !filePath) {
        throw new Error(
          "Executive summary generation returned an incomplete response.",
        );
      }

      await supabase.from("downloads").insert([
        {
          lead_id: leadData.id,
          asset_key: ASSET_KEY,
          file_path: filePath,
          downloaded_at: new Date().toISOString(),
        },
      ]);

      queueResourceEmail({
        assetKey: ASSET_KEY,
        leadId: leadData.id,
        name: trimmedName,
        email: normalizedEmail,
        company,
        filePath,
      });

      window.open(reportUrl, "_blank", "noopener,noreferrer");

      setPdfGenerating(false);

      // Track event
      await supabase.from("events").insert({
        event_name: "lead_captured",
        lead_id: leadData?.id,
        event_payload: {
          source: "ai-roi-calculator",
          sector,
          revenueId,
          headcountId,
        },
      });

      setEmailSubmitted(true);
      setShowEmailModal(false);

      toast({
        title: "Executive summary ready!",
        description:
          "Your executive summary is open now, and an email copy is on the way.",
      });
    } catch (err) {
      console.error("Lead submission error:", err);
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPdfGenerating(false);
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  const selectedSector = SECTORS.find((s) => s.id === sector);

  return (
    <>
      <Helmet>
        <title>
          AI Automation ROI Calculator | Enterprise Benchmarks 2025-2026 | Chase
          Continental
        </title>
        <meta
          name="description"
          content="Calculate your AI automation ROI with industry-specific benchmarks from McKinsey, Deloitte, and PwC. 12+ sectors, revenue & headcount based projections."
        />
        <meta
          name="keywords"
          content="AI ROI calculator, automation ROI, AI investment calculator, McKinsey AI benchmarks, enterprise AI"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section - Full Bleed */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Financial growth visualization"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10 py-32">
            <div className="max-w-3xl rounded-2xl backdrop-blur-md bg-background/40 p-8">
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    2025-2026 McKinsey • Deloitte • PwC • Gartner Benchmarks
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
              >
                Calculate Your
                <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  AI Automation ROI
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground mb-8 max-w-2xl"
              >
                Get enterprise-grade projections based on your sector, revenue,
                and team size. Powered by research from the world's leading
                consulting firms.
              </motion.p>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-6"
              >
                {[
                  { value: "12+", label: "Sectors" },
                  { value: "350%", label: "Avg ROI" },
                  { value: "8mo", label: "Avg Payback" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16 -mt-20 relative z-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-6xl mx-auto"
            >
              {/* Calculator Card */}
              <Card className="bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
                <CardHeader className="border-b border-border/50 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10">
                      <Calculator className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-foreground">
                        AI Automation ROI Calculator
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">
                        Select your parameters below for personalized
                        projections
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-8">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Input Column */}
                    <div className="lg:col-span-1 space-y-6">
                      {/* Sector Selection */}
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-foreground flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          Industry Sector
                        </Label>
                        <Select value={sector} onValueChange={setSector}>
                          <SelectTrigger className="h-12 bg-background border-border">
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {SECTORS.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                <div className="flex items-center gap-2">
                                  <s.icon className="w-4 h-4" />
                                  {s.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Revenue Selection */}
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-foreground flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          Annual Revenue
                        </Label>
                        <Select value={revenueId} onValueChange={setRevenueId}>
                          <SelectTrigger className="h-12 bg-background border-border">
                            <SelectValue placeholder="Select revenue bracket" />
                          </SelectTrigger>
                          <SelectContent>
                            {REVENUE_BRACKETS.map((r) => (
                              <SelectItem key={r.id} value={r.id}>
                                {r.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Headcount Selection */}
                      <div className="space-y-3">
                        <Label className="text-base font-medium text-foreground flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          Employee Count
                        </Label>
                        <Select
                          value={headcountId}
                          onValueChange={setHeadcountId}
                        >
                          <SelectTrigger className="h-12 bg-background border-border">
                            <SelectValue placeholder="Select headcount range" />
                          </SelectTrigger>
                          <SelectContent>
                            {HEADCOUNT_BRACKETS.map((h) => (
                              <SelectItem key={h.id} value={h.id}>
                                {h.label} employees
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Calculate Button */}
                      <Button
                        onClick={handleCalculate}
                        disabled={
                          isCalculating || !sector || !revenueId || !headcountId
                        }
                        className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
                      >
                        {isCalculating ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Sparkles className="w-5 h-5" />
                            </motion.div>
                            Calculating...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Calculator className="w-5 h-5" />
                            Calculate ROI
                          </span>
                        )}
                      </Button>

                      {/* Sector Insight */}
                      {selectedSector && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-primary/5 border border-primary/10"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg bg-gradient-to-br ${selectedSector.color}`}
                            >
                              <selectedSector.icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {SECTOR_BENCHMARKS[sector]?.keyMetric}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {SECTOR_BENCHMARKS[sector]?.source}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Results Column */}
                    <div className="lg:col-span-2">
                      <AnimatePresence mode="wait">
                        {results ? (
                          <motion.div
                            key="results"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[
                                {
                                  label: "Annual Savings",
                                  value: formatCurrency(results.annualSavings),
                                  icon: DollarSign,
                                  color: "text-emerald-500",
                                },
                                {
                                  label: "ROI",
                                  value: `${results.roiPercentage}%`,
                                  icon: TrendingUp,
                                  color: "text-primary",
                                },
                                {
                                  label: "Payback Period",
                                  value: `${results.paybackMonths} mo`,
                                  icon: Clock,
                                  color: "text-amber-500",
                                },
                                {
                                  label: "3-Year Value",
                                  value: formatCurrency(results.threeYearValue),
                                  icon: Target,
                                  color: "text-violet-500",
                                },
                              ].map((metric, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="p-4 rounded-xl bg-muted/50 border border-border/50"
                                >
                                  <metric.icon
                                    className={`w-5 h-5 ${metric.color} mb-2`}
                                  />
                                  <div className="text-2xl font-bold text-foreground">
                                    {metric.value}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {metric.label}
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {/* Charts Row */}
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Savings Breakdown Pie */}
                              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                <h3 className="text-sm font-medium text-foreground mb-4">
                                  Savings Breakdown
                                </h3>
                                <div className="h-48">
                                  <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                  >
                                    <PieChart>
                                      <Pie
                                        data={results.breakdownData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={2}
                                        dataKey="value"
                                      >
                                        {results.breakdownData.map(
                                          (entry, index) => (
                                            <Cell
                                              key={`cell-${index}`}
                                              fill={entry.color}
                                            />
                                          ),
                                        )}
                                      </Pie>
                                      <Tooltip
                                        formatter={(value: number) =>
                                          formatCurrency(value)
                                        }
                                        contentStyle={{
                                          backgroundColor: "hsl(var(--card))",
                                          border:
                                            "1px solid hsl(var(--border))",
                                          borderRadius: "8px",
                                        }}
                                      />
                                      <Legend />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>

                              {/* Cumulative Value Projection */}
                              <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                <h3 className="text-sm font-medium text-foreground mb-4">
                                  5-Year Value Projection
                                </h3>
                                <div className="h-48">
                                  <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                  >
                                    <AreaChart data={results.projectionData}>
                                      <defs>
                                        <linearGradient
                                          id="colorCumulative"
                                          x1="0"
                                          y1="0"
                                          x2="0"
                                          y2="1"
                                        >
                                          <stop
                                            offset="5%"
                                            stopColor="hsl(var(--primary))"
                                            stopOpacity={0.3}
                                          />
                                          <stop
                                            offset="95%"
                                            stopColor="hsl(var(--primary))"
                                            stopOpacity={0}
                                          />
                                        </linearGradient>
                                      </defs>
                                      <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="hsl(var(--border))"
                                      />
                                      <XAxis
                                        dataKey="year"
                                        tick={{ fontSize: 12 }}
                                        stroke="hsl(var(--muted-foreground))"
                                      />
                                      <YAxis
                                        tickFormatter={(v) => formatCurrency(v)}
                                        tick={{ fontSize: 10 }}
                                        stroke="hsl(var(--muted-foreground))"
                                      />
                                      <Tooltip
                                        formatter={(value: number) =>
                                          formatCurrency(value)
                                        }
                                        contentStyle={{
                                          backgroundColor: "hsl(var(--card))",
                                          border:
                                            "1px solid hsl(var(--border))",
                                          borderRadius: "8px",
                                        }}
                                      />
                                      <Area
                                        type="monotone"
                                        dataKey="cumulative"
                                        stroke="hsl(var(--primary))"
                                        fillOpacity={1}
                                        fill="url(#colorCumulative)"
                                        strokeWidth={2}
                                      />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </div>

                            {/* Additional Metrics */}
                            <div className="grid grid-cols-3 gap-4">
                              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center">
                                <div className="text-xl font-bold text-foreground">
                                  {formatNumber(results.hoursSavedPerYear)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Hours Saved/Year
                                </div>
                              </div>
                              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center">
                                <div className="text-xl font-bold text-foreground">
                                  {formatNumber(results.errorsPreventedPerYear)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Errors Prevented
                                </div>
                              </div>
                              <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center">
                                <div className="text-xl font-bold text-foreground">
                                  {formatCurrency(results.estimatedInvestment)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Est. Investment
                                </div>
                              </div>
                            </div>

                            {/* Sector Insight Box */}
                            <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
                              <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-primary/10">
                                  <Zap className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    {results.sectorInsight}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Source: {results.source}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Export CTA */}
                            <div className="flex flex-col sm:flex-row gap-4">
                              <Button
                                onClick={() => setShowEmailModal(true)}
                                disabled={emailSubmitted}
                                className="flex-1 h-12 bg-primary hover:bg-primary/90"
                              >
                                {emailSubmitted ? (
                                  <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Report Sent!
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Get Executive Summary
                                  </span>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setResults(null);
                                  setSector("");
                                  setRevenueId("");
                                  setHeadcountId("");
                                }}
                                className="h-12"
                              >
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Start Over
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full min-h-[400px] text-center"
                          >
                            <div className="p-4 rounded-2xl bg-muted/30 mb-6">
                              <BarChart3 className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              Your ROI Analysis Will Appear Here
                            </h3>
                            <p className="text-muted-foreground max-w-md">
                              Select your sector, revenue bracket, and headcount
                              to see personalized AI automation projections
                              backed by enterprise research.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Research Sources */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Benchmarks sourced from
                </p>
                <div className="flex flex-wrap justify-center gap-6 opacity-60">
                  {[
                    "McKinsey Global Institute",
                    "Deloitte Insights",
                    "PwC",
                    "Gartner",
                    "Stanford HAI",
                  ].map((source, i) => (
                    <span
                      key={i}
                      className="text-sm font-medium text-muted-foreground"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Email Gate Modal */}
        <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Get Your Executive Summary
              </DialogTitle>
              <DialogDescription>
                We'll open your executive summary immediately and send a copy by
                email with the same analysis, recommendations, and industry
                benchmarks.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    required
                    value={leadForm.name}
                    onChange={(e) =>
                      setLeadForm({ ...leadForm, name: e.target.value })
                    }
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    required
                    value={leadForm.company}
                    onChange={(e) =>
                      setLeadForm({ ...leadForm, company: e.target.value })
                    }
                    placeholder="Acme Corp"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={leadForm.email}
                  onChange={(e) =>
                    setLeadForm({ ...leadForm, email: e.target.value })
                  }
                  placeholder="john@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={leadForm.role}
                  onChange={(e) =>
                    setLeadForm({ ...leadForm, role: e.target.value })
                  }
                  placeholder="VP of Operations"
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                    {pdfGenerating ? "Generating Report..." : "Submitting..."}
                  </span>
                ) : (
                  "Send Me the Report"
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                We respect your privacy. No spam, ever.
              </p>
            </form>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </>
  );
};

export default AiRoiCalculator;
