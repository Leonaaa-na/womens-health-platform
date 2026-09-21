import { useState } from "react";
import { Link } from "react-router-dom";
import {
  triggerSos,
  resolveAlert,
  getCurrentLocation,
  callNumber,
  openDirections,
  apiErrorMessage,
  type SosResult,
} from "../../api/emergencyApi";

function EmergencyHome() {
  const [sos, setSos] = useState<SosResult | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSos = async () => {
    if (!window.confirm("Send an SOS alert? We'll use your location to find help near you.")) return;
    setSending(true);
    setError("");
    try {
      const location = await getCurrentLocation();
      setSos(await triggerSos(location));
    } catch (err) {
      setError(apiErrorMessage(err, "Could not send the alert. Call 112 directly."));
    } finally {
      setSending(false);
    }
  };

  const handleSafe = async () => {
    if (!sos) return;
    try {
      await resolveAlert(sos.alert.id);
    } catch {
      // closing the panel matters more than this call
    }
    setSos(null);
  };

  const copyLocation = async () => {
    if (!sos?.mapsLink) return;
    try {
      await navigator.clipboard.writeText(`I need help. My location: ${sos.mapsLink}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Emergency Assistance</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">Emergency Home</h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Quick access to emergency contacts, healthcare facilities, emergency services, and trusted health information.
          </p>
        </div>

        {/* SOS */}
        <div className="mb-8 rounded-3xl bg-red-600 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">🆘 Need help right now?</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-red-100">
                Press SOS to record an emergency alert with your location. You'll instantly see your emergency contacts,
                your medical card and the nearest hospitals.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSos}
                disabled={sending}
                className="rounded-2xl bg-white px-8 py-4 text-lg font-extrabold text-red-600 shadow-md transition hover:bg-red-50 disabled:opacity-60"
              >
                {sending ? "Sending..." : "SOS"}
              </button>
              <button
                type="button"
                onClick={() => callNumber("112")}
                className="rounded-2xl border-2 border-white px-6 py-4 font-bold text-white transition hover:bg-red-700"
              >
                📞 Call 112
              </button>
            </div>
          </div>
          {error ? <p className="mt-4 rounded-xl bg-white/20 p-3 text-sm font-semibold">{error}</p> : null}
        </div>

        {/* SOS result */}
        {sos ? (
          <div className="mb-8 rounded-3xl border-2 border-red-300 bg-white p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-red-700">🚨 Alert recorded — here's your help</h2>
              <button
                type="button"
                onClick={handleSafe}
                className="rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                ✓ I'm safe now
              </button>
            </div>

            {/* Contacts */}
            <div className="mt-5">
              <h3 className="font-bold text-gray-900">Call someone you trust</h3>
              {sos.contacts.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">
                  You haven't added personal contacts yet.{" "}
                  <Link to="/emergency/contacts" className="font-semibold text-red-600 underline">Add one</Link>
                </p>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {sos.contacts.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => callNumber(c.phone)}
                      className="flex items-center justify-between rounded-xl bg-red-50 p-4 text-left hover:bg-red-100"
                    >
                      <span>
                        <span className="font-semibold text-gray-900">{c.name}{c.isPrimary ? " ⭐" : ""}</span>
                        <span className="block text-xs text-gray-500">{c.relationship || "Contact"} · {c.phone}</span>
                      </span>
                      <span className="text-lg">📞</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Share location */}
            {sos.mapsLink ? (
              <button
                type="button"
                onClick={copyLocation}
                className="mt-4 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                {copied ? "✓ Location copied — paste it in a message" : "📍 Copy my location to send to someone"}
              </button>
            ) : (
              <p className="mt-4 rounded-xl bg-yellow-50 p-3 text-sm text-yellow-800">
                Location wasn't shared. Allow location access in your browser for nearby hospitals.
              </p>
            )}

            {/* Nearest facilities */}
            {sos.nearbyFacilities.length > 0 ? (
              <div className="mt-5">
                <h3 className="font-bold text-gray-900">Nearest hospitals</h3>
                <div className="mt-3 space-y-2">
                  {sos.nearbyFacilities.map((f) => (
                    <div key={f.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-gray-50 p-3">
                      <div>
                        <p className="font-semibold text-gray-900">{f.name}</p>
                        <p className="text-xs text-gray-500">{f.distanceKm} km away</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => callNumber(f.emergencyPhone || f.phone)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white">
                          📞 Call
                        </button>
                        {f.latitude !== null && f.longitude !== null ? (
                          <button type="button" onClick={() => openDirections(f.latitude as number, f.longitude as number)} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700">
                            🧭 Directions
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Medical card summary */}
            <div className="mt-5 rounded-xl bg-purple-50 p-4 text-sm text-gray-700">
              <p className="font-bold text-gray-900">🪪 Your medical card</p>
              <p className="mt-2">Blood group: <b>{sos.medicalInfo.bloodGroup || "Not set"}</b></p>
              <p>Allergies: <b>{sos.medicalInfo.allergies.join(", ") || "None recorded"}</b></p>
              <p>Medications: <b>{sos.medicalInfo.currentMedications.join(", ") || "None recorded"}</b></p>
              {sos.medicalInfo.isPregnant ? <p>Pregnant{sos.medicalInfo.pregnancyWeek ? ` · week ${sos.medicalInfo.pregnancyWeek}` : ""}</p> : null}
            </div>
          </div>
        ) : null}

        {/* Quick Actions */}
        <section>
          <h2 className="mb-5 text-2xl font-bold text-gray-900">Quick Emergency Actions</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/emergency/contacts" className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-3xl">📞</div>
              <h3 className="mt-5 text-lg font-bold text-gray-900">Emergency Contacts</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">Hotlines and the people you trust most.</p>
              <span className="mt-4 inline-block text-sm font-semibold text-red-600">View Contacts →</span>
            </Link>

            <Link to="/emergency/facilities" className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-3xl">🏥</div>
              <h3 className="mt-5 text-lg font-bold text-gray-900">Find Healthcare Facility</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">Find hospitals near you when you need assistance.</p>
              <span className="mt-4 inline-block text-sm font-semibold text-pink-600">Find Facility →</span>
            </Link>

            <Link to="/emergency/services" className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-3xl">📱</div>
              <h3 className="mt-5 text-lg font-bold text-gray-900">Emergency Services</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">Ambulance, police and fire services.</p>
              <span className="mt-4 inline-block text-sm font-semibold text-orange-600">View Services →</span>
            </Link>

            <Link to="/emergency/information" className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-3xl">📚</div>
              <h3 className="mt-5 text-lg font-bold text-gray-900">Emergency Information</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">Guidance and your personal medical card.</p>
              <span className="mt-4 inline-block text-sm font-semibold text-blue-600">Learn More →</span>
            </Link>
          </div>
        </section>

        {/* Safety Notice */}
        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-bold text-gray-900">Important Safety Notice</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            SOS records your alert in HerBloom and shows you where to get help — it does not automatically contact emergency
            services. In a life-threatening emergency, always call 112 or 193.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmergencyHome;