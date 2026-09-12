import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

interface Professional {
  id: number;
  name: string;
  specialty: string;
  location: string;
  experience: string;
  availability: string;
  verified: boolean;
}

const professionals: Professional[] = [
  {
    id: 1,
    name: "Dr. Ama Mensah",
    specialty: "Obstetrician & Gynaecologist",
    location: "Accra, Ghana",
    experience: "8 years experience",
    availability: "Available for consultation",
    verified: true,
  },
  {
    id: 2,
    name: "Dr. Efua Owusu",
    specialty: "Women's Health Specialist",
    location: "Kumasi, Ghana",
    experience: "6 years experience",
    availability: "Available this week",
    verified: true,
  },
  {
    id: 3,
    name: "Dr. Abena Boateng",
    specialty: "Fertility Specialist",
    location: "Accra, Ghana",
    experience: "10 years experience",
    availability: "Available for consultation",
    verified: true,
  },
  {
    id: 4,
    name: "Dr. Akosua Asante",
    specialty: "Midwife",
    location: "Tema, Ghana",
    experience: "7 years experience",
    availability: "Available this week",
    verified: true,
  },
];

function FindProfessional() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("All");

  const filteredProfessionals = useMemo(() => {
    return professionals.filter((professional) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        professional.name.toLowerCase().includes(search) ||
        professional.specialty.toLowerCase().includes(search) ||
        professional.location.toLowerCase().includes(search);

      const matchesSpecialty =
        specialty === "All" ||
        professional.specialty === specialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [searchTerm, specialty]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-pink-600">
            Healthcare Professionals
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Find a Professional
          </h1>

          <p className="mt-3 max-w-3xl text-gray-600">
            Find healthcare professionals who can support
            you throughout your health journey.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm">

          <div className="grid gap-4 md:grid-cols-3">

            {/* Search */}
            <div className="md:col-span-2">
              <label
                htmlFor="professional-search"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Search professionals
              </label>

              <input
                id="professional-search"
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search by name, specialty or location..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* Specialty */}
            <div>
              <label
                htmlFor="specialty"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Specialty
              </label>

              <select
                id="specialty"
                value={specialty}
                onChange={(event) =>
                  setSpecialty(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              >
                <option value="All">All Specialties</option>
                <option value="Obstetrician & Gynaecologist">
                  Obstetrician & Gynaecologist
                </option>
                <option value="Women's Health Specialist">
                  Women's Health Specialist
                </option>
                <option value="Fertility Specialist">
                  Fertility Specialist
                </option>
                <option value="Midwife">
                  Midwife
                </option>
              </select>
            </div>

          </div>
        </div>

        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Healthcare Professionals
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredProfessionals.length}{" "}
              {filteredProfessionals.length === 1
                ? "professional"
                : "professionals"}{" "}
              found
            </p>
          </div>
        </div>

        {/* Professionals */}
        {filteredProfessionals.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">

            {filteredProfessionals.map((professional) => (
              <article
                key={professional.id}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                {/* Profile Header */}
                <div className="flex items-start gap-4">

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-pink-50 text-3xl">
                    👩🏾‍⚕️
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="text-xl font-bold text-gray-900">
                        {professional.name}
                      </h3>

                      {professional.verified && (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          ✓ Verified
                        </span>
                      )}

                    </div>

                    <p className="mt-1 font-medium text-pink-600">
                      {professional.specialty}
                    </p>

                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 space-y-3 text-sm text-gray-600">

                  <p>
                    📍 {professional.location}
                  </p>

                  <p>
                    🩺 {professional.experience}
                  </p>

                  <p className="font-medium text-green-600">
                    ● {professional.availability}
                  </p>

                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                  <Link
                    to={`/healthcare-professionals/${professional.id}`}
                    className="flex-1 rounded-lg border border-pink-600 px-4 py-3 text-center text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
                  >
                    View Profile
                  </Link>

                  <Link
                    to={`/healthcare-professionals/${professional.id}/chat`}
                    className="flex-1 rounded-lg bg-pink-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-pink-700"
                  >
                    💬 Consultation Chat
                  </Link>

                </div>

              </article>
            ))}

          </div>
        ) : (

          /* No Results */
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <div className="text-5xl">
              🔎
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              No Professionals Found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600">
              Try searching with a different name,
              specialty or location.
            </p>

          </div>
        )}

        {/* Information Notice */}
        <div className="mt-10 rounded-2xl border border-pink-100 bg-pink-50 p-6">

          <h2 className="font-bold text-gray-900">
            About Healthcare Professionals
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Professional information will be verified and
            managed through HerBloom's healthcare
            professional system. Always confirm that a
            healthcare professional is appropriate for your
            specific needs.
          </p>

        </div>

      </div>
    </div>
  );
}

export default FindProfessional;