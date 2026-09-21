import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

const mealOptions = [
  "Fruits & vegetables",
  "Whole grains",
  "Protein foods",
  "Dairy or alternatives",
  "Healthy snacks",
];

const WATER_GOAL = 8;

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

function PregnancyNutrition() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [water, setWater] = useState(0);
  const [meals, setMeals] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Today's row — shared with the other daily wellness pages
  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get(`/trackers/wellness?from=${today}&to=${today}`);
        const row = response.data?.data?.[0];
        setWater(row?.waterGlasses || 0);
        setMeals(row?.foodGroups || []);
        setNotes(row?.nutritionNotes || "");
      } catch {
        // Start empty
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [today]);

  const saveToday = (fields: Record<string, unknown>) =>
    apiClient.post("/trackers/wellness", { date: today, context: "pregnancy", ...fields });

  const changeWater = async (change: number) => {
    const previous = water;
    const next = Math.min(Math.max(water + change, 0), WATER_GOAL);
    if (next === previous) return;

    setWater(next);
    try {
      await saveToday({ waterGlasses: next });
    } catch (error) {
      setWater(previous);
      setMessage(errorMessage(error, "Could not update water."));
    }
  };

  const toggleMeal = async (meal: string) => {
    const previous = meals;
    const next = meals.includes(meal) ? meals.filter((m) => m !== meal) : [...meals, meal];

    setMeals(next);
    try {
      await saveToday({ foodGroups: next });
    } catch (error) {
      setMeals(previous);
      setMessage(errorMessage(error, "Could not update food choices."));
    }
  };

  const saveNotes = async () => {
    setMessage("");
    try {
      await saveToday({ nutritionNotes: notes.trim() || null });
      setMessage("Note saved 🌸");
    } catch (error) {
      setMessage(errorMessage(error, "Could not save note."));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 pb-10">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex max-w-md items-center gap-4">
          <button
            onClick={() => navigate("/pregnancy-tracker")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-lg text-pink-600"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-pink-700">Nutrition 🥗</h1>
            <p className="text-sm text-gray-500">Support your pregnancy wellness</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">🥗</div>
            <div>
              <p className="text-sm opacity-80">Today's wellness</p>
              <h2 className="text-2xl font-bold">Nourish yourself</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 opacity-90">
            Keep simple notes about your meals, hydration, and healthy habits.
          </p>
        </section>

        {/* Water Tracker */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Water Intake 💧</h2>
              <p className="mt-1 text-sm text-gray-500">Track your glasses for today</p>
            </div>
            <span className="text-3xl">💧</span>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => changeWater(-1)}
              disabled={water === 0}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-600 disabled:opacity-40"
            >
              −
            </button>
            <div className="text-center">
              <p className="text-4xl font-bold text-pink-600">{water}</p>
              <p className="text-xs text-gray-500">of {WATER_GOAL} glasses</p>
            </div>
            <button
              onClick={() => changeWater(1)}
              disabled={water === WATER_GOAL}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 text-xl font-bold text-pink-600 disabled:opacity-40"
            >
              +
            </button>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-pink-500 transition-all" style={{ width: `${(water / WATER_GOAL) * 100}%` }} />
          </div>
        </section>

        {/* Food Groups */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Today's food choices 🍎</h2>
          <p className="mt-1 text-sm text-gray-500">Select the types of foods you've had today.</p>

          <div className="mt-4 space-y-3">
            {mealOptions.map((meal) => {
              const selected = meals.includes(meal);
              return (
                <button
                  key={meal}
                  onClick={() => toggleMeal(meal)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                    selected ? "border-pink-400 bg-pink-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <span className={`text-sm font-semibold ${selected ? "text-pink-700" : "text-gray-700"}`}>{meal}</span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                      selected ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {selected ? "✓" : "+"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Nutrition Notes */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Nutrition Notes 📝</h2>
          <p className="mt-1 text-sm text-gray-500">Add a personal note about your meals or nutrition today.</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your note here..."
            rows={5}
            className="mt-4 w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm text-gray-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          />

          {message && <p className="mt-3 text-center text-sm font-medium text-pink-700">{message}</p>}

          <button
            onClick={saveNotes}
            className="mt-3 w-full rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700"
          >
            Save Note
          </button>
        </section>

        {/* Reminder */}
        <section className="rounded-3xl border border-pink-200 bg-pink-50 p-5">
          <div className="flex gap-3">
            <span className="text-xl">🩺</span>
            <div>
              <h2 className="font-bold text-gray-900">Nutrition reminder</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Nutrition needs during pregnancy can vary. For personalized dietary advice, speak with
                a qualified healthcare professional.
              </p>
            </div>
          </div>
        </section>

        <button
          onClick={() => navigate("/pregnancy-tracker")}
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Back to Pregnancy Dashboard
        </button>
      </main>
    </div>
  );
}

export default PregnancyNutrition;