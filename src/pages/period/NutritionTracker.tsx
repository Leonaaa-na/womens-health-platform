import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Meal = {
  id: number;
  date: string;
  mealType: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string;
};

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

  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem("nutritionMeals");

    return saved ? JSON.parse(saved) : [];
  });

  const handleSaveMeal = (event: React.FormEvent) => {
    event.preventDefault();

    if (!date || !mealType || !foodName) {
      setMessage(
        "Please enter the date, meal type and food name."
      );
      return;
    }

    const newMeal: Meal = {
      id: Date.now(),
      date,
      mealType,
      foodName,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      notes,
    };

    const updatedMeals = [
      ...meals,
      newMeal,
    ];

    setMeals(updatedMeals);

    localStorage.setItem(
      "nutritionMeals",
      JSON.stringify(updatedMeals)
    );

    setMealType("");
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setNotes("");

    setMessage("Meal logged successfully 🍽️");
  };

  const deleteMeal = (id: number) => {
    const updatedMeals = meals.filter(
      (meal) => meal.id !== id
    );

    setMeals(updatedMeals);

    localStorage.setItem(
      "nutritionMeals",
      JSON.stringify(updatedMeals)
    );
  };

  const todaysMeals = meals.filter(
    (meal) => meal.date === today
  );

  const totalCalories = todaysMeals.reduce(
    (total, meal) => total + meal.calories,
    0
  );

  const totalProtein = todaysMeals.reduce(
    (total, meal) => total + meal.protein,
    0
  );

  const totalCarbs = todaysMeals.reduce(
    (total, meal) => total + meal.carbs,
    0
  );

  const totalFat = todaysMeals.reduce(
    (total, meal) => total + meal.fat,
    0
  );

  return (
    <div className="min-h-screen bg-pink-50 pb-24">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">

        <div className="mx-auto flex max-w-md items-center gap-4">

          <button
            onClick={() =>
              navigate("/period-tracker")
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-lg text-pink-600"
          >
            ←
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Food & Nutrition
            </h1>

            <p className="text-sm text-gray-500">
              Keep track of the meals you eat
            </p>
          </div>

        </div>

      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Intro */}
        <section className="rounded-3xl bg-green-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl">
              🍎
            </div>

            <div>

              <h2 className="text-xl font-bold">
                Nutrition Diary
              </h2>

              <p className="mt-1 text-sm opacity-80">
                Keep a simple record of what you eat
                throughout your cycle.
              </p>

            </div>

          </div>

        </section>

        {/* Today's Nutrition */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-gray-900">
                Today's nutrition
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Based on meals you've logged today
              </p>
            </div>

            <span className="text-2xl">
              🥗
            </span>

          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-orange-50 p-4">
              <p className="text-xs text-gray-500">
                Calories
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {totalCalories}
              </p>

              <p className="text-xs text-gray-400">
                kcal
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-xs text-gray-500">
                Protein
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {totalProtein}
              </p>

              <p className="text-xs text-gray-400">
                g
              </p>
            </div>

            <div className="rounded-2xl bg-yellow-50 p-4">
              <p className="text-xs text-gray-500">
                Carbohydrates
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {totalCarbs}
              </p>

              <p className="text-xs text-gray-400">
                g
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-4">
              <p className="text-xs text-gray-500">
                Fat
              </p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {totalFat}
              </p>

              <p className="text-xs text-gray-400">
                g
              </p>
            </div>

          </div>

        </section>

        {/* Log Meal */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="mb-5 text-lg font-bold text-gray-900">
            Log a meal
          </h2>

          <form
            onSubmit={handleSaveMeal}
            className="space-y-5"
          >

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
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />

            </div>

            {/* Meal Type */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Meal type
              </label>

              <select
                value={mealType}
                onChange={(event) =>
                  setMealType(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none focus:border-pink-400"
              >

                <option value="">
                  Select meal type
                </option>

                <option value="Breakfast">
                  Breakfast
                </option>

                <option value="Lunch">
                  Lunch
                </option>

                <option value="Dinner">
                  Dinner
                </option>

                <option value="Snack">
                  Snack
                </option>

              </select>

            </div>

            {/* Food Name */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Food name
              </label>

              <input
                type="text"
                value={foodName}
                onChange={(event) =>
                  setFoodName(event.target.value)
                }
                placeholder="e.g. Rice and vegetables"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />

            </div>

            {/* Calories */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Calories
                <span className="ml-1 font-normal text-gray-400">
                  (optional)
                </span>
              </label>

              <input
                type="number"
                min="0"
                value={calories}
                onChange={(event) =>
                  setCalories(event.target.value)
                }
                placeholder="e.g. 450"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />

            </div>

            {/* Macronutrients */}
            <div className="grid grid-cols-3 gap-3">

              <div>

                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Protein (g)
                </label>

                <input
                  type="number"
                  min="0"
                  value={protein}
                  onChange={(event) =>
                    setProtein(event.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 outline-none focus:border-pink-400"
                />

              </div>

              <div>

                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Carbs (g)
                </label>

                <input
                  type="number"
                  min="0"
                  value={carbs}
                  onChange={(event) =>
                    setCarbs(event.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 outline-none focus:border-pink-400"
                />

              </div>

              <div>

                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Fat (g)
                </label>

                <input
                  type="number"
                  min="0"
                  value={fat}
                  onChange={(event) =>
                    setFat(event.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 outline-none focus:border-pink-400"
                />

              </div>

            </div>

            {/* Notes */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Notes
                <span className="ml-1 font-normal text-gray-400">
                  (optional)
                </span>
              </label>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                rows={3}
                placeholder="How did you feel after the meal?"
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />

            </div>

            {/* Message */}
            {message && (
              <div className="rounded-xl bg-green-50 p-3 text-center text-sm font-medium text-green-700">
                {message}
              </div>
            )}

            {/* Save */}
            <button
              type="submit"
              className="w-full rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700"
            >
              Log Meal
            </button>

          </form>

        </section>

        {/* Today's Meals */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-gray-900">
                Today's meals
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {todaysMeals.length} meal
                {todaysMeals.length !== 1 ? "s" : ""} logged
              </p>
            </div>

            <span className="text-2xl">
              🍽️
            </span>

          </div>

          {todaysMeals.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-5 text-center">

              <p className="text-2xl">
                🍽️
              </p>

              <p className="mt-2 text-sm font-medium text-gray-700">
                No meals logged today
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Add your first meal above.
              </p>

            </div>
          ) : (
            <div className="mt-5 space-y-3">

              {todaysMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="rounded-2xl bg-green-50 p-4"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-green-700">
                        {meal.mealType}
                      </span>

                      <h3 className="mt-2 font-bold text-gray-900">
                        {meal.foodName}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {meal.calories} kcal ·{" "}
                        {meal.protein}g protein ·{" "}
                        {meal.carbs}g carbs ·{" "}
                        {meal.fat}g fat
                      </p>

                      {meal.notes && (
                        <p className="mt-2 text-xs text-gray-500">
                          {meal.notes}
                        </p>
                      )}

                    </div>

                    <button
                      onClick={() =>
                        deleteMeal(meal.id)
                      }
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

            <span className="text-xl">
              🌿
            </span>

            <div>

              <h2 className="font-bold text-gray-900">
                Nutrition reminder
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                A balanced diet can support your overall
                health and wellbeing throughout your
                menstrual cycle. Use this diary to notice
                patterns in how food and your wellbeing
                relate to each other.
              </p>

            </div>

          </div>

        </section>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-md items-center justify-around px-3 py-3">

          <button
            onClick={() =>
              navigate("/period-tracker")
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              🏠
            </span>
            Home
          </button>

          <button
            onClick={() =>
              navigate("/period-tracker/flow")
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              🩸
            </span>
            Flow
          </button>

          <button
            onClick={() =>
              navigate("/period-tracker/symptoms")
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              📝
            </span>
            Symptoms
          </button>

          <button
            onClick={() =>
              navigate("/period-tracker/medication")
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              💊
            </span>
            Medicine
          </button>

        </div>

      </nav>

    </div>
  );
}

export default NutritionTracker;