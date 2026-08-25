import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PostpartumTransition() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const topics = [
    {
      id: "recovery",
      title: "Physical recovery",
      description:
        "Learn about general recovery and changes after birth.",
      icon: "🌷",
    },
    {
      id: "baby",
      title: "Caring for baby",
      description:
        "Prepare questions about caring for your newborn.",
      icon: "👶🏽",
    },
    {
      id: "feeding",
      title: "Feeding support",
      description:
        "Prepare questions about feeding and newborn nutrition.",
      icon: "🍼",
    },
    {
      id: "sleep",
      title: "Rest & sleep",
      description:
        "Plan ways to get support and rest during the transition.",
      icon: "🌙",
    },
    {
      id: "care",
      title: "Postpartum care & recovery",
      description:
        "Keep track of things you want to discuss with your healthcare professional after birth.",
      icon: "🩺",
    },
    {
      id: "wellbeing",
      title: "Emotional wellbeing",
      description:
        "Keep track of questions or concerns about how you are feeling.",
      icon: "💗",
    },
  ];

  useEffect(() => {
    const savedNotes =
      localStorage.getItem("postpartumNotes");

    const savedTopics =
      localStorage.getItem("postpartumTopics");

    if (savedNotes) {
      setNotes(savedNotes);
    }

    if (savedTopics) {
      try {
        setSelectedTopics(JSON.parse(savedTopics));
      } catch {
        setSelectedTopics([]);
      }
    }
  }, []);

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((previous) =>
      previous.includes(topicId)
        ? previous.filter((id) => id !== topicId)
        : [...previous, topicId]
    );
  };

  const saveInformation = () => {
    localStorage.setItem(
      "postpartumNotes",
      notes
    );

    localStorage.setItem(
      "postpartumTopics",
      JSON.stringify(selectedTopics)
    );

    setSavedMessage(
      "Your postpartum information has been saved."
    );

    setTimeout(() => {
      setSavedMessage("");
    }, 3000);
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
              Postpartum Transition 🌸
            </h1>

            <p className="text-xs text-gray-500">
              Preparing for life after birth
            </p>
          </div>

        </div>

      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">
              🌷
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Preparing for the transition
              </h2>

              <p className="mt-2 text-sm leading-6 opacity-90">
                Pregnancy doesn't end at delivery. Use
                this space to prepare questions, support
                plans and personal reminders for the period
                after birth.
              </p>
            </div>

          </div>

        </section>

        {/* Important Reminder */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-100 text-xl">
              💡
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                A gentle reminder
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Recovery is different for everyone.
              </p>
            </div>

          </div>

          <p className="mt-4 text-sm leading-6 text-gray-700">
            Your healthcare team can guide you through
            recovery, newborn care and follow-up care.
            If something concerns you, contact a qualified
            healthcare professional.
          </p>

        </section>

        {/* Preparation Topics */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Prepare for postpartum
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select the areas you want to prepare for.
              </p>
            </div>

            <span className="text-2xl">
              📋
            </span>

          </div>

          <div className="mt-4 space-y-3">

            {topics.map((topic) => {
              const isSelected =
                selectedTopics.includes(topic.id);

              return (
                <button
                  key={topic.id}
                  onClick={() =>
                    toggleTopic(topic.id)
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-100 bg-white"
                  }`}
                >

                  <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xl">
                      {topic.icon}
                    </div>

                    <div className="flex-1">

                      <div className="flex items-center justify-between">

                        <h3 className="font-semibold text-gray-900">
                          {topic.title}
                        </h3>

                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                            isSelected
                              ? "border-pink-600 bg-pink-600 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected ? "✓" : ""}
                        </div>

                      </div>

                      <p className="mt-1 text-sm leading-5 text-gray-500">
                        {topic.description}
                      </p>

                    </div>

                  </div>

                </button>
              );
            })}

          </div>

        </section>

        {/* Support Planning */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-xl">
              🤝
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Support plan
              </h2>

              <p className="text-sm text-gray-500">
                Think about who can support you.
              </p>
            </div>

          </div>

          <div className="mt-4 rounded-2xl bg-purple-50 p-4">

            <p className="text-sm leading-6 text-gray-700">
              Consider people who may be able to help with
              meals, errands, transportation, baby care or
              simply keeping you company while you recover.
            </p>

          </div>

          <button
            onClick={() =>
              navigate(
                "/pregnancy-tracker/hospital-birth-planning"
              )
            }
            className="mt-4 w-full rounded-xl bg-purple-100 py-3 text-sm font-semibold text-purple-700"
          >
            View Important Contacts
          </button>

        </section>

        {/* Postpartum Notes */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="text-lg font-bold text-gray-900">
            My postpartum notes 📝
          </h2>

          <p className="mt-1 text-sm leading-5 text-gray-500">
            Write down questions or things you want to
            discuss with your healthcare team.
          </p>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            placeholder="Write your questions or notes here..."
            rows={6}
            className="mt-4 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-500"
          />

        </section>

        {/* Selected Summary */}
        {selectedTopics.length > 0 && (
          <section className="rounded-3xl bg-white p-5 shadow-sm">

            <h2 className="font-bold text-gray-900">
              Your preparation areas
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {selectedTopics.length} area
              {selectedTopics.length === 1
                ? ""
                : "s"} selected
            </p>

            <div className="mt-4 flex flex-wrap gap-2">

              {selectedTopics.map((topicId) => {
                const topic = topics.find(
                  (item) => item.id === topicId
                );

                if (!topic) {
                  return null;
                }

                return (
                  <span
                    key={topic.id}
                    className="rounded-full bg-pink-100 px-3 py-2 text-xs font-semibold text-pink-700"
                  >
                    {topic.icon} {topic.title}
                  </span>
                );
              })}

            </div>

          </section>
        )}

        {/* Save */}
        <section>

          {savedMessage && (
            <div className="mb-3 rounded-2xl bg-green-50 p-4 text-center text-sm font-semibold text-green-700">
              ✓ {savedMessage}
            </div>
          )}

          <button
            onClick={saveInformation}
            className="w-full rounded-2xl bg-pink-600 py-4 font-bold text-white shadow-lg transition hover:bg-pink-700"
          >
            Save Postpartum Plan
          </button>

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

export default PostpartumTransition;