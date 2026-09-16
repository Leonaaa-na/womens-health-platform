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

function AppointmentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const appointments: Appointment[] = JSON.parse(
    localStorage.getItem("herbloomAppointments") || "[]"
  );

  const appointment = appointments.find(
    (item) => item.id === Number(id)
  );

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

            <h1 className="text-xl font-bold text-gray-800">
              Appointment Not Found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              We couldn't find this appointment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(
    `${appointment.date}T00:00:00`
  ).toLocaleDateString("en-GH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const statusStyles = {
    Upcoming: "bg-green-100 text-green-700",
    Completed: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
    Missed: "bg-orange-100 text-orange-700",
  };

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

          <h1 className="text-3xl font-bold text-gray-800">
            Appointment Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Her health. Her journey. Her bloom.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">

          {/* Top Section */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-pink-100">
                  Healthcare Professional
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {appointment.professional}
                </h2>

                <p className="mt-1 text-sm text-pink-100">
                  {appointment.specialty}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  appointment.status === "Upcoming"
                    ? "bg-white text-green-700"
                    : "bg-white/90 text-gray-700"
                }`}
              >
                {appointment.status}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-5 p-6">

            <div className="rounded-xl bg-pink-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                📅 Date
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {formattedDate}
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                🕐 Time
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {appointment.time}
              </p>
            </div>

            <div className="rounded-xl bg-pink-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                💬 Consultation Type
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {appointment.type}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Appointment Status
              </p>

              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[appointment.status]
                }`}
              >
                {appointment.status}
              </span>
            </div>

            {/* Actions */}
            {appointment.status === "Upcoming" && (
              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <button
                  onClick={() =>
                    navigate(`/appointments/${appointment.id}/reschedule`)
                  }
                  className="rounded-xl border border-pink-200 px-4 py-3 font-semibold text-pink-600 hover:bg-pink-50"
                >
                  ✏️ Reschedule
                </button>

                <button
                  onClick={() =>
                    navigate(`/appointments/${appointment.id}/cancel`)
                  }
                  className="rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 hover:bg-red-50"
                >
                  ❌ Cancel Appointment
                </button>
              </div>
            )}

            {appointment.status === "Completed" && (
              <div className="rounded-xl bg-blue-50 p-4 text-center text-sm text-blue-700">
                This appointment has been completed and is preserved in your
                appointment history.
              </div>
            )}

            {(appointment.status === "Cancelled" ||
              appointment.status === "Missed") && (
              <div className="rounded-xl bg-gray-50 p-4 text-center text-sm text-gray-600">
                This appointment is preserved in your appointment history.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetails;