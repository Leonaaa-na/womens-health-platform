import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHotlines, callNumber, type Facility } from "../../api/emergencyApi";

// Colours per number, matching your original design
const STYLES: Record<string, { icon: string; border: string; bg: string; button: string }> = {
  "112": { icon: "🚨", border: "border-red-200", bg: "bg-red-100", button: "bg-red-600 hover:bg-red-700" },
  "193": { icon: "🚑", border: "border-pink-200", bg: "bg-pink-100", button: "bg-pink-600 hover:bg-pink-700" },
  "191": { icon: "🛡️", border: "border-blue-200", bg: "bg-blue-100", button: "bg-blue-600 hover:bg-blue-700" },
  "192": { icon: "🔥", border: "border-orange-200", bg: "bg-orange-100", button: "bg-orange-500 hover:bg-orange-600" },
};
const DEFAULT_STYLE = { icon: "📞", border: "border-gray-200", bg: "bg-gray-100", button: "bg-gray-700 hover:bg-gray-800" };

// Show 112 first, then 193, 191, 192
const ORDER = ["112", "193", "191", "192"];

export default function EmergencyServices() {
  const [hotlines, setHotlines] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getHotlines();
        setHotlines(
          [...list].sort((a, b) => {
            const ia = ORDER.indexOf(a.phone || "");
            const ib = ORDER.indexOf(b.phone || "");
            return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
          })
        );
      } catch {
        setHotlines([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">📱</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emergency Services</h1>
              <p className="text-sm text-gray-600">Quick access to important emergency services.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <h2 className="font-bold text-red-700">🚨 Need immediate help?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              If you are experiencing a serious or life-threatening emergency, contact the appropriate emergency service
              immediately. HerBloom does not replace professional emergency care.
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">🚨 Quick Emergency Services</h2>

          {loading ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-red-200 border-t-red-600"></div>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {hotlines.map((h) => {
                const style = STYLES[h.phone || ""] || DEFAULT_STYLE;
                return (
                  <div key={h.id} className={`rounded-2xl border ${style.border} bg-white p-5 shadow-sm`}>
                    <div className="flex items-start gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.bg} text-3xl`}>{style.icon}</div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{h.name}</h3>
                        <p className="mt-1 text-sm text-gray-600">{h.description}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => callNumber(h.phone)}
                      className={`mt-5 block w-full rounded-xl ${style.button} px-4 py-3 text-center text-sm font-semibold text-white transition`}
                    >
                      📞 Call {h.phone}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Other Emergency Actions */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">🏥 Other Emergency Assistance</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Link to="/emergency/facilities" className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-3xl">🏥</div>
                <div>
                  <h3 className="font-bold text-gray-900">Find Healthcare Facility</h3>
                  <p className="mt-1 text-sm text-gray-600">Find healthcare facilities that may be able to assist you.</p>
                </div>
              </div>
            </Link>

            <Link to="/emergency/contacts" className="rounded-2xl border border-pink-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-3xl">📞</div>
                <div>
                  <h3 className="font-bold text-gray-900">Emergency Contacts</h3>
                  <p className="mt-1 text-sm text-gray-600">View emergency numbers and personal emergency contacts.</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-bold text-gray-900">ℹ️ Important</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Emergency numbers and services are provided to help users quickly access appropriate assistance. Always seek
            professional help when an emergency requires it.
          </p>
        </div>
      </div>
    </div>
  );
}