import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ContractionRecord {
  id: number;
  startTime: string;
  duration: number;
  interval: number | null;
}

function ContractionTimer() {
  const navigate = useNavigate();

  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [contractions, setContractions] = useState<
    ContractionRecord[]
  >([]);

  useEffect(() => {
    const saved =
      localStorage.getItem("contractionRecords");

    if (saved) {
      try {
        setContractions(JSON.parse(saved));
      } catch {
        setContractions([]);
      }
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((previous) => previous + 1);
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startContraction = () => {
    setSeconds(0);
    setIsRunning(true);
  };

  const stopContraction = () => {
    if (seconds === 0) {
      setIsRunning(false);
      return;
    }

    const now = new Date();

    const previousContraction =
      contractions[0];

    let interval: number | null = null;

    if (previousContraction) {
      const previousTime = new Date(
        previousContraction.startTime
      ).getTime();

      interval = Math.max(
        Math.round(
          (now.getTime() - previousTime) / 1000
        ),
        0
      );
    }

    const newRecord: ContractionRecord = {
      id: Date.now(),
      startTime: now.toISOString(),
      duration: seconds,
      interval,
    };

    const updatedRecords = [
      newRecord,
      ...contractions,
    ];

    setContractions(updatedRecords);

    localStorage.setItem(
      "contractionRecords",
      JSON.stringify(updatedRecords)
    );

    setIsRunning(false);
    setSeconds(0);
  };

  const clearHistory = () => {
    localStorage.removeItem(
      "contractionRecords"
    );

    setContractions([]);
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
            <h1 className="text-xl font-bold text-pink-700">
              Contraction Timer ⏱️
            </h1>

            <p className="text-xs text-gray-500">
              Track the timing of contractions
            </p>
          </div>

        </div>

      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">
              ⏱️
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Contraction Timer
              </h2>

              <p className="mt-2 text-sm leading-6 opacity-90">
                Use the timer to record when contractions
                start and how long they last.
              </p>
            </div>

          </div>

        </section>

        {/* Important Information */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xl">
              💡
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Important
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Contractions can vary throughout labour.
                Follow the guidance provided by your
                healthcare professional or maternity care
                team. If you are concerned or think you may
                be in labour, contact your healthcare team.
              </p>
            </div>

          </div>

        </section>

        {/* Timer */}
        <section className="rounded-3xl bg-white p-6 text-center shadow-sm">

          <p className="text-sm font-medium text-gray-500">
            Current contraction
          </p>

          <div className="mt-6 flex h-44 w-44 mx-auto items-center justify-center rounded-full bg-pink-100">

            <div>
              <p className="text-5xl font-bold text-pink-700">
                {formatTime(seconds)}
              </p>

              <p className="mt-2 text-xs text-pink-600">
                {isRunning
                  ? "Contraction in progress"
                  : "Ready"}
              </p>
            </div>

          </div>

          <button
            onClick={
              isRunning
                ? stopContraction
                : startContraction
            }
            className={`mt-7 w-full rounded-2xl py-4 font-bold text-white ${
              isRunning
                ? "bg-gray-700"
                : "bg-pink-600"
            }`}
          >
            {isRunning
              ? "End Contraction"
              : "Start Contraction"}
          </button>

          {!isRunning && seconds === 0 && (
            <p className="mt-3 text-xs text-gray-400">
              Tap Start when a contraction begins.
            </p>
          )}

        </section>

        {/* Contraction History */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-gray-900">
                Recent contractions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your saved contraction history
              </p>
            </div>

            {contractions.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs font-semibold text-red-500"
              >
                Clear
              </button>
            )}

          </div>

          {contractions.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-pink-50 p-5 text-center">

              <p className="text-2xl">
                ⏱️
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-700">
                No contractions recorded
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Your contraction records will appear here.
              </p>

            </div>
          ) : (
            <div className="mt-4 space-y-3">

              {contractions.map(
                (contraction, index) => (
                  <div
                    key={contraction.id}
                    className="rounded-2xl bg-pink-50 p-4"
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="font-semibold text-gray-900">
                          Contraction{" "}
                          {contractions.length -
                            index}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(
                            contraction.startTime
                          ).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-bold text-pink-700">
                          {formatTime(
                            contraction.duration
                          )}
                        </p>

                        <p className="text-xs text-gray-500">
                          Duration
                        </p>

                      </div>

                    </div>

                    {contraction.interval !==
                      null && (
                      <div className="mt-3 border-t border-pink-100 pt-3">

                        <p className="text-xs text-gray-500">
                          Time since previous contraction
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          {formatTime(
                            contraction.interval
                          )}
                        </p>

                      </div>
                    )}

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* Back to Pregnancy */}
        <button
          onClick={() =>
            navigate("/pregnancy-tracker")
          }
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Back to Pregnancy Tracker
        </button>

      </main>

    </div>
  );
}

export default ContractionTimer;