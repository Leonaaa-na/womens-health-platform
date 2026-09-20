import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createReminder, type ReminderType } from "../../services/reminderService";

function CreateReminder() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ReminderType>("custom");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title || !date || !time) {
      alert("Please fill in the reminder title, date, and time.");
      return;
    }

    setLoading(true);
    try {
      await createReminder({
        title,
        type,
        date,
        time,
        notes,
        repeat: "none",
      });
      alert("Reminder created successfully!");
      navigate("/notifications/reminders");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Could not create reminder.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate("/notifications")}
          className="mb-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
        >
          ← Back
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-lg md:p-8">
          <div className="mb-7">
            <div className="mb-3 text-4xl">➕</div>
            <h1 className="text-3xl font-bold text-gray-800">
              Create Reminder
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Create a reminder to help you stay on top of your health and
              important activities.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Reminder Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Take medication"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Reminder Type
              </label>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as ReminderType)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              >
                <option value="custom">General</option>
                <option value="period">Period</option>
                <option value="pregnancy">Pregnancy</option>
                <option value="medication">Medication</option>
                <option value="appointment">Appointment</option>
                <option value="wellness">Wellness</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* Time */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Notes <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add any additional information..."
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Reminder"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateReminder;
