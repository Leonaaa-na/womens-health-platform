import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWeeklyTip, type WeeklyTip } from "../api/weeklyTipApi";

function WeeklyTipBanner() {
  const [tip, setTip] = useState<WeeklyTip | null>(null);

  useEffect(() => {
    getWeeklyTip()
      .then(setTip)
      .catch(() => setTip(null));
  }, []);

  if (!tip) return null; // nothing featured yet — show nothing rather than an empty box

  return (
    <Link
      to={`/health-library/article/${tip.slug}`}
      className="block rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white shadow-lg transition hover:opacity-95"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl">
          {tip.category?.icon || "🌸"}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-90">This week's health tip</p>
          <h3 className="mt-1 text-lg font-bold leading-6">{tip.title}</h3>
          {tip.summary ? <p className="mt-2 text-sm leading-6 opacity-90">{tip.summary}</p> : null}
          <p className="mt-3 text-sm font-semibold">
            {tip.category?.name}
            {tip.readTimeMinutes ? ` · ${tip.readTimeMinutes} min read` : ""} · Read now →
          </p>
        </div>
      </div>
    </Link>
  );
}

export default WeeklyTipBanner;