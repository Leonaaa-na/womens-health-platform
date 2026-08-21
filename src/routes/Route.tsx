import { Routes, Route,BrowserRouter } from "react-router-dom";

import UnauthLayout from "../layouts/UnauthLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

import { publicRoutes } from "./routes";

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
          {/* Authenticated routes will be added here */}
        </Route>
      </Route>

    </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;