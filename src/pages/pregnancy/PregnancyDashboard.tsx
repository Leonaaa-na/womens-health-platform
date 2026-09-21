import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

interface PregnancyData {
  dueDate: string;
  currentWeek: number | null;
  daysRemaining: number | null;
  daysPregnant: number;
  trimester: number | null;
}

/*
 * Shape of GET /api/pregnancy/current → data
 * (null when there's no active pregnancy)
 */
interface CurrentPregnancy {
  pregnancy: { dueDate: string; lastMenstrualPeriod: string };
  currentWeek: number;
  trimester: number;
  daysPregnant: number;
  daysUntilDue: number;
}

const features = [
  { path: "baby-development", icon: "👶🏽", bg: "bg-pink-100", title: "Baby Development", text: "See baby's growth" },
  { path: "timeline", icon: "🗺️", bg: "bg-purple-100", title: "Pregnancy Timeline", text: "Your journey week by week" },
  { path: "baby-movement", icon: "👣", bg: "bg-pink-100", title: "Baby Movement", text: "Track baby's movements" },
  { path: "contraction-timer", icon: "⏱️", bg: "bg-pink-100", title: "Contraction Timer", text: "Time your contractions" },
  { path: "symptoms", icon: "🩺", bg: "bg-purple-100", title: "Symptoms", text: "Track how you feel" },
  { path: "appointments", icon: "🗓️", bg: "bg-blue-100", title: "Appointments", text: "Keep track of your visits" },
  { path: "nutrition", icon: "🥗", bg: "bg-green-100", title: "Nutrition", text: "Support your health" },
  { path: "wellness", icon: "🌿", bg: "bg-teal-100", title: "Wellness", text: "Healthy habits" },
  { path: "notes", icon: "📝", bg: "bg-rose-100", title: "My Notes", text: "Write your thoughts" },
  { path: "hospital-birth-planning", icon: "🏥", bg: "bg-blue-100", title: "Hospital & Birth Planning", text: "Plan for birth and hospital needs" },
  { path: "education", icon: "📚", bg: "bg-yellow-100", title: "Pregnancy Education", text: "Learn about your pregnancy" },
  { path: "postpartum-transition", icon: "🌷", bg: "bg-pink-100", title: "Postpartum Transition", text: "Prepare for life after birth" },
];

function PregnancyDashboard() {
  const navigate = useNavigate();

  const [pregnancy, setPregnancy] = useState<PregnancyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPregnancy = async () => {
      try {
        const response = await apiClient.get("/pregnancy/current");
        const d: CurrentPregnancy | null = response.data?.data ?? null;

        if (d?.pregnancy) {
          setPregnancy({
            dueDate: d.pregnancy.dueDate,
            // Backend counts from week 0; show at least week 1
            currentWeek: Math.min(Math.max(d.currentWeek, 1), 42),
            daysRemaining: Math.max(0, d.daysUntilDue),
            daysPregnant: d.daysPregnant,
            trimester: d.trimester,
          });
        }
      } catch {
        setPregnancy(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPregnancy();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="text-gray-600">Loading pregnancy data...</p>
      </div>
    );
  }

  const currentWeek = pregnancy?.currentWeek ?? null;
  const progress = currentWeek !== null ? Math.min((currentWeek / 40) * 100, 100) : 0;

  const babyStage =
    currentWeek === null
      ? "Your journey is waiting to begin."
      : currentWeek <= 4
      ? "Early pregnancy"
      : pregnancy?.trimester === 1
      ? "First trimester"
      : pregnancy?.trimester === 2
      ? "Second trimester"
      : "Third trimester";

  const formattedDueDate = pregnancy?.dueDate
    ? new Date(pregnancy.dueDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not set";

  return (
    <div className="min-h-screen bg-pink-50 pb-24 md:pb-0">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-pink-700">HerBloom 🌸</h1>
            <p className="text-xs text-gray-500">Your pregnancy journey</p>
          </div>
          <button
            onClick={() => navigate("/pregnancy-tracker/setup")}
            className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600"
          >
            {pregnancy ? "Edit" : "Set up"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Welcome */}
        <section>
          <p className="text-sm text-gray-500">Your pregnancy journey 🤍</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            {pregnancy ? "You're doing beautifully." : "Welcome to your pregnancy tracker."}
          </h2>
        </section>

        {/* Progress */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Pregnancy progress</p>
              <h2 className="mt-1 text-4xl font-bold">
                {currentWeek ? `Week ${currentWeek}` : "Not set"}
              </h2>
              <p className="mt-2 text-sm opacity-80">{babyStage}</p>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <span className="text-4xl">🤰🏽</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs opacity-80">
              <span>Start</span>
              <span>40 weeks</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-center text-sm opacity-80">
              {pregnancy
                ? `${pregnancy.daysRemaining} days remaining`
                : "Add your due date to begin tracking"}
            </p>
          </div>

          {!pregnancy && (
            <button
              onClick={() => navigate("/pregnancy-tracker/setup")}
              className="mt-4 w-full rounded-xl bg-white py-3 text-sm font-semibold text-pink-600"
            >
              Set up now
            </button>
          )}
        </section>

        {/* Due Date */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-2xl">📅</div>
            <div>
              <p className="text-sm text-gray-500">Expected due date</p>
              <h3 className="mt-1 font-bold text-gray-900">{formattedDueDate}</h3>
            </div>
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="mb-3 text-lg font-bold text-gray-900">Your pregnancy</h2>
          <div className="grid grid-cols-2 gap-3">
            {features.map((f) => (
              <button
                key={f.path}
                onClick={() => navigate(`/pregnancy-tracker/${f.path}`)}
                className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${f.bg}`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{f.text}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Weekly Insight */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">This week's insight ✨</h2>
              <p className="mt-1 text-sm text-gray-500">A little reminder for your journey</p>
            </div>
            <span className="text-2xl">🌸</span>
          </div>
          <div className="mt-4 rounded-2xl bg-pink-50 p-4">
            <p className="text-sm leading-6 text-gray-700">
              Every pregnancy journey is different. Continue attending your healthcare appointments
              and speak with a qualified healthcare professional if you have concerns.
            </p>
          </div>
        </section>

        <button
          onClick={() => navigate("/period-tracker")}
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Go to Period Tracker
        </button>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-3 py-3">
          <button onClick={() => navigate("/pregnancy-tracker")} className="flex flex-col items-center gap-1 text-xs font-semibold text-pink-600">
            <span className="text-xl">🏠</span>Home
          </button>
          <button onClick={() => navigate("/pregnancy-tracker/baby-development")} className="flex flex-col items-center gap-1 text-xs text-gray-400">
            <span className="text-xl">👶🏽</span>Baby
          </button>
          <button onClick={() => navigate("/pregnancy-tracker/baby-movement")} className="flex flex-col items-center gap-1 text-xs text-gray-400">
            <span className="text-xl">👣</span>Movement
          </button>
          <button onClick={() => navigate("/pregnancy-tracker/contraction-timer")} className="flex flex-col items-center gap-1 text-xs text-gray-400">
            <span className="text-xl">⏱️</span>Timer
          </button>
          <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1 text-xs text-gray-400">
            <span className="text-xl">👤</span>Profile
          </button>
        </div>
      </nav>
    </div>
  );
}

export default PregnancyDashboard;