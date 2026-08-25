import { Routes, Route, BrowserRouter } from "react-router-dom";

import UnauthLayout from "../layouts/UnauthLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

import { publicRoutes } from "./routes";

/* =========================
   PERIOD TRACKER
========================= */

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

/* =========================
   PREGNANCY TRACKER
========================= */

import PregnancyDashboard from "../pages/pregnancy/PregnancyDashboard";
import PregnancySetup from "../pages/pregnancy/PregnancySetup";
import BabyDevelopment from "../pages/pregnancy/BabyDevelopment";
import BabyMovement from "../pages/pregnancy/BabyMovement";
import ContractionTimer from "../pages/pregnancy/ContractionTimer";
import PregnancySymptoms from "../pages/pregnancy/PregnancySymptoms";
import PregnancyNutrition from "../pages/pregnancy/PregnancyNutrition";
import PregnancyWellness from "../pages/pregnancy/PregnancyWellness";
import PregnancyNotes from "../pages/pregnancy/PregnancyNotes";
import HospitalBirthPlanning from "../pages/pregnancy/HospitalBirthPlanning";
import PregnancyEducation from "../pages/pregnancy/PregnancyEducation";
import PostpartumTransition from "../pages/pregnancy/PostpartumTransition";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            UNAUTHENTICATED ROUTES
        ========================= */}

        <Route element={<UnauthLayout />}>

          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

        </Route>

        {/* =========================
            AUTHENTICATED ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>

          <Route element={<AuthLayout />}>

            {/* =========================
                PERIOD TRACKER
            ========================= */}

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

            {/* =========================
                PREGNANCY TRACKER
            ========================= */}

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
              path="/pregnancy-tracker/hospital-birth-planning"
              element={<HospitalBirthPlanning />}
            />

            <Route
              path="/pregnancy-tracker/education"
              element={<PregnancyEducation />}
            />

            <Route
              path="/pregnancy-tracker/postpartum"
              element={<PostpartumTransition />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;