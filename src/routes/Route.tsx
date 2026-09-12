import { Routes, Route, BrowserRouter } from "react-router-dom";

import UnauthLayout from "../layouts/UnauthLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

import { publicRoutes } from "./routes";

// ==================== PERIOD TRACKER ====================

import PeriodDashboard from "../pages/period/PeriodDashboard";
import CycleSetup from "../pages/period/CycleSetup";
import FlowTracker from "../pages/period/FlowTracker";
import SymptomsTracker from "../pages/period/SymptomsTracker";
import MedicationTracker from "../pages/period/MedicationTracker";
import NutritionTracker from "../pages/period/NutritionTracker";
import WellnessTracker from "../pages/period/WellnessTracker";
import PeriodNotes from "../pages/period/PeriodNotes";
import ReportsInsights from "../pages/period/ReportsInsights";
import PartnerSharing from "../pages/period/PartnerSharing";

// ==================== PREGNANCY TRACKER ====================

import PregnancyDashboard from "../pages/pregnancy/PregnancyDashboard";
import PregnancySetup from "../pages/pregnancy/PregnancySetup";
import BabyDevelopment from "../pages/pregnancy/BabyDevelopment";
import BabyMovement from "../pages/pregnancy/BabyMovement";
import ContractionTimer from "../pages/pregnancy/ContractionTimer";
import HospitalBirthPlanning from "../pages/pregnancy/HospitalBirthPlanning";
import PostpartumTransition from "../pages/pregnancy/PostpartumTransition";
import PregnancyEducation from "../pages/pregnancy/PregnancyEducation";
import PregnancySymptoms from "../pages/pregnancy/PregnancySymptoms";
import PregnancyNutrition from "../pages/pregnancy/PregnancyNutrition";
import PregnancyWellness from "../pages/pregnancy/PregnancyWellness";
import PregnancyNotes from "../pages/pregnancy/PregnancyNotes";
import PregnancyTimeline from "../pages/pregnancy/PregnancyTimeline";

// ==================== HEALTH LIBRARY ====================

import HealthLibrary from "../pages/health/HealthLibrary";
import HealthCategories from "../pages/health/HealthCategories";
import HealthSearch from "../pages/health/HealthSearch";
import HealthArticles from "../pages/health/HealthArticles";
import HealthArticleDetails from "../pages/health/HealthArticleDetails";
import HealthSaved from "../pages/health/HealthSaved";

// ==================== HEALTHCARE PROFESSIONALS ====================

import FindProfessional from "../pages/professionals/FindProfessional";
import ProfessionalProfile from "../pages/professionals/ProfessionalProfile";
import ConsultationChat from "../pages/professionals/ConsultationChat";

// ==================== EMERGENCY ASSISTANCE ====================

import EmergencyHome from "../pages/emergency/EmergencyHome";
import EmergencyContacts from "../pages/emergency/EmergencyContacts";
import FindHealthcareFacility from "../pages/emergency/FindHealthcareFacility";
import EmergencyServices from "../pages/emergency/EmergencyServices";
import EmergencyInformation from "../pages/emergency/EmergencyInformation";

// ==================== COMMUNITY ====================

import CommunityHome from "../pages/community/CommunityHome";
import CommunityPosts from "../pages/community/CommunityPosts";
import CommunityComments from "../pages/community/CommunityComments";
import ProfessionalHealthContent from "../pages/community/ProfessionalHealthContent";
import VerifiedProof from "../pages/community/VerifiedProof";
import UserProfile from "../pages/community/UserProfile";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================== PUBLIC ROUTES ==================== */}

        <Route element={<UnauthLayout />}>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>

        {/* ==================== PROTECTED ROUTES ==================== */}

        <Route element={<ProtectedRoute />}>
          <Route element={<AuthLayout />}>

            {/* ==================== PERIOD TRACKER ==================== */}

            <Route
              path="/period-tracker"
              element={<PeriodDashboard />}
            />

            <Route
              path="/period-tracker/setup"
              element={<CycleSetup />}
            />

            <Route
              path="/period-tracker/flow"
              element={<FlowTracker />}
            />

            <Route
              path="/period-tracker/symptoms"
              element={<SymptomsTracker />}
            />

            <Route
              path="/period-tracker/medication"
              element={<MedicationTracker />}
            />

            <Route
              path="/period-tracker/nutrition"
              element={<NutritionTracker />}
            />

            <Route
              path="/period-tracker/wellness"
              element={<WellnessTracker />}
            />

            <Route
              path="/period-tracker/notes"
              element={<PeriodNotes />}
            />

            <Route
              path="/period-tracker/reports"
              element={<ReportsInsights />}
            />

            <Route
              path="/period-tracker/partner-sharing"
              element={<PartnerSharing />}
            />


            {/* ==================== PREGNANCY TRACKER ==================== */}

            <Route
              path="/pregnancy-tracker"
              element={<PregnancyDashboard />}
            />

            <Route
              path="/pregnancy-tracker/setup"
              element={<PregnancySetup />}
            />

            <Route
              path="/pregnancy-tracker/baby-development"
              element={<BabyDevelopment />}
            />

            <Route
              path="/pregnancy-tracker/baby-movement"
              element={<BabyMovement />}
            />

            <Route
              path="/pregnancy-tracker/contraction-timer"
              element={<ContractionTimer />}
            />

            <Route
              path="/pregnancy-tracker/hospital-birth-planning"
              element={<HospitalBirthPlanning />}
            />

            <Route
              path="/pregnancy-tracker/postpartum-transition"
              element={<PostpartumTransition />}
            />

            <Route
              path="/pregnancy-tracker/education"
              element={<PregnancyEducation />}
            />

            <Route
              path="/pregnancy-tracker/symptoms"
              element={<PregnancySymptoms />}
            />

            <Route
              path="/pregnancy-tracker/nutrition"
              element={<PregnancyNutrition />}
            />

            <Route
              path="/pregnancy-tracker/wellness"
              element={<PregnancyWellness />}
            />

            <Route
              path="/pregnancy-tracker/notes"
              element={<PregnancyNotes />}
            />

            <Route
              path="/pregnancy-tracker/timeline"
              element={<PregnancyTimeline />}
            />


            {/* ==================== HEALTH LIBRARY ==================== */}

            <Route
              path="/health-library"
              element={<HealthLibrary />}
            />

            <Route
              path="/health-library/categories"
              element={<HealthCategories />}
            />

            <Route
              path="/health-library/search"
              element={<HealthSearch />}
            />

            <Route
              path="/health-library/saved"
              element={<HealthSaved />}
            />

            <Route
              path="/health-library/articles"
              element={<HealthArticles />}
            />

            <Route
              path="/health-library/articles/:id"
              element={<HealthArticleDetails />}
            />


            {/* ==================== HEALTHCARE PROFESSIONALS ==================== */}

            <Route
              path="/healthcare-professionals"
              element={<FindProfessional />}
            />

            <Route
              path="/healthcare-professionals/:id"
              element={<ProfessionalProfile />}
            />

            <Route
              path="/healthcare-professionals/:id/chat"
              element={<ConsultationChat />}
            />


            {/* ==================== EMERGENCY ASSISTANCE ==================== */}

            <Route
              path="/emergency"
              element={<EmergencyHome />}
            />

            <Route
              path="/emergency/contacts"
              element={<EmergencyContacts />}
            />

            <Route
              path="/emergency/facilities"
              element={<FindHealthcareFacility />}
            />

            <Route
              path="/emergency/services"
              element={<EmergencyServices />}
            />

            <Route
              path="/emergency/information"
              element={<EmergencyInformation />}
            />


            {/* ==================== COMMUNITY ==================== */}

            <Route
              path="/community"
              element={<CommunityHome />}
            />

            <Route
              path="/community/posts"
              element={<CommunityPosts />}
            />

            <Route
              path="/community/comments"
              element={<CommunityComments />}
            />

            <Route
              path="/community/professional-content"
              element={<ProfessionalHealthContent />}
            />

            <Route
              path="/community/verified"
              element={<VerifiedProof />}
            />

            <Route
              path="/community/profile"
              element={<UserProfile />}
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;