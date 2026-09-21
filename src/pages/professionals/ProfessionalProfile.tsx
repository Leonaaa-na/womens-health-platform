import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProfessional,
  specialtyIcon,
  locationText,
  experienceText,
  availabilityText,
  type Professional,
} from "../../api/professionalApi";

function ProfessionalProfile() {
  const { id } = useParams();

  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setProfessional(await getProfessional(id));
      } catch {
        setProfessional(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

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
          <div className="text-5xl">👩🏾‍⚕️</div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Professional Not Found</h1>
          <p className="mt-3 text-gray-600">We could not find the healthcare professional you are looking for.</p>
          <Link
            to="/healthcare-professionals"
            className="mt-6 inline-block rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700"
          >
            Find a Professional
          </Link>
        </div>
      </div>
    );
  }

  const fee = Number(professional.consultationFee) || 0;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <Link to="/healthcare-professionals" className="text-sm font-semibold text-pink-600 hover:text-pink-700">
          ← Back to Professionals
        </Link>

        {/* Profile Header */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-pink-50 text-6xl">
              {professional.avatarUrl ? (
                <img src={professional.avatarUrl} alt={professional.name} className="h-full w-full object-cover" />
              ) : (
                specialtyIcon(professional.specialty)
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">{professional.name}</h1>
                {professional.isVerified && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    ✓ Verified Professional
                  </span>
                )}
              </div>

              <p className="mt-2 text-lg font-semibold text-pink-600">{professional.specialty}</p>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>📍 {locationText(professional)}</p>
                <p>🩺 {experienceText(professional)}</p>
                {professional.hospital && <p>🏥 {professional.hospital}</p>}
                {professional.languages.length > 0 && <p>🗣️ {professional.languages.join(", ")}</p>}
                <p>💳 {fee > 0 ? `GHS ${fee.toFixed(2)} per consultation` : "Free consultation"}</p>
                <p className={`font-semibold ${professional.isAvailable ? "text-green-600" : "text-gray-400"}`}>
                  ● {availabilityText(professional)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {professional.acceptsChat && (
              <Link
                to={`/healthcare-professionals/${professional.id}/chat`}
                className="flex-1 rounded-lg bg-pink-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-pink-700"
              >
                💬 Start Consultation Chat
              </Link>
            )}
            <Link
              to={`/appointments/book?professionalId=${professional.id}`}
              className="flex-1 rounded-lg border border-pink-600 px-5 py-3 text-center font-semibold text-pink-600 transition hover:bg-pink-50"
            >
              📅 Book an Appointment
            </Link>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">About</h2>
            <p className="mt-3 leading-7 text-gray-600">{professional.bio || "No description provided yet."}</p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Qualifications</h2>
            {professional.qualifications.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {professional.qualifications.map((q) => (
                  <li key={q} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="mt-0.5 text-pink-600">✓</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-gray-500">No qualifications listed yet.</p>
            )}
          </section>
        </div>

        {/* Consultation Areas */}
        {professional.consultationAreas.length > 0 && (
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Consultation Areas</h2>
            <p className="mt-2 text-sm text-gray-600">Areas this professional can provide guidance and consultation for.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {professional.consultationAreas.map((area) => (
                <span key={area} className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600">
                  {area}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Important Notice */}
        <div className="mt-6 rounded-2xl border border-pink-100 bg-pink-50 p-6">
          <h2 className="font-bold text-gray-900">Important</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            This professional has been verified by HerBloom. Consultations through HerBloom do not replace
            emergency care — if you need urgent help, use Emergency Assistance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfessionalProfile;