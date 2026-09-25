import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyAppointments,
  uiStatus,
  professionalName,
  specialtyOf,
  consultationLabel,
  isAwaitingConfirmation,
  needsNewTime,
  toSlotLabel,
  formatDate,
  statusStyle,
  type Appointment,
} from "../../api/appointmentApi";

function Appointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setAppointments(await getMyAppointments());
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Declined ones need the patient to act, so they sit at the top
  const declined = appointments.filter(needsNewTime);
  const upcomingAppointments = appointments.filter((a) => uiStatus(a) === "Upcoming");
  const pastAppointments = appointments
    .filter((a) => ["Completed", "Cancelled", "Missed"].includes(uiStatus(a)))
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

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
            <h1 className="text-xl font-bold text-pink-700">Appointments 📅</h1>
            <p className="text-xs text-gray-500">Manage your healthcare appointments</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Needs your attention */}
        {declined.length > 0 ? (
          <section className="rounded-3xl border-2 border-orange-200 bg-orange-50 p-5">
            <h2 className="font-bold text-orange-800">⚠️ Please pick another time</h2>
            <p className="mt-1 text-sm text-orange-700">
              {declined.length === 1 ? "A professional isn't available" : `${declined.length} professionals aren't available`} at the time you chose.
            </p>

            <div className="mt-4 space-y-3">
              {declined.map((a) => (
                <div key={a.id} className="rounded-2xl bg-white p-4">
                  <h3 className="font-semibold text-gray-900">{professionalName(a)}</h3>
                  <p className="mt-1 text-xs text-gray-500">{specialtyOf(a)}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    You asked for {formatDate(a.scheduledAt)} at {toSlotLabel(a.scheduledAt)}
                  </p>
                  {a.declineReason ? (
                    <p className="mt-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-700">"{a.declineReason}"</p>
                  ) : null}

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/appointments/${a.id}/reschedule`)}
                      className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600"
                    >
                      Pick another time
                    </button>
                    <button
                      onClick={() => navigate(`/appointments/${a.id}/cancel`)}
                      className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50"
                    >
                      Drop it
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Welcome Card */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-3xl">📅</div>
            <div>
              <h2 className="text-xl font-bold">Your appointments</h2>
              <p className="mt-2 text-sm leading-6 opacity-90">
                Keep track of upcoming consultations and review your previous appointments.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/appointments/book")}
            className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 text-xl">➕</div>
            <h3 className="font-bold text-gray-900">Book Appointment</h3>
            <p className="mt-1 text-sm text-gray-500">Schedule a consultation</p>
          </button>

          <button
            onClick={() => navigate("/appointments/history")}
            className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-xl">📜</div>
            <h3 className="font-bold text-gray-900">Appointment History</h3>
            <p className="mt-1 text-sm text-gray-500">View your past appointments</p>
          </button>
        </section>

        {/* Upcoming */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Upcoming</h2>
              <p className="mt-1 text-sm text-gray-500">Your scheduled appointments</p>
            </div>
            <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
              {upcomingAppointments.length}
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-pink-50 p-5 text-center">
              <div className="text-3xl">📅</div>
              <h3 className="mt-2 font-semibold text-gray-900">No upcoming appointments</h3>
              <p className="mt-1 text-sm text-gray-500">Book an appointment with a healthcare professional when you need one.</p>
              <button
                onClick={() => navigate("/appointments/book")}
                className="mt-4 rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Book Appointment
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {upcomingAppointments.map((a) => (
                <div key={a.id} className="rounded-2xl border border-pink-100 bg-pink-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl">👩🏾‍⚕️</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{professionalName(a)}</h3>
                        <p className="mt-1 text-xs text-gray-500">{specialtyOf(a)}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle("Upcoming")}`}>
                      {isAwaitingConfirmation(a) ? "Pending" : "Confirmed"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-400">Date</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">{formatDate(a.scheduledAt)}</p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-gray-400">Time</p>
                      <p className="mt-1 text-sm font-semibold text-gray-800">{toSlotLabel(a.scheduledAt)}</p>
                    </div>
                  </div>

                  {isAwaitingConfirmation(a) && !a.isPersonal ? (
                    <p className="mt-3 text-xs text-gray-500">⏳ Waiting for the professional to confirm.</p>
                  ) : null}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">💬 {consultationLabel(a)}</span>
                    <button
                      onClick={() => navigate(`/appointments/${a.id}`)}
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

        {/* Recent Activity */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <p className="mt-1 text-sm text-gray-500">Your latest appointment activity</p>
            </div>
            <button onClick={() => navigate("/appointments/history")} className="text-sm font-semibold text-pink-600">
              View All
            </button>
          </div>

          {pastAppointments.length === 0 ? (
            <p className="mt-5 rounded-2xl bg-gray-50 p-4 text-center text-sm text-gray-500">No previous appointments yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {pastAppointments.slice(0, 2).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => navigate(`/appointments/${a.id}`)}
                  className="flex w-full items-center justify-between rounded-2xl bg-gray-50 p-4 text-left"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">{professionalName(a)}</h3>
                    <p className="mt-1 text-xs text-gray-500">{formatDate(a.scheduledAt)}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(uiStatus(a))}`}>
                    {uiStatus(a)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Information */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg">💡</div>
            <div>
              <h2 className="font-bold text-gray-900">How booking works</h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                When you book, the professional confirms or suggests you pick another time. You'll be notified either way, and
                you'll get a reminder the day before.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Appointments;