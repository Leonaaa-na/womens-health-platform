import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

type BackendAppointment = {
  id: string;
  providerName: string | null;
  isPersonal: boolean;
  scheduledAt: string;
  status: string;
  notes: string | null;
  reason: string | null;
  professional: { name: string } | null;
};

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

function PregnancyAppointments() {
  const navigate = useNavigate();

  const [professional, setProfessional] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [appointments, setAppointments] = useState<BackendAppointment[]>([]);

  // Pregnancy appointments — personal ones AND any booked through the app
  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get("/appointments?context=pregnancy&status=all");
        const rows: BackendAppointment[] = response.data?.data || [];
        setAppointments(rows.filter((a) => a.status !== "cancelled"));
      } catch {
        setAppointments([]);
      }
    };
    load();
  }, []);

  const saveAppointment = async () => {
    if (!professional.trim() || !date || !time) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await apiClient.post("/appointments/personal", {
        providerName: professional.trim(),
        scheduledAt: `${date}T${time}:00`,
        notes: note.trim() || null,
        context: "pregnancy",
      });

      setAppointments((prev) =>
        [...prev, response.data.data].sort(
          (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
        )
      );

      setProfessional("");
      setDate("");
      setTime("");
      setNote("");
      setMessage("Appointment saved. You'll get a reminder the day before 🗓️");
    } catch (error) {
      setMessage(errorMessage(error, "Could not save appointment."));
    } finally {
      setSaving(false);
    }
  };

  // Personal → delete. Booked with a professional → cancel.
  const removeAppointment = async (appointment: BackendAppointment) => {
    const previous = appointments;
    setAppointments((prev) => prev.filter((a) => a.id !== appointment.id));

    try {
      if (appointment.isPersonal) {
        await apiClient.delete(`/appointments/${appointment.id}`);
      } else {
        await apiClient.put(`/appointments/${appointment.id}/cancel`, { reason: "Cancelled by patient" });
      }
    } catch (error) {
      setAppointments(previous);
      setMessage(errorMessage(error, "Could not remove appointment."));
    }
  };

  const who = (a: BackendAppointment) => a.providerName || a.professional?.name || "Appointment";

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const canSave = !!professional.trim() && !!date && !!time && !saving;

  return (
    <div className="min-h-screen bg-pink-50 pb-10">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex max-w-md items-center gap-4">
          <button
            onClick={() => navigate("/pregnancy-tracker")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-lg text-pink-600"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-pink-700">Appointments 🗓️</h1>
            <p className="text-sm text-gray-500">Keep track of your healthcare visits</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">🗓️</div>
            <div>
              <p className="text-sm opacity-80">Pregnancy care</p>
              <h2 className="text-2xl font-bold">Upcoming visits</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 opacity-90">
            Keep your important pregnancy appointments organized in one place.
          </p>
        </section>

        {/* Add Appointment */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Add Appointment</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Healthcare professional or clinic</label>
              <input
                type="text"
                value={professional}
                onChange={(e) => setProfessional(e.target.value)}
                placeholder="e.g. Dr. Mensah or ABC Clinic"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a reminder or question..."
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
          </div>

          {message && (
            <div className="mt-4 rounded-xl bg-pink-50 p-3 text-center text-sm font-medium text-pink-700">{message}</div>
          )}

          <button
            onClick={saveAppointment}
            disabled={!canSave}
            className={`mt-5 w-full rounded-xl py-3 font-semibold transition ${
              canSave ? "bg-pink-600 text-white hover:bg-pink-700" : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            {saving ? "Saving..." : "Save Appointment"}
          </button>

          <button
            onClick={() => navigate("/professionals")}
            className="mt-3 w-full rounded-xl border border-pink-200 bg-white py-3 text-sm font-semibold text-pink-600"
          >
            Or book a HerBloom professional
          </button>
        </section>

        {/* Saved Appointments */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">My Appointments</h2>
            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
              {appointments.length}
            </span>
          </div>

          {appointments.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-5 text-center">
              <p className="text-3xl">🗓️</p>
              <p className="mt-2 text-sm text-gray-500">No appointments added yet.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="rounded-2xl bg-pink-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{who(appointment)}</h3>
                      {!appointment.isPersonal && (
                        <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-xs font-medium capitalize text-pink-700">
                          Booked · {appointment.status}
                        </span>
                      )}
                      <p className="mt-2 text-sm text-gray-600">📅 {formatDate(appointment.scheduledAt)}</p>
                      <p className="mt-1 text-sm text-gray-600">🕐 {formatTime(appointment.scheduledAt)}</p>
                      {(appointment.notes || appointment.reason) && (
                        <p className="mt-2 text-sm leading-5 text-gray-500">{appointment.notes || appointment.reason}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeAppointment(appointment)}
                      className="rounded-lg px-2 py-1 text-sm font-semibold text-red-500"
                    >
                      {appointment.isPersonal ? "Remove" : "Cancel"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reminder */}
        <section className="rounded-3xl border border-pink-200 bg-pink-50 p-5">
          <div className="flex gap-3">
            <span className="text-xl">🩺</span>
            <div>
              <h2 className="font-bold text-gray-900">Keep your appointments</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Regular pregnancy care is important. Use this tracker as a personal reminder and
                follow the advice of your healthcare professional.
              </p>
            </div>
          </div>
        </section>

        <button
          onClick={() => navigate("/pregnancy-tracker")}
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Back to Pregnancy Dashboard
        </button>
      </main>
    </div>
  );
}

export default PregnancyAppointments;