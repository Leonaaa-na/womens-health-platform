import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  createReminder,
  apiErrorMessage,
  isUpgradeError,
  todayInput,
  REMINDER_TYPES,
  REPEAT_OPTIONS,
  type ReminderType,
  type RepeatType,
} from "../../api/reminderApi";

function CreateReminder() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ReminderType>("custom");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState<RepeatType>("none");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setShowUpgrade(false);

    if (!title.trim() || !date || !time) {
      setMessage("Please fill in the reminder title, date, and time.");
      return;
    }

    setLoading(true);
    try {
      await createReminder({ title: title.trim(), type, date, time, repeat, notes: notes.trim() || null });
      navigate("/notifications/reminders");
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not create reminder."));
      setShowUpgrade(isUpgradeError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate("/notifications/reminders")}
          className="mb-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
        >
          ← Back
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-lg md:p-8">
          <div className="mb-7">
            <div className="mb-3 text-4xl">➕</div>
            <h1 className="text-3xl font-bold text-gray-800">Create Reminder</h1>
            <p className="mt-2 text-sm text-gray-500">
              Create a reminder to help you stay on top of your health and important activities.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Reminder Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Take medication"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Reminder Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ReminderType)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              >
                {REMINDER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Date</label>
                <input
                  type="date"
                  value={date}
                  min={todayInput()}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Repeat <span className="font-normal text-purple-500">💎 Premium</span>
              </label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as RepeatType)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              >
                {REPEAT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Notes <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional information..."
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {message ? (
              <div className="rounded-xl bg-pink-50 p-4 text-sm font-medium text-pink-700">
                {message}
                {showUpgrade ? (
                  <button
                    type="button"
                    onClick={() => navigate("/premium/plans")}
                    className="ml-2 font-bold underline"
                  >
                    View Premium
                  </button>
                ) : null}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Reminder"}
            </button>

            <p className="text-center text-xs text-gray-400">
              Free accounts can have 3 active reminders. Period, appointment and medication reminders are created for you
              automatically and don't count.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateReminder;