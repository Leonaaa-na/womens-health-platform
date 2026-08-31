import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="min-h-screen w-64 bg-gray-900 px-5 py-8 text-white">

      {/* HerBloom Brand */}
      <div className="mb-10">
        <Link to="/period-tracker">
          <h2 className="text-2xl font-bold text-pink-400">
            HerBloom
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Her health. Her journey. Her bloom.
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">

        <Link
          to="/period-tracker"
          className="block rounded-lg px-4 py-3 transition hover:bg-gray-800 hover:text-pink-400"
        >
          Period Tracker
        </Link>

        <Link
          to="/pregnancy-tracker"
          className="block rounded-lg px-4 py-3 transition hover:bg-gray-800 hover:text-pink-400"
        >
          Pregnancy Tracker
        </Link>

        <Link
          to="/health-library"
          className="block rounded-lg px-4 py-3 transition hover:bg-gray-800 hover:text-pink-400"
        >
          Health Library
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