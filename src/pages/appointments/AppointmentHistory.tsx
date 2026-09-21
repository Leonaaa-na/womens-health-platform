import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyAppointments,
  uiStatus,
  professionalName,
  specialtyOf,
  consultationLabel,
  toSlotLabel,
  formatDate,
  statusStyle,
  type Appointment,
} from "../../api/appointmentApi";

const FILTERS = ["All", "This Month", "Last 3 Months", "Last 6 Months", "Last Year"];

function AppointmentHistory() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setAppointments(await getMyAppointments());
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const now = new Date();

  const pastAppointments = appointments
    .filter((a) => uiStatus(a) !== "Upcoming")
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  const filteredAppointments = pastAppointments.filter((a) => {
    if (filter === "All") return true;
    const d = new Date(a.scheduledAt);

    if (filter === "This Month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }

    const from = new Date();
    if (filter === "Last 3 Months") from.setMonth(now.getMonth() - 3);
    if (filter === "Last 6 Months") from.setMonth(now.getMonth() - 6);
    if (filter === "Last Year") from.setFullYear(now.getFullYear() - 1);
    return d >= from && d <= now;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">

        <button
          onClick={() => navigate("/appointments")}
          className="mb-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
        >
          ← Back
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📜 Appointment History</h1>
          <p className="mt-1 text-sm text-gray-500">View your completed, cancelled, and missed appointments.</p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-md">
          <p className="mb-3 text-sm font-semibold text-gray-700">Filter by period</p>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  filter === option ? "bg-pink-500 text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-pink-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{filter}</h2>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <div className="mb-3 text-5xl">📭</div>
            <h3 className="font-bold text-gray-800">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">There are no past appointments for this period.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((a) => (
              <div key={a.id} className="rounded-2xl bg-white p-5 shadow-md">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(uiStatus(a))}`}>
                      {uiStatus(a)}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-gray-800">{professionalName(a)}</h3>
                    <p className="text-sm text-gray-500">{specialtyOf(a)}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                      <span>📅 {formatDate(a.scheduledAt)}</span>
                      <span>🕐 {toSlotLabel(a.scheduledAt)}</span>
                      <span>💬 {consultationLabel(a)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/appointments/${a.id}`)}
                    className="rounded-xl border border-pink-200 px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-700">
          💡 Appointment history is preserved so completed, cancelled, and missed appointments are not lost.
        </div>
      </div>
    </div>
  );
}

export default AppointmentHistory;