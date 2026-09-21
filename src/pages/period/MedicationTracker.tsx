import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // backend value, e.g. "twice_daily"
  reminderTime: string;
  notes: string;
  active: boolean;
};

type BackendMedication = {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string;
  times: string[] | null;
  notes: string | null;
  isActive: boolean;
};

// Backend stores these values; the UI shows the labels
const frequencyOptions = [
  { value: "daily", label: "Once daily" },
  { value: "twice_daily", label: "Twice daily" },
  { value: "three_times_daily", label: "Three times daily" },
  { value: "weekly", label: "Weekly" },
  { value: "as_needed", label: "As needed" },
  { value: "custom", label: "Other" },
];

const frequencyLabel = (value: string) =>
  frequencyOptions.find((o) => o.value === value)?.label || value;

const toMedication = (m: BackendMedication): Medication => ({
  id: m.id,
  name: m.name,
  dosage: m.dosage || "",
  frequency: m.frequency,
  reminderTime: m.times?.[0] || "",
  notes: m.notes || "",
  active: m.isActive,
});

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

function MedicationTracker() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get("/trackers/medications");
        const rows: BackendMedication[] = response.data?.data || [];
        setMedications(rows.map(toMedication));
      } catch {
        setMedications([]);
      }
    };
    load();
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !dosage || !frequency) {
      setMessage("Please enter the medication name, dosage and frequency.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await apiClient.post("/trackers/medications", {
        name: name.trim(),
        dosage: dosage.trim(),
        frequency,
        times: reminderTime ? [reminderTime] : [],
        notes: notes.trim() || null,
        context: "cycle",
      });

      setMedications((prev) => [toMedication(response.data.data), ...prev]);

      setName("");
      setDosage("");
      setFrequency("");
      setReminderTime("");
      setNotes("");
      setMessage("Medication added successfully 💊");
    } catch (error) {
      setMessage(errorMessage(error, "Could not add medication."));
    } finally {
      setSaving(false);
    }
  };

  const toggleMedication = async (id: string) => {
    const current = medications.find((m) => m.id === id);
    if (!current) return;

    // Update the screen straight away, undo if the server says no
    setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));

    try {
      await apiClient.put(`/trackers/medications/${id}`, { isActive: !current.active });
    } catch (error) {
      setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, active: current.active } : m)));
      setMessage(errorMessage(error, "Could not update medication."));
    }
  };

  const deleteMedication = async (id: string) => {
    const previous = medications;
    setMedications((prev) => prev.filter((m) => m.id !== id));

    try {
      await apiClient.delete(`/trackers/medications/${id}`);
    } catch (error) {
      setMedications(previous);
      setMessage(errorMessage(error, "Could not delete medication."));
    }
  };

  const active = medications.filter((m) => m.active);
  const inactive = medications.filter((m) => !m.active);

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
            <h1 className="text-2xl font-bold text-gray-900">Medication</h1>
            <p className="text-sm text-gray-500">Keep track of your medication and supplements</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Intro */}
        <section className="rounded-3xl bg-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl">💊</div>
            <div>
              <h2 className="text-xl font-bold">Medication & Supplements</h2>
              <p className="mt-1 text-sm opacity-80">
                Keep your medication information organized in one place.
              </p>
            </div>
          </div>
        </section>

        {/* Add Medication */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-gray-900">Add medication</h2>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Medication or supplement name
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Vitamin D"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Dosage</label>
              <input
                type="text"
                value={dosage}
                onChange={(event) => setDosage(event.target.value)}
                placeholder="e.g. 500 mg"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Frequency</label>
              <select
                value={frequency}
                onChange={(event) => setFrequency(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none focus:border-pink-400"
              >
                <option value="">Select frequency</option>
                {frequencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Reminder time
                <span className="ml-1 font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(event) => setReminderTime(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />
              <p className="mt-2 text-xs text-gray-400">
                HerBloom will remind you at this time every day.
              </p>
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
                placeholder="Add any additional information..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />
            </div>

            {message && (
              <div className="rounded-xl bg-pink-50 p-3 text-center text-sm font-medium text-pink-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Add Medication"}
            </button>
          </form>
        </section>

        {/* Active Medications */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">Active medications</h2>
              <p className="mt-1 text-sm text-gray-500">{active.length} active</p>
            </div>
            <span className="text-2xl">💊</span>
          </div>

          {active.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-5 text-center">
              <p className="text-2xl">💊</p>
              <p className="mt-2 text-sm font-medium text-gray-700">No medications added</p>
              <p className="mt-1 text-xs text-gray-500">Add a medication above to start tracking.</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {active.map((medication) => (
                <div key={medication.id} className="rounded-2xl bg-pink-50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{medication.name}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {medication.dosage} · {frequencyLabel(medication.frequency)}
                      </p>
                      {medication.reminderTime && (
                        <p className="mt-2 text-xs font-medium text-pink-600">
                          ⏰ Reminder: {medication.reminderTime}
                        </p>
                      )}
                      {medication.notes && (
                        <p className="mt-2 text-xs text-gray-500">{medication.notes}</p>
                      )}
                    </div>
                    <span className="text-2xl">💊</span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => toggleMedication(medication.id)}
                      className="flex-1 rounded-lg bg-white py-2 text-xs font-semibold text-gray-600"
                    >
                      Mark inactive
                    </button>
                    <button
                      onClick={() => deleteMedication(medication.id)}
                      className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Medication History */}
        {inactive.length > 0 && (
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="font-bold text-gray-900">Medication history</h2>
            <div className="mt-4 space-y-3">
              {inactive.map((medication) => (
                <div key={medication.id} className="rounded-2xl bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{medication.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {medication.dosage} · {frequencyLabel(medication.frequency)}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleMedication(medication.id)}
                      className="rounded-lg bg-pink-100 px-3 py-2 text-xs font-semibold text-pink-700"
                    >
                      Reactivate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Safety Notice */}
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h2 className="font-bold text-gray-900">Important notice</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                This tracker is for record-keeping and reminders only. Always consult a
                qualified healthcare professional before starting, stopping, or changing
                medication or supplements.
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
          <button className="flex flex-col items-center gap-1 text-xs font-semibold text-pink-600">
            <span className="text-xl">💊</span>Medicine
          </button>
        </div>
      </nav>
    </div>
  );
}

export default MedicationTracker;