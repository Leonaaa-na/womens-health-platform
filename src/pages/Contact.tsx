import { useState, type FormEvent } from "react";
import FormInput from "../components/FormInput";
import apiClient from "../api/client";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// If they're logged in, fill in their name and email for them
const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("herbloomUser") || "null");
  } catch {
    return null;
  }
})();

function Contact() {
  const [name, setName] = useState(
    storedUser ? `${storedUser.firstName || ""} ${storedUser.lastName || ""}`.trim() : ""
  );
  const [email, setEmail] = useState(storedUser?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // spam trap — hidden from people

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // stops the browser reloading the page
    setError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email and message.");
      return;
    }
    if (!isValidEmail(email.trim())) {
      setError("Please enter a valid email address, e.g. name@example.com.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Please write a little more (at least 10 characters) so we can help.");
      return;
    }

    setSending(true);
    try {
      await apiClient.post("/users/contact", {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        website,
      });
      setSent(true);
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
          "We couldn't send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-pink-50 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-600">HerBloom Support</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Have a question, suggestion, or need more information? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">

          {/* Info */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-pink-600">Contact Information</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">We're Here to Help</h2>
            <p className="mt-5 leading-7 text-gray-600">
              Whether you have a question about HerBloom, need help using a feature, or have suggestions for improving the
              platform, feel free to reach out to us.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-2xl">📧</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-600">support@herbloom.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-2xl">📞</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="mt-1 text-gray-600">+233 00 000 0000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-2xl">📍</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="mt-1 text-gray-600">Ghana</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-2xl">🚨</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Emergency?</h3>
                  <p className="mt-1 text-gray-600">
                    This form isn't monitored around the clock. In an emergency call 112 or 193.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl bg-white p-8 shadow-md">
            {sent ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
                <h2 className="text-2xl font-bold text-gray-900">Message sent!</h2>
                <p className="mt-3 text-gray-600">Thanks for reaching out. We'll reply to {email} as soon as we can.</p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-lg border border-pink-200 px-5 py-2.5 text-sm font-semibold text-pink-600 hover:bg-pink-50"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
                <p className="mt-2 text-sm text-gray-600">Fill in the form below and we'll get back to you.</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <FormInput
                    label="Full Name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <FormInput
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <FormInput
                    label="Subject"
                    type="text"
                    name="subject"
                    placeholder="What is your message about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-semibold text-gray-700">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      maxLength={3000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                    ></textarea>
                    <p className="mt-1 text-right text-xs text-gray-400">{message.length}/3000</p>
                  </div>

                  {/* Spam trap: invisible to people, bots fill it in */}
                  <input
                    type="text"
                    name="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  {error ? <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div> : null}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-lg bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-wait disabled:opacity-70"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Bottom */}
      <section className="bg-pink-600 px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-pink-100">
            Her health. Her journey. Her bloom.
          </p>
          <h2 className="text-2xl font-bold text-white">Your Questions Matter</h2>
          <p className="mt-3 leading-7 text-pink-100">
            We're committed to creating a platform that listens to women's needs and continuously improves to provide better
            health support.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Contact;