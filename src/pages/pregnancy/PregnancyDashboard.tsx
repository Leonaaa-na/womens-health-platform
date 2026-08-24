import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PregnancyDashboard() {
  const navigate = useNavigate();

  const [dueDate, setDueDate] = useState("");
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    const savedDueDate = localStorage.getItem("pregnancyDueDate");

    if (!savedDueDate) {
      return;
    }

    setDueDate(savedDueDate);

    const due = new Date(savedDueDate);
    const today = new Date();

    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference = due.getTime() - today.getTime();

    const remainingDays = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    const pregnancyLength = 280;
    const daysPregnant = pregnancyLength - remainingDays;

    const calculatedWeek = Math.floor(daysPregnant / 7) + 1;

    setDaysRemaining(Math.max(remainingDays, 0));

    setCurrentWeek(
      Math.min(Math.max(calculatedWeek, 1), 40)
    );
  }, []);

  const progress =
    currentWeek !== null
      ? Math.min((currentWeek / 40) * 100, 100)
      : 0;

  const babyStage =
    currentWeek === null
      ? "Your journey is waiting to begin."
      : currentWeek <= 4
      ? "Early pregnancy"
      : currentWeek <= 12
      ? "First trimester"
      : currentWeek <= 27
      ? "Second trimester"
      : "Third trimester";

  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not set";

  return (
    <div className="min-h-screen bg-pink-50 pb-24">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex max-w-md items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-pink-700">
              HerBloom 🌸
            </h1>

            <p className="text-xs text-gray-500">
              Your pregnancy journey
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/pregnancy-tracker/setup")
            }
            className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600"
          >
            Edit
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Welcome */}
        <section>
          <p className="text-sm text-gray-500">
            Your pregnancy journey 🤍
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            You're doing beautifully.
          </h2>
        </section>

        {/* Pregnancy Progress */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm opacity-80">
                Pregnancy progress
              </p>

              <h2 className="mt-1 text-4xl font-bold">
                {currentWeek
                  ? `Week ${currentWeek}`
                  : "Not set"}
              </h2>

              <p className="mt-2 text-sm opacity-80">
                {babyStage}
              </p>
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <span className="text-4xl">
                🤰🏽
              </span>
            </div>

          </div>

          <div className="mt-6">

            <div className="mb-2 flex justify-between text-xs opacity-80">
              <span>Start</span>
              <span>40 weeks</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/20">

              <div
                className="h-full rounded-full bg-white transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <p className="mt-3 text-center text-sm opacity-80">
              {daysRemaining !== null
                ? `${daysRemaining} days remaining`
                : "Add your due date to begin tracking"}
            </p>

          </div>

        </section>

        {/* Due Date */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-2xl">
              📅
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Expected due date
              </p>

              <h3 className="mt-1 font-bold text-gray-900">
                {formattedDueDate}
              </h3>
            </div>

          </div>

        </section>

        {/* Pregnancy Features */}
        <section>

          <h2 className="mb-3 text-lg font-bold text-gray-900">
            Your pregnancy
          </h2>

          <div className="grid grid-cols-2 gap-3">

            {/* Baby Development */}
            <button
              onClick={() =>
                navigate(
                  "/pregnancy-tracker/baby-development"
                )
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                👶🏽
              </div>

              <h3 className="font-semibold text-gray-900">
                Baby Development
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                See baby's growth
              </p>
            </button>

            {/* Symptoms */}
            <button
              onClick={() =>
                navigate(
                  "/pregnancy-tracker/symptoms"
                )
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                🩺
              </div>

              <h3 className="font-semibold text-gray-900">
                Symptoms
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Track how you feel
              </p>
            </button>

            {/* Nutrition */}
            <button
              onClick={() =>
                navigate(
                  "/pregnancy-tracker/nutrition"
                )
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                🥗
              </div>

              <h3 className="font-semibold text-gray-900">
                Nutrition
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Support your health
              </p>
            </button>

            {/* Appointments */}
            <button
              onClick={() =>
                navigate(
                  "/pregnancy-tracker/appointments"
                )
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                🗓️
              </div>

              <h3 className="font-semibold text-gray-900">
                Appointments
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Keep track of visits
              </p>
            </button>

            {/* Wellness */}
            <button
              onClick={() =>
                navigate(
                  "/pregnancy-tracker/wellness"
                )
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                🌿
              </div>

              <h3 className="font-semibold text-gray-900">
                Wellness
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Healthy habits
              </p>
            </button>

            {/* Notes */}
            <button
              onClick={() =>
                navigate(
                  "/pregnancy-tracker/notes"
                )
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                📝
              </div>

              <h3 className="font-semibold text-gray-900">
                My Notes
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Write your thoughts
              </p>
            </button>

          </div>

        </section>

        {/* Weekly Insight */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-gray-900">
                This week's insight ✨
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                A little reminder for your journey
              </p>
            </div>

            <span className="text-2xl">
              🌸
            </span>

          </div>

          <div className="mt-4 rounded-2xl bg-pink-50 p-4">

            <p className="text-sm leading-6 text-gray-700">
              Every pregnancy journey is different.
              Continue attending your healthcare
              appointments and speak with a qualified
              healthcare professional if you have concerns.
            </p>

          </div>

        </section>

        {/* Back to Period Tracker */}
        <button
          onClick={() =>
            navigate("/period-tracker")
          }
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Go to Period Tracker
        </button>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-md items-center justify-around px-3 py-3">

          <button
            onClick={() =>
              navigate("/pregnancy-tracker")
            }
            className="flex flex-col items-center gap-1 text-xs font-semibold text-pink-600"
          >
            <span className="text-xl">
              🏠
            </span>
            Home
          </button>

          <button
            onClick={() =>
              navigate(
                "/pregnancy-tracker/baby-development"
              )
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              👶🏽
            </span>
            Baby
          </button>

          <button
            onClick={() =>
              navigate(
                "/pregnancy-tracker/appointments"
              )
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              🗓️
            </span>
            Appointments
          </button>

          <button
            onClick={() =>
              navigate(
                "/pregnancy-tracker/symptoms"
              )
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              🩺
            </span>
            Symptoms
          </button>

          <button
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              👤
            </span>
            Profile
          </button>

        </div>

      </nav>

    </div>
  );
}

export default PregnancyDashboard;