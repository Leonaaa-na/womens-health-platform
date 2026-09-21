import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

function PregnancyWellness() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [sleep, setSleep] = useState(0);
  const [exercise, setExercise] = useState(false);
  const [rest, setRest] = useState(false);
  const [wellnessNote, setWellnessNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get(`/trackers/wellness?from=${today}&to=${today}`);
        const row = response.data?.data?.[0];
        setSleep(row?.sleepHours || 0);
        setExercise(!!row?.gentleMovement);
        setRest(!!row?.restDone);
        setWellnessNote(row?.notes || "");
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

  const updateSleep = async (hours: number) => {
    const previous = sleep;
    const next = Math.max(0, Math.min(hours, 12));
    if (next === previous) return;

    setSleep(next);
    try {
      await saveToday({ sleepHours: next });
    } catch (error) {
      setSleep(previous);
      setMessage(errorMessage(error, "Could not update sleep."));
    }
  };

  const toggleExercise = async () => {
    const next = !exercise;
    setExercise(next);
    try {
      await saveToday({ gentleMovement: next });
    } catch (error) {
      setExercise(!next);
      setMessage(errorMessage(error, "Could not update."));
    }
  };

  const toggleRest = async () => {
    const next = !rest;
    setRest(next);
    try {
      await saveToday({ restDone: next });
    } catch (error) {
      setRest(!next);
      setMessage(errorMessage(error, "Could not update."));
    }
  };

  const saveWellnessNote = async () => {
    setMessage("");
    try {
      await saveToday({ notes: wellnessNote.trim() || null });
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
            <h1 className="text-2xl font-bold text-pink-700">Wellness 🌿</h1>
            <p className="text-sm text-gray-500">Take care of yourself</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">🌿</div>
            <div>
              <p className="text-sm opacity-80">Today's wellness</p>
              <h2 className="text-2xl font-bold">Take a moment for you</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 opacity-90">
            Small moments of rest, movement, and self-care can help you feel supported during your pregnancy.
          </p>
        </section>

        {/* Sleep */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Sleep 😴</h2>
              <p className="mt-1 text-sm text-gray-500">How many hours did you sleep?</p>
            </div>
            <span className="text-3xl">🌙</span>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => updateSleep(sleep - 1)}
              disabled={sleep === 0}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-600 disabled:opacity-40"
            >
              −
            </button>
            <div className="text-center">
              <p className="text-4xl font-bold text-pink-600">{sleep}</p>
              <p className="text-xs text-gray-500">hours</p>
            </div>
            <button
              onClick={() => updateSleep(sleep + 1)}
              disabled={sleep === 12}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 text-xl font-bold text-pink-600 disabled:opacity-40"
            >
              +
            </button>
          </div>
        </section>

        {/* Daily Wellness */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Today's wellness 🌸</h2>
          <p className="mt-1 text-sm text-gray-500">Check off the habits you've completed.</p>

          <div className="mt-4 space-y-3">
            <button
              onClick={toggleExercise}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                exercise ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚶🏽</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Gentle movement</h3>
                  <p className="text-xs text-gray-500">Movement that feels comfortable</p>
                </div>
              </div>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  exercise ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                {exercise ? "✓" : "+"}
              </span>
            </button>

            <button
              onClick={toggleRest}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                rest ? "border-purple-300 bg-purple-50" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧘🏽</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Rest & relaxation</h3>
                  <p className="text-xs text-gray-500">Take some quiet time for yourself</p>
                </div>
              </div>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  rest ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                {rest ? "✓" : "+"}
              </span>
            </button>
          </div>
        </section>

        {/* Wellness Note */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Wellness Note 📝</h2>
          <p className="mt-1 text-sm text-gray-500">Write something about how you're feeling today.</p>
          <textarea
            value={wellnessNote}
            onChange={(e) => setWellnessNote(e.target.value)}
            placeholder="How are you feeling today?"
            rows={5}
            className="mt-4 w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm text-gray-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          />

          {message && <p className="mt-3 text-center text-sm font-medium text-pink-700">{message}</p>}

          <button
            onClick={saveWellnessNote}
            className="mt-3 w-full rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700"
          >
            Save Note
          </button>
        </section>

        {/* Reminder */}
        <section className="rounded-3xl border border-pink-200 bg-pink-50 p-5">
          <div className="flex gap-3">
            <span className="text-xl">💗</span>
            <div>
              <h2 className="font-bold text-gray-900">Be gentle with yourself</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Listen to your body and follow the guidance of your healthcare professional. If an
                activity or exercise causes discomfort, stop and seek appropriate advice.
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

export default PregnancyWellness;