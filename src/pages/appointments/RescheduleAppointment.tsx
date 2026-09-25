import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAppointment,
  rescheduleAppointment,
  getBookedSlots,
  uiStatus,
  professionalName,
  specialtyOf,
  consultationLabel,
  needsNewTime,
  toSlotLabel,
  toDateInput,
  to24h,
  apiErrorMessage,
  AVAILABLE_TIMES,
  type Appointment,
} from "../../api/appointmentApi";

const todayInput = () => toDateInput(new Date().toISOString());

function RescheduleAppointment() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const found = await getAppointment(id);
        setAppointment(found);
        setDate(toDateInput(found.scheduledAt));
        // A declined appointment needs a NEW time, so don't pre-select the old one
        setTime(needsNewTime(found) ? "" : toSlotLabel(found.scheduledAt));
      } catch {
        setAppointment(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Grey out slots the professional already has booked on the chosen day
  useEffect(() => {
    const loadSlots = async () => {
      if (!appointment?.professionalId || !date) {
        setBookedSlots([]);
        return;
      }
      try {
        const taken = await getBookedSlots(appointment.professionalId, date);
        // Your own current slot doesn't count as taken — unless it was declined
        const own =
          !needsNewTime(appointment) && toDateInput(appointment.scheduledAt) === date
            ? toSlotLabel(appointment.scheduledAt)
            : null;
        setBookedSlots(taken.filter((slot) => slot !== own));
      } catch {
        setBookedSlots([]);
      }
    };
    loadSlots();
  }, [appointment, date]);

  const isPastSlot = (slot: string) => date === todayInput() && new Date(`${date}T${to24h(slot)}:00`) < new Date();

  const handleReschedule = async () => {
    if (!id || !date || !time) {
      setMessage("Please select a date and time.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await rescheduleAppointment(id, date, time);
      setMessage("New time sent! The professional will confirm it shortly.");
      setTimeout(() => navigate(`/appointments/${id}`), 900);
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not reschedule this appointment."));
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

  // Upcoming appointments can be moved; declined ones must be
  const canReschedule = appointment && ["Upcoming", "Declined"].includes(uiStatus(appointment));

  if (!canReschedule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-md">
          <div className="mb-3 text-5xl">📅</div>
          <h1 className="text-xl font-bold text-gray-800">
            {appointment ? "This appointment can no longer be rescheduled" : "Appointment not found"}
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
          <h1 className="text-3xl font-bold text-gray-800">
            {declined ? "🕐 Pick another time" : "✏️ Reschedule Appointment"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {declined
              ? "The professional isn't available at your original time. Choose one that works for both of you."
              : "Choose a new date and time for your appointment."}
          </p>

          {/* Why it was declined */}
          {declined && appointment?.declineReason ? (
            <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Their message</p>
              <p className="mt-1 text-sm italic text-orange-800">"{appointment.declineReason}"</p>
            </div>
          ) : null}

          <div className="mt-6 rounded-xl bg-pink-50 p-4">
            <h2 className="font-bold text-gray-800">{professionalName(appointment as Appointment)}</h2>
            <p className="text-sm text-gray-500">{specialtyOf(appointment as Appointment)}</p>
            <p className="mt-2 text-sm text-gray-600">💬 {consultationLabel(appointment as Appointment)}</p>
            <p className="mt-2 text-xs text-gray-500">
              Originally: {toSlotLabel((appointment as Appointment).scheduledAt)} on{" "}
              {new Date((appointment as Appointment).scheduledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>

          {/* Date */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">New Date</label>
            <input
              type="date"
              value={date}
              min={todayInput()}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
            />
          </div>

          {/* Time */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-700">New Time</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {AVAILABLE_TIMES.map((slot) => {
                const disabled = bookedSlots.includes(slot) || isPastSlot(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={disabled}
                    onClick={() => setTime(slot)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium ${
                      time === slot
                        ? "border-pink-500 bg-pink-500 text-white"
                        : disabled
                        ? "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-300 line-through"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-pink-50"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-gray-400">Greyed-out times are already booked.</p>
          </div>

          {message ? (
            <div className="mt-5 rounded-xl bg-pink-50 p-4 text-sm font-medium text-pink-700">{message}</div>
          ) : null}

          <button
            onClick={handleReschedule}
            disabled={saving || !time}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : declined ? "Send new time" : "Confirm Reschedule"}
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-700">
          💡 The professional is notified of the new time and will confirm it. The change is recorded in the appointment's activity.
        </div>
      </div>
    </div>
  );
}

export default RescheduleAppointment;