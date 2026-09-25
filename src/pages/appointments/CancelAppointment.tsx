import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAppointment,
  cancelAppointment,
  uiStatus,
  professionalName,
  specialtyOf,
  consultationLabel,
  needsNewTime,
  toSlotLabel,
  formatDate,
  apiErrorMessage,
  type Appointment,
} from "../../api/appointmentApi";

function CancelAppointment() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

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

  const handleCancel = async () => {
    if (!id) return;
    setSaving(true);
    setMessage("");
    try {
      await cancelAppointment(id, reason.trim());
      setMessage("Appointment cancelled successfully.");
      setTimeout(() => navigate(`/appointments/${id}`), 900);
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not cancel this appointment."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    );
  }

  // Upcoming and declined appointments can both be dropped
  const canCancel = appointment && ["Upcoming", "Declined"].includes(uiStatus(appointment));

  if (!canCancel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-md">
          <div className="mb-3 text-5xl">📅</div>
          <h1 className="text-xl font-bold text-gray-800">
            {appointment ? "This appointment can no longer be cancelled" : "Appointment not found"}
          </h1>
          <button
            onClick={() => navigate("/appointments")}
            className="mt-5 rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  const declined = needsNewTime(appointment as Appointment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">

        <button
          onClick={() => navigate(`/appointments/${id}`)}
          className="mb-5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
        >
          ← Back
        </button>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-6 text-center">
            <div className="mb-3 text-5xl">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800">Cancel Appointment</h1>
            <p className="mt-2 text-sm text-gray-500">Are you sure you want to cancel this appointment?</p>
          </div>

          {/* If it was declined, offer the better option first */}
          {declined ? (
            <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-5">
              <p className="text-sm leading-6 text-orange-800">
                This appointment was declined, so you can simply choose another time instead of cancelling it altogether.
              </p>
              <button
                onClick={() => navigate(`/appointments/${id}/reschedule`)}
                className="mt-4 w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
              >
                Pick another time instead →
              </button>
            </div>
          ) : null}

          <div className="rounded-xl bg-pink-50 p-4">
            <h2 className="font-bold text-gray-800">{professionalName(appointment as Appointment)}</h2>
            <p className="text-sm text-gray-500">{specialtyOf(appointment as Appointment)}</p>
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <p>📅 {formatDate((appointment as Appointment).scheduledAt, "long")}</p>
              <p>🕐 {toSlotLabel((appointment as Appointment).scheduledAt)}</p>
              <p>💬 {consultationLabel(appointment as Appointment)}</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Reason for cancellation
              <span className="font-normal text-gray-400"> (optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell us why you are cancelling..."
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
            />
          </div>

          {message ? (
            <div className="mt-5 rounded-xl bg-pink-50 p-4 text-sm font-medium text-pink-700">{message}</div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate(`/appointments/${id}`)}
              className="w-full rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-600 hover:bg-gray-50"
            >
              Keep Appointment
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="w-full rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
            >
              {saving ? "Cancelling..." : "Cancel Appointment"}
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-700">
          💡 Cancelled appointments remain in your appointment history, and the professional is notified.
        </div>
      </div>
    </div>
  );
}

export default CancelAppointment;