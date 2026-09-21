import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

type BackendContraction = {
  id: string;
  startedAt: string;
  durationSeconds: number | null;
  intervalSeconds: number | null;
};

type Summary = {
  shouldGoToHospital: boolean;
  lastHourCount: number;
  averageIntervalSeconds: number | null;
  averageDurationSeconds: number | null;
};

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

function ContractionTimer() {
  const navigate = useNavigate();

  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [startedAt, setStartedAt] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [contractions, setContractions] = useState<BackendContraction[]>([]); // newest first
  const [summary, setSummary] = useState<Summary | null>(null);
  const [message, setMessage] = useState("");

  // Load a session's contractions + the 5-1-1 summary
  const loadSession = useCallback(async (id: string) => {
    const response = await apiClient.get(`/pregnancy/contractions/${id}`);
    const data = response.data.data;
    setContractions([...(data.session.contractions || [])].reverse());
    setSummary(data.summary);
  }, []);

  // On open: pick up the latest session if it's still running
  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get("/pregnancy/contractions");
        const latest = response.data?.data?.[0];
        if (latest && !latest.endedAt) {
          setSessionId(latest.id);
          await loadSession(latest.id);
        }
      } catch {
        // No active pregnancy or no sessions yet
      }
    };
    load();
  }, [loadSession]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isRunning) {
      timer = setInterval(() => setSeconds((p) => p + 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  const startContraction = () => {
    setMessage("");
    setSeconds(0);
    setStartedAt(new Date().toISOString());
    setIsRunning(true);
  };

  const stopContraction = async () => {
    setIsRunning(false);

    if (seconds === 0 || !startedAt) {
      setSeconds(0);
      return;
    }

    const endedAt = new Date().toISOString();

    try {
      // First contraction of a new session → create the session
      let id = sessionId;
      if (!id) {
        const started = await apiClient.post("/pregnancy/contractions/start");
        id = started.data.data.id as string;
        setSessionId(id);
      }

      await apiClient.post(`/pregnancy/contractions/${id}/add`, { startedAt, endedAt });
      await loadSession(id);
    } catch (error) {
      setMessage(errorMessage(error, "Could not save the contraction."));
    } finally {
      setSeconds(0);
      setStartedAt(null);
    }
  };

  // Close the current session; the next contraction starts a fresh one
  const clearHistory = async () => {
    if (!sessionId) return;
    try {
      await apiClient.post(`/pregnancy/contractions/${sessionId}/end`);
      setSessionId(null);
      setContractions([]);
      setSummary(null);
    } catch (error) {
      setMessage(errorMessage(error, "Could not clear history."));
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
            <h1 className="text-xl font-bold text-pink-700">Contraction Timer ⏱️</h1>
            <p className="text-xs text-gray-500">Track the timing of contractions</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">⏱️</div>
            <div>
              <h2 className="text-xl font-bold">Contraction Timer</h2>
              <p className="mt-2 text-sm leading-6 opacity-90">
                Use the timer to record when contractions start and how long they last.
              </p>
            </div>
          </div>
        </section>

        {/* 5-1-1 alert */}
        {summary?.shouldGoToHospital && (
          <section className="rounded-3xl border-2 border-red-300 bg-red-50 p-5">
            <div className="flex gap-3">
              <span className="text-2xl">🚨</span>
              <div>
                <h2 className="font-bold text-red-700">Contact your maternity team</h2>
                <p className="mt-1 text-sm leading-6 text-red-700">
                  Your contractions have been about 5 minutes apart, lasting about 1 minute, for an
                  hour. This is a common sign it may be time to call your hospital or midwife.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Important Information */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xl">💡</div>
            <div>
              <h2 className="font-bold text-gray-900">Important</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Contractions can vary throughout labour. Follow the guidance provided by your
                healthcare professional or maternity care team. If you are concerned or think you may
                be in labour, contact your healthcare team.
              </p>
            </div>
          </div>
        </section>

        {/* Timer */}
        <section className="rounded-3xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-500">Current contraction</p>

          <div className="mx-auto mt-6 flex h-44 w-44 items-center justify-center rounded-full bg-pink-100">
            <div>
              <p className="text-5xl font-bold text-pink-700">{formatTime(seconds)}</p>
              <p className="mt-2 text-xs text-pink-600">{isRunning ? "Contraction in progress" : "Ready"}</p>
            </div>
          </div>

          <button
            onClick={isRunning ? stopContraction : startContraction}
            className={`mt-7 w-full rounded-2xl py-4 font-bold text-white ${isRunning ? "bg-gray-700" : "bg-pink-600"}`}
          >
            {isRunning ? "End Contraction" : "Start Contraction"}
          </button>

          {!isRunning && seconds === 0 && (
            <p className="mt-3 text-xs text-gray-400">Tap Start when a contraction begins.</p>
          )}

          {message && <p className="mt-3 text-sm font-medium text-red-600">{message}</p>}
        </section>

        {/* Contraction History */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">Recent contractions</h2>
              <p className="mt-1 text-sm text-gray-500">Your current timing session</p>
            </div>
            {contractions.length > 0 && (
              <button onClick={clearHistory} className="text-xs font-semibold text-red-500">
                Clear
              </button>
            )}
          </div>

          {contractions.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-pink-50 p-5 text-center">
              <p className="text-2xl">⏱️</p>
              <p className="mt-2 text-sm font-semibold text-gray-700">No contractions recorded</p>
              <p className="mt-1 text-xs text-gray-500">Your contraction records will appear here.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {contractions.map((c, index) => (
                <div key={c.id} className="rounded-2xl bg-pink-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Contraction {contractions.length - index}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(c.startedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-pink-700">{formatTime(c.durationSeconds || 0)}</p>
                      <p className="text-xs text-gray-500">Duration</p>
                    </div>
                  </div>

                  {c.intervalSeconds !== null && (
                    <div className="mt-3 border-t border-pink-100 pt-3">
                      <p className="text-xs text-gray-500">Time since previous contraction</p>
                      <p className="mt-1 text-sm font-semibold text-gray-700">{formatTime(c.intervalSeconds)}</p>
                    </div>
                  )}
                </div>
              ))}
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

export default ContractionTimer;