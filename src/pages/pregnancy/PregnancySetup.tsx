import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

function PregnancySetup() {
  const navigate = useNavigate();

  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!dueDate) {
      setMessage("Please select your expected due date.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await apiClient.post("/pregnancy", {
        dueDate,
        isFirstPregnancy: true,
      });

      setMessage("Your pregnancy information has been saved 🌸");

      setTimeout(() => {
        navigate("/pregnancy-tracker");
      }, 800);
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Could not save pregnancy setup.";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">

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
              Pregnancy Setup 🤰🏽
            </h1>

            <p className="text-sm text-gray-500">
              Let's personalize your journey
            </p>
          </div>

        </div>

      </header>

      <main className="mx-auto max-w-md px-5 py-6">

        {/* Welcome */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
              🌸
            </div>

            <div>
              <p className="text-sm opacity-80">
                Your pregnancy journey
              </p>

              <h2 className="text-2xl font-bold">
                Let's get started
              </h2>
            </div>

          </div>

          <p className="mt-5 text-sm leading-6 opacity-90">
            Enter your expected due date so HerBloom can
            help you follow your pregnancy journey.
          </p>

        </section>

        {/* Setup Form */}
        <section className="mt-5 rounded-3xl bg-white p-6 shadow-sm">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>
              <label
                htmlFor="dueDate"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Expected Due Date
              </label>

              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                Your due date can be updated later if needed.
              </p>
            </div>

            {message && (
              <div className="rounded-xl bg-green-50 p-3 text-center text-sm font-medium text-green-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>

          </form>

        </section>

        {/* Privacy */}
        <section className="mt-5 rounded-3xl border border-pink-200 bg-pink-50 p-5">

          <div className="flex gap-3">

            <span className="text-xl">
              🔒
            </span>

            <div>
              <h2 className="font-bold text-gray-900">
                Your information matters
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your pregnancy information is personal.
                HerBloom is designed to keep your health
                information private.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default PregnancySetup;