import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

// One row on screen = one symptom inside a saved log
type Symptom = {
  key: string; // "logId:name"
  logId: string;
  name: string;
  severity: string;
  date: string;
};

type BackendLog = {
  id: string;
  date: string;
  symptoms: string[] | null;
  severity: string | null;
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

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

function PregnancySymptoms() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState("Mild");
  const [logs, setLogs] = useState<BackendLog[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get("/pregnancy/health-logs");
        setLogs(response.data?.data || []);
      } catch (error) {
        setLogs([]);
        setMessage(errorMessage(error, ""));
      }
    };
    load();
  }, []);

  // Flatten logs into individual symptoms for the list
  const savedSymptoms: Symptom[] = logs.flatMap((log) =>
    (log.symptoms || []).map((name) => ({
      key: `${log.id}:${name}`,
      logId: log.id,
      name,
      severity: log.severity || "—",
      date: log.date,
    }))
  );

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((current) =>
      current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom]
    );
  };

  const saveSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await apiClient.post("/pregnancy/health-logs", {
        date: today,
        symptoms: selectedSymptoms,
        severity,
      });
      setLogs((prev) => [response.data.data, ...prev]);
      setSelectedSymptoms([]);
      setSeverity("Mild");
      setMessage("Symptoms saved 🌸");
    } catch (error) {
      setMessage(errorMessage(error, "Could not save symptoms."));
    } finally {
      setSaving(false);
    }
  };

  // Remove one symptom; if the log is then empty, delete the whole log
  const removeSymptom = async (symptom: Symptom) => {
    const log = logs.find((l) => l.id === symptom.logId);
    if (!log) return;

    const remaining = (log.symptoms || []).filter((s) => s !== symptom.name);
    const previous = logs;

    try {
      if (remaining.length === 0) {
        setLogs((prev) => prev.filter((l) => l.id !== log.id));
        await apiClient.delete(`/pregnancy/health-logs/${log.id}`);
      } else {
        setLogs((prev) => prev.map((l) => (l.id === log.id ? { ...l, symptoms: remaining } : l)));
        await apiClient.put(`/pregnancy/health-logs/${log.id}`, { symptoms: remaining });
      }
    } catch (error) {
      setLogs(previous);
      setMessage(errorMessage(error, "Could not remove symptom."));
    }
  };

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
            <h1 className="text-2xl font-bold text-pink-700">Pregnancy Symptoms 🩺</h1>
            <p className="text-sm text-gray-500">Keep track of how you're feeling</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">🩺</div>
            <div>
              <p className="text-sm opacity-80">Today's check-in</p>
              <h2 className="text-2xl font-bold">How are you feeling?</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 opacity-90">
            Select any symptoms you're experiencing and choose how strong they feel.
          </p>
        </section>

        {/* Symptoms */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Select symptoms</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {symptomOptions.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom);
              return (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isSelected ? "border-pink-500 bg-pink-50 text-pink-700" : "border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{symptom}</span>
                    {isSelected && <span className="text-pink-600">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Severity */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">How strong are your symptoms?</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {["Mild", "Moderate", "Severe"].map((level) => (
              <button
                key={level}
                onClick={() => setSeverity(level)}
                className={`rounded-xl py-3 text-sm font-semibold transition ${
                  severity === level ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        {message && (
          <div className="rounded-xl bg-pink-100 p-3 text-center text-sm font-medium text-pink-700">
            {message}
          </div>
        )}

        {/* Save */}
        <button
          onClick={saveSymptoms}
          disabled={selectedSymptoms.length === 0 || saving}
          className={`w-full rounded-xl py-3 font-semibold transition ${
            selectedSymptoms.length > 0 && !saving
              ? "bg-pink-600 text-white hover:bg-pink-700"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          }`}
        >
          {saving ? "Saving..." : "Save Symptoms"}
        </button>

        {/* Saved Symptoms */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Saved Symptoms</h2>
            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
              {savedSymptoms.length}
            </span>
          </div>

          {savedSymptoms.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-5 text-center">
              <p className="text-3xl">🌸</p>
              <p className="mt-2 text-sm text-gray-500">No symptoms recorded yet.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {savedSymptoms.map((symptom) => (
                <div key={symptom.key} className="flex items-center justify-between rounded-2xl bg-pink-50 p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{symptom.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Severity: {symptom.severity} · {symptom.date}
                    </p>
                  </div>
                  <button
                    onClick={() => removeSymptom(symptom)}
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
            <span className="text-xl">🩺</span>
            <div>
              <h2 className="font-bold text-gray-900">Important</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                This tracker is for keeping personal notes about symptoms. If you feel unwell or have
                concerns about your pregnancy, speak with a qualified healthcare professional.
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

export default PregnancySymptoms;