import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />
          <p className="font-semibold text-pink-600">
            Loading...
          </p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
export default ProtectedRoute;