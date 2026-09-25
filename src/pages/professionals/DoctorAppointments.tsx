import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfessionalAppointments,
  confirmAppointment,
  declineAppointment,
  completeAppointment,
  toSlotLabel,
  formatDate,
  consultationLabel,
  apiErrorMessage,
  type Appointment,
} from "../../api/appointmentApi";

const TABS = [
  { value: "pending", label: "Pending", icon: "⏳" },
  { value: "confirmed", label: "Confirmed", icon: "✅" },
  { value: "past", label: "Past", icon: "📜" },
];

function DoctorAppointments() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("pending");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [declining, setDeclining] = useState<Appointment | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAppointments(await getProfessionalAppointments(tab));
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not load your appointments."));
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  const accept = async (appt: Appointment) => {
    setBusy(true);
    setMessage("");
    try {
      await confirmAppointment(appt.id);
      setAppointments((prev) => prev.filter((a) => a.id !== appt.id)); // leaves the Pending tab
      setMessage(`Confirmed — ${appt.patient?.name || "the patient"} has been notified.`);
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not confirm that appointment."));
    } finally {
      setBusy(false);
    }
  };

  const submitDecline = async () => {
    if (!declining) return;
    setBusy(true);
    setMessage("");
    try {
      await declineAppointment(declining.id, declineReason.trim());
      setAppointments((prev) => prev.filter((a) => a.id !== declining.id));
      setMessage(`Declined — ${declining.patient?.name || "the patient"} has been asked to pick another time.`);
      setDeclining(null);
      setDeclineReason("");
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not decline that appointment."));
    } finally {
      setBusy(false);
    }
  };

  const markDone = async (appt: Appointment) => {
    if (!window.confirm("Mark this appointment as completed?")) return;
    setBusy(true);
    try {
      await completeAppointment(appt.id);
      setAppointments((prev) => prev.filter((a) => a.id !== appt.id));
      setMessage("Marked as completed.");
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not complete that appointment."));
    } finally {
      setBusy(false);
    }
  };

  const isPast = (a: Appointment) => new Date(a.scheduledAt) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/healthcare-professionals")}
            className="mb-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-2xl">📅</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-sm text-gray-600">Review appointment requests from your patients.</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                tab === t.value ? "bg-pink-600 text-white shadow" : "bg-white text-gray-600 shadow-sm hover:bg-pink-50"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {message ? <div className="mb-5 rounded-xl bg-pink-50 p-4 text-sm font-medium text-pink-700">{message}</div> : null}

        {/* List */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">{tab === "pending" ? "🎉" : "📅"}</div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              {tab === "pending" ? "No requests waiting" : tab === "confirmed" ? "No confirmed appointments" : "Nothing in your history yet"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {tab === "pending" ? "You're all caught up. New requests will appear here." : "Appointments will show here once patients book with you."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((a) => (
              <div key={a.id} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{a.patient?.name || "Patient"}</h3>
                      {a.status === "rescheduled" ? (
                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">Rescheduled</span>
                      ) : null}
                      {isPast(a) && tab !== "past" ? (
                        <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">Time has passed</span>
                      ) : null}
                    </div>

                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p>📅 {formatDate(a.scheduledAt, "long")}</p>
                      <p>🕐 {toSlotLabel(a.scheduledAt)} · {a.durationMinutes} minutes</p>
                      <p>💬 {consultationLabel(a)}</p>
                      {a.location ? <p>📍 {a.location}</p> : null}
                      {a.patient?.email ? <p className="text-xs text-gray-400">{a.patient.email}</p> : null}
                    </div>

                    {a.declineReason ? (
                      <p className="mt-3 rounded-lg bg-orange-50 p-3 text-sm text-orange-700">You declined: {a.declineReason}</p>
                    ) : null}
                    {a.cancellationReason ? (
                      <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">Cancelled: {a.cancellationReason}</p>
                    ) : null}
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-col gap-2 sm:w-44">
                    {tab === "pending" ? (
                      <>
                        <button
                          onClick={() => accept(a)}
                          disabled={busy}
                          className="rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => {
                            setDeclining(a);
                            setDeclineReason("");
                          }}
                          disabled={busy}
                          className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          ✕ Decline
                        </button>
                      </>
                    ) : null}

                    {tab === "confirmed" ? (
                      <button
                        onClick={() => markDone(a)}
                        disabled={busy}
                        className="rounded-xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-60"
                      >
                        Mark completed
                      </button>
                    ) : null}

                    {a.professionalId ? (
                      <button
                        onClick={() => navigate(`/healthcare-professionals/${a.professionalId}/chat`)}
                        className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        💬 Messages
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Decline dialog */}
        {declining ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900">Decline this appointment?</h2>
              <p className="mt-2 text-sm text-gray-600">
                {declining.patient?.name || "The patient"} will be asked to pick another time, and will see your reason.
              </p>

              <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                <p>📅 {formatDate(declining.scheduledAt, "long")}</p>
                <p>🕐 {toSlotLabel(declining.scheduledAt)}</p>
              </div>

              <label className="mt-5 block text-sm font-semibold text-gray-700">
                Reason <span className="font-normal text-gray-400">(optional, but helpful)</span>
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows={3}
                placeholder="e.g. I'm in theatre that morning — any afternoon this week works"
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
              />

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setDeclining(null)}
                  className="flex-1 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Keep it
                </button>
                <button
                  onClick={submitDecline}
                  disabled={busy}
                  className="flex-1 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {busy ? "Declining..." : "Decline"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DoctorAppointments;