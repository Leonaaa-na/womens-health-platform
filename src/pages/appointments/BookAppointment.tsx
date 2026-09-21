import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProfessionals, type Professional } from "../../api/professionalApi";
import {
  bookAppointment,
  getBookedSlots,
  apiErrorMessage,
  CONSULTATION_TYPES,
  AVAILABLE_TIMES,
  to24h,
} from "../../api/appointmentApi";

const todayInput = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function BookAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [professionalId, setProfessionalId] = useState(searchParams.get("professionalId") || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [consultationType, setConsultationType] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getProfessionals();
        setProfessionals(list.professionals.filter((p) => p.isAvailable));
      } catch {
        setMessage("Could not load professionals.");
      }
    };
    load();
  }, []);

  // When professional + date are chosen, grey out slots already taken
  useEffect(() => {
    const loadSlots = async () => {
      if (!professionalId || !date) {
        setBookedSlots([]);
        return;
      }
      try {
        setBookedSlots(await getBookedSlots(professionalId, date));
      } catch {
        setBookedSlots([]);
      }
    };
    loadSlots();
  }, [professionalId, date]);

  const selectedProfessional = professionals.find((p) => p.id === professionalId);

  // Times already gone today can't be picked
  const isPastSlot = (slot: string) => date === todayInput() && new Date(`${date}T${to24h(slot)}:00`) < new Date();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!professionalId || !date || !time || !consultationType) {
      setMessage("Please complete all appointment details.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const appt = await bookAppointment({ professionalId, date, time, consultationType });
      setMessage("Appointment requested! The professional will confirm it soon.");
      setTimeout(() => navigate(`/appointments/${appt.id}`), 900);
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not book this appointment."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/appointments")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            ← Back
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
            <p className="text-sm text-gray-500">Her health. Her journey. Her bloom.</p>
          </div>
        </div>

        {/* Intro */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white shadow-lg">
          <h2 className="text-xl font-bold">Schedule your consultation 🌸</h2>
          <p className="mt-2 text-sm text-pink-50">
            Choose a healthcare professional, select a suitable date and time, and choose how you would like to consult.
          </p>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-md">

          {/* Professional */}
          <div className="mb-5">
            <label htmlFor="professional" className="mb-2 block text-sm font-semibold text-gray-700">
              👩🏾‍⚕️ Choose Professional
            </label>
            <select
              id="professional"
              value={professionalId}
              onChange={(e) => {
                setProfessionalId(e.target.value);
                setTime("");
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            >
              <option value="">Select a professional</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.specialty}
                </option>
              ))}
            </select>
          </div>

          {selectedProfessional ? (
            <div className="mb-5 rounded-xl bg-pink-50 p-4">
              <p className="text-sm font-semibold text-pink-700">Selected Professional</p>
              <p className="mt-1 font-bold text-gray-800">{selectedProfessional.name}</p>
              <p className="text-sm text-gray-600">{selectedProfessional.specialty}</p>
              {selectedProfessional.hospital ? (
                <p className="mt-1 text-xs text-gray-500">🏥 {selectedProfessional.hospital}</p>
              ) : null}
            </div>
          ) : null}

          {/* Date */}
          <div className="mb-5">
            <label htmlFor="appointment-date" className="mb-2 block text-sm font-semibold text-gray-700">
              📅 Choose Date
            </label>
            <input
              id="appointment-date"
              type="date"
              value={date}
              min={todayInput()}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          {/* Time */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-gray-700">🕐 Choose Time</label>
            {!professionalId || !date ? (
              <p className="rounded-xl bg-gray-50 p-3 text-sm text-gray-500">Pick a professional and a date first.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {AVAILABLE_TIMES.map((slot) => {
                  const taken = bookedSlots.includes(slot);
                  const past = isPastSlot(slot);
                  const disabled = taken || past;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={disabled}
                      onClick={() => setTime(slot)}
                      className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
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
            )}
          </div>

          {/* Consultation Type */}
          <div className="mb-5">
            <label htmlFor="consultation-type" className="mb-2 block text-sm font-semibold text-gray-700">
              💬 Consultation Type
            </label>
            <select
              id="consultation-type"
              value={consultationType}
              onChange={(e) => setConsultationType(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            >
              <option value="">Select consultation type</option>
              {CONSULTATION_TYPES.map((c) => (
                <option key={c.label} value={c.label}>{c.label}</option>
              ))}
            </select>
          </div>

          {message ? (
            <div className="mb-5 rounded-xl bg-pink-50 p-4 text-center text-sm font-medium text-pink-700">{message}</div>
          ) : null}

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/appointments")}
              className="w-full rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Booking..." : "📅 Book Appointment"}
            </button>
          </div>
        </form>

        <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50 p-4 text-center text-xs text-gray-600">
          Greyed-out times are already booked. After booking, you'll get a notification when the professional confirms,
          and a reminder the day before.
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;