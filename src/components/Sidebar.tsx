import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("herbloomUser");
    localStorage.removeItem("herbloomAccessToken");
    localStorage.removeItem("herbloomRefreshToken");

    navigate("/login");
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-pink-200 bg-gradient-to-b from-pink-100 via-fuchsia-50 to-purple-100">

      {/* Brand */}
      <div className="border-b border-pink-200 px-6 py-7">
        <Link to="/period-tracker">
          <h1 className="text-3xl font-bold tracking-tight text-pink-600">
            HerBloom
          </h1>

          <p className="mt-1 text-xs font-medium text-purple-600">
            Her health. Her journey. Her bloom.
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">

        {/* Period Tracker */}
        <Link
          to="/period-tracker"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isActive("/period-tracker")
              ? "bg-pink-500 text-white shadow-md"
              : "text-gray-700 hover:bg-white/70 hover:text-pink-700"
          }`}
        >
          <span className="text-lg">🩸</span>
          <span>Period Tracker</span>
        </Link>

        {/* Pregnancy Tracker */}
        <Link
          to="/pregnancy-tracker"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isActive("/pregnancy-tracker")
              ? "bg-pink-500 text-white shadow-md"
              : "text-gray-700 hover:bg-white/70 hover:text-pink-700"
          }`}
        >
          <span className="text-lg">🤰</span>
          <span>Pregnancy Tracker</span>
        </Link>

        {/* Health Library */}
        <Link
          to="/health-library"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            location.pathname.startsWith("/health-library")
              ? "bg-pink-500 text-white shadow-md"
              : "text-gray-700 hover:bg-white/70 hover:text-pink-700"
          }`}
        >
          <span className="text-lg">📚</span>
          <span>Health Library</span>
        </Link>

        {/* Healthcare Professionals */}
        <Link
          to="/healthcare-professionals"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            location.pathname.startsWith("/healthcare-professionals")
              ? "bg-pink-500 text-white shadow-md"
              : "text-gray-700 hover:bg-white/70 hover:text-pink-700"
          }`}
        >
          <span className="text-lg">👩🏾‍⚕️</span>
          <span>Healthcare Professionals</span>
        </Link>

        {/* Emergency Assistance */}
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

        {/* Appointments */}
        <Link
          to="/appointments"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isActive("/appointments")
              ? "bg-pink-500 text-white shadow-md"
              : "text-gray-700 hover:bg-white/70 hover:text-pink-700"
          }`}
        >
          <span className="text-lg">📅</span>
          <span>Appointments</span>
        </Link>

        {/* Profile */}
        <Link
          to="/profile"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isActive("/profile")
              ? "bg-pink-500 text-white shadow-md"
              : "text-gray-700 hover:bg-white/70 hover:text-pink-700"
          }`}
        >
          <span className="text-lg">👤</span>
          <span>Profile</span>
        </Link>

      </nav>

      {/* Logout */}
      <div className="border-t border-pink-200 p-4">
        <button
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