import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="min-h-screen w-64 bg-gray-900 px-5 py-8 text-white">

      {/* Logo / Title */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-pink-400">
          Women's Health
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Health Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">

        <Link
          to="/dashboard"
          className="block rounded-lg px-4 py-3 transition hover:bg-gray-800 hover:text-pink-400"
        >
          Dashboard
        </Link>

        <Link
          to="/menstrual-health"
          className="block rounded-lg px-4 py-3 transition hover:bg-gray-800 hover:text-pink-400"
        >
          Menstrual Health
        </Link>

        <Link
          to="/pregnancy"
          className="block rounded-lg px-4 py-3 transition hover:bg-gray-800 hover:text-pink-400"
        >
          Pregnancy
        </Link>

        <Link
          to="/health-resources"
          className="block rounded-lg px-4 py-3 transition hover:bg-gray-800 hover:text-pink-400"
        >
          Health Resources
        </Link>

        <Link
          to="/appointments"
          className="block rounded-lg px-4 py-3 transition hover:bg-gray-800 hover:text-pink-400"
        >
          Appointments
        </Link>

        <Link
          to="/profile"
          className="block rounded-lg px-4 py-3 transition hover:bg-gray-800 hover:text-pink-400"
        >
          Profile
        </Link>

      </nav>

      {/* Logout */}
      <div className="mt-10 border-t border-gray-700 pt-6">

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-lg px-4 py-3 text-left text-gray-300 transition hover:bg-gray-800 hover:text-pink-400"
        >
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;