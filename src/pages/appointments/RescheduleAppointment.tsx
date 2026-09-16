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

const availableTimes = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

function RescheduleAppointment() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const appointments: Appointment[] = JSON.parse(
      localStorage.getItem("herbloomAppointments") || "[]"
    );

    const found = appointments.find(
      (item) => item.id === Number(id)
    );

    if (found) {
      setAppointment(found);
      setDate(found.date);
      setTime(found.time);
    }
  }, [id]);

  const handleReschedule = () => {
    if (!date || !time) {
      setMessage("Please select a date and time.");
      return;
    }

    const appointments: Appointment[] = JSON.parse(
      localStorage.getItem("herbloomAppointments") || "[]"
    );

    const updatedAppointments = appointments.map((item) =>
      item.id === Number(id)
        ? {
            ...item,
            date,
            time,
            status: "Upcoming" as const,
          }
        : item
    );

    localStorage.setItem(
      "herbloomAppointments",
      JSON.stringify(updatedAppointments)
    );

    setMessage("Appointment successfully rescheduled!");

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

          <h1 className="text-3xl font-bold text-gray-800">
            ✏️ Reschedule Appointment
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Choose a new date and time for your appointment.
          </p>

          {/* Professional */}
          <div className="mt-6 rounded-xl bg-pink-50 p-4">
            <h2 className="font-bold text-gray-800">
              {appointment.professional}
            </h2>

            <p className="text-sm text-gray-500">
              {appointment.specialty}
            </p>

            <p className="mt-2 text-sm text-gray-600">
              💬 {appointment.type}
            </p>
          </div>

          {/* Date */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              New Date
            </label>

            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
            />
          </div>

          {/* Time */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              New Time
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {availableTimes.map((availableTime) => (
                <button
                  key={availableTime}
                  onClick={() => setTime(availableTime)}
                  className={`rounded-xl border px-3 py-3 text-sm font-medium ${
                    time === availableTime
                      ? "border-pink-500 bg-pink-500 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-pink-50"
                  }`}
                >
                  {availableTime}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
              {message}
            </div>
          )}

          {/* Confirm */}
          <button
            onClick={handleReschedule}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 font-semibold text-white shadow-md hover:opacity-90"
          >
            Confirm Reschedule
          </button>

        </div>

        <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-700">
          💡 Your appointment history is preserved. Rescheduling only updates
          the selected upcoming appointment.
        </div>

      </div>
    </div>
  );
}

export default RescheduleAppointment;