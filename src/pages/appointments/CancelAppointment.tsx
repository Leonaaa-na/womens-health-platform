import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Appointment {
  id: number;
  professional: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: "Upcoming" | "Completed" | "Cancelled" | "Missed";
}

function CancelAppointment() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const appointments: Appointment[] = JSON.parse(
      localStorage.getItem("herbloomAppointments") || "[]"
    );

    const found = appointments.find(
      (item) => item.id === Number(id)
    );

    setAppointment(found || null);
  }, [id]);

  const handleCancel = () => {
    const appointments: Appointment[] = JSON.parse(
      localStorage.getItem("herbloomAppointments") || "[]"
    );

    const updatedAppointments = appointments.map((item) =>
      item.id === Number(id)
        ? {
            ...item,
            status: "Cancelled" as const,
          }
        : item
    );

    localStorage.setItem(
      "herbloomAppointments",
      JSON.stringify(updatedAppointments)
    );

    setMessage("Appointment cancelled successfully.");

    setTimeout(() => {
      navigate(`/appointments/${id}`);
    }, 1000);
  };

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-md">
          <div className="mb-3 text-5xl">📅</div>

          <h1 className="text-xl font-bold text-gray-800">
            Appointment not found
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

            <h1 className="text-2xl font-bold text-gray-800">
              Cancel Appointment
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to cancel this appointment?
            </p>
          </div>

          {/* Appointment information */}
          <div className="rounded-xl bg-pink-50 p-4">
            <h2 className="font-bold text-gray-800">
              {appointment.professional}
            </h2>

            <p className="text-sm text-gray-500">
              {appointment.specialty}
            </p>

            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <p>📅 {appointment.date}</p>
              <p>🕐 {appointment.time}</p>
              <p>💬 {appointment.type}</p>
            </div>
          </div>

          {/* Reason */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Reason for cancellation
              <span className="font-normal text-gray-400">
                {" "}
                (optional)
              </span>
            </label>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell us why you are cancelling..."
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
            />
          </div>

          {message && (
            <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
              {message}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            <button
              onClick={() => navigate(`/appointments/${id}`)}
              className="w-full rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-600 hover:bg-gray-50"
            >
              Keep Appointment
            </button>

            <button
              onClick={handleCancel}
              className="w-full rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
            >
              Cancel Appointment
            </button>

          </div>

        </div>

        <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-700">
          💡 Cancelled appointments remain in your appointment history.
        </div>

      </div>
    </div>
  );
}

export default CancelAppointment;