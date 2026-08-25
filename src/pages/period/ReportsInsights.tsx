import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type PeriodRecord = {
  date: string;
  flow?: string;
  symptoms?: string[];
};

function ReportsInsights() {
  const navigate = useNavigate();

  const [records, setRecords] = useState<PeriodRecord[]>([]);
  const [averageCycle, setAverageCycle] = useState<number | null>(null);
  const [trackedDays, setTrackedDays] = useState(0);

  useEffect(() => {
    const savedRecords = localStorage.getItem("periodRecords");

    if (!savedRecords) {
      return;
    }

    try {
      const parsedRecords = JSON.parse(savedRecords);

      if (Array.isArray(parsedRecords)) {
        setRecords(parsedRecords);
        setTrackedDays(parsedRecords.length);

        calculateAverageCycle(parsedRecords);
      }
    } catch {
      setRecords([]);
    }
  }, []);

  const calculateAverageCycle = (data: PeriodRecord[]) => {
    const validDates = data
      .map((record) => new Date(record.date))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    if (validDates.length < 2) {
      setAverageCycle(null);
      return;
    }

    const differences: number[] = [];

    for (let i = 1; i < validDates.length; i++) {
      const difference =
        (validDates[i].getTime() -
          validDates[i - 1].getTime()) /
        (1000 * 60 * 60 * 24);

      if (difference > 0 && difference <= 60) {
        differences.push(Math.round(difference));
      }
    }

    if (differences.length === 0) {
      setAverageCycle(null);
      return;
    }

    const total = differences.reduce(
      (sum, value) => sum + value,
      0
    );

    setAverageCycle(
      Math.round(total / differences.length)
    );
  };

  const getFlowCount = (flow: string) => {
    return records.filter(
      (record) =>
        record.flow?.toLowerCase() === flow.toLowerCase()
    ).length;
  };

  const getMostCommonFlow = () => {
    if (records.length === 0) {
      return "No data yet";
    }

    const flows = ["light", "medium", "heavy"];

    let mostCommon = flows[0];
    let highestCount = getFlowCount(flows[0]);

    flows.forEach((flow) => {
      const count = getFlowCount(flow);

      if (count > highestCount) {
        highestCount = count;
        mostCommon = flow;
      }
    });

    return highestCount === 0
      ? "No data yet"
      : mostCommon.charAt(0).toUpperCase() +
          mostCommon.slice(1);
  };

  const getLatestDate = () => {
    if (records.length === 0) {
      return "No data yet";
    }

    const validDates = records
      .map((record) => new Date(record.date))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => b.getTime() - a.getTime());

    if (validDates.length === 0) {
      return "No data yet";
    }

    return validDates[0].toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const insights =
    records.length === 0
      ? [
          "Start recording your cycle information to see personalized insights.",
          "The more consistently you track, the more useful your reports can become.",
          "Use the Daily Logs and Flow Tracker to build your history.",
        ]
      : [
          `You have tracked ${trackedDays} ${
            trackedDays === 1 ? "record" : "records"
          } so far.`,
          averageCycle
            ? `Your current estimated average cycle length is ${averageCycle} days.`
            : "Continue tracking to estimate your average cycle length.",
          `Your most frequently recorded flow level is ${getMostCommonFlow()}.`,
        ];

  return (
    <div className="min-h-screen bg-pink-50 pb-10">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex max-w-md items-center gap-4">

          <button
            onClick={() =>
              navigate("/period-tracker")
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-lg text-pink-600"
          >
            ←
          </button>

          <div>
            <h1 className="text-2xl font-bold text-pink-700">
              Reports & Insights 📊
            </h1>

            <p className="text-sm text-gray-500">
              Understand your cycle patterns
            </p>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">
              📊
            </div>

            <div>
              <p className="text-sm opacity-80">
                Your cycle history
              </p>

              <h2 className="text-2xl font-bold">
                Your insights
              </h2>
            </div>

          </div>

          <p className="mt-4 text-sm leading-6 opacity-90">
            Review the information you've recorded and
            look for patterns over time.
          </p>

        </section>

        {/* Summary */}
        <section>

          <h2 className="mb-3 text-lg font-bold text-gray-900">
            Cycle Summary
          </h2>

          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                📅
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Average cycle
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {averageCycle
                  ? `${averageCycle} days`
                  : "—"}
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                📝
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Records tracked
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {trackedDays}
              </p>

            </div>

          </div>

        </section>

        {/* Flow Overview */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Flow Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your recorded flow levels
              </p>
            </div>

            <span className="text-2xl">
              💧
            </span>

          </div>

          <div className="mt-5 space-y-4">

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">
                  Light
                </span>

                <span className="font-semibold text-gray-900">
                  {getFlowCount("light")}
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-pink-300"
                  style={{
                    width: `${Math.min(
                      getFlowCount("light") * 10,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">
                  Medium
                </span>

                <span className="font-semibold text-gray-900">
                  {getFlowCount("medium")}
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-pink-400"
                  style={{
                    width: `${Math.min(
                      getFlowCount("medium") * 10,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">
                  Heavy
                </span>

                <span className="font-semibold text-gray-900">
                  {getFlowCount("heavy")}
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-pink-600"
                  style={{
                    width: `${Math.min(
                      getFlowCount("heavy") * 10,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

          </div>

        </section>

        {/* Latest Record */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
              🌸
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Latest recorded date
              </p>

              <h3 className="mt-1 font-bold text-gray-900">
                {getLatestDate()}
              </h3>

            </div>

          </div>

        </section>

        {/* Insights */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              💡
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Your Insights
              </h2>

              <p className="text-sm text-gray-500">
                Helpful observations from your data
              </p>
            </div>

          </div>

          <div className="mt-4 space-y-3">

            {insights.map((insight, index) => (
              <div
                key={index}
                className="rounded-2xl bg-pink-50 p-4"
              >
                <p className="text-sm leading-6 text-gray-700">
                  {insight}
                </p>
              </div>
            ))}

          </div>

        </section>

        {/* Important Note */}
        <section className="rounded-3xl border border-pink-200 bg-pink-50 p-5">

          <div className="flex gap-3">

            <span className="text-xl">
              💗
            </span>

            <div>

              <h2 className="font-bold text-gray-900">
                Remember
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                These reports are designed to help you
                understand your tracking history. They are
                not a diagnosis. If you notice something
                concerning or unusual, speak with a qualified
                healthcare professional.
              </p>

            </div>

          </div>

        </section>

        {/* Back */}
        <button
          onClick={() =>
            navigate("/period-tracker")
          }
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Back to Period Tracker
        </button>

      </main>

    </div>
  );
}

export default ReportsInsights;