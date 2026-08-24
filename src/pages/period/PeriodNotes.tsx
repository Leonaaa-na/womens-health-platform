import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Note = {
  id: number;
  date: string;
  text: string;
};

function PeriodNotes() {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("periodNotes");

    return saved ? JSON.parse(saved) : [];
  });

  const handleSaveNote = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!note.trim()) {
      setMessage("Please write something before saving.");
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      date: today,
      text: note.trim(),
    };

    const updatedNotes = [
      newNote,
      ...notes,
    ];

    setNotes(updatedNotes);

    localStorage.setItem(
      "periodNotes",
      JSON.stringify(updatedNotes)
    );

    setNote("");
    setMessage("Your note has been saved privately 🌸");
  };

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter(
      (item) => item.id !== id
    );

    setNotes(updatedNotes);

    localStorage.setItem(
      "periodNotes",
      JSON.stringify(updatedNotes)
    );
  };

  return (
    <div className="min-h-screen bg-pink-50 pb-24">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">

        <div className="mx-auto flex max-w-md items-center gap-4">

          <button
            onClick={() =>
              navigate("/period-tracker")
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-lg text-pink-600"
          >
            ←
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Notes
            </h1>

            <p className="text-sm text-gray-500">
              A private space for your thoughts
            </p>
          </div>

        </div>

      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Intro */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl">
              📝
            </div>

            <div>

              <h2 className="text-xl font-bold">
                Your private journal
              </h2>

              <p className="mt-1 text-sm opacity-80">
                Write down anything you'd like to
                remember about your health journey.
              </p>

            </div>

          </div>

        </section>

        {/* New Note */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="mb-2 text-lg font-bold text-gray-900">
            Add a note
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            What would you like to remember today?
          </p>

          <form
            onSubmit={handleSaveNote}
            className="space-y-4"
          >

            <textarea
              value={note}
              onChange={(event) =>
                setNote(event.target.value)
              }
              rows={6}
              placeholder="Write your thoughts here..."
              className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white"
            />

            {message && (
              <div className="rounded-xl bg-green-50 p-3 text-center text-sm font-medium text-green-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700"
            >
              Save Note
            </button>

          </form>

        </section>

        {/* Saved Notes */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="font-bold text-gray-900">
                Previous notes
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {notes.length} note
                {notes.length !== 1 ? "s" : ""}
              </p>
            </div>

            <span className="text-2xl">
              📖
            </span>

          </div>

          {notes.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-6 text-center">

              <p className="text-3xl">
                🌸
              </p>

              <p className="mt-2 text-sm font-medium text-gray-700">
                No notes yet
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Your saved notes will appear here.
              </p>

            </div>
          ) : (
            <div className="mt-5 space-y-3">

              {notes.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-pink-50 p-4"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex-1">

                      <p className="text-xs font-medium text-pink-600">
                        {item.date}
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                        {item.text}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        deleteNote(item.id)
                      }
                      className="text-sm font-semibold text-red-500"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* Privacy Reminder */}
        <section className="rounded-3xl border border-pink-200 bg-pink-50 p-5">

          <div className="flex gap-3">

            <span className="text-xl">
              🔒
            </span>

            <div>

              <h2 className="font-bold text-gray-900">
                Keep your notes private
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                These notes are intended for your personal
                use. Avoid entering passwords or other
                highly sensitive information.
              </p>

            </div>

          </div>

        </section>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">

        <div className="mx-auto flex max-w-md items-center justify-around px-3 py-3">

          <button
            onClick={() =>
              navigate("/period-tracker")
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              🏠
            </span>
            Home
          </button>

          <button
            onClick={() =>
              navigate("/period-tracker/flow")
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              🩸
            </span>
            Flow
          </button>

          <button
            onClick={() =>
              navigate("/period-tracker/symptoms")
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              📝
            </span>
            Symptoms
          </button>

          <button
            onClick={() =>
              navigate("/period-tracker/wellness")
            }
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">
              🌿
            </span>
            Wellness
          </button>

        </div>

      </nav>

    </div>
  );
}

export default PeriodNotes;