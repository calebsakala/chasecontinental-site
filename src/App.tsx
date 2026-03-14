import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import LandingPage from "./pages/LandingPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ResourcesPage from "./pages/ResourcesPage";
import SiloAuditChecklist from "./pages/resources/SiloAuditChecklist";

import TransformationPlaybook from "./pages/resources/TransformationPlaybook";
import ReliabilityAssessment from "./pages/resources/ReliabilityAssessment";
import OrchestrationSwipeFile from "./pages/resources/OrchestrationSwipeFile";
import PeakSeasonSurvivalGuide from "./pages/resources/PeakSeasonSurvivalGuide";
import DeterministicBlueprint from "./pages/resources/DeterministicBlueprint";
import FiveDayPilotChallenge from "./pages/resources/FiveDayPilotChallenge";
import CcidCaseStudy from "./pages/resources/CcidCaseStudy";
import NeutralVsProprietaryScorecard from "./pages/resources/NeutralVsProprietaryScorecard";
import ShopifyOpsAutomation from "./pages/resources/ShopifyOpsAutomation";
import AiRoiCalculator from "./pages/resources/AiRoiCalculator";
import ProductsPage from "./pages/ProductsPage";
import CharlesPage from "./pages/CharlesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Backwards-compatible alias (older bundles/links may still reference this name)
const AutomationRoiCalculator = AiRoiCalculator;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/silo-audit-checklist" element={<SiloAuditChecklist />} />
          <Route
            path="/resources/automation-roi-calculator"
            element={<AutomationRoiCalculator />}
          />
          <Route path="/resources/transformation-playbook" element={<TransformationPlaybook />} />
          <Route path="/resources/reliability-assessment" element={<ReliabilityAssessment />} />
          <Route path="/resources/orchestration-swipe-file" element={<OrchestrationSwipeFile />} />
          <Route path="/resources/peak-season-survival-guide" element={<PeakSeasonSurvivalGuide />} />
          <Route path="/resources/deterministic-blueprint" element={<DeterministicBlueprint />} />
          <Route path="/resources/5-day-pilot-challenge" element={<FiveDayPilotChallenge />} />
          <Route path="/resources/ccid-case-study" element={<CcidCaseStudy />} />
          <Route path="/resources/neutral-vs-proprietary-scorecard" element={<NeutralVsProprietaryScorecard />} />
          <Route path="/resources/shopify-ops-automation" element={<ShopifyOpsAutomation />} />
          <Route path="/resources/ai-roi-calculator" element={<AiRoiCalculator />} />
          <Route path="/resources/charles" element={<CharlesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
