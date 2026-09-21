import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getReminder,
  updateReminder,
  apiErrorMessage,
  isUpgradeError,
  REMINDER_TYPES,
  REPEAT_OPTIONS,
  type ReminderType,
  type RepeatType,
} from "../../api/reminderApi";

function EditReminder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ReminderType>("custom");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState<RepeatType>("none");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const r = await getReminder(id);
        if (r.automatic) {
          // Automatic reminders are managed by the system
          navigate("/notifications/reminders");
          return;
        }
        setTitle(r.title);
        setType(r.type);
        setDate(r.date);
        setTime(r.time.slice(0, 5));
        setRepeat(r.repeat);
        setNotes(r.notes || "");
      } catch {
        navigate("/notifications/reminders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setShowUpgrade(false);

    if (!id || !title.trim() || !date || !time) {
      setMessage("Please fill in the reminder title, date, and time.");
      return;
    }

    setSaving(true);
    try {
      await updateReminder(id, { title: title.trim(), type, date, time, repeat, notes: notes.trim() || null });
      navigate("/notifications/reminders");
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not update reminder."));
      setShowUpgrade(isUpgradeError(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
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
            <h1 className="text-3xl font-bold text-gray-800">Edit Reminder</h1>
            <p className="mt-2 text-sm text-gray-500">Update the details of your reminder.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Reminder Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {message ? (
              <div className="rounded-xl bg-pink-50 p-4 text-sm font-medium text-pink-700">
                {message}
                {showUpgrade ? (
                  <button type="button" onClick={() => navigate("/premium/plans")} className="ml-2 font-bold underline">
                    View Premium
                  </button>
                ) : null}
              </div>
            ) : null}

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