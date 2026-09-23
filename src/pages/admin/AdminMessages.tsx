import { useCallback, useEffect, useState } from "react";
import { getMessages, setMessageStatus, formatDateTime, apiErrorMessage, type AdminMessage } from "../../api/adminApi";

const FILTERS = [
  { value: "", label: "All" },
  { value: "new", label: "Unread" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
];

function AdminMessages() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState<AdminMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMessages(await getMessages(filter ? { status: filter } : {}));
    } catch {
      setError("Could not load messages.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (msg: AdminMessage, status: "read" | "replied") => {
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, status } : m)));
    if (open?.id === msg.id) setOpen({ ...msg, status });
    try {
      await setMessageStatus(msg.id, status);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not update that message."));
      load();
    }
  };

  // Open the person's email app with a reply started
  const replyByEmail = (msg: AdminMessage) => {
    const subject = encodeURIComponent(`Re: ${msg.subject || "Your HerBloom message"}`);
    const body = encodeURIComponent(`Hi ${msg.name},\n\nThanks for contacting HerBloom.\n\n`);
    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;
    changeStatus(msg, "replied");
  };

  const openMessage = (msg: AdminMessage) => {
    setOpen(msg);
    if (msg.status === "new") changeStatus(msg, "read");
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">✉️ Contact Messages</h2>
        <p className="text-sm text-gray-500">Messages sent from the public contact page.</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.value)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filter === f.value ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error ? <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div> : null}

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-4xl">📭</div>
          <p className="mt-3 text-gray-500">No messages here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => openMessage(m)}
              className={`block w-full rounded-2xl p-5 text-left shadow-sm transition hover:shadow-md ${
                m.status === "new" ? "border-l-4 border-blue-500 bg-blue-50" : "bg-white"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{m.subject || "(No subject)"}</p>
                  <p className="text-sm text-gray-600">{m.name} · {m.email}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">{m.message}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    m.status === "new" ? "bg-blue-100 text-blue-700" : m.status === "replied" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {m.status === "new" ? "unread" : m.status}
                  </span>
                  <p className="mt-2 text-xs text-gray-400">{formatDateTime(m.createdAt)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Read a message */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{open.subject || "(No subject)"}</h2>
                <p className="mt-1 text-sm text-gray-600">{open.name} · {open.email}</p>
                <p className="text-xs text-gray-400">{formatDateTime(open.createdAt)}</p>
              </div>
              <button onClick={() => setOpen(null)} className="rounded-full bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200">
                ✕
              </button>
            </div>

            <div className="mt-5 whitespace-pre-wrap rounded-2xl bg-gray-50 p-5 text-sm leading-7 text-gray-700">
              {open.message}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => replyByEmail(open)}
                className="flex-1 rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-700"
              >
                ✉️ Reply by email
              </button>
              {open.status !== "replied" ? (
                <button
                  onClick={() => changeStatus(open, "replied")}
                  className="flex-1 rounded-xl border border-green-200 px-5 py-3 text-sm font-semibold text-green-700 hover:bg-green-50"
                >
                  ✓ Mark as replied
                </button>
              ) : null}
              <button
                onClick={() => setOpen(null)}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminMessages;