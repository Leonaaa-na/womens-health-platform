import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats, formatGhs, type AdminStats } from "../../api/adminApi";

function StatCard({ label, value, hint, accent = "bg-white" }: { label: string; value: string | number; hint?: string; accent?: string }) {
  return (
    <div className={`rounded-2xl ${accent} p-5 shadow-sm`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError("Could not load statistics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    );
  }

  if (error || !stats) return <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>;

  const maxSignups = Math.max(...stats.signupsChart.map((d) => d.count), 1);

  return (
    <div className="space-y-8">

      {/* Things needing attention */}
      {stats.professionals.pendingVerifications > 0 || stats.messages.new > 0 ? (
        <div className="flex flex-wrap gap-3">
          {stats.professionals.pendingVerifications > 0 ? (
            <Link to="/admin/professionals" className="rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-3 text-sm font-semibold text-yellow-800 hover:bg-yellow-100">
              🩺 {stats.professionals.pendingVerifications} professional{stats.professionals.pendingVerifications === 1 ? "" : "s"} waiting for verification →
            </Link>
          ) : null}
          {stats.messages.new > 0 ? (
            <Link to="/admin/messages" className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-800 hover:bg-blue-100">
              ✉️ {stats.messages.new} unread message{stats.messages.new === 1 ? "" : "s"} →
            </Link>
          ) : null}
        </div>
      ) : null}

      {/* Users */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">👥 Users</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total users" value={stats.users.total} />
          <StatCard label="New this week" value={stats.users.newThisWeek} hint="Signed up in the last 7 days" />
          <StatCard label="Active today" value={stats.users.activeToday} hint="Logged in since midnight" />
          <StatCard label="Deactivated" value={stats.users.deactivated} />
        </div>
      </section>

      {/* Premium & money */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">💎 Premium & Revenue</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Premium members" value={stats.premium.active} hint={`${stats.premium.conversionRate}% of all users`} accent="bg-gradient-to-br from-pink-50 to-purple-50" />
          <StatCard label="Ending within 7 days" value={stats.premium.expiringSoon} />
          <StatCard label="Revenue this month" value={formatGhs(stats.revenue.thisMonth)} accent="bg-green-50" />
          <StatCard label="Revenue all time" value={formatGhs(stats.revenue.total)} hint={`${stats.revenue.successfulPayments} successful payments`} />
        </div>
      </section>

      {/* Activity */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-900">📈 Activity</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Appointments" value={stats.activity.appointments} hint={`${stats.activity.upcomingAppointments} upcoming`} />
          <StatCard label="Consultations" value={stats.activity.consultations} hint="Chat threads" />
          <StatCard label="Community posts" value={stats.activity.posts} />
          <StatCard label="Active reminders" value={stats.activity.activeReminders} />
          <StatCard label="Professionals" value={stats.professionals.total} hint={`${stats.professionals.pendingVerifications} pending`} />
        </div>
      </section>

      {/* Sign-ups chart */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Sign-ups — last 30 days</h2>
        <div className="mt-6 flex h-40 items-end gap-1">
          {stats.signupsChart.map((d) => (
            <div key={d.day} className="group relative flex-1">
              <div
                className="w-full rounded-t bg-pink-400 transition hover:bg-pink-600"
                style={{ height: `${Math.max((d.count / maxSignups) * 140, d.count ? 6 : 2)}px` }}
              />
              <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                {d.day}: {d.count}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          <span>{stats.signupsChart[0]?.day}</span>
          <span>Today</span>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;