import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

type Meal = {
  id: string;
  date: string;
  mealType: string; // lowercase, as stored
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string;
};

type BackendMeal = {
  id: string;
  date: string;
  mealType: string;
  description: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  notes: string | null;
};

const mealOptions = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

const mealLabel = (value: string) =>
  mealOptions.find((o) => o.value === value)?.label || value;

const toMeal = (m: BackendMeal): Meal => ({
  id: m.id,
  date: m.date,
  mealType: m.mealType,
  foodName: m.description,
  calories: m.calories || 0,
  protein: m.protein || 0,
  carbs: m.carbs || 0,
  fat: m.fat || 0,
  notes: m.notes || "",
});

// Empty box → don't send; otherwise send the number
const optionalNumber = (value: string) => (value === "" ? undefined : Number(value));

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

function NutritionTracker() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [mealType, setMealType] = useState("");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [todaysMeals, setTodaysMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get(`/trackers/nutrition?from=${today}&to=${today}`);
        const rows: BackendMeal[] = response.data?.data || [];
        setTodaysMeals(rows.map(toMeal));
      } catch {
        setTodaysMeals([]);
      }
    };
    load();
  }, [today]);

  const handleSaveMeal = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!date || !mealType || !foodName.trim()) {
      setMessage("Please enter the date, meal type and food name.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await apiClient.post("/trackers/nutrition", {
        date,
        mealType,
        description: foodName.trim(),
        calories: optionalNumber(calories),
        protein: optionalNumber(protein),
        carbs: optionalNumber(carbs),
        fat: optionalNumber(fat),
        notes: notes.trim() || null,
        context: "cycle",
      });

      const saved = toMeal(response.data.data);

      // This list only shows today's meals
      if (saved.date === today) {
        setTodaysMeals((prev) => [saved, ...prev]);
      }

      setMealType("");
      setFoodName("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
      setNotes("");
      setMessage(
        saved.date === today
          ? "Meal logged successfully 🍽️"
          : `Meal logged for ${saved.date} 🍽️`
      );
    } catch (error) {
      setMessage(errorMessage(error, "Could not log meal."));
    } finally {
      setSaving(false);
    }
  };

  const deleteMeal = async (id: string) => {
    const previous = todaysMeals;
    setTodaysMeals((prev) => prev.filter((m) => m.id !== id));

    try {
      await apiClient.delete(`/trackers/nutrition/${id}`);
    } catch (error) {
      setTodaysMeals(previous);
      setMessage(errorMessage(error, "Could not delete meal."));
    }
  };

  const total = (key: "calories" | "protein" | "carbs" | "fat") =>
    Math.round(todaysMeals.reduce((sum, meal) => sum + meal[key], 0));

  return (
    <div className="min-h-screen bg-pink-50 pb-24">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex max-w-md items-center gap-4">
          <button
            onClick={() => navigate("/period-tracker")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-lg text-pink-600"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Food & Nutrition</h1>
            <p className="text-sm text-gray-500">Keep track of the meals you eat</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Intro */}
        <section className="rounded-3xl bg-green-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl">🍎</div>
            <div>
              <h2 className="text-xl font-bold">Nutrition Diary</h2>
              <p className="mt-1 text-sm opacity-80">
                Keep a simple record of what you eat throughout your cycle.
              </p>
            </div>
          </div>
        </section>

        {/* Today's Nutrition */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">Today's nutrition</h2>
              <p className="mt-1 text-sm text-gray-500">Based on meals you've logged today</p>
            </div>
            <span className="text-2xl">🥗</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-orange-50 p-4">
              <p className="text-xs text-gray-500">Calories</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{total("calories")}</p>
              <p className="text-xs text-gray-400">kcal</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-xs text-gray-500">Protein</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{total("protein")}</p>
              <p className="text-xs text-gray-400">g</p>
            </div>
            <div className="rounded-2xl bg-yellow-50 p-4">
              <p className="text-xs text-gray-500">Carbohydrates</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{total("carbs")}</p>
              <p className="text-xs text-gray-400">g</p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-4">
              <p className="text-xs text-gray-500">Fat</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{total("fat")}</p>
              <p className="text-xs text-gray-400">g</p>
            </div>
          </div>
        </section>

        {/* Log Meal */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-gray-900">Log a meal</h2>

          <form onSubmit={handleSaveMeal} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Date</label>
              <input
                type="date"
                value={date}
                max={today}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Meal type</label>
              <select
                value={mealType}
                onChange={(event) => setMealType(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none focus:border-pink-400"
              >
                <option value="">Select meal type</option>
                {mealOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Food name</label>
              <input
                type="text"
                value={foodName}
                onChange={(event) => setFoodName(event.target.value)}
                placeholder="e.g. Rice and vegetables"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Calories
                <span className="ml-1 font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="number"
                min="0"
                value={calories}
                onChange={(event) => setCalories(event.target.value)}
                placeholder="e.g. 450"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">Protein (g)</label>
                <input
                  type="number"
                  min="0"
                  value={protein}
                  onChange={(event) => setProtein(event.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">Carbs (g)</label>
                <input
                  type="number"
                  min="0"
                  value={carbs}
                  onChange={(event) => setCarbs(event.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">Fat (g)</label>
                <input
                  type="number"
                  min="0"
                  value={fat}
                  onChange={(event) => setFat(event.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 outline-none focus:border-pink-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Notes
                <span className="ml-1 font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                placeholder="How did you feel after the meal?"
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />
            </div>

            {message && (
              <div className="rounded-xl bg-green-50 p-3 text-center text-sm font-medium text-green-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Log Meal"}
            </button>
          </form>
        </section>

        {/* Today's Meals */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">Today's meals</h2>
              <p className="mt-1 text-sm text-gray-500">
                {todaysMeals.length} meal{todaysMeals.length !== 1 ? "s" : ""} logged
              </p>
            </div>
            <span className="text-2xl">🍽️</span>
          </div>

          {todaysMeals.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-5 text-center">
              <p className="text-2xl">🍽️</p>
              <p className="mt-2 text-sm font-medium text-gray-700">No meals logged today</p>
              <p className="mt-1 text-xs text-gray-500">Add your first meal above.</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {todaysMeals.map((meal) => (
                <div key={meal.id} className="rounded-2xl bg-green-50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-green-700">
                        {mealLabel(meal.mealType)}
                      </span>
                      <h3 className="mt-2 font-bold text-gray-900">{meal.foodName}</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {meal.calories} kcal · {meal.protein}g protein · {meal.carbs}g carbs · {meal.fat}g fat
                      </p>
                      {meal.notes && <p className="mt-2 text-xs text-gray-500">{meal.notes}</p>}
                    </div>
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="text-sm font-semibold text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Nutrition Information */}
        <section className="rounded-3xl border border-green-200 bg-green-50 p-5">
          <div className="flex gap-3">
            <span className="text-xl">🌿</span>
            <div>
              <h2 className="font-bold text-gray-900">Nutrition reminder</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                A balanced diet can support your overall health and wellbeing throughout your
                menstrual cycle. Use this diary to notice patterns in how food and your
                wellbeing relate to each other.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-md items-center justify-around px-3 py-3">
          <button onClick={() => navigate("/period-tracker")} className="flex flex-col items-center gap-1 text-xs text-gray-400">
            <span className="text-xl">🏠</span>Home
          </button>
          <button onClick={() => navigate("/period-tracker/flow")} className="flex flex-col items-center gap-1 text-xs text-gray-400">
            <span className="text-xl">🩸</span>Flow
          </button>
          <button onClick={() => navigate("/period-tracker/symptoms")} className="flex flex-col items-center gap-1 text-xs text-gray-400">
            <span className="text-xl">📝</span>Symptoms
          </button>
          <button onClick={() => navigate("/period-tracker/medication")} className="flex flex-col items-center gap-1 text-xs text-gray-400">
            <span className="text-xl">💊</span>Medicine
          </button>
        </div>
      </nav>
    </div>
  );
}

export default NutritionTracker;