import { useState } from "react";
import { useNavigate } from "react-router-dom";

type SymptomEntry = {
  id: number;
  date: string;
  painLevel: string;
  painLocation: string;
  mood: string;
  stressLevel: string;
  symptoms: string[];
  notes: string;
};

function SymptomsTracker() {
  const navigate = useNavigate();

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [painLevel, setPainLevel] = useState("");

  const [painLocation, setPainLocation] = useState("");

  const [mood, setMood] = useState("");

  const [stressLevel, setStressLevel] = useState("");

  const [selectedSymptoms, setSelectedSymptoms] =
    useState<string[]>([]);

  const [notes, setNotes] = useState("");

  const [message, setMessage] = useState("");

  const [entries, setEntries] = useState<SymptomEntry[]>(() => {
    const saved = localStorage.getItem("symptomEntries");

    return saved ? JSON.parse(saved) : [];
  });

  const symptomOptions = [
    "Headache",
    "Bloating",
    "Fatigue",
    "Back pain",
    "Breast tenderness",
    "Nausea",
    "Dizziness",
    "Cramps",
  ];

  const moodOptions = [
    "😊 Happy",
    "🙂 Calm",
    "😐 Neutral",
    "😔 Sad",
    "😣 Irritable",
    "😴 Tired",
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom]
    );
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();

    if (!painLevel && !mood && !stressLevel && selectedSymptoms.length === 0) {
      setMessage("Please log at least one symptom or feeling.");
      return;
    }

    const newEntry: SymptomEntry = {
      id: Date.now(),
      date,
      painLevel,
      painLocation,
      mood,
      stressLevel,
      symptoms: selectedSymptoms,
      notes,
    };

    const updatedEntries = [newEntry, ...entries];

    setEntries(updatedEntries);

    localStorage.setItem(
      "symptomEntries",
      JSON.stringify(updatedEntries)
    );

    setMessage("Today's symptoms have been saved 🌸");

    setPainLevel("");
    setPainLocation("");
    setMood("");
    setStressLevel("");
    setSelectedSymptoms([]);
    setNotes("");
  };

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
            <h1 className="text-2xl font-bold text-gray-900">
              Log Your Symptoms
            </h1>

            <p className="text-sm text-gray-500">
              Check in with how you're feeling
            </p>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Intro */}
        <section className="rounded-3xl bg-purple-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl">
              🌸
            </div>

            <div>
              <h2 className="text-xl font-bold">
                How are you feeling today?
              </h2>

              <p className="mt-1 text-sm opacity-80">
                Your daily check-in can help you notice
                patterns over time.
              </p>
            </div>

          </div>

        </section>

        {/* Form */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <form
            onSubmit={handleSave}
            className="space-y-7"
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

            {/* Pain Level */}
            <div>

              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Pain or cramps
              </label>

              <div className="grid grid-cols-5 gap-2">

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                  (number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() =>
                        setPainLevel(String(number))
                      }
                      className={`rounded-xl py-3 text-sm font-semibold transition ${
                        painLevel === String(number)
                          ? "bg-pink-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-pink-50"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

              </div>

              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Very mild</span>
                <span>Very strong</span>
              </div>

            </div>

            {/* Pain Location */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Pain location
              </label>

              <select
                value={painLocation}
                onChange={(event) =>
                  setPainLocation(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none focus:border-pink-400"
              >

                <option value="">
                  Select location
                </option>

                <option value="Lower abdomen">
                  Lower abdomen
                </option>

                <option value="Upper abdomen">
                  Upper abdomen
                </option>

                <option value="Lower back">
                  Lower back
                </option>

                <option value="Upper back">
                  Upper back
                </option>

                <option value="Pelvis">
                  Pelvis
                </option>

                <option value="Head">
                  Head
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            {/* Mood */}
            <div>

              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Mood
              </label>

              <div className="grid grid-cols-2 gap-2">

                {moodOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMood(option)}
                    className={`rounded-xl border px-3 py-3 text-left text-sm transition ${
                      mood === option
                        ? "border-pink-500 bg-pink-50 font-semibold text-pink-700"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}

              </div>

            </div>

            {/* Stress */}
            <div>

              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Stress level
              </label>

              <div className="grid grid-cols-3 gap-2">

                {["Low", "Moderate", "High"].map(
                  (level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setStressLevel(level)
                      }
                      className={`rounded-xl py-3 text-sm font-semibold transition ${
                        stressLevel === level
                          ? "bg-green-100 text-green-700 ring-2 ring-green-200"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {level}
                    </button>
                  )
                )}

              </div>

            </div>

            {/* Other Symptoms */}
            <div>

              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Other symptoms
              </label>

              <div className="flex flex-wrap gap-2">

                {symptomOptions.map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() =>
                      toggleSymptom(symptom)
                    }
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      selectedSymptoms.includes(symptom)
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {symptom}
                  </button>
                ))}

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
                rows={4}
                placeholder="Anything else you'd like to record?"
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />

            </div>

            {/* Message */}
            {message && (
              <div className="rounded-xl bg-pink-50 p-3 text-center text-sm font-medium text-pink-700">
                {message}
              </div>
            )}

            {/* Save */}
            <button
              type="submit"
              className="w-full rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700"
            >
              Save Today's Check-in
            </button>

          </form>

        </section>

        {/* Pain Management */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="font-bold text-gray-900">
            Comfort & pain management 💗
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Some people find these measures helpful for
            managing period discomfort.
          </p>

          <div className="mt-4 space-y-3">

            <div className="rounded-2xl bg-pink-50 p-4">
              <p className="font-semibold text-gray-900">
                ♨️ Gentle warmth
              </p>

              <p className="mt-1 text-sm leading-5 text-gray-600">
                A warm heating pad or warm bath may help
                ease menstrual cramps.
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-4">
              <p className="font-semibold text-gray-900">
                🧘 Gentle movement
              </p>

              <p className="mt-1 text-sm leading-5 text-gray-600">
                Gentle stretching or light physical activity
                may help some people feel more comfortable.
              </p>
            </div>

          </div>

          <p className="mt-4 text-xs leading-5 text-gray-400">
            If pain is severe, persistent, or significantly
            interferes with daily activities, consider
            speaking with a healthcare professional.
          </p>

        </section>

        {/* Recent Entries */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-gray-900">
                Recent check-ins
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your symptom history
              </p>
            </div>

            <span className="text-2xl">
              📋
            </span>

          </div>

          {entries.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-5 text-center">

              <p className="text-2xl">
                🌸
              </p>

              <p className="mt-2 text-sm font-medium text-gray-700">
                No check-ins yet
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Your saved symptom records will appear here.
              </p>

            </div>
          ) : (
            <div className="mt-5 space-y-3">

              {entries.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl bg-gray-50 p-4"
                >

                  <div className="flex items-center justify-between">

                    <p className="font-semibold text-gray-900">
                      {entry.date}
                    </p>

                    {entry.painLevel && (
                      <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                        Pain {entry.painLevel}/10
                      </span>
                    )}

                  </div>

                  {entry.painLocation && (
                    <p className="mt-2 text-xs text-gray-600">
                      Pain location: {entry.painLocation}
                    </p>
                  )}

                  {entry.mood && (
                    <p className="mt-2 text-xs text-gray-600">
                      Mood: {entry.mood}
                    </p>
                  )}

                  {entry.stressLevel && (
                    <p className="mt-2 text-xs text-gray-600">
                      Stress: {entry.stressLevel}
                    </p>
                  )}

                  {entry.symptoms.length > 0 && (
                    <p className="mt-2 text-xs text-gray-600">
                      Symptoms: {entry.symptoms.join(", ")}
                    </p>
                  )}

                  {entry.notes && (
                    <p className="mt-2 text-xs text-gray-600">
                      Note: {entry.notes}
                    </p>
                  )}

                </div>
              ))}

            </div>
          )}

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
            className="flex flex-col items-center gap-1 text-xs font-semibold text-pink-600"
          >
            <span className="text-xl">
              📝
            </span>
            Symptoms
          </button>

          <button className="flex flex-col items-center gap-1 text-xs text-gray-400">
            <span className="text-xl">
              📊
            </span>
            Reports
          </button>

          <button className="flex flex-col items-center gap-1 text-xs text-gray-400">
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

export default SymptomsTracker;