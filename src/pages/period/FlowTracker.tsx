import { useState } from "react";
import { useNavigate } from "react-router-dom";

type FlowEntry = {
  id: number;
  date: string;
  flow: string;
  products: string;
  notes: string;
};

function FlowTracker() {
  const navigate = useNavigate();

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [flow, setFlow] = useState("");

  const [products, setProducts] = useState("");

  const [notes, setNotes] = useState("");

  const [message, setMessage] = useState("");

  const [entries, setEntries] = useState<FlowEntry[]>(() => {
    const saved = localStorage.getItem("flowEntries");

    return saved ? JSON.parse(saved) : [];
  });

  const flowOptions = [
    {
      name: "Spotting",
      emoji: "🌸",
      description: "Very light bleeding",
    },
    {
      name: "Light",
      emoji: "🩸",
      description: "Light bleeding",
    },
    {
      name: "Medium",
      emoji: "🩸",
      description: "Moderate bleeding",
    },
    {
      name: "Heavy",
      emoji: "🩸",
      description: "Heavy bleeding",
    },
  ];

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();

    if (!flow) {
      setMessage("Please select your flow level.");
      return;
    }

    const newEntry: FlowEntry = {
      id: Date.now(),
      date,
      flow,
      products,
      notes,
    };

    const updatedEntries = [newEntry, ...entries];

    setEntries(updatedEntries);

    localStorage.setItem(
      "flowEntries",
      JSON.stringify(updatedEntries)
    );

    setMessage("Flow entry saved successfully 🌸");

    setFlow("");
    setProducts("");
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
              Flow Tracker
            </h1>

            <p className="text-sm text-gray-500">
              Keep track of your menstrual flow
            </p>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Intro */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl">
              🩸
            </div>

            <div>
              <h2 className="text-xl font-bold">
                How is your flow today?
              </h2>

              <p className="mt-1 text-sm opacity-80">
                Tracking your flow can help you understand
                your cycle patterns.
              </p>
            </div>

          </div>

        </section>

        {/* Flow Form */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <form
            onSubmit={handleSave}
            className="space-y-6"
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
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none focus:border-pink-400"
              />
            </div>

            {/* Flow Level */}
            <div>

              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Flow level
              </label>

              <div className="grid grid-cols-2 gap-3">

                {flowOptions.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() =>
                      setFlow(option.name)
                    }
                    className={`rounded-2xl border p-4 text-left transition ${
                      flow === option.name
                        ? "border-pink-500 bg-pink-50 ring-2 ring-pink-200"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >

                    <div className="text-xl">
                      {option.emoji}
                    </div>

                    <p className="mt-2 font-semibold text-gray-900">
                      {option.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {option.description}
                    </p>

                  </button>
                ))}

              </div>

            </div>

            {/* Products Used */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Pads or tampons used
                <span className="ml-1 font-normal text-gray-400">
                  (optional)
                </span>
              </label>

              <input
                type="number"
                min="0"
                value={products}
                onChange={(event) =>
                  setProducts(event.target.value)
                }
                placeholder="e.g. 3"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />

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
                placeholder="Anything you'd like to remember..."
                rows={4}
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
              Save Flow Entry
            </button>

          </form>

        </section>

        {/* Flow Guide */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="font-bold text-gray-900">
            Flow guide 💡
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            A simple guide to the levels above.
          </p>

          <div className="mt-4 space-y-3">

            <div className="rounded-2xl bg-pink-50 p-4">
              <p className="font-semibold text-gray-900">
                Spotting
              </p>

              <p className="mt-1 text-sm leading-5 text-gray-600">
                Very light bleeding or a small amount of
                blood noticed when wiping or on underwear.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">
                Light
              </p>

              <p className="mt-1 text-sm leading-5 text-gray-600">
                Light menstrual bleeding that is less than
                your usual flow.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">
                Medium
              </p>

              <p className="mt-1 text-sm leading-5 text-gray-600">
                A typical menstrual flow for you.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">
                Heavy
              </p>

              <p className="mt-1 text-sm leading-5 text-gray-600">
                A noticeably heavier flow than your usual
                menstrual bleeding.
              </p>
            </div>

          </div>

        </section>

        {/* Recent Entries */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-gray-900">
                Recent flow
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest entries
              </p>
            </div>

            <span className="text-2xl">
              📋
            </span>

          </div>

          {entries.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-5 text-center">

              <p className="text-2xl">
                🩸
              </p>

              <p className="mt-2 text-sm font-medium text-gray-700">
                No flow entries yet
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Your saved flow records will appear here.
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

                    <div>
                      <p className="font-semibold text-gray-900">
                        {entry.flow}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {entry.date}
                      </p>
                    </div>

                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
                      Logged
                    </span>

                  </div>

                  {entry.products && (
                    <p className="mt-3 text-xs text-gray-600">
                      Products used: {entry.products}
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
            onClick={() => navigate("/period-tracker")}
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              🏠
            </span>
            Home
          </button>

          <button className="flex flex-col items-center gap-1 text-xs font-semibold text-pink-600">
            <span className="text-xl">
              🩸
            </span>
            Track
          </button>

          <button className="flex flex-col items-center gap-1 text-xs text-gray-400">
            <span className="text-xl">
              📅
            </span>
            Calendar
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

export default FlowTracker;