import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Reminder {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  notes: string;
  completed: boolean;
}

function EditReminder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("General");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("herbloomReminders");

    if (!saved) {
      navigate("/notifications/reminders");
      return;
    }

    const reminders: Reminder[] = JSON.parse(saved);

    const reminder = reminders.find(
      (item) => item.id === Number(id)
    );

    if (!reminder) {
      navigate("/notifications/reminders");
      return;
    }

    setTitle(reminder.title);
    setType(reminder.type);
    setDate(reminder.date);
    setTime(reminder.time);
    setNotes(reminder.notes);
    setLoading(false);
  }, [id, navigate]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title || !date || !time) {
      alert("Please fill in the reminder title, date, and time.");
      return;
    }

    const saved = localStorage.getItem("herbloomReminders");

    const reminders: Reminder[] = saved
      ? JSON.parse(saved)
      : [];

    const updatedReminders = reminders.map((reminder) =>
      reminder.id === Number(id)
        ? {
            ...reminder,
            title,
            type,
            date,
            time,
            notes,
          }
        : reminder
    );

    localStorage.setItem(
      "herbloomReminders",
      JSON.stringify(updatedReminders)
    );

    alert("Reminder updated successfully!");

    navigate("/notifications/reminders");
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
                onChange={(event) => setType(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              >
                <option value="General">General</option>
                <option value="Period">Period</option>
                <option value="Pregnancy">Pregnancy</option>
                <option value="Medication">Medication</option>
                <option value="Appointment">Appointment</option>
                <option value="Wellness">Wellness</option>
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
                <span className="font-normal text-gray-400">
                  (optional)
                </span>
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
              className="w-full rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white shadow-md hover:bg-pink-600"
            >
              Save Changes
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditReminder;