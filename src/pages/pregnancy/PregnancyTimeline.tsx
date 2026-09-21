import { useNavigate } from "react-router-dom";
import { usePregnancyWeek } from "../../hooks/usePregnancyWeek";

type TimelineItem = {
  week: number;
  title: string;
  description: string;
  icon: string;
  trimester: string;
};

const timelineItems: TimelineItem[] = [
  { week: 1, title: "Pregnancy begins", description: "Your pregnancy journey is starting. Your body is preparing for the weeks ahead.", icon: "🌱", trimester: "First Trimester" },
  { week: 4, title: "Early development", description: "Early pregnancy development is underway. This is a good time to focus on healthy habits.", icon: "🌸", trimester: "First Trimester" },
  { week: 8, title: "Baby is developing", description: "Important development continues as your pregnancy progresses.", icon: "👶🏽", trimester: "First Trimester" },
  { week: 12, title: "End of first trimester", description: "You are approaching the end of the first trimester. Keep attending recommended healthcare appointments.", icon: "✨", trimester: "First Trimester" },
  { week: 16, title: "Growing and changing", description: "Your body continues to change as your pregnancy progresses.", icon: "🤰🏽", trimester: "Second Trimester" },
  { week: 20, title: "Halfway point", description: "Around this stage, many people have an important pregnancy check-up. Follow your healthcare professional's advice.", icon: "💗", trimester: "Second Trimester" },
  { week: 24, title: "Continued growth", description: "Your pregnancy continues to progress. Continue looking after your wellbeing and attending appointments.", icon: "🌿", trimester: "Second Trimester" },
  { week: 28, title: "Third trimester begins", description: "You are entering the third trimester and moving closer to meeting your baby.", icon: "🌷", trimester: "Third Trimester" },
  { week: 32, title: "Getting closer", description: "Your pregnancy is progressing toward the final weeks. Continue preparing and attending your appointments.", icon: "🍼", trimester: "Third Trimester" },
  { week: 36, title: "Birth preparation", description: "This can be a useful time to review your birth preferences and hospital preparation.", icon: "🏥", trimester: "Third Trimester" },
  { week: 40, title: "Estimated due period", description: "Around this time, your baby may be ready to arrive. Your healthcare professional can guide you through the next steps.", icon: "👶🏽", trimester: "Third Trimester" },
];

function PregnancyTimeline() {
  const navigate = useNavigate();
  const { currentWeek, loading } = usePregnancyWeek();

  const currentStage =
    currentWeek === null
      ? "Set up your pregnancy to see your timeline."
      : currentWeek <= 12
      ? "First Trimester"
      : currentWeek <= 27
      ? "Second Trimester"
      : "Third Trimester";

  // The last milestone you've reached is "You are here"
  const reached = currentWeek === null ? [] : timelineItems.filter((i) => i.week <= currentWeek);
  const currentMilestoneWeek = reached.length ? reached[reached.length - 1].week : null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 pb-10">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex max-w-md items-center gap-4">
          <button
            onClick={() => navigate("/pregnancy-tracker")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-lg text-pink-600"
            aria-label="Back to pregnancy dashboard"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-pink-700">Pregnancy Timeline 🌸</h1>
            <p className="text-sm text-gray-500">Follow your journey week by week</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Current Stage */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Your current stage</p>
              <h2 className="mt-1 text-2xl font-bold">{currentWeek ? `Week ${currentWeek}` : "Timeline"}</h2>
              <p className="mt-2 text-sm opacity-80">{currentStage}</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">🤰🏽</div>
          </div>

          {!currentWeek && (
            <button
              onClick={() => navigate("/pregnancy-tracker/setup")}
              className="mt-5 w-full rounded-xl bg-white py-3 text-sm font-semibold text-pink-600"
            >
              Set Up Pregnancy
            </button>
          )}
        </section>

        {/* Trimester Overview */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Pregnancy journey</h2>
          <p className="mt-1 text-sm text-gray-500">Your pregnancy is divided into three trimesters.</p>

          <div className="mt-5 space-y-3">
            <div className={`rounded-2xl p-4 ${currentWeek !== null && currentWeek <= 12 ? "bg-pink-100" : "bg-gray-50"}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌱</span>
                <div>
                  <p className="font-semibold text-gray-900">First Trimester</p>
                  <p className="text-xs text-gray-500">Weeks 1–12</p>
                </div>
              </div>
            </div>
            <div className={`rounded-2xl p-4 ${currentWeek !== null && currentWeek >= 13 && currentWeek <= 27 ? "bg-purple-100" : "bg-gray-50"}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌸</span>
                <div>
                  <p className="font-semibold text-gray-900">Second Trimester</p>
                  <p className="text-xs text-gray-500">Weeks 13–27</p>
                </div>
              </div>
            </div>
            <div className={`rounded-2xl p-4 ${currentWeek !== null && currentWeek >= 28 ? "bg-blue-100" : "bg-gray-50"}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌷</span>
                <div>
                  <p className="font-semibold text-gray-900">Third Trimester</p>
                  <p className="text-xs text-gray-500">Weeks 28–40</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Week-by-week timeline</h2>
            <p className="mt-1 text-sm text-gray-500">Key stages throughout your pregnancy</p>
          </div>

          <div className="space-y-4">
            {timelineItems.map((item) => {
              const completed = currentWeek !== null && item.week <= currentWeek;
              const isCurrent = item.week === currentMilestoneWeek;

              return (
                <div key={item.week} className={`rounded-3xl bg-white p-5 shadow-sm ${isCurrent ? "ring-2 ring-pink-300" : ""}`}>
                  <div className="flex gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${completed ? "bg-pink-100" : "bg-gray-100"}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">Week {item.week}</p>
                          <h3 className="mt-1 font-bold text-gray-900">{item.title}</h3>
                        </div>
                        {isCurrent && (
                          <span className="rounded-full bg-pink-100 px-2 py-1 text-xs font-semibold text-pink-700">
                            You are here
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-gray-500">{item.description}</p>
                      <p className="mt-3 text-xs font-medium text-gray-400">{item.trimester}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Important Note */}
        <section className="rounded-3xl border border-pink-200 bg-pink-50 p-5">
          <div className="flex gap-3">
            <span className="text-xl">💗</span>
            <p className="text-sm leading-6 text-gray-600">
              Pregnancy timelines are estimates and can vary between individuals. Always follow the
              guidance of your qualified healthcare professional.
            </p>
          </div>
        </section>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/pregnancy-tracker")}
            className="rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
          >
            Pregnancy Home
          </button>
          <button
            onClick={() => navigate("/pregnancy-tracker/baby-development")}
            className="rounded-xl bg-pink-600 py-3 font-semibold text-white"
          >
            Baby Development
          </button>
        </div>
      </main>
    </div>
  );
}

export default PregnancyTimeline;