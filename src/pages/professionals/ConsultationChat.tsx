import { Link, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getProfessional,
  startConversation,
  getConversations,
  getMessages,
  sendMessage,
  markConversationRead,
  specialtyIcon,
  apiErrorMessage,
  type Professional,
  type ChatMessage,
  type Conversation,
} from "../../api/professionalApi";

const POLL_MS = 5000; // check for new messages every 5 seconds

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function ConsultationChat() {
  const { id } = useParams(); // professional id
  const { user } = useAuth();

  const [professional, setProfessional] = useState<Professional | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inbox, setInbox] = useState<Conversation[]>([]); // only for the professional
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Logged in as the professional whose chat this is → inbox mode
  const isProfessionalView = !!professional && !!user && professional.userId === user.id;

  // Load the professional, then either open the patient's chat or the professional's inbox
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const pro = await getProfessional(id);
        setProfessional(pro);

        if (user && pro.userId === user.id) {
          const convos = await getConversations();
          setInbox(convos.filter((c) => c.professionalId === pro.id));
        } else {
          const convo = await startConversation(pro.id);
          setConversationId(convo.id);
        }
      } catch (err) {
        setError(apiErrorMessage(err, "Could not open this chat."));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const refreshMessages = useCallback(async (convoId: string) => {
    try {
      const list = await getMessages(convoId);
      setMessages(list);
      await markConversationRead(convoId);
    } catch {
      // keep what we have; the next poll will try again
    }
  }, []);

  // Load messages for the open conversation and keep checking for new ones
  useEffect(() => {
    if (!conversationId) return;
    refreshMessages(conversationId);
    const timer = setInterval(() => refreshMessages(conversationId), POLL_MS);
    return () => clearInterval(timer);
  }, [conversationId, refreshMessages]);

  // Scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    const text = message.trim();
    if (!text || !conversationId) return;

    setSending(true);
    setError("");
    try {
      const saved = await sendMessage(conversationId, text);
      setMessages((prev) => [...prev, saved]);
      setMessage("");
    } catch (err) {
      setError(apiErrorMessage(err, "Could not send message."));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-5xl">💬</div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Professional Not Found</h1>
          <p className="mt-3 text-gray-600">{error || "We could not find the healthcare professional for this consultation."}</p>
          <Link
            to="/healthcare-professionals"
            className="mt-6 inline-block rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white hover:bg-pink-700"
          >
            Find a Professional
          </Link>
        </div>
      </div>
    );
  }

  const openConversation = inbox.find((c) => c.id === conversationId);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        <Link to={`/healthcare-professionals/${professional.id}`} className="text-sm font-semibold text-pink-600 hover:text-pink-700">
          ← Back to Profile
        </Link>

        {/* Professional's inbox */}
        {isProfessionalView && (
          <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-bold text-gray-900">Your patient conversations</h2>
            {inbox.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">No patients have messaged you yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {inbox.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConversationId(c.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                      c.id === conversationId ? "border-pink-500 bg-pink-50" : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{c.user?.name || "Patient"}</p>
                      <p className="truncate text-xs text-gray-500">{c.lastMessagePreview || "No messages yet"}</p>
                    </div>
                    {c.unreadCount ? (
                      <span className="ml-3 rounded-full bg-pink-600 px-2 py-0.5 text-xs font-bold text-white">{c.unreadCount}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Chat Container */}
        {(!isProfessionalView || conversationId) && (
          <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">

            {/* Chat Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-3xl">
                  {isProfessionalView ? "🙋🏾‍♀️" : specialtyIcon(professional.specialty)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-900">
                      {isProfessionalView ? openConversation?.user?.name || "Patient" : professional.name}
                    </h1>
                    {!isProfessionalView && (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          professional.isAvailable ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        ● {professional.isAvailable ? "Available" : "Away"}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-pink-600">
                    {isProfessionalView ? "Consultation" : professional.specialty}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="max-h-[500px] min-h-[450px] space-y-4 overflow-y-auto bg-gray-50 p-6">

              {/* Friendly opener before the first real message */}
              {messages.length === 0 && !isProfessionalView && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-gray-800 shadow-sm">
                    <p className="text-sm leading-6">
                      Hello! Send a message and {professional.name} will reply here.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((m) => {
                const mine = m.senderId === user?.id;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        mine ? "rounded-br-md bg-pink-600 text-white" : "rounded-bl-md bg-white text-gray-800 shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-6">{m.content}</p>
                      <p className={`mt-1 text-xs ${mine ? "text-pink-100" : "text-gray-400"}`}>{formatTime(m.createdAt)}</p>
                    </div>
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white p-4">
              {error && <p className="mb-3 text-sm font-medium text-red-600">{error}</p>}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  placeholder="Type your message..."
                  disabled={!conversationId}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={sending || !message.trim() || !conversationId}
                  className="rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:opacity-60"
                >
                  {sending ? "..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notice */}
        <div className="mt-6 rounded-2xl border border-pink-100 bg-pink-50 p-6">
          <h2 className="font-bold text-gray-900">Consultation Notice</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Messages are saved securely and new replies appear automatically. This chat is not for emergencies —
            if you need urgent help, use Emergency Assistance or call 112.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConsultationChat;