import { Link, useParams } from "react-router-dom";
import { useState } from "react";

interface Message {
  id: number;
  sender: "professional" | "user";
  text: string;
  time: string;
}

const professionals = [
  {
    id: 1,
    name: "Dr. Ama Mensah",
    specialty: "Obstetrician & Gynaecologist",
  },
  {
    id: 2,
    name: "Dr. Efua Owusu",
    specialty: "Women's Health Specialist",
  },
  {
    id: 3,
    name: "Dr. Abena Boateng",
    specialty: "Fertility Specialist",
  },
  {
    id: 4,
    name: "Dr. Akosua Asante",
    specialty: "Midwife",
  },
];

function ConsultationChat() {
  const { id } = useParams();

  const professional = professionals.find(
    (item) => item.id === Number(id)
  );

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "professional",
      text: "Hello! How can I help you today?",
      time: "10:30 AM",
    },
  ]);

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: trimmedMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      newMessage,
    ]);

    setMessage("");
  };

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">

          <div className="text-5xl">
            💬
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Professional Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            We could not find the healthcare professional
            for this consultation.
          </p>

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

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          to={`/healthcare-professionals/${professional.id}`}
          className="text-sm font-semibold text-pink-600 hover:text-pink-700"
        >
          ← Back to Profile
        </Link>

        {/* Chat Container */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">

          {/* Chat Header */}
          <div className="border-b border-gray-200 p-6">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-3xl">
                👩🏾‍⚕️
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">

                  <h1 className="text-xl font-bold text-gray-900">
                    {professional.name}
                  </h1>

                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    ● Available
                  </span>

                </div>

                <p className="mt-1 text-sm text-pink-600">
                  {professional.specialty}
                </p>

              </div>

            </div>

          </div>

          {/* Messages */}
          <div className="min-h-[450px] space-y-4 bg-gray-50 p-6">

            {messages.map((chatMessage) => (
              <div
                key={chatMessage.id}
                className={`flex ${
                  chatMessage.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    chatMessage.sender === "user"
                      ? "rounded-br-md bg-pink-600 text-white"
                      : "rounded-bl-md bg-white text-gray-800 shadow-sm"
                  }`}
                >

                  <p className="text-sm leading-6">
                    {chatMessage.text}
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      chatMessage.sender === "user"
                        ? "text-pink-100"
                        : "text-gray-400"
                    }`}
                  >
                    {chatMessage.time}
                  </p>

                </div>

              </div>
            ))}

          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 bg-white p-4">

            <div className="flex gap-3">

              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />

              <button
                type="button"
                onClick={handleSendMessage}
                className="rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700"
              >
                Send
              </button>

            </div>

          </div>

        </div>

        {/* Notice */}
        <div className="mt-6 rounded-2xl border border-pink-100 bg-pink-50 p-6">

          <h2 className="font-bold text-gray-900">
            Consultation Notice
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            This chat interface is currently a frontend
            demonstration. Real-time messaging,
            professional availability and conversation
            history will be connected to the HerBloom
            backend later.
          </p>

        </div>

      </div>
    </div>
  );
}

export default ConsultationChat;