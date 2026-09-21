import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";

type Share = {
  id: string;
  shareCode: string;
  status: "pending" | "active" | "revoked";
  partner: { id: string; name: string; email: string } | null;
};

const errorMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

function PartnerSharing() {
  const navigate = useNavigate();

  const [share, setShare] = useState<Share | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");

  const sharingEnabled = !!share;

  // Find the user's current (not revoked) share, if any
  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiClient.get("/partner");
        const shares: Share[] = response.data?.data || [];
        setShare(shares.find((s) => s.status !== "revoked") || null);
      } catch {
        setShare(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const generateShareCode = async () => {
    setBusy(true);
    setMessage("");
    try {
      const response = await apiClient.post("/partner/invite", {});
      setShare(response.data.data);
    } catch (error) {
      setMessage(errorMessage(error, "Could not create a sharing code."));
    } finally {
      setBusy(false);
    }
  };

  const stopSharing = async () => {
    if (!share) return;
    setBusy(true);
    setMessage("");
    try {
      await apiClient.delete(`/partner/${share.id}`);
      setShare(null);
      setCopied(false);
      setMessage("Partner sharing has been turned off.");
    } catch (error) {
      setMessage(errorMessage(error, "Could not stop sharing."));
    } finally {
      setBusy(false);
    }
  };

  // Toggle on = create a code, toggle off = revoke it
  const toggleSharing = () => {
    if (busy) return;
    if (sharingEnabled) stopSharing();
    else generateShareCode();
  };

  const copyShareCode = async () => {
    if (!share) return;
    try {
      await navigator.clipboard.writeText(share.shareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 pb-10">

      {/* Header */}
      <header className="bg-white px-5 pb-5 pt-8 shadow-sm">
        <div className="mx-auto flex max-w-md items-center gap-4">
          <button
            onClick={() => navigate("/period-tracker")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50 text-lg text-pink-600"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-pink-700">Partner Sharing 🤝</h1>
            <p className="text-sm text-gray-500">Choose what you want to share</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">🤝</div>
            <div>
              <p className="text-sm opacity-80">Share your journey</p>
              <h2 className="text-2xl font-bold">Partner Sharing</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 opacity-90">
            Share selected cycle information with someone you trust while keeping control
            over your personal information.
          </p>
        </section>

        {/* Privacy Information */}
        <section className="rounded-3xl border border-pink-200 bg-white p-5 shadow-sm">
          <div className="flex gap-3">
            <span className="text-2xl">🔐</span>
            <div>
              <h2 className="font-bold text-gray-900">Your privacy matters</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                You decide whether to share your tracking information. You can turn sharing
                off at any time.
              </p>
            </div>
          </div>
        </section>

        {/* Sharing Toggle */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-gray-900">Partner sharing</h2>
              <p className="mt-1 text-sm text-gray-500">
                {!sharingEnabled
                  ? "Sharing is currently turned off."
                  : share.status === "active"
                  ? `Connected with ${share.partner?.name || "your partner"}.`
                  : "Waiting for your partner to enter the code."}
              </p>
            </div>

            <button
              onClick={toggleSharing}
              disabled={busy}
              aria-label="Toggle partner sharing"
              className={`relative h-7 w-12 rounded-full transition disabled:opacity-60 ${
                sharingEnabled ? "bg-pink-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                  sharingEnabled ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

        {message && (
          <div className="rounded-xl bg-pink-100 p-3 text-center text-sm font-medium text-pink-700">
            {message}
          </div>
        )}

        {/* Generate Share Code */}
        {!sharingEnabled && (
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-3xl">🔗</div>
              <h2 className="mt-4 text-lg font-bold text-gray-900">Create a sharing code</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Generate a private code that your trusted partner can enter in their own
                HerBloom account.
              </p>
              <button
                onClick={generateShareCode}
                disabled={busy}
                className="mt-5 w-full rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? "Creating..." : "Generate Sharing Code"}
              </button>
            </div>
          </section>
        )}

        {/* Share Code */}
        {sharingEnabled && (
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">🔗</div>
              <h2 className="mt-4 text-lg font-bold text-gray-900">Your sharing code</h2>
              <p className="mt-2 text-sm text-gray-500">Share this code only with someone you trust.</p>

              <div className="mt-5 rounded-2xl bg-pink-50 p-5">
                <p className="text-3xl font-bold tracking-[0.25em] text-pink-700">{share.shareCode}</p>
              </div>

              <button
                onClick={copyShareCode}
                className="mt-4 w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
              >
                {copied ? "Copied ✓" : "Copy Sharing Code"}
              </button>
            </div>
          </section>
        )}

        {/* Information Shared */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Information that may be shared</h2>
          <p className="mt-1 text-sm text-gray-500">
            Keep your partner informed without sharing everything in your health account.
          </p>

          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-pink-50 p-4">
              <span className="text-xl">📅</span>
              <div>
                <p className="font-semibold text-gray-900">Cycle information</p>
                <p className="text-xs text-gray-500">Cycle dates and general cycle status</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-purple-50 p-4">
              <span className="text-xl">🌸</span>
              <div>
                <p className="font-semibold text-gray-900">Period updates</p>
                <p className="text-xs text-gray-500">General updates about your cycle</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4">
              <span className="text-xl">🔔</span>
              <div>
                <p className="font-semibold text-gray-900">Selected reminders</p>
                <p className="text-xs text-gray-500">Only reminders you choose to share</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stop Sharing */}
        {sharingEnabled && (
          <section className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-gray-900">Stop partner sharing</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              This cancels your current code. Your partner will no longer see your information.
            </p>
            <button
              onClick={stopSharing}
              disabled={busy}
              className="mt-4 w-full rounded-xl border border-red-200 py-3 font-semibold text-red-600 disabled:opacity-60"
            >
              Stop Sharing
            </button>
          </section>
        )}

        {/* Reminder */}
        <section className="rounded-3xl border border-pink-200 bg-pink-50 p-5">
          <div className="flex gap-3">
            <span className="text-xl">💗</span>
            <p className="text-sm leading-6 text-gray-600">
              Partner sharing is optional. Only share information with someone you trust.
            </p>
          </div>
        </section>

        {/* Back */}
        <button
          onClick={() => navigate("/period-tracker")}
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Back to Period Tracker
        </button>
      </main>
    </div>
  );
}

export default PartnerSharing;