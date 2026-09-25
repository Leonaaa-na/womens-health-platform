import { useCallback, useEffect, useState } from "react";
import {
  getAllAppointments,
  uiStatus,
  professionalName,
  consultationLabel,
  toSlotLabel,
  formatDate,
  statusStyle,
  type Appointment,
} from "../../api/appointmentApi";

const FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Awaiting doctor" },
  { value: "confirmed", label: "Confirmed" },
  { value: "declined", label: "Declined" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllAppointments({ status: filter || undefined, page });
      setAppointments(data.appointments);
      setPages(data.pages);
      setTotal(data.total);
    } catch {
      setError("Could not load appointments.");
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">📅 Appointments</h2>
        <p className="text-sm text-gray-500">
          {total} appointments across the platform. Read-only — only the professional can accept or decline.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => {
              setFilter(f.value);
              setPage(1);
            }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filter === f.value ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error ? <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div> : null}

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-4xl">📅</div>
          <p className="mt-3 text-gray-500">No appointments in this list.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-5 py-4">Patient</th>
                <th className="px-5 py-4">Provider</th>
                <th className="px-5 py-4">When</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Note</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => {
                const status = uiStatus(a);
                return (
                  <tr key={a.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{a.patient?.name || "—"}</p>
                      <p className="text-xs text-gray-500">{a.patient?.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-800">{professionalName(a)}</p>
                      <p className="text-xs text-gray-400">{a.isPersonal ? "Personal" : a.professional?.specialty}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(a.scheduledAt)}
                      <span className="block text-xs text-gray-400">{toSlotLabel(a.scheduledAt)}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{consultationLabel(a)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(status)}`}>
                        {a.status === "pending" || a.status === "rescheduled" ? "Awaiting doctor" : status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">
                      {a.declineReason || a.cancellationReason || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-500">Page {page} of {pages}</span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default AdminAppointments;