import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Symptom = {
  id: number;
  name: string;
  severity: string;
};

const symptomOptions = [
  "Nausea",
  "Fatigue",
  "Headache",
  "Back pain",
  "Heartburn",
  "Swelling",
  "Mood changes",
  "Difficulty sleeping",
];

function PregnancySymptoms() {
  const navigate = useNavigate();

  const [selectedSymptoms, setSelectedSymptoms] = useState<
    string[]
  >([]);

  const [severity, setSeverity] = useState("Mild");

  const [savedSymptoms, setSavedSymptoms] = useState<Symptom[]>(
    []
  );

  useEffect(() => {
    const saved = localStorage.getItem(
      "pregnancySymptoms"
    );

    if (saved) {
      setSavedSymptoms(JSON.parse(saved));
    }
  }, []);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom]
    );
  };

  const saveSymptoms = () => {
    if (selectedSymptoms.length === 0) {
      return;
    }

    const newSymptoms: Symptom[] = selectedSymptoms.map(
      (symptom) => ({
        id: Date.now() + Math.random(),
        name: symptom,
        severity,
      })
    );

    const updatedSymptoms = [
      ...savedSymptoms,
      ...newSymptoms,
    ];

    setSavedSymptoms(updatedSymptoms);

    localStorage.setItem(
      "pregnancySymptoms",
      JSON.stringify(updatedSymptoms)
    );

    setSelectedSymptoms([]);
    setSeverity("Mild");
  };

  const removeSymptom = (id: number) => {
    const updatedSymptoms = savedSymptoms.filter(
      (symptom) => symptom.id !== id
    );

    setSavedSymptoms(updatedSymptoms);

    localStorage.setItem(
      "pregnancySymptoms",
      JSON.stringify(updatedSymptoms)
    );
  };

  return (
    <div className="min-h-screen bg-pink-50 pb-10">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex max-w-md items-center gap-4">

          <button
            onClick={() =>
              navigate("/pregnancy-tracker")
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-lg text-pink-600"
          >
            ←
          </button>

          <div>
            <h1 className="text-2xl font-bold text-pink-700">
              Pregnancy Symptoms 🩺
            </h1>

            <p className="text-sm text-gray-500">
              Keep track of how you're feeling
            </p>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">
              🩺
            </div>

            <div>
              <p className="text-sm opacity-80">
                Today's check-in
              </p>

              <h2 className="text-2xl font-bold">
                How are you feeling?
              </h2>
            </div>

          </div>

          <p className="mt-4 text-sm leading-6 opacity-90">
            Select any symptoms you're experiencing and
            choose how strong they feel.
          </p>

        </section>

        {/* Symptoms */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="text-lg font-bold text-gray-900">
            Select symptoms
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-3">

            {symptomOptions.map((symptom) => {
              const isSelected =
                selectedSymptoms.includes(symptom);

              return (
                <button
                  key={symptom}
                  onClick={() =>
                    toggleSymptom(symptom)
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-pink-500 bg-pink-50 text-pink-700"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">

                    <span className="text-sm font-semibold">
                      {symptom}
                    </span>

                    {isSelected && (
                      <span className="text-pink-600">
                        ✓
                      </span>
                    )}

                  </div>
                </button>
              );
            })}

          </div>

        </section>

        {/* Severity */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="text-lg font-bold text-gray-900">
            How strong are your symptoms?
          </h2>

          <div className="mt-4 grid grid-cols-3 gap-3">

            {["Mild", "Moderate", "Severe"].map(
              (level) => (
                <button
                  key={level}
                  onClick={() =>
                    setSeverity(level)
                  }
                  className={`rounded-xl py-3 text-sm font-semibold transition ${
                    severity === level
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {level}
                </button>
              )
            )}

          </div>

        </section>

        {/* Save */}
        <button
          onClick={saveSymptoms}
          disabled={selectedSymptoms.length === 0}
          className={`w-full rounded-xl py-3 font-semibold transition ${
            selectedSymptoms.length > 0
              ? "bg-pink-600 text-white hover:bg-pink-700"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          }`}
        >
          Save Symptoms
        </button>

        {/* Saved Symptoms */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-lg font-bold text-gray-900">
              Saved Symptoms
            </h2>

            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
              {savedSymptoms.length}
            </span>

          </div>

          {savedSymptoms.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-5 text-center">

              <p className="text-3xl">
                🌸
              </p>

              <p className="mt-2 text-sm text-gray-500">
                No symptoms recorded yet.
              </p>

            </div>
          ) : (
            <div className="mt-4 space-y-3">

              {savedSymptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className="flex items-center justify-between rounded-2xl bg-pink-50 p-4"
                >

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {symptom.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Severity: {symptom.severity}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeSymptom(symptom.id)
                    }
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-red-500"
                  >
                    Remove
                  </button>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* Health Reminder */}
        <section className="rounded-3xl border border-pink-200 bg-pink-50 p-5">

          <div className="flex gap-3">

            <span className="text-xl">
              🩺
            </span>

            <div>

              <h2 className="font-bold text-gray-900">
                Important
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                This tracker is for keeping personal notes
                about symptoms. If you feel unwell or have
                concerns about your pregnancy, speak with a
                qualified healthcare professional.
              </p>

            </div>

          </div>

        </section>

        {/* Back */}
        <button
          onClick={() =>
            navigate("/pregnancy-tracker")
          }
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Back to Pregnancy Dashboard
        </button>

      </main>

    </div>
  );
}

export default PregnancySymptoms;