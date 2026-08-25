import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PartnerSharing() {
  const navigate = useNavigate();

  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [shareCode, setShareCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedSharing =
      localStorage.getItem("partnerSharingEnabled");

    const savedCode =
      localStorage.getItem("partnerSharingCode");

    if (savedSharing === "true") {
      setSharingEnabled(true);
    }

    if (savedCode) {
      setShareCode(savedCode);
    }
  }, []);

  const generateShareCode = () => {
    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(
        Math.random() * characters.length
      );

      code += characters[randomIndex];
    }

    setShareCode(code);

    localStorage.setItem(
      "partnerSharingCode",
      code
    );

    setSharingEnabled(true);

    localStorage.setItem(
      "partnerSharingEnabled",
      "true"
    );
  };

  const toggleSharing = () => {
    const newValue = !sharingEnabled;

    setSharingEnabled(newValue);

    localStorage.setItem(
      "partnerSharingEnabled",
      String(newValue)
    );

    if (!newValue) {
      setCopied(false);
    }
  };

  const copyShareCode = async () => {
    if (!shareCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareCode);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const stopSharing = () => {
    setSharingEnabled(false);
    setShareCode("");
    setCopied(false);

    localStorage.removeItem(
      "partnerSharingEnabled"
    );

    localStorage.removeItem(
      "partnerSharingCode"
    );
  };

  return (
    <div className="min-h-screen bg-pink-50 pb-10">

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
            <h1 className="text-2xl font-bold text-pink-700">
              Partner Sharing 🤝
            </h1>

            <p className="text-sm text-gray-500">
              Choose what you want to share
            </p>
          </div>

        </div>

      </header>

      <main className="mx-auto max-w-md space-y-5 px-5 py-6">

        {/* Introduction */}
        <section className="rounded-3xl bg-pink-600 p-6 text-white shadow-lg">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">
              🤝
            </div>

            <div>
              <p className="text-sm opacity-80">
                Share your journey
              </p>

              <h2 className="text-2xl font-bold">
                Partner Sharing
              </h2>
            </div>

          </div>

          <p className="mt-4 text-sm leading-6 opacity-90">
            Share selected cycle information with someone
            you trust while keeping control over your
            personal information.
          </p>

        </section>

        {/* Privacy Information */}
        <section className="rounded-3xl border border-pink-200 bg-white p-5 shadow-sm">

          <div className="flex gap-3">

            <span className="text-2xl">
              🔐
            </span>

            <div>

              <h2 className="font-bold text-gray-900">
                Your privacy matters
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                You decide whether to share your tracking
                information. You can turn sharing off at
                any time.
              </p>

            </div>

          </div>

        </section>

        {/* Sharing Toggle */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between gap-4">

            <div>

              <h2 className="font-bold text-gray-900">
                Partner sharing
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {sharingEnabled
                  ? "Sharing is currently enabled."
                  : "Sharing is currently turned off."}
              </p>

            </div>

            <button
              onClick={toggleSharing}
              aria-label="Toggle partner sharing"
              className={`relative h-7 w-12 rounded-full transition ${
                sharingEnabled
                  ? "bg-pink-600"
                  : "bg-gray-300"
              }`}
            >

              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                  sharingEnabled
                    ? "left-6"
                    : "left-1"
                }`}
              />

            </button>

          </div>

        </section>

        {/* Generate Share Code */}
        {!shareCode && (
          <section className="rounded-3xl bg-white p-5 shadow-sm">

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-3xl">
                🔗
              </div>

              <h2 className="mt-4 text-lg font-bold text-gray-900">
                Create a sharing code
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Generate a private code that your trusted
                partner can use when sharing is available.
              </p>

              <button
                onClick={generateShareCode}
                className="mt-5 w-full rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700"
              >
                Generate Sharing Code
              </button>

            </div>

          </section>
        )}

        {/* Share Code */}
        {shareCode && sharingEnabled && (
          <section className="rounded-3xl bg-white p-5 shadow-sm">

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
                🔗
              </div>

              <h2 className="mt-4 text-lg font-bold text-gray-900">
                Your sharing code
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Share this code only with someone you trust.
              </p>

              <div className="mt-5 rounded-2xl bg-pink-50 p-5">

                <p className="text-3xl font-bold tracking-[0.35em] text-pink-700">
                  {shareCode}
                </p>

              </div>

              <button
                onClick={copyShareCode}
                className="mt-4 w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
              >
                {copied
                  ? "Copied ✓"
                  : "Copy Sharing Code"}
              </button>

            </div>

          </section>
        )}

        {/* Information Shared */}
        <section className="rounded-3xl bg-white p-5 shadow-sm">

          <h2 className="text-lg font-bold text-gray-900">
            Information that may be shared
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Keep your partner informed without sharing
            everything in your health account.
          </p>

          <div className="mt-5 space-y-3">

            <div className="flex items-center gap-3 rounded-2xl bg-pink-50 p-4">

              <span className="text-xl">
                📅
              </span>

              <div>
                <p className="font-semibold text-gray-900">
                  Cycle information
                </p>

                <p className="text-xs text-gray-500">
                  Cycle dates and general cycle status
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-purple-50 p-4">

              <span className="text-xl">
                🌸
              </span>

              <div>
                <p className="font-semibold text-gray-900">
                  Period updates
                </p>

                <p className="text-xs text-gray-500">
                  General updates about your cycle
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4">

              <span className="text-xl">
                🔔
              </span>

              <div>
                <p className="font-semibold text-gray-900">
                  Selected reminders
                </p>

                <p className="text-xs text-gray-500">
                  Only reminders you choose to share
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* Stop Sharing */}
        {sharingEnabled && (
          <section className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm">

            <h2 className="font-bold text-gray-900">
              Stop partner sharing
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Turning sharing off will remove your current
              sharing code from this device.
            </p>

            <button
              onClick={stopSharing}
              className="mt-4 w-full rounded-xl border border-red-200 py-3 font-semibold text-red-600"
            >
              Stop Sharing
            </button>

          </section>
        )}

        {/* Reminder */}
        <section className="rounded-3xl border border-pink-200 bg-pink-50 p-5">

          <div className="flex gap-3">

            <span className="text-xl">
              💗
            </span>

            <p className="text-sm leading-6 text-gray-600">
              Partner sharing is optional. Only share
              information with someone you trust.
            </p>

          </div>

        </section>

        {/* Back */}
        <button
          onClick={() =>
            navigate("/period-tracker")
          }
          className="w-full rounded-xl border border-pink-200 bg-white py-3 font-semibold text-pink-600"
        >
          Back to Period Tracker
        </button>

      </main>

    </div>
  );
}

export default PartnerSharing;