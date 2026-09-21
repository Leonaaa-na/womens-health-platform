import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

type BackendSession = {
  id: string;
  startedAt: string;
  kickCount: number;
  notes: string | null;
};

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

function BabyMovement() {
  const navigate = useNavigate();

  const [movementCount, setMovementCount] = useState(0);
  const [note, setNote] = useState("");
  const [records, setRecords] = useState<BackendSession[]>([]);
  const [savedMessage, setSavedMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get("/pregnancy/movements");
        setRecords(response.data?.data || []);
      } catch {
        setRecords([]);
      }
    };
    load();
  }, []);

  const flash = (text: string) => {
    setSavedMessage(text);
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const saveSession = async () => {
    if (movementCount === 0) {
      flash("Please record at least one movement before saving.");
      return;
    }

    setSaving(true);

    try {
      // Create a session, then close it with the final count and note
      const started = await apiClient.post("/pregnancy/movements/start");
      const sessionId: string = started.data.data.id;

      const ended = await apiClient.post(`/pregnancy/movements/${sessionId}/end`, {
        kickCount: movementCount,
        notes: note.trim() || null,
      });

      setRecords((prev) => [ended.data.data, ...prev]);
      setMovementCount(0);
      setNote("");
      flash("Movement session saved successfully.");
    } catch (error) {
      flash(errorMessage(error, "Could not save the session."));
    } finally {
      setSaving(false);
    }
  };

  const clearRecords = async () => {
    const previous = records;
    setRecords([]);

    try {
      await apiClient.delete("/pregnancy/movements");
      flash("Movement history cleared.");
    } catch (error) {
      setRecords(previous);
      flash(errorMessage(error, "Could not clear history."));
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 pb-10">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-lg"
            aria-label="Go back"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold text-pink-700">Baby Movement 👶🏾</h1>
            <p className="text-xs text-gray-500">Keep track of your baby's movements</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">👶🏾</div>
            <div>
              <h2 className="text-xl font-bold">Baby movement</h2>
              <p className="mt-2 text-sm leading-6 opacity-90">
                Record movements during your day so you can keep a personal history to discuss with
                your healthcare professional when needed.
              </p>
            </div>
          </div>
        </section>

        {/* Safety Information */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xl">💡</div>
            <div>
              <h2 className="font-bold text-gray-900">Important</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Baby movement patterns can vary. If you notice a change or are concerned about your
                baby's movements, contact your healthcare professional or maternity care team promptly.
              </p>
            </div>
          </div>
        </section>

        {/* Movement Counter */}
        <section className="rounded-3xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-500">Current movement session</p>

          <div className="mt-5 flex items-center justify-center gap-6">
            <button
              onClick={() => setMovementCount((p) => Math.max(p - 1, 0))}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-pink-200 bg-pink-50 text-2xl font-bold text-pink-600"
              aria-label="Remove movement"
            >
              −
            </button>

            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-pink-100">
              <span className="text-5xl font-bold text-pink-700">{movementCount}</span>
              <span className="mt-1 text-xs text-pink-600">movements</span>
            </div>

            <button
              onClick={() => setMovementCount((p) => p + 1)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-600 text-2xl font-bold text-white shadow-md"
              aria-label="Add movement"
            >
              +
            </button>
          </div>

          <button
            onClick={() => setMovementCount((p) => p + 1)}
            className="mt-6 w-full rounded-2xl bg-pink-600 py-4 font-bold text-white"
          >
            I felt a movement 👶🏾
          </button>
        </section>

        {/* Notes */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-gray-900">Session notes 📝</h2>
          <p className="mt-1 text-sm text-gray-500">Add anything you want to remember about this session.</p>

          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Optional note..."
            rows={4}
            className="mt-4 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-500"
          />

          <button
            onClick={saveSession}
            disabled={saving}
            className="mt-4 w-full rounded-xl bg-pink-600 py-3 font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Movement Session"}
          </button>
        </section>

        {savedMessage && (
          <section className="rounded-2xl bg-green-50 p-4 text-center text-sm font-semibold text-green-700">
            ✓ {savedMessage}
          </section>
        )}

        {/* Movement History */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">Recent movement records</h2>
              <p className="mt-1 text-sm text-gray-500">Your saved movement sessions</p>
            </div>
            {records.length > 0 && (
              <button onClick={clearRecords} className="text-xs font-semibold text-red-500">
                Clear
              </button>
            )}
          </div>

          {records.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-pink-50 p-5 text-center">
              <p className="text-2xl">👶🏾</p>
              <p className="mt-2 text-sm font-semibold text-gray-700">No movement sessions yet</p>
              <p className="mt-1 text-xs text-gray-500">Your saved sessions will appear here.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {records.map((record) => {
                const when = new Date(record.startedAt);
                return (
                  <div key={record.id} className="rounded-2xl bg-pink-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {record.kickCount} movement{record.kickCount === 1 ? "" : "s"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {when.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} •{" "}
                          {when.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </p>
                      </div>
                      <span className="text-2xl">👶🏾</span>
                    </div>
                    {record.notes && (
                      <p className="mt-3 border-t border-pink-100 pt-3 text-sm text-gray-600">{record.notes}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <button
          onClick={() => navigate("/pregnancy-tracker")}
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Back to Pregnancy Tracker
        </button>
      </main>
    </div>
  );
}

export default BabyMovement;