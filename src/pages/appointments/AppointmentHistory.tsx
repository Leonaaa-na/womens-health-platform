import { useState } from "react";
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

const demoAppointments: Appointment[] = [
  {
    id: 2,
    professional: "Dr. Efua Owusu",
    specialty: "Women's Health Specialist",
    date: "2026-08-10",
    time: "2:00 PM",
    type: "Consultation Chat",
    status: "Completed",
  },
  {
    id: 3,
    professional: "Dr. Abena Boateng",
    specialty: "Fertility Specialist",
    date: "2026-06-18",
    time: "11:00 AM",
    type: "General Consultation",
    status: "Cancelled",
  },
  {
    id: 4,
    professional: "Dr. Ama Mensah",
    specialty: "Obstetrician & Gynaecologist",
    date: "2026-03-12",
    time: "10:00 AM",
    type: "Follow-up Consultation",
    status: "Missed",
  },
];

function AppointmentHistory() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const savedAppointments: Appointment[] = JSON.parse(
    localStorage.getItem("herbloomAppointments") || "[]"
  );

  const allAppointments = [...demoAppointments, ...savedAppointments];

  const pastAppointments = allAppointments.filter(
    (appointment, index, self) =>
      appointment.status !== "Upcoming" &&
      self.findIndex((item) => item.id === appointment.id) === index
  );

  const now = new Date();

  const filteredAppointments = pastAppointments.filter((appointment) => {
    if (filter === "All") return true;

    const appointmentDate = new Date(`${appointment.date}T00:00:00`);

    if (filter === "This Month") {
      return (
        appointmentDate.getMonth() === now.getMonth() &&
        appointmentDate.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "Last 3 Months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return appointmentDate >= threeMonthsAgo && appointmentDate <= now;
    }

    if (filter === "Last 6 Months") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      return appointmentDate >= sixMonthsAgo && appointmentDate <= now;
    }

    if (filter === "Last Year") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      return appointmentDate >= oneYearAgo && appointmentDate <= now;
    }

    return true;
  });

  const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-GH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const statusStyle = (status: Appointment["status"]) => {
    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-orange-100 text-orange-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">

        <button
          onClick={() => navigate("/appointments")}
          className="mb-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
        >
          ← Back
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            📜 Appointment History
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your completed, cancelled, and missed appointments.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-md">
          <p className="mb-3 text-sm font-semibold text-gray-700">
            Filter by period
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "This Month",
              "Last 3 Months",
              "Last 6 Months",
              "Last Year",
            ].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  filter === option
                    ? "bg-pink-500 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-pink-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {filter}
          </h2>

          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            {filteredAppointments.length} appointment
            {filteredAppointments.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <div className="mb-3 text-5xl">📭</div>

            <h3 className="font-bold text-gray-800">
              No appointments found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              There are no past appointments for this period.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-2xl bg-white p-5 shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
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

        <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm text-purple-700">
          💡 Appointment history is preserved so completed, cancelled, and
          missed appointments are not lost.
        </div>

      </div>
    </div>
  );
}

export default AppointmentHistory;