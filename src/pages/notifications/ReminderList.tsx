import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReminders,
  syncReminders,
  toggleReminderComplete,
  deleteReminder,
  typeIcon,
  typeLabel,
  friendlyDate,
  friendlyTime,
  REPEAT_OPTIONS,
  apiErrorMessage,
  type Reminder,
} from "../../api/reminderApi";

function ReminderList() {
  const navigate = useNavigate();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        // Make sure period / appointment / medication reminders are up to date first
        await syncReminders().catch(() => undefined);
        setReminders(await getReminders());
      } catch {
        setReminders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleCompleted = async (reminder: Reminder) => {
    setReminders((prev) => prev.map((r) => (r.id === reminder.id ? { ...r, completed: !r.completed } : r)));
    try {
      await toggleReminderComplete(reminder.id);
    } catch (error) {
      setReminders((prev) => prev.map((r) => (r.id === reminder.id ? reminder : r)));
      setMessage(apiErrorMessage(error, "Could not update reminder."));
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const previous = reminders;
    setReminders((prev) => prev.filter((r) => r.id !== deleteId));
    setDeleteId(null);
    try {
      await deleteReminder(deleteId);
    } catch (error) {
      setReminders(previous);
      setMessage(apiErrorMessage(error, "Could not delete reminder."));
    }
  };

  const visible = reminders.filter((r) => showCompleted || !r.completed);
  const completedCount = reminders.filter((r) => r.completed).length;
  const repeatLabel = (r: Reminder) => REPEAT_OPTIONS.find((o) => o.value === r.repeat)?.label;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate("/notifications")}
          className="mb-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
        >
          ← Back to Notifications
        </button>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">📋 My Reminders</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your personal health reminders.</p>
          </div>
          <button
            onClick={() => navigate("/notifications/create")}
            className="rounded-xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-pink-600"
          >
            + Add Reminder
          </button>
        </div>

        {message ? <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{message}</div> : null}

        {completedCount > 0 ? (
          <label className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="h-4 w-4 accent-pink-500"
            />
            Show completed ({completedCount})
          </label>
        ) : null}

        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
            <p className="mt-3 text-sm text-gray-500">Loading reminders...</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <div className="mb-4 text-5xl">📋</div>
            <h2 className="text-xl font-bold text-gray-800">No reminders yet</h2>
            <p className="mt-2 text-sm text-gray-500">Create your first reminder to stay organized.</p>
            <button
              onClick={() => navigate("/notifications/create")}
              className="mt-5 rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white hover:bg-pink-600"
            >
              Create Reminder
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((reminder) => (
              <div key={reminder.id} className={`rounded-2xl bg-white p-5 shadow-md ${reminder.completed ? "opacity-60" : ""}`}>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-50 text-2xl">
                    {typeIcon(reminder.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className={`text-lg font-bold text-gray-800 ${reminder.completed ? "line-through" : ""}`}>
                          {reminder.title}
                        </h2>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="text-xs font-semibold text-pink-500">{typeLabel(reminder.type)}</span>
                          {reminder.automatic ? (
                            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                              ⚡ Automatic
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          reminder.completed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {reminder.completed ? "Completed" : "Pending"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>📅 {friendlyDate(reminder.date)}</span>
                      <span>⏰ {friendlyTime(reminder.time)}</span>
                      {reminder.repeat !== "none" ? <span>🔁 {repeatLabel(reminder)}</span> : null}
                    </div>

                    {reminder.notes ? (
                      <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{reminder.notes}</p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {!reminder.automatic ? (
                        <button
                          onClick={() => navigate(`/notifications/reminders/${reminder.id}/edit`)}
                          className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                        >
                          ✏️ Edit
                        </button>
                      ) : null}
                      <button
                        onClick={() => toggleCompleted(reminder)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                          reminder.completed ? "bg-gray-100 text-gray-700" : "bg-green-100 text-green-700"
                        }`}
                      >
                        {reminder.completed ? "Mark Pending" : "Mark Completed"}
                      </button>
                      {!reminder.automatic ? (
                        <button
                          onClick={() => setDeleteId(reminder.id)}
                          className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                        >
                          🗑️ Delete
                        </button>
                      ) : null}
                    </div>

                    {reminder.automatic ? (
                      <p className="mt-3 text-xs text-gray-400">
                        Created automatically from your cycle, appointments or medications. It updates when those change.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteId !== null ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">🗑️</div>
              <h2 className="text-xl font-bold text-gray-800">Delete Reminder?</h2>
              <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Keep Reminder
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ReminderList;