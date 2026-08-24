import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Medication = {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  reminderTime: string;
  notes: string;
  active: boolean;
};

function MedicationTracker() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [notes, setNotes] = useState("");

  const [message, setMessage] = useState("");

  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem("medications");

    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !dosage || !frequency) {
      setMessage("Please enter the medication name, dosage and frequency.");
      return;
    }

    const newMedication: Medication = {
      id: Date.now(),
      name,
      dosage,
      frequency,
      reminderTime,
      notes,
      active: true,
    };

    const updatedMedications = [
      ...medications,
      newMedication,
    ];

    setMedications(updatedMedications);

    localStorage.setItem(
      "medications",
      JSON.stringify(updatedMedications)
    );

    setName("");
    setDosage("");
    setFrequency("");
    setReminderTime("");
    setNotes("");

    setMessage("Medication added successfully 💊");
  };

  const toggleMedication = (id: number) => {
    const updatedMedications = medications.map((medication) =>
      medication.id === id
        ? {
            ...medication,
            active: !medication.active,
          }
        : medication
    );

    setMedications(updatedMedications);

    localStorage.setItem(
      "medications",
      JSON.stringify(updatedMedications)
    );
  };

  const deleteMedication = (id: number) => {
    const updatedMedications = medications.filter(
      (medication) => medication.id !== id
    );

    setMedications(updatedMedications);

    localStorage.setItem(
      "medications",
      JSON.stringify(updatedMedications)
    );
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
              Medication
            </h1>

            <p className="text-sm text-gray-500">
              Keep track of your medication and supplements
            </p>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Intro */}
        <section className="rounded-3xl bg-purple-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl">
              💊
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Medication & Supplements
              </h2>

              <p className="mt-1 text-sm opacity-80">
                Keep your medication information organized
                in one place.
              </p>
            </div>

          </div>

        </section>

        {/* Add Medication */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="mb-5 text-lg font-bold text-gray-900">
            Add medication
          </h2>

          <form
            onSubmit={handleSave}
            className="space-y-5"
          >

            {/* Medication Name */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Medication or supplement name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. Vitamin D"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />

            </div>

            {/* Dosage */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Dosage
              </label>

              <input
                type="text"
                value={dosage}
                onChange={(event) =>
                  setDosage(event.target.value)
                }
                placeholder="e.g. 500 mg"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-pink-400"
              />

            </div>

            {/* Frequency */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Frequency
              </label>

              <select
                value={frequency}
                onChange={(event) =>
                  setFrequency(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none focus:border-pink-400"
              >

                <option value="">
                  Select frequency
                </option>

                <option value="Once daily">
                  Once daily
                </option>

                <option value="Twice daily">
                  Twice daily
                </option>

                <option value="Three times daily">
                  Three times daily
                </option>

                <option value="Weekly">
                  Weekly
                </option>

                <option value="As needed">
                  As needed
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            {/* Reminder */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Reminder time
                <span className="ml-1 font-normal text-gray-400">
                  (optional)
                </span>
              </label>

              <input
                type="time"
                value={reminderTime}
                onChange={(event) =>
                  setReminderTime(event.target.value)
                }
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
                rows={3}
                placeholder="Add any additional information..."
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
              Add Medication
            </button>

          </form>

        </section>

        {/* Active Medications */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-gray-900">
                Active medications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {medications.filter((item) => item.active).length} active
              </p>
            </div>

            <span className="text-2xl">
              💊
            </span>

          </div>

          {medications.filter((item) => item.active).length === 0 ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-5 text-center">

              <p className="text-2xl">
                💊
              </p>

              <p className="mt-2 text-sm font-medium text-gray-700">
                No medications added
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Add a medication above to start tracking.
              </p>

            </div>
          ) : (
            <div className="mt-5 space-y-3">

              {medications
                .filter((item) => item.active)
                .map((medication) => (
                  <div
                    key={medication.id}
                    className="rounded-2xl bg-pink-50 p-4"
                  >

                    <div className="flex items-start justify-between">

                      <div>
                        <h3 className="font-bold text-gray-900">
                          {medication.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-600">
                          {medication.dosage} ·{" "}
                          {medication.frequency}
                        </p>

                        {medication.reminderTime && (
                          <p className="mt-2 text-xs font-medium text-pink-600">
                            ⏰ Reminder:{" "}
                            {medication.reminderTime}
                          </p>
                        )}

                        {medication.notes && (
                          <p className="mt-2 text-xs text-gray-500">
                            {medication.notes}
                          </p>
                        )}
                      </div>

                      <span className="text-2xl">
                        💊
                      </span>

                    </div>

                    <div className="mt-4 flex gap-2">

                      <button
                        onClick={() =>
                          toggleMedication(medication.id)
                        }
                        className="flex-1 rounded-lg bg-white py-2 text-xs font-semibold text-gray-600"
                      >
                        Mark inactive
                      </button>

                      <button
                        onClick={() =>
                          deleteMedication(medication.id)
                        }
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
        {medications.some((item) => !item.active) && (
          <section className="rounded-3xl bg-white p-5 shadow-sm">

            <h2 className="font-bold text-gray-900">
              Medication history
            </h2>

            <div className="mt-4 space-y-3">

              {medications
                .filter((item) => !item.active)
                .map((medication) => (
                  <div
                    key={medication.id}
                    className="rounded-2xl bg-gray-50 p-4"
                  >

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="font-semibold text-gray-800">
                          {medication.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {medication.dosage} ·{" "}
                          {medication.frequency}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          toggleMedication(medication.id)
                        }
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

            <span className="text-xl">
              ⚠️
            </span>

            <div>

              <h2 className="font-bold text-gray-900">
                Important notice
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                This tracker is for record-keeping and
                reminders only. Always consult a qualified
                healthcare professional before starting,
                stopping, or changing medication or
                supplements.
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

          <button className="flex flex-col items-center gap-1 text-xs font-semibold text-pink-600">
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

export default MedicationTracker;