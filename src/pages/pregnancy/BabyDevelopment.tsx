import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BabyDevelopment() {
  const navigate = useNavigate();

  const [currentWeek, setCurrentWeek] = useState<number | null>(null);

  useEffect(() => {
    const savedDueDate =
      localStorage.getItem("pregnancyDueDate");

    if (!savedDueDate) {
      return;
    }

    const dueDate = new Date(savedDueDate);
    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference =
      dueDate.getTime() - today.getTime();

    const daysRemaining = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    const pregnancyLength = 280;
    const daysPregnant =
      pregnancyLength - daysRemaining;

    const week =
      Math.floor(daysPregnant / 7) + 1;

    setCurrentWeek(
      Math.min(Math.max(week, 1), 40)
    );
  }, []);

  const getDevelopmentInfo = () => {
    if (!currentWeek) {
      return {
        title: "Your baby's journey",
        description:
          "Set your expected due date to see general information about your pregnancy stage.",
        emoji: "👶🏽",
      };
    }

    if (currentWeek <= 4) {
      return {
        title: "Early development",
        description:
          "This is an early stage of pregnancy. Important changes are beginning as the pregnancy develops.",
        emoji: "🌱",
      };
    }

    if (currentWeek <= 8) {
      return {
        title: "Early growth",
        description:
          "Early structures are developing rapidly during this stage of pregnancy.",
        emoji: "🌱",
      };
    }

    if (currentWeek <= 12) {
      return {
        title: "First trimester",
        description:
          "Major developmental changes are taking place during the first trimester.",
        emoji: "👶🏽",
      };
    }

    if (currentWeek <= 16) {
      return {
        title: "Growing and developing",
        description:
          "Your pregnancy continues to develop as your baby grows and changes.",
        emoji: "🌸",
      };
    }

    if (currentWeek <= 20) {
      return {
        title: "Halfway milestone",
        description:
          "You're around the halfway point of a typical 40-week pregnancy.",
        emoji: "✨",
      };
    }

    if (currentWeek <= 27) {
      return {
        title: "Second trimester",
        description:
          "Your pregnancy is continuing through the second trimester, with ongoing growth and development.",
        emoji: "💗",
      };
    }

    if (currentWeek <= 32) {
      return {
        title: "Third trimester",
        description:
          "Your pregnancy has entered the third trimester and continues toward the expected due date.",
        emoji: "🤰🏽",
      };
    }

    return {
      title: "Getting closer",
      description:
        "You're in the later stages of pregnancy. Continue following your healthcare team's guidance.",
      emoji: "🌸",
    };
  };

  const development = getDevelopmentInfo();

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
              Baby Development 👶🏽
            </h1>

            <p className="text-sm text-gray-500">
              Follow your pregnancy journey
            </p>
          </div>

        </div>

      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Current Week */}
        <section className="rounded-3xl bg-pink-600 p-6 text-center text-white shadow-lg">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-4xl">
            {development.emoji}
          </div>

          <p className="mt-4 text-sm opacity-80">
            Current pregnancy week
          </p>

          <h2 className="mt-1 text-4xl font-bold">
            {currentWeek
              ? `Week ${currentWeek}`
              : "Not set"}
          </h2>

          <p className="mt-2 text-sm opacity-90">
            {development.title}
          </p>

        </section>

        {/* Development Information */}
        <section className="rounded-3xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            What's happening? 🌸
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-600">
            {development.description}
          </p>

        </section>

        {/* Pregnancy Stage */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="font-bold text-gray-900">
            Pregnancy timeline
          </h2>

          <div className="mt-4 space-y-3">

            <div
              className={`rounded-2xl p-4 ${
                currentWeek !== null &&
                currentWeek <= 12
                  ? "bg-pink-100"
                  : "bg-gray-50"
              }`}
            >
              <p className="font-semibold text-gray-900">
                First Trimester
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Weeks 1–12
              </p>
            </div>

            <div
              className={`rounded-2xl p-4 ${
                currentWeek !== null &&
                currentWeek >= 13 &&
                currentWeek <= 27
                  ? "bg-pink-100"
                  : "bg-gray-50"
              }`}
            >
              <p className="font-semibold text-gray-900">
                Second Trimester
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Weeks 13–27
              </p>
            </div>

            <div
              className={`rounded-2xl p-4 ${
                currentWeek !== null &&
                currentWeek >= 28
                  ? "bg-pink-100"
                  : "bg-gray-50"
              }`}
            >
              <p className="font-semibold text-gray-900">
                Third Trimester
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Weeks 28–40
              </p>
            </div>

          </div>

        </section>

        {/* Health Reminder */}
        <section className="rounded-3xl border border-pink-200 bg-pink-50 p-5">

          <div className="flex gap-3">

            <span className="text-xl">
              🩺
            </span>

            <div>

              <h2 className="font-bold text-gray-900">
                A gentle reminder
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Pregnancy experiences can vary from person
                to person. Use this information for general
                education and continue following advice from
                your healthcare professional.
              </p>

            </div>

          </div>

        </section>

        {/* Back Button */}
        <button
          onClick={() =>
            navigate("/pregnancy-tracker")
          }
          className="w-full rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700"
        >
          Back to Pregnancy Dashboard
        </button>

      </main>

    </div>
  );
}

export default BabyDevelopment;