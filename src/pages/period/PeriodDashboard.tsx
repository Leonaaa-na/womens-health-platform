import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CycleCalendar from "../../components/CycleCalendar";

function PeriodDashboard() {
  const navigate = useNavigate();

  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [daysUntilPeriod, setDaysUntilPeriod] = useState<number | null>(
    null
  );

  const savedStartDate =
    localStorage.getItem("periodStartDate") || "";

  const savedCycleLength = Number(
    localStorage.getItem("cycleLength") || 28
  );

  const savedPeriodLength = Number(
    localStorage.getItem("periodLength") || 5
  );

  useEffect(() => {
    if (!savedStartDate || !savedCycleLength) {
      return;
    }

    const startDate = new Date(savedStartDate);
    const today = new Date();

    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const differenceInMilliseconds =
      today.getTime() - startDate.getTime();

    const differenceInDays = Math.floor(
      differenceInMilliseconds /
        (1000 * 60 * 60 * 24)
    );

    const currentCycleDay =
      (differenceInDays % savedCycleLength) + 1;

    const daysRemaining =
      savedCycleLength - currentCycleDay + 1;

    setCycleDay(currentCycleDay);
    setDaysUntilPeriod(daysRemaining);
  }, [savedStartDate, savedCycleLength]);

  return (
    <div className="min-h-screen bg-pink-50 pb-24 md:pb-0">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8">
        <div className="mx-auto flex max-w-md items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-pink-700">
              HerBloom 🌸
            </h1>

            <p className="text-xs text-gray-500">
              Her health. Her journey. Her bloom.
            </p>
          </div>

          <button
            type="button"
            className="rounded-full bg-pink-50 p-3 text-lg"
            aria-label="Notifications"
          >
            🔔
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Welcome */}
        <section>
          <p className="text-sm text-gray-500">
            Good morning 🌷
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            How are you feeling today?
          </h2>
        </section>

        {/* Cycle Card */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm opacity-80">
                Your current cycle
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                {cycleDay
                  ? `Day ${cycleDay}`
                  : "Set up your cycle"}
              </h2>
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <span className="text-3xl">
                🌸
              </span>
            </div>

          </div>

          <div className="mt-6 rounded-2xl bg-white/10 p-4">

            <p className="text-sm opacity-80">
              Estimated next period
            </p>

            <p className="mt-1 text-lg font-semibold">
              {daysUntilPeriod !== null
                ? `In ${daysUntilPeriod} days`
                : "Complete your cycle setup"}
            </p>

          </div>

        </section>

        {/* Today's Check-in */}
        <section>

          <div className="mb-3 flex items-center justify-between">

            <h2 className="text-lg font-bold text-gray-900">
              Today's check-in
            </h2>

            <button
              type="button"
              onClick={() =>
                navigate("/period-tracker/flow")
              }
              className="text-sm font-semibold text-pink-600"
            >
              View all
            </button>

          </div>

          <div className="grid grid-cols-2 gap-3">

            {/* Flow */}
            <button
              type="button"
              onClick={() =>
                navigate("/period-tracker/flow")
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                🩸
              </div>

              <h3 className="font-semibold text-gray-900">
                Flow
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Log your flow
              </p>
            </button>

            {/* Symptoms */}
            <button
              type="button"
              onClick={() =>
                navigate("/period-tracker/symptoms")
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                📝
              </div>

              <h3 className="font-semibold text-gray-900">
                Symptoms
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                How are you feeling?
              </p>
            </button>

            {/* Mood */}
            <button
              type="button"
              onClick={() =>
                navigate("/period-tracker/symptoms")
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                😊
              </div>

              <h3 className="font-semibold text-gray-900">
                Mood
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Track your mood
              </p>
            </button>

            {/* Stress */}
            <button
              type="button"
              onClick={() =>
                navigate("/period-tracker/symptoms")
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                🌿
              </div>

              <h3 className="font-semibold text-gray-900">
                Stress
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Check your stress
              </p>
            </button>

            {/* Medication */}
            <button
              type="button"
              onClick={() =>
                navigate("/period-tracker/medication")
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                💊
              </div>

              <h3 className="font-semibold text-gray-900">
                Medication
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Track medication
              </p>
            </button>

            {/* Nutrition */}
            <button
              type="button"
              onClick={() =>
                navigate("/period-tracker/nutrition")
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                🍎
              </div>

              <h3 className="font-semibold text-gray-900">
                Nutrition
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Log your meals
              </p>
            </button>

            {/* Wellness */}
            <button
              type="button"
              onClick={() =>
                navigate("/period-tracker/wellness")
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
                Hydration & movement
              </p>
            </button>

            {/* Notes */}
            <button
              type="button"
              onClick={() =>
                navigate("/period-tracker/notes")
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
                📖
              </div>

              <h3 className="font-semibold text-gray-900">
                My Notes
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Write down your thoughts
              </p>
            </button>

          </div>

        </section>

        {/* Cycle Calendar */}
        <CycleCalendar
          startDate={savedStartDate}
          cycleLength={savedCycleLength}
          periodLength={savedPeriodLength}
        />

        {/* Reports & Insights */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-gray-900">
                Your insights 📊
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Understand your cycle better
              </p>
            </div>

            <span className="text-2xl">
              ✨
            </span>

          </div>

          <div className="mt-4 rounded-2xl bg-pink-50 p-4">

            <p className="text-sm leading-6 text-gray-700">
              As you continue tracking your cycles,
              HerBloom will identify patterns and provide
              personalized insights.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/period-tracker/reports")
            }
            className="mt-4 w-full rounded-xl bg-pink-600 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
          >
            View cycle reports
          </button>

        </section>

        {/* Partner Sharing */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-2xl">
                🤝
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Partner Sharing
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Share selected cycle updates
                </p>
              </div>

            </div>

          </div>

          <div className="mt-4 rounded-2xl bg-purple-50 p-4">

            <p className="text-sm leading-6 text-gray-700">
              Choose what you want to share with someone
              you trust while keeping control of your
              personal information.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/period-tracker/partner-sharing")
            }
            className="mt-4 w-full rounded-xl border border-purple-200 bg-white py-3 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
          >
            Manage Partner Sharing
          </button>

        </section>

      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">

        <div className="mx-auto flex max-w-md items-center justify-around px-3 py-3">

          <button
            type="button"
            onClick={() =>
              navigate("/period-tracker")
            }
            className="flex flex-col items-center gap-1 text-xs font-semibold text-pink-600"
          >
            <span className="text-xl">
              🏠
            </span>
            Home
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/period-tracker/flow")
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              🩸
            </span>
            Track
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/period-tracker")
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              📅
            </span>
            Calendar
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/period-tracker/reports")
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              📊
            </span>
            Reports
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/profile")
            }
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

export default PeriodDashboard;