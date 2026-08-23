import { Routes, Route, BrowserRouter } from "react-router-dom";

import UnauthLayout from "../layouts/UnauthLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

import { publicRoutes } from "./routes";

import PeriodDashboard from "../pages/period/PeriodDashboard";
import CycleSetup from "../pages/period/CycleSetup";
import FlowTracker from "../pages/period/FlowTracker";
import SymptomsTracker from "../pages/period/SymptomsTracker";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Unauthenticated Routes */}
        <Route element={<UnauthLayout />}>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Route>

        {/* Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthLayout />}>

            {/* Period Tracker */}
            <Route
              path="/period-tracker"
              element={<PeriodDashboard />}
            />

            {/* Cycle Setup */}
            <Route
              path="/period-tracker/setup"
              element={<CycleSetup />}
            />

            {/* Flow Tracker */}
            <Route
              path="/period-tracker/flow"
              element={<FlowTracker />}
            />

            {/* Symptoms Tracker */}
            <Route
              path="/period-tracker/symptoms"
              element={<SymptomsTracker />}
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;