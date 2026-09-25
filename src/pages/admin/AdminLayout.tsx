import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

const TABS = [
  { path: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { path: "/admin/users", label: "Users", icon: "👥" },
  { path: "/admin/appointments", label: "Appointments", icon: "📅" },
  { path: "/admin/professionals", label: "Verifications", icon: "🩺" },
  { path: "/admin/messages", label: "Messages", icon: "✉️" },
  { path: "/admin/payments", label: "Payments", icon: "💳" },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null); // null = still checking

  // Only admins get in — the backend decides, not the browser
  useEffect(() => {
    apiClient
      .get("/users/me")
      .then((res) => setAllowed(res.data.data?.role === "admin"))
      .catch(() => setAllowed(false));
  }, []);

  if (allowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="mb-4 text-5xl">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900">Admins only</h1>
          <p className="mt-3 text-gray-600">This area is restricted to HerBloom administrators.</p>
          <button
            onClick={() => navigate("/period-tracker")}
            className="mt-6 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-700"
          >
            Back to HerBloom
          </button>
        </div>
      </div>
    );
  }

  const isActive = (tab: (typeof TABS)[number]) =>
    tab.exact ? location.pathname === tab.path : location.pathname.startsWith(tab.path);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">⚙️ Admin Panel</h1>
              <p className="text-sm text-gray-500">Manage HerBloom users, professionals and activity.</p>
            </div>
            <Link to="/period-tracker" className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              ← Back to app
            </Link>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive(tab) ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.icon} {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;