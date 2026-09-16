import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: number;
  professional: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: "Upcoming" | "Completed" | "Cancelled" | "Missed";
}

function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const savedAppointments = JSON.parse(
      localStorage.getItem("herbloomAppointments") || "[]"
    );

    setAppointments(savedAppointments);
  }, []);

  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === "Upcoming"
  );

  const pastAppointments = appointments.filter(
    (appointment) => appointment.status !== "Upcoming"
  );

  const formatDate = (date: string) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GH", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/appointments")}
              className="mb-3 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              ← Back
            </button>

            <h1 className="text-3xl font-bold text-gray-800">
              My Appointments
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your upcoming and previous appointments.
            </p>
          </div>

          <button
            onClick={() => navigate("/appointments/book")}
            className="hidden rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-md sm:block"
          >
            + Book Appointment
          </button>
        </div>

        {/* Upcoming */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              📅 Upcoming
            </h2>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              {upcomingAppointments.length}
            </span>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-md">
              <div className="mb-3 text-5xl">📅</div>

              <h3 className="font-bold text-gray-800">
                No upcoming appointments
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Book an appointment with a healthcare professional.
              </p>

              <button
                onClick={() => navigate("/appointments/book")}
                className="mt-5 rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-600"
              >
                Book Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-2xl bg-white p-5 shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Upcoming
                      </span>

                      <h3 className="mt-3 text-lg font-bold text-gray-800">
                        {appointment.professional}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {appointment.specialty}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                        <span>📅 {formatDate(appointment.date)}</span>
                        <span>🕐 {appointment.time}</span>
                        <span>💬 {appointment.type}</span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/appointments/${appointment.id}`)
                      }
                      className="rounded-xl border border-pink-200 px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-50"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              📜 Past Appointments
            </h2>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              {pastAppointments.length}
            </span>
          </div>

          {pastAppointments.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-md">
              <div className="mb-3 text-4xl">📜</div>

              <h3 className="font-bold text-gray-800">
                No past appointments
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Your completed, cancelled, or missed appointments will appear
                here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                          {appointment.status}
                        </span>
                      </div>

                      <h3 className="mt-3 font-bold text-gray-800">
                        {appointment.professional}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {appointment.specialty}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                        <span>📅 {formatDate(appointment.date)}</span>
                        <span>🕐 {appointment.time}</span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/appointments/${appointment.id}`)
                      }
                      className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Mobile booking button */}
        <button
          onClick={() => navigate("/appointments/book")}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 font-semibold text-white shadow-md sm:hidden"
        >
          + Book Appointment
        </button>

      </div>
    </div>
  );
}

export default MyAppointments;