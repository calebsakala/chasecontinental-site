import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import LandingPage from "./pages/LandingPage";

const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const SiloAuditChecklist = lazy(
  () => import("./pages/resources/SiloAuditChecklist"),
);
const TransformationPlaybook = lazy(
  () => import("./pages/resources/TransformationPlaybook"),
);
const ReliabilityAssessment = lazy(
  () => import("./pages/resources/ReliabilityAssessment"),
);
const OrchestrationSwipeFile = lazy(
  () => import("./pages/resources/OrchestrationSwipeFile"),
);
const PeakSeasonSurvivalGuide = lazy(
  () => import("./pages/resources/PeakSeasonSurvivalGuide"),
);
const DeterministicBlueprint = lazy(
  () => import("./pages/resources/DeterministicBlueprint"),
);
const FiveDayPilotChallenge = lazy(
  () => import("./pages/resources/FiveDayPilotChallenge"),
);
const CcidCaseStudy = lazy(() => import("./pages/resources/CcidCaseStudy"));
const NeutralVsProprietaryScorecard = lazy(
  () => import("./pages/resources/NeutralVsProprietaryScorecard"),
);
const ShopifyOpsAutomation = lazy(
  () => import("./pages/resources/ShopifyOpsAutomation"),
);
const AiRoiCalculator = lazy(() => import("./pages/resources/AiRoiCalculator"));
const ResourceDownloadRedirect = lazy(
  () => import("./pages/resources/ResourceDownloadRedirect"),
);
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const CharlesPage = lazy(() => import("./pages/CharlesPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const routeFallback = (
  <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
    Loading...
  </div>
);

// Backwards-compatible alias (older bundles/links may still reference this name)
const AutomationRoiCalculator = AiRoiCalculator;

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={routeFallback}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route
            path="/resources/silo-audit-checklist"
            element={<SiloAuditChecklist />}
          />
          <Route
            path="/resources/automation-roi-calculator"
            element={<AutomationRoiCalculator />}
          />
          <Route
            path="/resources/transformation-playbook"
            element={<TransformationPlaybook />}
          />
          <Route
            path="/resources/reliability-assessment"
            element={<ReliabilityAssessment />}
          />
          <Route
            path="/resources/orchestration-swipe-file"
            element={<OrchestrationSwipeFile />}
          />
          <Route
            path="/resources/peak-season-survival-guide"
            element={<PeakSeasonSurvivalGuide />}
          />
          <Route
            path="/resources/deterministic-blueprint"
            element={<DeterministicBlueprint />}
          />
          <Route
            path="/resources/5-day-pilot-challenge"
            element={<FiveDayPilotChallenge />}
          />
          <Route
            path="/resources/ccid-case-study"
            element={<CcidCaseStudy />}
          />
          <Route
            path="/resources/neutral-vs-proprietary-scorecard"
            element={<NeutralVsProprietaryScorecard />}
          />
          <Route
            path="/resources/shopify-ops-automation"
            element={<ShopifyOpsAutomation />}
          />
          <Route
            path="/resources/ai-roi-calculator"
            element={<AiRoiCalculator />}
          />
          <Route
            path="/download/:assetKey"
            element={<ResourceDownloadRedirect />}
          />
          <Route path="/resources/charles" element={<CharlesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
