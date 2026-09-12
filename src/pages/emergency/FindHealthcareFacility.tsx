import { useMemo, useState } from "react";

interface HealthcareFacility {
  id: number;
  name: string;
  type: string;
  location: string;
  address: string;
  phone: string;
  emergencyAvailable: boolean;
  openHours: string;
}

const facilities: HealthcareFacility[] = [
  {
    id: 1,
    name: "Korle Bu Teaching Hospital",
    type: "Teaching Hospital",
    location: "Accra",
    address: "Guggisberg Avenue",
    phone: "0302665401",
    emergencyAvailable: true,
    openHours: "Open 24 hours",
  },
  {
    id: 2,
    name: "37 Military Hospital",
    type: "General Hospital",
    location: "Accra",
    address: "37 Military Hospital Road",
    phone: "0302776661",
    emergencyAvailable: true,
    openHours: "Open 24 hours",
  },
  {
    id: 3,
    name: "Komfo Anokye Teaching Hospital",
    type: "Teaching Hospital",
    location: "Kumasi",
    address: "Okomfo Anokye Road",
    phone: "0322022301",
    emergencyAvailable: true,
    openHours: "Open 24 hours",
  },
  {
    id: 4,
    name: "Cape Coast Teaching Hospital",
    type: "Teaching Hospital",
    location: "Cape Coast",
    address: "Abura",
    phone: "0332135221",
    emergencyAvailable: true,
    openHours: "Open 24 hours",
  },
];

export default function FindHealthcareFacility() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const facilityTypes = [
    "All",
    ...Array.from(new Set(facilities.map((facility) => facility.type))),
  ];

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) => {
      const matchesSearch =
        facility.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        facility.location
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        facility.address
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "All" ||
        facility.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  const getDirections = (facility: HealthcareFacility) => {
    const query = encodeURIComponent(
      `${facility.name}, ${facility.location}`
    );

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-2xl">
              🏥
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Find Healthcare Facility
              </h1>

              <p className="text-sm text-gray-600">
                Find healthcare facilities that may be able to assist you.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-pink-200 bg-pink-50 p-4 text-sm leading-6 text-gray-700">
            Search for a healthcare facility by name, location, or address.
            For emergencies, use the appropriate emergency contact service.
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">

            {/* Search */}
            <div className="md:col-span-2">
              <label
                htmlFor="facility-search"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Search facility or location
              </label>

              <input
                id="facility-search"
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="e.g. Korle Bu, Accra, Kumasi..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* Facility Type */}
            <div>
              <label
                htmlFor="facility-type"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Facility type
              </label>

              <select
                id="facility-type"
                value={selectedType}
                onChange={(event) =>
                  setSelectedType(event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              >
                {facilityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Healthcare Facilities
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredFacilities.length}{" "}
              {filteredFacilities.length === 1
                ? "facility"
                : "facilities"}{" "}
              found
            </p>
          </div>
        </div>

        {/* Facility Cards */}
        {filteredFacilities.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                {/* Facility Header */}
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-3xl">
                    🏥
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {facility.name}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-pink-600">
                      {facility.type}
                    </p>
                  </div>
                </div>

                {/* Facility Information */}
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span>📍</span>

                    <div>
                      <p className="font-medium text-gray-900">
                        {facility.location}
                      </p>

                      <p className="text-gray-500">
                        {facility.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>📞</span>

                    <span className="text-gray-700">
                      {facility.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>🕐</span>

                    <span className="text-gray-700">
                      {facility.openHours}
                    </span>
                  </div>

                  {facility.emergencyAvailable && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                      ✓ Emergency services available
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="mt-5 flex gap-3">
                  <a
                    href={`tel:${facility.phone}`}
                    className="flex-1 rounded-xl bg-pink-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-pink-700"
                  >
                    📞 Call
                  </a>

                  <button
                    type="button"
                    onClick={() => getDirections(facility)}
                    className="flex-1 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-100"
                  >
                    🗺️ Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mb-4 text-5xl">🏥</div>

            <h3 className="text-xl font-bold text-gray-900">
              No healthcare facilities found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another facility name, location, or facility type.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("All");
              }}
              className="mt-5 rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-700"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Future Location Feature */}
        <div className="mt-8 rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <h3 className="font-bold text-gray-900">
            📍 Nearby Healthcare Facilities
          </h3>

          <p className="mt-1 text-sm leading-6 text-gray-600">
            In a future version, HerBloom can use location services and
            a healthcare facility database to show facilities closest to
            the user.
          </p>
        </div>

      </div>
    </div>
  );
}