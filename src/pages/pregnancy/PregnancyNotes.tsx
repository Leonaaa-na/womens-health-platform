import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type PregnancyNote = {
  id: number;
  text: string;
  date: string;
};

function PregnancyNotes() {
  const navigate = useNavigate();

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<PregnancyNote[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem("pregnancyNotes");

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNote = () => {
    if (!note.trim()) {
      return;
    }

    const newNote: PregnancyNote = {
      id: Date.now(),
      text: note.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };

    const updatedNotes = [newNote, ...notes];

    setNotes(updatedNotes);

    localStorage.setItem(
      "pregnancyNotes",
      JSON.stringify(updatedNotes)
    );

    setNote("");
  };

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter(
      (savedNote) => savedNote.id !== id
    );

    setNotes(updatedNotes);

    localStorage.setItem(
      "pregnancyNotes",
      JSON.stringify(updatedNotes)
    );
  };

  return (
    <div className="min-h-screen bg-pink-50 pb-10">

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
              My Notes 📝
            </h1>

            <p className="text-sm text-gray-500">
              Keep your pregnancy thoughts in one place
            </p>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">
              📝
            </div>

            <div>
              <p className="text-sm opacity-80">
                Your private space
              </p>

              <h2 className="text-2xl font-bold">
                Write it down
              </h2>
            </div>

          </div>

          <p className="mt-4 text-sm leading-6 opacity-90">
            Record questions, thoughts, reminders, or
            moments you want to remember during your
            pregnancy journey.
          </p>

        </section>

        {/* New Note */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="text-lg font-bold text-gray-900">
            New Note
          </h2>

          <textarea
            value={note}
            onChange={(event) =>
              setNote(event.target.value)
            }
            placeholder="Write your note here..."
            rows={6}
            className="mt-4 w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm text-gray-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          />

          <button
            onClick={saveNote}
            disabled={!note.trim()}
            className={`mt-4 w-full rounded-xl py-3 font-semibold transition ${
              note.trim()
                ? "bg-pink-600 text-white hover:bg-pink-700"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            Save Note
          </button>

        </section>

        {/* Saved Notes */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-lg font-bold text-gray-900">
              Saved Notes
            </h2>

            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
              {notes.length}
            </span>

          </div>

          {notes.length === 0 ? (
            <div className="mt-5 rounded-2xl bg-gray-50 p-6 text-center">

              <p className="text-3xl">
                📝
              </p>

              <p className="mt-2 text-sm text-gray-500">
                You haven't written any notes yet.
              </p>

            </div>
          ) : (
            <div className="mt-4 space-y-3">

              {notes.map((savedNote) => (
                <article
                  key={savedNote.id}
                  className="rounded-2xl bg-pink-50 p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex-1">

                      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                        {savedNote.text}
                      </p>

                      <p className="mt-3 text-xs text-gray-400">
                        {savedNote.date}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        deleteNote(savedNote.id)
                      }
                      className="rounded-lg px-2 py-1 text-sm font-semibold text-red-500"
                    >
                      Delete
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

        {/* Reminder */}
        <section className="rounded-3xl border border-pink-200 bg-pink-50 p-5">

          <div className="flex gap-3">

            <span className="text-xl">
              💗
            </span>

            <div>

              <h2 className="font-bold text-gray-900">
                A little reminder
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your notes can help you remember questions
                to discuss with your healthcare professional
                during your appointments.
              </p>

            </div>

          </div>

        </section>

        {/* Back */}
        <button
          onClick={() =>
            navigate("/pregnancy-tracker")
          }
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Back to Pregnancy Dashboard
        </button>

      </main>

    </div>
  );
}

export default PregnancyNotes;