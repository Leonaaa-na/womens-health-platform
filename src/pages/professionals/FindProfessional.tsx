import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  getProfessionals,
  getSpecialties,
  specialtyIcon,
  locationText,
  experienceText,
  availabilityText,
  openExternal,
  type Professional,
} from "../../api/professionalApi";

function FindProfessional() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [list, specs] = await Promise.all([getProfessionals(), getSpecialties()]);
        setProfessionals(list.professionals);
        setSpecialties(specs);
      } catch {
        setError("Could not load professionals. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter on the page so typing feels instant
  const filteredProfessionals = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    return professionals.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search) ||
        p.specialty.toLowerCase().includes(search) ||
        locationText(p).toLowerCase().includes(search) ||
        (p.hospital || "").toLowerCase().includes(search);
      const matchesSpecialty = specialty === "All" || p.specialty === specialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [professionals, searchTerm, specialty]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-pink-600">Healthcare Professionals</p>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">Find a Professional</h1>
          <p className="mt-3 max-w-3xl text-gray-600">
            Find healthcare professionals who can support you throughout your health journey.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label htmlFor="professional-search" className="mb-2 block text-sm font-semibold text-gray-700">
                Search professionals
              </label>
              <input
                id="professional-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, specialty or location..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label htmlFor="specialty" className="mb-2 block text-sm font-semibold text-gray-700">
                Specialty
              </label>
              <select
                id="specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              >
                <option value="All">All Specialties</option>
                {specialties.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error ? <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Healthcare Professionals</h2>
          {!loading ? (
            <p className="mt-1 text-sm text-gray-500">
              {filteredProfessionals.length} {filteredProfessionals.length === 1 ? "professional" : "professionals"} found
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
            <p className="mt-3 text-sm text-gray-500">Loading professionals...</p>
          </div>
        ) : filteredProfessionals.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredProfessionals.map((p) => (
              <article key={p.id} className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

                {/* Profile Header */}
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-pink-50 text-3xl">
                    {p.avatarUrl ? (
                      <img src={p.avatarUrl} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      specialtyIcon(p.specialty)
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                      {p.isVerified ? (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">✓ Verified</span>
                      ) : null}
                    </div>
                    <p className="mt-1 font-medium text-pink-600">{p.specialty}</p>
                    {p.rating > 0 ? <p className="mt-1 text-xs text-gray-500">⭐ {p.rating.toFixed(1)}</p> : null}
                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <p>📍 {locationText(p)}</p>
                  <p>🩺 {experienceText(p)}</p>
                  {p.hospital ? <p>🏥 {p.hospital}</p> : null}
                  <p className={`font-medium ${p.isAvailable ? "text-green-600" : "text-gray-400"}`}>● {availabilityText(p)}</p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={`/healthcare-professionals/${p.id}`}
                    className="flex-1 rounded-lg border border-pink-600 px-4 py-3 text-center text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
                  >
                    View Profile
                  </Link>
                  {p.acceptsChat ? (
                    <Link
                      to={`/healthcare-professionals/${p.id}/chat`}
                      className="flex-1 rounded-lg bg-pink-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-pink-700"
                    >
                      💬 Consultation Chat
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🔎</div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">No Professionals Found</h2>
            <p className="mx-auto mt-3 max-w-md text-gray-600">Try searching with a different name, specialty or location.</p>
          </div>
        )}

        {/* DoctorEVS External Finder */}
        <div className="mt-10 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50 p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm">🔎</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Can't Find the Professional You Need?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                  You can search for additional healthcare professionals through DoctorEVS, an external healthcare service.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openExternal("https://doctorevs.com")}
              className="shrink-0 rounded-xl bg-teal-500 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Find More Professionals
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            You will be redirected to an external website. HerBloom does not manage or verify professionals listed on external services.
          </p>
        </div>

        {/* Information Notice */}
        <div className="mt-6 rounded-2xl border border-pink-100 bg-pink-50 p-6">
          <h2 className="font-bold text-gray-900">About Healthcare Professionals</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Every professional listed here has been verified through HerBloom's healthcare professional system.
            Always confirm that a healthcare professional is appropriate for your specific needs.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FindProfessional;