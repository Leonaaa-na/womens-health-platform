import { useState } from "react";
import { Link } from "react-router-dom";

interface VerifiedProfessional {
  id: number;
  name: string;
  specialty: string;
  qualification: string;
  organization: string;
  location: string;
  verifiedDate: string;
  verificationItems: string[];
}

const professionals: VerifiedProfessional[] = [
  {
    id: 1,
    name: "Dr. Ama Mensah",
    specialty: "Obstetrician & Gynaecologist",
    qualification: "MBChB, Specialist in Obstetrics & Gynaecology",
    organization: "Women's Health Centre",
    location: "Accra, Ghana",
    verifiedDate: "August 2026",
    verificationItems: [
      "Professional identity",
      "Medical qualification",
      "Professional specialty",
      "Healthcare affiliation",
    ],
  },
  {
    id: 2,
    name: "Dr. Efua Owusu",
    specialty: "Women's Health Specialist",
    qualification: "MBChB, Women's Health Practice",
    organization: "Women's Wellness Clinic",
    location: "Kumasi, Ghana",
    verifiedDate: "August 2026",
    verificationItems: [
      "Professional identity",
      "Medical qualification",
      "Professional specialty",
      "Healthcare affiliation",
    ],
  },
  {
    id: 3,
    name: "Dr. Abena Boateng",
    specialty: "Fertility Specialist",
    qualification: "MBChB, Fertility & Reproductive Health",
    organization: "Reproductive Health Centre",
    location: "Accra, Ghana",
    verifiedDate: "July 2026",
    verificationItems: [
      "Professional identity",
      "Medical qualification",
      "Professional specialty",
      "Healthcare affiliation",
    ],
  },
];

export default function VerifiedProof() {
  const [selectedProfessional, setSelectedProfessional] =
    useState<VerifiedProfessional | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-2xl">
              ✅
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Verified Proof
              </h1>

              <p className="text-sm text-gray-600">
                Learn how HerBloom identifies verified healthcare
                professionals in the community.
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
              <h2 className="text-xl font-bold text-gray-900">
                Why verification matters
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Verification helps community members understand whether
                someone presenting themselves as a healthcare professional
                has gone through HerBloom's professional verification
                process.
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                In the current frontend version, the verification records
                below are demonstration data. Real verification will be
                handled securely through the HerBloom backend.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Process */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            🔎 How verification works
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-pink-50 p-5">
              <div className="text-2xl">1️⃣</div>

              <h3 className="mt-3 font-bold text-gray-900">
                Professional applies
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                The healthcare professional submits their professional
                information.
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-5">
              <div className="text-2xl">2️⃣</div>

              <h3 className="mt-3 font-bold text-gray-900">
                Information is reviewed
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Submitted professional information is reviewed through
                the verification system.
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-5">
              <div className="text-2xl">3️⃣</div>

              <h3 className="mt-3 font-bold text-gray-900">
                Verification completed
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Approved professional information is recorded securely.
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <div className="text-2xl">4️⃣</div>

              <h3 className="mt-3 font-bold text-gray-900">
                Badge displayed
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                A verified badge appears on the professional's community
                profile and content.
              </p>
            </div>
          </div>
        </div>

        {/* Verified Professionals */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Verified Professionals
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {professionals.length} verified professionals
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {professionals.map((professional) => (
            <article
              key={professional.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Profile */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-xl">
                  👩🏾‍⚕️
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-gray-900">
                      {professional.name}
                    </h3>

                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                      ✓ Verified
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    {professional.specialty}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="mt-5 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    QUALIFICATION
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {professional.qualification}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    ORGANIZATION
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {professional.organization}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    LOCATION
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    📍 {professional.location}
                  </p>
                </div>
              </div>

              {/* Button */}
              <button
                type="button"
                onClick={() => setSelectedProfessional(professional)}
                className="mt-5 w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                🔍 View Verification Proof
              </button>
            </article>
          ))}
        </div>

        {/* Privacy */}
        <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <h3 className="font-bold text-gray-900">
            🔐 Privacy & security
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            HerBloom should only display information that is necessary to
            establish professional credibility. Sensitive personal
            documents should never be publicly displayed to community
            members.
          </p>
        </div>
      </div>

      {/* Verification Modal */}
      {selectedProfessional && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛡️</span>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    ✓ Verified Professional
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  {selectedProfessional.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedProfessional.specialty}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProfessional(null)}
                className="rounded-full bg-gray-100 px-3 py-2 text-gray-600 transition hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Status */}
            <div className="mt-6 rounded-2xl bg-green-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  ✓
                </div>

                <div>
                  <p className="font-bold text-green-800">
                    Verification completed
                  </p>

                  <p className="text-sm text-green-700">
                    Verified {selectedProfessional.verifiedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Verified Information */}
            <div className="mt-6">
              <h3 className="font-bold text-gray-900">
                Information verified
              </h3>

              <div className="mt-3 space-y-3">
                {selectedProfessional.verificationItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-gray-50 p-4"
                  >
                    <span className="text-green-600">✓</span>

                    <span className="text-sm font-medium text-gray-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Information */}
            <div className="mt-6 rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900">
                Professional information
              </h3>

              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    QUALIFICATION
                  </p>

                  <p className="mt-1 text-gray-700">
                    {selectedProfessional.qualification}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    ORGANIZATION
                  </p>

                  <p className="mt-1 text-gray-700">
                    {selectedProfessional.organization}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    LOCATION
                  </p>

                  <p className="mt-1 text-gray-700">
                    {selectedProfessional.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Future Backend Note */}
            <div className="mt-6 rounded-2xl bg-yellow-50 p-5">
              <h3 className="font-bold text-gray-900">
                🔐 Full verification coming later
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                This frontend demonstration shows how verified proof will
                appear. In the production HerBloom system, verification
                records will come from the secure backend and will not
                expose private documents.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedProfessional(null)}
              className="mt-6 w-full rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Close Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}