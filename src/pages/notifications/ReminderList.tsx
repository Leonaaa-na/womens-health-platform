import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Reminder {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  notes: string;
  completed: boolean;
}

function ReminderList() {
  const navigate = useNavigate();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("herbloomReminders");

    if (saved) {
      setReminders(JSON.parse(saved));
    }
  }, []);

  const toggleCompleted = (id: number) => {
    const updated = reminders.map((reminder) =>
      reminder.id === id
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    );

    setReminders(updated);

    localStorage.setItem(
      "herbloomReminders",
      JSON.stringify(updated)
    );
  };

  const confirmDelete = () => {
    if (deleteId === null) return;

    const updated = reminders.filter(
      (reminder) => reminder.id !== deleteId
    );

    setReminders(updated);

    localStorage.setItem(
      "herbloomReminders",
      JSON.stringify(updated)
    );

    setDeleteId(null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Period":
        return "🩸";
      case "Pregnancy":
        return "🤰";
      case "Medication":
        return "💊";
      case "Appointment":
        return "📅";
      case "Wellness":
        return "🌸";
      default:
        return "🔔";
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-800">
              📋 My Reminders
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your personal health reminders.
            </p>
          </div>

          <button
            onClick={() => navigate("/notifications/create")}
            className="rounded-xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-pink-600"
          >
            + Add Reminder
          </button>
        </div>

        {reminders.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <div className="mb-4 text-5xl">📋</div>

            <h2 className="text-xl font-bold text-gray-800">
              No reminders yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create your first reminder to stay organized.
            </p>

            <button
              onClick={() => navigate("/notifications/create")}
              className="mt-5 rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white hover:bg-pink-600"
            >
              Create Reminder
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`rounded-2xl bg-white p-5 shadow-md ${
                  reminder.completed ? "opacity-60" : ""
                }`}
              >
                <div className="flex gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-50 text-2xl">
                    {getIcon(reminder.type)}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2
                          className={`text-lg font-bold text-gray-800 ${
                            reminder.completed
                              ? "line-through"
                              : ""
                          }`}
                        >
                          {reminder.title}
                        </h2>

                        <span className="text-xs font-semibold text-pink-500">
                          {reminder.type}
                        </span>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          reminder.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {reminder.completed
                          ? "Completed"
                          : "Pending"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>📅 {reminder.date}</span>
                      <span>⏰ {reminder.time}</span>
                    </div>

                    {reminder.notes && (
                      <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                        {reminder.notes}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">

                      <button
                        onClick={() =>
                          navigate(
                            `/notifications/reminders/${reminder.id}/edit`
                          )
                        }
                        className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() =>
                          toggleCompleted(reminder.id)
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                          reminder.completed
                            ? "bg-gray-100 text-gray-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {reminder.completed
                          ? "Mark Pending"
                          : "Mark Completed"}
                      </button>

                      <button
                        onClick={() => setDeleteId(reminder.id)}
                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                      >
                        🗑️ Delete
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

              <div className="text-center">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
                  🗑️
                </div>

                <h2 className="text-xl font-bold text-gray-800">
                  Delete Reminder?
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete this reminder?
                  This action cannot be undone.
                </p>

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
          </div>
        )}

      </div>
    </div>
  );
}

export default ReminderList;