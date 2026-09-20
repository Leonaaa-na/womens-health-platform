import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

interface PregnancyData {
  dueDate: string;
  currentWeek: number | null;
  daysRemaining: number | null;
  daysPregnant: number;
  trimester: string;
}

function PregnancyDashboard() {
  const navigate = useNavigate();

  const [pregnancy, setPregnancy] = useState<PregnancyData>({
    dueDate: "",
    currentWeek: null,
    daysRemaining: null,
    daysPregnant: 0,
    trimester: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPregnancy = async () => {
      try {
        const response = await apiClient.get<{
          pregnancy: { dueDate: string; lastMenstrualPeriod: string };
          currentWeek: number;
          trimester: string;
          daysPregnant: number;
          daysUntilDue: number;
        }>("/pregnancy/current");

        if (response.data.success && response.data.data) {
          const d = response.data.data;
          setPregnancy({
            dueDate: d.pregnancy.dueDate,
            currentWeek: d.currentWeek,
            daysRemaining: Math.max(0, d.daysUntilDue),
            daysPregnant: d.daysPregnant,
            trimester: d.trimester,
          });
        }
      } catch {
        // No active pregnancy
      } finally {
        setLoading(false);
      }
    };

    fetchPregnancy();
  }, []);

  const currentWeek = pregnancy.currentWeek;
  const daysRemaining = pregnancy.daysRemaining;
  const dueDate = pregnancy.dueDate;
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="text-gray-600">Loading pregnancy data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 pb-24 md:pb-0">

      {/* =========================
          HEADER
      ========================= */}

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

        {/* =========================
            WELCOME
        ========================= */}

        <section>
          <p className="text-sm text-gray-500">
            Your pregnancy journey 🤍
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            You're doing beautifully.
          </h2>
        </section>

        {/* =========================
            PREGNANCY PROGRESS
        ========================= */}

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

        {/* =========================
            DUE DATE
        ========================= */}

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

        {/* =========================
            PREGNANCY FEATURES
        ========================= */}

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

            {/* Baby Movement */}
            <button
              onClick={() =>
                navigate(
                  "/pregnancy-tracker/baby-movement"
                )
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                👣
              </div>

              <h3 className="font-semibold text-gray-900">
                Baby Movement
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Track baby's movements
              </p>
            </button>

            {/* Contraction Timer */}
            <button
              onClick={() =>
                navigate(
                  "/pregnancy-tracker/contraction-timer"
                )
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                ⏱️
              </div>

              <h3 className="font-semibold text-gray-900">
                Contraction Timer
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Time your contractions
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

            {/* Hospital & Birth Planning */}
            <button
              onClick={() =>
                navigate(
                  "/pregnancy-tracker/hospital-birth-planning"
                )
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                🏥
              </div>

              <h3 className="font-semibold text-gray-900">
                Hospital & Birth Planning
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Plan for birth and hospital needs
              </p>
            </button>

            {/* Pregnancy Education */}
            <button
              onClick={() =>
                navigate(
                  "/pregnancy-tracker/education"
                )
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                📚
              </div>

              <h3 className="font-semibold text-gray-900">
                Pregnancy Education
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Learn about your pregnancy
              </p>
            </button>

            {/* Postpartum Transition */}
            <button
              onClick={() =>
                navigate(
                  "/pregnancy-tracker/postpartum-transition"
                )
              }
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                🌷
              </div>

              <h3 className="font-semibold text-gray-900">
                Postpartum Transition
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Prepare for life after birth
              </p>
            </button>

          </div>

        </section>

        {/* =========================
            WEEKLY INSIGHT
        ========================= */}

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

        {/* =========================
            BACK TO PERIOD TRACKER
        ========================= */}

        <button
          onClick={() =>
            navigate("/period-tracker")
          }
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Go to Period Tracker
        </button>

      </main>

      {/* =========================
          MOBILE BOTTOM NAVIGATION
      ========================= */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">

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
                "/pregnancy-tracker/baby-movement"
              )
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              👣
            </span>
            Movement
          </button>

          <button
            onClick={() =>
              navigate(
                "/pregnancy-tracker/contraction-timer"
              )
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              ⏱️
            </span>
            Timer
          </button>

          <button
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

export default PregnancyDashboard;