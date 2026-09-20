import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../api/client";
import {
  updateReminder,
  type HerBloomReminder,
  type ReminderType,
} from "../../services/reminderService";

function EditReminder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ReminderType>("custom");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadReminder = async () => {
      try {
        const response = await apiClient.get<HerBloomReminder>(`/reminders/${id}`);
        const reminder = response.data.data;

        setTitle(reminder.title);
        setType((reminder.type || "custom") as ReminderType);
        setDate(reminder.date);
        setTime(reminder.time);
        setNotes(reminder.notes || "");
      } catch {
        navigate("/notifications/reminders");
      } finally {
        setLoading(false);
      }
    };

    loadReminder();
  }, [id, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title || !date || !time) {
      alert("Please fill in the reminder title, date, and time.");
      return;
    }

    if (!id) return;

    setSaving(true);
    try {
      await updateReminder(id, {
        title,
        type,
        date,
        time,
        notes,
      });
      alert("Reminder updated successfully!");
      navigate("/notifications/reminders");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        "Could not update reminder.";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="text-gray-600">Loading reminder...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate("/notifications/reminders")}
          className="mb-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
        >
          ← Back to Reminders
        </button>

        <div className="rounded-3xl bg-white p-6 shadow-lg md:p-8">
          <div className="mb-7">
            <div className="mb-3 text-4xl">✏️</div>
            <h1 className="text-3xl font-bold text-gray-800">
              Edit Reminder
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Update the details of your reminder.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Reminder Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

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

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

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

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Notes{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white shadow-md hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditReminder;
