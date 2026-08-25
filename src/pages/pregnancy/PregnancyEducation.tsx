import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PregnancyEducation() {
  const navigate = useNavigate();

  const [currentWeek, setCurrentWeek] = useState<number | null>(null);

  useEffect(() => {
    const savedDueDate = localStorage.getItem("pregnancyDueDate");

    if (!savedDueDate) {
      return;
    }

    const due = new Date(savedDueDate);
    const today = new Date();

    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference = due.getTime() - today.getTime();

    const remainingDays = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    const pregnancyLength = 280;
    const daysPregnant = pregnancyLength - remainingDays;

    const calculatedWeek =
      Math.floor(daysPregnant / 7) + 1;

    setCurrentWeek(
      Math.min(Math.max(calculatedWeek, 1), 40)
    );
  }, []);

  const getTrimester = () => {
    if (currentWeek === null) {
      return "Pregnancy education";
    }

    if (currentWeek <= 12) {
      return "First trimester";
    }

    if (currentWeek <= 27) {
      return "Second trimester";
    }

    return "Third trimester";
  };

  const getWeeklyTitle = () => {
    if (currentWeek === null) {
      return "Your pregnancy journey";
    }

    return `Understanding Week ${currentWeek}`;
  };

  const getWeeklyDescription = () => {
    if (currentWeek === null) {
      return "Set your pregnancy due date to see education that is relevant to your current stage.";
    }

    if (currentWeek <= 4) {
      return "Your pregnancy journey is beginning. Learn about early pregnancy and the changes happening in your body.";
    }

    if (currentWeek <= 12) {
      return "Your baby is developing quickly. Learn about early pregnancy changes, prenatal care and healthy habits.";
    }

    if (currentWeek <= 27) {
      return "Your pregnancy is progressing. Learn about your growing baby, body changes and preparing for the months ahead.";
    }

    return "You are in the final stage of pregnancy. Learn about preparing for birth, hospital planning and the changes ahead.";
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
              Pregnancy Education 📚
            </h1>

            <p className="text-xs text-gray-500">
              Learn about your pregnancy journey
            </p>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Current Stage */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <p className="text-sm opacity-80">
            {getTrimester()}
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {currentWeek
              ? `Week ${currentWeek}`
              : "Your pregnancy"}
          </h2>

          <p className="mt-3 text-sm leading-6 opacity-90">
            {getWeeklyDescription()}
          </p>

        </section>

        {/* Weekly Education */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-2xl">
              🌸
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                {getWeeklyTitle()}
              </h2>

              <p className="text-sm text-gray-500">
                Information for your stage
              </p>
            </div>

          </div>

          <div className="mt-5 rounded-2xl bg-pink-50 p-4">

            <h3 className="font-semibold text-gray-900">
              What to know
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-700">
              Pregnancy can bring many physical and emotional
              changes. Keeping track of your appointments,
              symptoms and wellbeing can help you have useful
              conversations with your healthcare professional.
            </p>

          </div>

        </section>

        {/* Pregnancy Topics */}
        <section>

          <h2 className="mb-3 text-lg font-bold text-gray-900">
            Pregnancy topics
          </h2>

          <div className="space-y-3">

            {/* Body Changes */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-xl">
                  🤰🏽
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Changes in your body
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Learn about common pregnancy changes.
                  </p>
                </div>

              </div>

              <p className="mt-4 text-sm leading-6 text-gray-700">
                Your body changes throughout pregnancy.
                Some changes are expected, while others
                should be discussed with a qualified
                healthcare professional.
              </p>

            </div>

            {/* Baby Development */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-xl">
                  👶🏽
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Baby development
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Follow your baby's development.
                  </p>
                </div>

              </div>

              <button
                onClick={() =>
                  navigate(
                    "/pregnancy-tracker/baby-development"
                  )
                }
                className="mt-4 w-full rounded-xl bg-pink-100 py-3 text-sm font-semibold text-pink-700"
              >
                View Baby Development
              </button>

            </div>

            {/* Nutrition */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-xl">
                  🥗
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Nutrition
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Learn about healthy pregnancy nutrition.
                  </p>
                </div>

              </div>

              <button
                onClick={() =>
                  navigate(
                    "/pregnancy-tracker/nutrition"
                  )
                }
                className="mt-4 w-full rounded-xl bg-green-100 py-3 text-sm font-semibold text-green-700"
              >
                Open Nutrition
              </button>

            </div>

            {/* Wellness */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-xl">
                  🌿
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Pregnancy wellness
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Learn about healthy everyday habits.
                  </p>
                </div>

              </div>

              <button
                onClick={() =>
                  navigate(
                    "/pregnancy-tracker/wellness"
                  )
                }
                className="mt-4 w-full rounded-xl bg-teal-100 py-3 text-sm font-semibold text-teal-700"
              >
                Open Wellness
              </button>

            </div>

            {/* Preparing for Birth */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-xl">
                  🏥
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Preparing for birth
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Learn about hospital and birth planning.
                  </p>
                </div>

              </div>

              <button
                onClick={() =>
                  navigate(
                    "/pregnancy-tracker/hospital-birth-planning"
                  )
                }
                className="mt-4 w-full rounded-xl bg-rose-100 py-3 text-sm font-semibold text-rose-700"
              >
                Open Birth Planning
              </button>

            </div>

          </div>

        </section>

        {/* Important Reminder */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <span className="text-2xl">
              💗
            </span>

            <h2 className="font-bold text-gray-900">
              Remember
            </h2>

          </div>

          <p className="mt-3 text-sm leading-6 text-gray-700">
            Educational information is here to help you
            understand your pregnancy. It does not replace
            advice, diagnosis or care from a qualified
            healthcare professional.
          </p>

        </section>

        {/* Back */}
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

export default PregnancyEducation;