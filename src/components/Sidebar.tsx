import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/client";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isProfessional, setIsProfessional] = useState(false);
  const [pending, setPending] = useState(0);

  // Ask the backend what this account is
  useEffect(() => {
    apiClient
      .get("/users/me")
      .then((res) => {
        const role = res.data.data?.role;
        setIsAdmin(role === "admin");
        setIsProfessional(role === "professional");
      })
      .catch(() => undefined);
  }, []);

  // Doctors see how many requests are waiting
  useEffect(() => {
    if (!isProfessional) return;
    const load = () =>
      apiClient
        .get("/appointments/professional/pending-count")
        .then((res) => setPending(res.data.data?.pending || 0))
        .catch(() => undefined);
    load();
    const timer = setInterval(load, 60000); // refresh every minute
    return () => clearInterval(timer);
  }, [isProfessional, location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      active ? "bg-pink-500 text-white shadow-md" : "text-gray-700 hover:bg-white/70 hover:text-pink-700"
    }`;

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-hidden border-r border-pink-200 bg-gradient-to-b from-pink-100 via-fuchsia-50 to-purple-100">

      {/* Brand */}
      <div className="shrink-0 border-b border-pink-200 px-6 py-7">
        <Link to="/period-tracker">
          <h1 className="text-3xl font-bold tracking-tight text-pink-600">HerBloom</h1>
          <p className="mt-1 text-xs font-medium text-purple-600">Her health. Her journey. Her bloom.</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-6">

        {/* Doctors first — it's what they're here for */}
        {isProfessional ? (
          <>
            <Link
              to="/doctor/appointments"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                location.pathname.startsWith("/doctor")
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white/60 text-gray-700 hover:bg-white/90 hover:text-purple-700"
              }`}
            >
              <span className="text-lg">🩺</span>
              <span className="flex-1">My Appointments</span>
              {pending > 0 ? (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{pending}</span>
              ) : null}
            </Link>
            <div className="!mb-3 !mt-3 border-t border-pink-200"></div>
          </>
        ) : null}

        <Link to="/period-tracker" className={linkClass(isActive("/period-tracker"))}>
          <span className="text-lg">🩸</span>
          <span>Period Tracker</span>
        </Link>

        <Link to="/pregnancy-tracker" className={linkClass(isActive("/pregnancy-tracker"))}>
          <span className="text-lg">🤰</span>
          <span>Pregnancy Tracker</span>
        </Link>

        <Link to="/health-library" className={linkClass(location.pathname.startsWith("/health-library"))}>
          <span className="text-lg">📚</span>
          <span>Health Library</span>
        </Link>

        <Link to="/healthcare-professionals" className={linkClass(location.pathname.startsWith("/healthcare-professionals"))}>
          <span className="text-lg">👩🏾‍⚕️</span>
          <span>Healthcare Professionals</span>
        </Link>

        <Link
          to="/emergency"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            location.pathname.startsWith("/emergency")
              ? "bg-red-500 text-white shadow-md"
              : "text-gray-700 hover:bg-red-50 hover:text-red-700"
          }`}
        >
          <span className="text-lg">🚨</span>
          <span>Emergency Assistance</span>
        </Link>

        <Link to="/appointments" className={linkClass(location.pathname.startsWith("/appointments"))}>
          <span className="text-lg">📅</span>
          <span>Appointments</span>
        </Link>

        <Link to="/notifications" className={linkClass(location.pathname.startsWith("/notifications"))}>
          <span className="text-lg">🔔</span>
          <span>Reminders & Notifications</span>
        </Link>

        <Link
          to="/premium"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            location.pathname.startsWith("/premium")
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
              : "text-gray-700 hover:bg-white/70 hover:text-pink-700"
          }`}
        >
          <span className="text-lg">💎</span>
          <span>Premium</span>
        </Link>

        <Link to="/community" className={linkClass(location.pathname.startsWith("/community"))}>
          <span className="text-lg">👥</span>
          <span>Community</span>
        </Link>

        <Link to="/profile" className={linkClass(isActive("/profile"))}>
          <span className="text-lg">👤</span>
          <span>Profile</span>
        </Link>

        {/* Admins only */}
        {isAdmin ? (
          <>
            <div className="!mt-5 border-t border-pink-200 pt-4">
              <p className="px-4 pb-2 text-xs font-bold uppercase tracking-wide text-purple-500">Administration</p>
            </div>
            <Link
              to="/admin"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                location.pathname.startsWith("/admin")
                  ? "bg-gray-900 text-white shadow-md"
                  : "text-gray-700 hover:bg-white/70 hover:text-gray-900"
              }`}
            >
              <span className="text-lg">⚙️</span>
              <span>Admin Panel</span>
            </Link>
          </>
        ) : null}
      </nav>

      {/* Logout */}
      <div className="shrink-0 border-t border-pink-200 bg-white/20 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-white/70 hover:text-red-600"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;