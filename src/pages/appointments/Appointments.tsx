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

const demoAppointments: Appointment[] = [
  {
    id: 1,
    professional: "Dr. Ama Mensah",
    specialty: "Obstetrician & Gynaecologist",
    date: "2026-09-18",
    time: "10:00 AM",
    type: "Consultation Chat",
    status: "Upcoming",
  },
  {
    id: 2,
    professional: "Dr. Efua Owusu",
    specialty: "Women's Health Specialist",
    date: "2026-08-10",
    time: "2:00 PM",
    type: "Consultation Chat",
    status: "Completed",
  },
];

function Appointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const savedAppointments =
      localStorage.getItem("herbloomAppointments");

    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch {
        setAppointments(demoAppointments);
      }
    } else {
      setAppointments(demoAppointments);
      localStorage.setItem(
        "herbloomAppointments",
        JSON.stringify(demoAppointments)
      );
    }
  }, []);

  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === "Upcoming"
  );

  const pastAppointments = appointments.filter(
    (appointment) => appointment.status !== "Upcoming"
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusStyle = (status: Appointment["status"]) => {
    switch (status) {
      case "Upcoming":
        return "bg-pink-100 text-pink-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-gray-100 text-gray-600";

      case "Missed":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 pb-10">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex max-w-md items-center gap-3">

          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-lg"
            aria-label="Go back"
          >
            ←
          </button>

          <div>
            <h1 className="text-xl font-bold text-pink-700">
              Appointments 📅
            </h1>

            <p className="text-xs text-gray-500">
              Manage your healthcare appointments
            </p>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Welcome Card */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-3xl">
              📅
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Your appointments
              </h2>

              <p className="mt-2 text-sm leading-6 opacity-90">
                Keep track of upcoming consultations and
                review your previous appointments.
              </p>
            </div>

          </div>

        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-3">

          <button
            onClick={() =>
              navigate("/appointments/book")
            }
            className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 text-xl">
              ➕
            </div>

            <h3 className="font-bold text-gray-900">
              Book Appointment
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Schedule a consultation
            </p>
          </button>

          <button
            onClick={() =>
              navigate("/appointments/history")
            }
            className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-xl">
              📜
            </div>

            <h3 className="font-bold text-gray-900">
              Appointment History
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View your past appointments
            </p>
          </button>

        </section>

        {/* Upcoming Appointments */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Upcoming
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your scheduled appointments
              </p>
            </div>

            <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
              {upcomingAppointments.length}
            </span>

          </div>

          {upcomingAppointments.length === 0 ? (

            <div className="mt-5 rounded-2xl bg-pink-50 p-5 text-center">

              <div className="text-3xl">
                📅
              </div>

              <h3 className="mt-2 font-semibold text-gray-900">
                No upcoming appointments
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Book an appointment with a healthcare
                professional when you need one.
              </p>

              <button
                onClick={() =>
                  navigate("/appointments/book")
                }
                className="mt-4 rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Book Appointment
              </button>

            </div>

          ) : (

            <div className="mt-4 space-y-3">

              {upcomingAppointments.map((appointment) => (

                <div
                  key={appointment.id}
                  className="rounded-2xl border border-pink-100 bg-pink-50 p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl">
                        👩🏾‍⚕️
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {appointment.professional}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {appointment.specialty}
                        </p>
                      </div>

                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusStyle(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-400">
                        Date
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {formatDate(appointment.date)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-400">
                        Time
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {appointment.time}
                      </p>
                    </div>

                  </div>

                  <div className="mt-3 flex items-center justify-between">

                    <span className="text-xs text-gray-500">
                      💬 {appointment.type}
                    </span>

                    <button
                      onClick={() =>
                        navigate(
                          `/appointments/${appointment.id}`
                        )
                      }
                      className="text-sm font-semibold text-pink-600"
                    >
                      View Details →
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* Recent Appointment */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest appointment activity
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/appointments/history")
              }
              className="text-sm font-semibold text-pink-600"
            >
              View All
            </button>

          </div>

          {pastAppointments.length === 0 ? (

            <p className="mt-5 rounded-2xl bg-gray-50 p-4 text-center text-sm text-gray-500">
              No previous appointments yet.
            </p>

          ) : (

            <div className="mt-4 space-y-3">

              {pastAppointments
                .slice(0, 2)
                .map((appointment) => (

                  <div
                    key={appointment.id}
                    className="flex items-center justify-between rounded-2xl bg-gray-50 p-4"
                  >

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {appointment.professional}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(appointment.date)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusStyle(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>

                  </div>

                ))}

            </div>

          )}

        </section>

        {/* Information */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg">
              💡
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Keep your appointments up to date
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-500">
                Completed, cancelled and missed appointments
                remain in your history so you can review your
                previous healthcare activity.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Appointments;