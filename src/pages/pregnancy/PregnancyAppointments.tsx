import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Appointment = {
  id: number;
  professional: string;
  date: string;
  time: string;
  note: string;
};

function PregnancyAppointments() {
  const navigate = useNavigate();

  const [professional, setProfessional] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");

  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);

  useEffect(() => {
    const savedAppointments = localStorage.getItem(
      "pregnancyAppointments"
    );

    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const saveAppointment = () => {
    if (!professional || !date || !time) {
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now(),
      professional,
      date,
      time,
      note,
    };

    const updatedAppointments = [
      ...appointments,
      newAppointment,
    ];

    setAppointments(updatedAppointments);

    localStorage.setItem(
      "pregnancyAppointments",
      JSON.stringify(updatedAppointments)
    );

    setProfessional("");
    setDate("");
    setTime("");
    setNote("");
  };

  const removeAppointment = (id: number) => {
    const updatedAppointments = appointments.filter(
      (appointment) => appointment.id !== id
    );

    setAppointments(updatedAppointments);

    localStorage.setItem(
      "pregnancyAppointments",
      JSON.stringify(updatedAppointments)
    );
  };

  const formatDate = (appointmentDate: string) => {
    return new Date(
      `${appointmentDate}T00:00:00`
    ).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-pink-50 pb-10">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex max-w-md items-center gap-4">

          <button
            onClick={() =>
              navigate("/pregnancy-tracker")
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-lg text-pink-600"
          >
            ←
          </button>

          <div>
            <h1 className="text-2xl font-bold text-pink-700">
              Appointments 🗓️
            </h1>

            <p className="text-sm text-gray-500">
              Keep track of your healthcare visits
            </p>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">
              🗓️
            </div>

            <div>
              <p className="text-sm opacity-80">
                Pregnancy care
              </p>

              <h2 className="text-2xl font-bold">
                Upcoming visits
              </h2>
            </div>

          </div>

          <p className="mt-4 text-sm leading-6 opacity-90">
            Keep your important pregnancy appointments
            organized in one place.
          </p>

        </section>

        {/* Add Appointment */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="text-lg font-bold text-gray-900">
            Add Appointment
          </h2>

          <div className="mt-4 space-y-4">

            {/* Professional */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Healthcare professional or clinic
              </label>

              <input
                type="text"
                value={professional}
                onChange={(event) =>
                  setProfessional(event.target.value)
                }
                placeholder="e.g. Dr. Mensah or ABC Clinic"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* Time */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Time
              </label>

              <input
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* Note */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Note
              </label>

              <textarea
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
                placeholder="Add a reminder or question..."
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

          </div>

          <button
            onClick={saveAppointment}
            disabled={
              !professional || !date || !time
            }
            className={`mt-5 w-full rounded-xl py-3 font-semibold transition ${
              professional && date && time
                ? "bg-pink-600 text-white hover:bg-pink-700"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            Save Appointment
          </button>

        </section>

        {/* Saved Appointments */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-lg font-bold text-gray-900">
              My Appointments
            </h2>

            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
              {appointments.length}
            </span>

          </div>

          {appointments.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-5 text-center">

              <p className="text-3xl">
                🗓️
              </p>

              <p className="mt-2 text-sm text-gray-500">
                No appointments added yet.
              </p>

            </div>
          ) : (
            <div className="mt-4 space-y-3">

              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-2xl bg-pink-50 p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <h3 className="font-bold text-gray-900">
                        {appointment.professional}
                      </h3>

                      <p className="mt-2 text-sm text-gray-600">
                        📅 {formatDate(appointment.date)}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        🕐 {appointment.time}
                      </p>

                      {appointment.note && (
                        <p className="mt-2 text-sm leading-5 text-gray-500">
                          {appointment.note}
                        </p>
                      )}

                    </div>

                    <button
                      onClick={() =>
                        removeAppointment(
                          appointment.id
                        )
                      }
                      className="rounded-lg px-2 py-1 text-sm font-semibold text-red-500"
                    >
                      Remove
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

            <span className="text-xl">
              🩺
            </span>

            <div>

              <h2 className="font-bold text-gray-900">
                Keep your appointments
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Regular pregnancy care is important.
                Use this tracker as a personal reminder
                and follow the advice of your healthcare
                professional.
              </p>

            </div>

          </div>

        </section>

        {/* Back */}
        <button
          onClick={() =>
            navigate("/pregnancy-tracker")
          }
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Back to Pregnancy Dashboard
        </button>

      </main>

    </div>
  );
}

export default PregnancyAppointments;