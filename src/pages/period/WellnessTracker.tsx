import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Exercise = {
  id: number;
  date: string;
  type: string;
  duration: number;
  intensity: string;
  notes: string;
};

function WellnessTracker() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [water, setWater] = useState(() => {
    const saved = localStorage.getItem("dailyWater");
    return saved ? Number(saved) : 0;
  });

  const [exerciseType, setExerciseType] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState("");
  const [notes, setNotes] = useState("");

  const [message, setMessage] = useState("");

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem("wellnessExercises");

    return saved ? JSON.parse(saved) : [];
  });

  const addWater = () => {
    const newAmount = water + 1;

    setWater(newAmount);

    localStorage.setItem(
      "dailyWater",
      String(newAmount)
    );
  };

  const removeWater = () => {
    if (water === 0) return;

    const newAmount = water - 1;

    setWater(newAmount);

    localStorage.setItem(
      "dailyWater",
      String(newAmount)
    );
  };

  const handleAddExercise = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!exerciseType || !duration || !intensity) {
      setMessage(
        "Please complete the exercise information."
      );
      return;
    }

    const newExercise: Exercise = {
      id: Date.now(),
      date: today,
      type: exerciseType,
      duration: Number(duration),
      intensity,
      notes,
    };

    const updatedExercises = [
      ...exercises,
      newExercise,
    ];

    setExercises(updatedExercises);

    localStorage.setItem(
      "wellnessExercises",
      JSON.stringify(updatedExercises)
    );

    setExerciseType("");
    setDuration("");
    setIntensity("");
    setNotes("");

    setMessage("Activity logged successfully 🌿");
  };

  const deleteExercise = (id: number) => {
    const updatedExercises = exercises.filter(
      (exercise) => exercise.id !== id
    );

    setExercises(updatedExercises);

    localStorage.setItem(
      "wellnessExercises",
      JSON.stringify(updatedExercises)
    );
  };

  const todaysExercises = exercises.filter(
    (exercise) => exercise.date === today
  );

  const totalExerciseMinutes =
    todaysExercises.reduce(
      (total, exercise) =>
        total + exercise.duration,
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
              Wellness
            </h1>

            <p className="text-sm text-gray-500">
              Take care of yourself throughout your cycle
            </p>
          </div>

        </div>

      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Intro */}
        <section className="rounded-3xl bg-green-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl">
              🌿
            </div>

            <div>

              <h2 className="text-xl font-bold">
                Your wellbeing matters
              </h2>

              <p className="mt-1 text-sm opacity-80">
                Keep track of hydration, movement and
                healthy daily habits.
              </p>

            </div>

          </div>

        </section>

        {/* Water */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="font-bold text-gray-900">
                💧 Water intake
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep track of the water you drink today.
              </p>

            </div>

            <span className="text-2xl">
              💧
            </span>

          </div>

          <div className="mt-5 rounded-2xl bg-blue-50 p-5 text-center">

            <p className="text-sm text-gray-500">
              Glasses logged
            </p>

            <p className="mt-1 text-4xl font-bold text-blue-600">
              {water}
            </p>

            <p className="text-xs text-gray-400">
              today
            </p>

          </div>

          <div className="mt-4 flex gap-3">

            <button
              onClick={removeWater}
              className="flex-1 rounded-xl border border-gray-200 py-3 font-semibold text-gray-600"
            >
              − Remove
            </button>

            <button
              onClick={addWater}
              className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white"
            >
              + Add glass
            </button>

          </div>

        </section>

        {/* Exercise Summary */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-gray-900">
                🏃 Today's movement
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Activities you've logged today
              </p>
            </div>

            <span className="text-2xl">
              🌸
            </span>

          </div>

          <div className="mt-5 rounded-2xl bg-green-50 p-5 text-center">

            <p className="text-sm text-gray-500">
              Total activity time
            </p>

            <p className="mt-1 text-3xl font-bold text-green-600">
              {totalExerciseMinutes}
            </p>

            <p className="text-xs text-gray-400">
              minutes
            </p>

          </div>

        </section>

        {/* Log Exercise */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="mb-5 text-lg font-bold text-gray-900">
            Log an activity
          </h2>

          <form
            onSubmit={handleAddExercise}
            className="space-y-5"
          >

            {/* Exercise Type */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Activity type
              </label>

              <select
                value={exerciseType}
                onChange={(event) =>
                  setExerciseType(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none focus:border-pink-400"
              >

                <option value="">
                  Select activity
                </option>

                <option value="Walking">
                  Walking
                </option>

                <option value="Stretching">
                  Stretching
                </option>

                <option value="Yoga">
                  Yoga
                </option>

                <option value="Cycling">
                  Cycling
                </option>

                <option value="Dancing">
                  Dancing
                </option>

                <option value="Home workout">
                  Home workout
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            {/* Duration */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Duration
              </label>

              <div className="relative">

                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(event) =>
                    setDuration(event.target.value)
                  }
                  placeholder="e.g. 30"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-16 outline-none focus:border-pink-400"
                />

                <span className="absolute right-4 top-3 text-sm text-gray-400">
                  min
                </span>

              </div>

            </div>

            {/* Intensity */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Intensity
              </label>

              <select
                value={intensity}
                onChange={(event) =>
                  setIntensity(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none focus:border-pink-400"
              >

                <option value="">
                  Select intensity
                </option>

                <option value="Gentle">
                  Gentle
                </option>

                <option value="Moderate">
                  Moderate
                </option>

                <option value="Vigorous">
                  Vigorous
                </option>

              </select>

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
                placeholder="How did you feel during the activity?"
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
              Log Activity
            </button>

          </form>

        </section>

        {/* Today's Activities */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="font-bold text-gray-900">
                Today's activities
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {todaysExercises.length} activit
                {todaysExercises.length !== 1
                  ? "ies"
                  : "y"} logged
              </p>

            </div>

            <span className="text-2xl">
              🏃
            </span>

          </div>

          {todaysExercises.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-5 text-center">

              <p className="text-2xl">
                🌿
              </p>

              <p className="mt-2 text-sm font-medium text-gray-700">
                No activities logged today
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Add an activity above.
              </p>

            </div>
          ) : (
            <div className="mt-5 space-y-3">

              {todaysExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="rounded-2xl bg-green-50 p-4"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-green-700">
                        {exercise.intensity}
                      </span>

                      <h3 className="mt-2 font-bold text-gray-900">
                        {exercise.type}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {exercise.duration} minutes
                      </p>

                      {exercise.notes && (
                        <p className="mt-2 text-xs text-gray-500">
                          {exercise.notes}
                        </p>
                      )}

                    </div>

                    <button
                      onClick={() =>
                        deleteExercise(exercise.id)
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

        {/* Wellness Tips */}
        <section className="rounded-3xl border border-green-200 bg-green-50 p-5">

          <div className="flex gap-3">

            <span className="text-xl">
              🌸
            </span>

            <div>

              <h2 className="font-bold text-gray-900">
                Wellness tip
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Listen to your body. Gentle movement,
                enough rest and staying hydrated can
                support your overall wellbeing. Choose
                activities that feel comfortable for you.
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
              navigate("/period-tracker/nutrition")
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              🍎
            </span>
            Nutrition
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

export default WellnessTracker;