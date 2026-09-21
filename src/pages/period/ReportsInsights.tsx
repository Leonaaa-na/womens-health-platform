import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

type Count = { name: string; total: number };

type Insights = {
  isPremium: boolean;
  historyMonths: number | "all";
  totalCycles: number;
  averageCycleLength: number | null;
  shortestCycle: number | null;
  longestCycle: number | null;
  isRegular: boolean;
  averagePeriodLength: number | null;
  daysLogged: number;
  topSymptoms: Count[];
  moods: Count[];
  flow: Count[];
  upgradeHint: string | null;
};

type Advanced = {
  hasEnoughData: boolean;
  message?: string;
  regularity?: string;
  variability?: number;
  trend?: string;
  predictionConfidence?: string;
};

const show = (value: number | null, unit: string) =>
  value === null ? "—" : `${value} ${unit}`;

function CountList({ items, empty }: { items: Count[]; empty: string }) {
  if (!items.length) return <p className="mt-3 text-sm text-gray-400">{empty}</p>;
  const max = Math.max(...items.map((i) => i.total));
  return (
    <div className="mt-3 space-y-2">
      {items.map((item) => (
        <div key={item.name}>
          <div className="flex justify-between text-sm">
            <span className="capitalize text-gray-700">{item.name}</span>
            <span className="text-gray-500">{item.total}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-pink-500"
              style={{ width: `${(item.total / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportsInsights() {
  const navigate = useNavigate();

  const [insights, setInsights] = useState<Insights | null>(null);
  const [advanced, setAdvanced] = useState<Advanced | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get("/cycles/insights");
        const data: Insights = response.data.data;
        setInsights(data);

        // Premium users also get the advanced analysis
        if (data.isPremium) {
          try {
            const adv = await apiClient.get("/insights/cycle");
            setAdvanced(adv.data.data);
          } catch {
            setAdvanced(null);
          }
        }
      } catch {
        setInsights(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="text-gray-600">Loading your reports...</p>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Reports & Insights</h1>
            <p className="text-sm text-gray-500">
              {insights?.historyMonths === "all"
                ? "Your full cycle history"
                : `Your last ${insights?.historyMonths ?? 3} months`}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">
        {!insights || insights.totalCycles === 0 ? (
          <section className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <p className="text-3xl">📊</p>
            <h2 className="mt-3 font-bold text-gray-900">No reports yet</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Log your periods, flow and symptoms, and your reports will build up here.
            </p>
            <button
              onClick={() => navigate("/period-tracker/flow")}
              className="mt-5 w-full rounded-xl bg-pink-600 py-3 text-sm font-semibold text-white"
            >
              Start tracking
            </button>
          </section>
        ) : (
          <>
            {/* Summary */}
            <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">
              <p className="text-sm opacity-80">Average cycle</p>
              <h2 className="mt-1 text-4xl font-bold">
                {show(insights.averageCycleLength, "days")}
              </h2>
              <p className="mt-2 text-sm opacity-90">
                {insights.totalCycles} cycle{insights.totalCycles !== 1 ? "s" : ""} tracked ·{" "}
                {insights.isRegular ? "Regular pattern" : "Pattern still forming"}
              </p>
            </section>

            {/* Key numbers */}
            <section className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">Average period</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{show(insights.averagePeriodLength, "days")}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">Days logged</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{insights.daysLogged}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">Shortest cycle</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{show(insights.shortestCycle, "days")}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-500">Longest cycle</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{show(insights.longestCycle, "days")}</p>
              </div>
            </section>

            {/* Symptoms */}
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="font-bold text-gray-900">Most common symptoms</h2>
              <CountList items={insights.topSymptoms} empty="No symptoms logged yet." />
            </section>

            {/* Moods */}
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="font-bold text-gray-900">Your moods</h2>
              <CountList items={insights.moods} empty="No moods logged yet." />
            </section>

            {/* Flow */}
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="font-bold text-gray-900">Flow levels</h2>
              <CountList items={insights.flow} empty="No flow logged yet." />
            </section>

            {/* Advanced (premium) */}
            {insights.isPremium && advanced && (
              <section className="rounded-3xl bg-white p-5 shadow-sm">
                <h2 className="font-bold text-gray-900">Advanced analysis 💎</h2>
                {advanced.hasEnoughData ? (
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <p>Regularity: <b className="capitalize">{advanced.regularity}</b></p>
                    <p>Varies by about <b>{advanced.variability} days</b></p>
                    <p>Trend: <b className="capitalize">{advanced.trend}</b></p>
                    <p>Prediction confidence: <b className="capitalize">{advanced.predictionConfidence}</b></p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">{advanced.message}</p>
                )}
              </section>
            )}

            {/* Upgrade prompt */}
            {!insights.isPremium && insights.upgradeHint && (
              <section className="rounded-3xl border border-purple-200 bg-purple-50 p-5">
                <h2 className="font-bold text-gray-900">Want deeper insights? 💎</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">{insights.upgradeHint}</p>
                <button
                  onClick={() => navigate("/premium")}
                  className="mt-4 w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white"
                >
                  View Premium Plans
                </button>
              </section>
            )}
          </>
        )}

        <p className="text-center text-xs leading-5 text-gray-400">
          These reports come from your own logs and are not medical advice.
        </p>
      </main>
    </div>
  );
}

export default ReportsInsights;