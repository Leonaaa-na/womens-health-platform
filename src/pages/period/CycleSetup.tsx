import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

function CycleSetup() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [periodLength, setPeriodLength] = useState("5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!startDate) return;

    setLoading(true);
    setError("");

    try {
      await apiClient.post("/cycles", {
        startDate,
        endDate: "",
        notes: "",
      });

      // Also update the profile with cycle length info
      await apiClient.put("/profile", {
        averageCycleLength: Number(cycleLength),
        averagePeriodLength: Number(periodLength),
        lastPeriodDate: startDate,
      });

      navigate("/period-tracker");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Could not save cycle setup.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 px-5 py-8">
      <div className="mx-auto max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-3xl">
            🌸
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Let's get to know your cycle
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            A few details will help HerBloom understand your cycle
            and provide more personalized tracking.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-6 shadow-sm"
        >

          {/* Start Date */}
          <div className="mb-6">
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              When did your last period start?
            </label>

            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
            />

            <p className="mt-2 text-xs text-gray-400">
              Choose the first day of your most recent period.
            </p>
          </div>

          {/* Cycle Length */}
          <div className="mb-6">
            <label
              htmlFor="cycleLength"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              What is your usual cycle length?
            </label>

            <div className="flex items-center gap-3">
              <input
                id="cycleLength"
                type="number"
                min="1"
                max="100"
                value={cycleLength}
                onChange={(event) => setCycleLength(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />

              <span className="text-sm text-gray-500">
                days
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-400">
              If you're unsure, you can use your best estimate.
            </p>
          </div>

          {/* Period Length */}
          <div className="mb-8">
            <label
              htmlFor="periodLength"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              How many days does your period usually last?
            </label>

            <div className="flex items-center gap-3">
              <input
                id="periodLength"
                type="number"
                min="1"
                max="20"
                value={periodLength}
                onChange={(event) => setPeriodLength(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />

              <span className="text-sm text-gray-500">
                days
              </span>
            </div>
          </div>

           {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Continue */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-pink-600 py-3.5 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Continue"}
          </button>

        </form>

        {/* Privacy note */}
        <p className="mt-5 text-center text-xs leading-5 text-gray-400">
          Your cycle information is personal. HerBloom will handle
          your information with privacy and care.
        </p>

      </div>
    </div>
  );
}

export default CycleSetup;