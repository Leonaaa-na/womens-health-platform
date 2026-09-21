import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProfessionals,
  specialtyIcon,
  locationText,
  type Professional,
} from "../../api/professionalApi";

// What HerBloom checks before approving someone
const verificationItemsFor = (p: Professional) => [
  "Professional identity",
  "Professional qualification",
  "Professional specialty",
  ...(p.hospital ? ["Healthcare affiliation"] : []),
];

const verifiedMonth = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Verified";

export default function VerifiedProof() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getProfessionals(); // only verified professionals are returned
        setProfessionals(list.professionals);
      } catch {
        setProfessionals([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">✅</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Verified Proof</h1>
              <p className="text-sm text-gray-600">
                Learn how HerBloom identifies verified healthcare professionals in the community.
              </p>
            </div>
          </div>

          <Link
            to="/community"
            className="inline-block rounded-xl border border-pink-200 bg-white px-5 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
          >
            ← Back to Community
          </Link>
        </div>

        {/* Explanation */}
        <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6">
          <div className="flex gap-4">
            <div className="text-3xl">🛡️</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Why verification matters</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Verification helps community members understand whether someone presenting themselves as a
                healthcare professional has gone through HerBloom's professional verification process.
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Professionals submit their licence and credentials privately. An administrator reviews them,
                and only then does the verified badge appear. The documents themselves are never shown publicly.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Process */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">🔎 How verification works</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-pink-50 p-5">
              <div className="text-2xl">1️⃣</div>
              <h3 className="mt-3 font-bold text-gray-900">Professional applies</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">The healthcare professional submits their professional information.</p>
            </div>
            <div className="rounded-xl bg-purple-50 p-5">
              <div className="text-2xl">2️⃣</div>
              <h3 className="mt-3 font-bold text-gray-900">Information is reviewed</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">Submitted documents are reviewed privately by a HerBloom administrator.</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-5">
              <div className="text-2xl">3️⃣</div>
              <h3 className="mt-3 font-bold text-gray-900">Verification completed</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">Approval and its date are recorded securely.</p>
            </div>
            <div className="rounded-xl bg-green-50 p-5">
              <div className="text-2xl">4️⃣</div>
              <h3 className="mt-3 font-bold text-gray-900">Badge displayed</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">A verified badge appears on the professional's profile and content.</p>
            </div>
          </div>
        </div>

        {/* Verified Professionals */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Verified Professionals</h2>
          {!loading && <p className="mt-1 text-sm text-gray-500">{professionals.length} verified professionals</p>}
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {professionals.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-xl">
                    {specialtyIcon(p.specialty)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-900">{p.name}</h3>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">✓ Verified</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{p.specialty}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">QUALIFICATION</p>
                    <p className="mt-1 text-sm text-gray-700">{p.qualifications.join(", ") || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">ORGANIZATION</p>
                    <p className="mt-1 text-sm text-gray-700">{p.hospital || "Independent practice"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">LOCATION</p>
                    <p className="mt-1 text-sm text-gray-700">📍 {locationText(p)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProfessional(p)}
                  className="mt-5 w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  🔍 View Verification Proof
                </button>
              </article>
            ))}
          </div>
        )}

        {/* Privacy */}
        <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <h3 className="font-bold text-gray-900">🔐 Privacy & security</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            HerBloom only displays information that is necessary to establish professional credibility. Licence
            numbers and uploaded documents are never shown to community members.
          </p>
        </div>
      </div>

      {/* Verification Modal */}
      {selectedProfessional && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛡️</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">✓ Verified Professional</span>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">{selectedProfessional.name}</h2>
                <p className="mt-1 text-sm text-gray-500">{selectedProfessional.specialty}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProfessional(null)}
                className="rounded-full bg-gray-100 px-3 py-2 text-gray-600 transition hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-green-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">✓</div>
                <div>
                  <p className="font-bold text-green-800">Verification completed</p>
                  <p className="text-sm text-green-700">Verified {verifiedMonth(selectedProfessional.verifiedAt)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-gray-900">Information verified</h3>
              <div className="mt-3 space-y-3">
                {verificationItemsFor(selectedProfessional).map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900">Professional information</h3>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-gray-400">QUALIFICATION</p>
                  <p className="mt-1 text-gray-700">{selectedProfessional.qualifications.join(", ") || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400">ORGANIZATION</p>
                  <p className="mt-1 text-gray-700">{selectedProfessional.hospital || "Independent practice"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400">LOCATION</p>
                  <p className="mt-1 text-gray-700">{locationText(selectedProfessional)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-yellow-50 p-5">
              <h3 className="font-bold text-gray-900">🔐 About this record</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                This record comes from HerBloom's secure verification system. Private documents such as licences
                are reviewed by administrators only and are never exposed here.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/healthcare-professionals/${selectedProfessional.id}`}
                className="flex-1 rounded-xl border border-green-600 px-5 py-3 text-center text-sm font-semibold text-green-700 hover:bg-green-50"
              >
                View Profile
              </Link>
              <button
                type="button"
                onClick={() => setSelectedProfessional(null)}
                className="flex-1 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}