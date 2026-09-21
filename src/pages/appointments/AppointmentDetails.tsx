import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAppointment,
  uiStatus,
  professionalName,
  specialtyOf,
  consultationLabel,
  isAwaitingConfirmation,
  toSlotLabel,
  formatDate,
  statusStyle,
  type Appointment,
} from "../../api/appointmentApi";

const actionLabel: Record<string, string> = {
  booked: "Appointment booked",
  confirmed: "Confirmed by professional",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
  completed: "Completed",
};

function AppointmentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setAppointment(await getAppointment(id));
      } catch {
        setAppointment(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => navigate("/appointments")}
            className="mb-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
          >
            ← Back to Appointments
          </button>
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <div className="mb-3 text-5xl">📅</div>
            <h1 className="text-xl font-bold text-gray-800">Appointment Not Found</h1>
            <p className="mt-2 text-sm text-gray-500">We couldn't find this appointment.</p>
          </div>
        </div>
      </div>
    );
  }

  const status = uiStatus(appointment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/appointments")}
            className="mb-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            ← Back to Appointments
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Appointment Details</h1>
          <p className="mt-1 text-sm text-gray-500">Her health. Her journey. Her bloom.</p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-md">

          {/* Top Section */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-pink-100">Healthcare Professional</p>
                <h2 className="mt-1 text-2xl font-bold">{professionalName(appointment)}</h2>
                <p className="mt-1 text-sm text-pink-100">{specialtyOf(appointment)}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-700">{status}</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-5 p-6">
            <div className="rounded-xl bg-pink-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">📅 Date</p>
              <p className="mt-1 font-semibold text-gray-800">{formatDate(appointment.scheduledAt, "long")}</p>
            </div>

            <div className="rounded-xl bg-purple-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">🕐 Time</p>
              <p className="mt-1 font-semibold text-gray-800">{toSlotLabel(appointment.scheduledAt)}</p>
            </div>

            <div className="rounded-xl bg-pink-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">💬 Consultation Type</p>
              <p className="mt-1 font-semibold text-gray-800">{consultationLabel(appointment)}</p>
            </div>

            {appointment.location ? (
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">📍 Location</p>
                <p className="mt-1 font-semibold text-gray-800">{appointment.location}</p>
              </div>
            ) : null}

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Appointment Status</p>
              <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(status)}`}>
                {status}
              </span>
              {isAwaitingConfirmation(appointment) ? (
                <p className="mt-2 text-xs text-gray-500">Waiting for the professional to confirm.</p>
              ) : null}
              {appointment.cancellationReason ? (
                <p className="mt-2 text-xs text-gray-500">Reason: {appointment.cancellationReason}</p>
              ) : null}
            </div>

            {/* Actions */}
            {status === "Upcoming" ? (
              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <button
                  onClick={() => navigate(`/appointments/${appointment.id}/reschedule`)}
                  className="rounded-xl border border-pink-200 px-4 py-3 font-semibold text-pink-600 hover:bg-pink-50"
                >
                  ✏️ Reschedule
                </button>
                <button
                  onClick={() => navigate(`/appointments/${appointment.id}/cancel`)}
                  className="rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 hover:bg-red-50"
                >
                  ❌ Cancel Appointment
                </button>
              </div>
            ) : null}

            {appointment.professionalId && status === "Upcoming" ? (
              <button
                onClick={() => navigate(`/healthcare-professionals/${appointment.professionalId}/chat`)}
                className="w-full rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white hover:bg-pink-700"
              >
                💬 Message {professionalName(appointment)}
              </button>
            ) : null}

            {status === "Completed" ? (
              <div className="rounded-xl bg-blue-50 p-4 text-center text-sm text-blue-700">
                This appointment has been completed and is preserved in your appointment history.
              </div>
            ) : null}

            {status === "Cancelled" || status === "Missed" ? (
              <div className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-600">
                This appointment is preserved in your appointment history.
              </div>
            ) : null}

            {/* Timeline */}
            {appointment.history && appointment.history.length > 0 ? (
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Activity</p>
                <div className="mt-3 space-y-3">
                  {appointment.history.map((h) => (
                    <div key={h.id} className="flex items-start gap-3 text-sm">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-pink-500"></span>
                      <div>
                        <p className="font-medium text-gray-800">{actionLabel[h.action] || h.action}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(h.createdAt)} · {toSlotLabel(h.createdAt)}
                          {h.action === "rescheduled" && h.newScheduledAt
                            ? ` → ${formatDate(h.newScheduledAt)} ${toSlotLabel(h.newScheduledAt)}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetails;