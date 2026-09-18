import { useMemo, useState } from "react";

interface Facility {
  id: number;
  name: string;
  type: string;
  region: string;
  city: string;
  address: string;
  phone: string;
  emergency: boolean;
  open24Hours: boolean;
  latitude?: number;
  longitude?: number;
}

const facilities: Facility[] = [
  {
    id: 1,
    name: "Korle Bu Teaching Hospital",
    type: "Teaching Hospital",
    region: "Greater Accra",
    city: "Accra",
    address: "Guggisberg Avenue, Accra",
    phone: "0302665401",
    emergency: true,
    open24Hours: true,
    latitude: 5.5339,
    longitude: -0.2287,
  },
  {
    id: 2,
    name: "Greater Accra Regional Hospital",
    type: "Regional Hospital",
    region: "Greater Accra",
    city: "Accra",
    address: "Castle Road, Accra",
    phone: "+233302428460",
    emergency: true,
    open24Hours: true,
    latitude: 5.5557,
    longitude: -0.2011,
  },
  {
    id: 3,
    name: "37 Military Hospital",
    type: "Military Hospital",
    region: "Greater Accra",
    city: "Accra",
    address: "Liberation Road, Accra",
    phone: "+233302777595",
    emergency: true,
    open24Hours: true,
    latitude: 5.5856,
    longitude: -0.1807,
  },
  {
    id: 4,
    name: "University of Ghana Medical Centre",
    type: "University Hospital",
    region: "Greater Accra",
    city: "Accra",
    address: "Legon, Accra",
    phone: "+233302550843",
    emergency: true,
    open24Hours: true,
    latitude: 5.6508,
    longitude: -0.1869,
  },
  {
    id: 5,
    name: "The Bank Hospital",
    type: "General Hospital",
    region: "Greater Accra",
    city: "Accra",
    address: "Shippi Close, near NAFTI, Accra",
    phone: "+233302739373",
    emergency: true,
    open24Hours: true,
    latitude: 5.5894,
    longitude: -0.1708,
  },
  {
    id: 6,
    name: "Nyaho Medical Centre",
    type: "Medical Centre",
    region: "Greater Accra",
    city: "Accra",
    address: "35 Kofi Annan Street, Accra",
    phone: "+233289404041",
    emergency: true,
    open24Hours: true,
    latitude: 5.6107,
    longitude: -0.1897,
  },
  {
    id: 7,
    name: "Accra Medical Centre",
    type: "Medical Centre",
    region: "Greater Accra",
    city: "Accra",
    address: "6 Angola Lane, Accra",
    phone: "+233204096099",
    emergency: true,
    open24Hours: true,
    latitude: 5.5749,
    longitude: -0.1868,
  },
  {
    id: 8,
    name: "Family Health Hospital",
    type: "Hospital",
    region: "Greater Accra",
    city: "Accra",
    address: "Teshie Road, Accra",
    phone: "+233503326753",
    emergency: true,
    open24Hours: true,
    latitude: 5.5705,
    longitude: -0.1158,
  },
  {
    id: 9,
    name: "Komfo Anokye Teaching Hospital",
    type: "Teaching Hospital",
    region: "Ashanti",
    city: "Kumasi",
    address: "Bantama, Kumasi",
    phone: "+233556490029",
    emergency: true,
    open24Hours: true,
    latitude: 6.6966,
    longitude: -1.6326,
  },
  {
    id: 10,
    name: "Tamale Teaching Hospital",
    type: "Teaching Hospital",
    region: "Northern",
    city: "Tamale",
    address: "Tamale-Salaga Road, Tamale",
    phone: "+233591854221",
    emergency: true,
    open24Hours: true,
    latitude: 9.4075,
    longitude: -0.8428,
  },
  {
    id: 11,
    name: "Cape Coast Teaching Hospital",
    type: "Teaching Hospital",
    region: "Central",
    city: "Cape Coast",
    address: "Cape Coast, Central Region",
    phone: "+233201380902",
    emergency: true,
    open24Hours: true,
    latitude: 5.1315,
    longitude: -1.2795,
  },
  {
    id: 12,
    name: "Ho Teaching Hospital",
    type: "Teaching Hospital",
    region: "Volta",
    city: "Ho",
    address: "Ho-Denu Road, Ho",
    phone: "+233208515689",
    emergency: true,
    open24Hours: true,
    latitude: 6.6008,
    longitude: 0.4713,
  },
  {
    id: 13,
    name: "Police Hospital",
    type: "Hospital",
    region: "Greater Accra",
    city: "Accra",
    address: "Cantonments, Accra",
    phone: "0302762389",
    emergency: true,
    open24Hours: true,
    latitude: 5.5759,
    longitude: -0.1755,
  },
  {
    id: 14,
    name: "BushRoad Medical Center",
    type: "Medical Centre",
    region: "Greater Accra",
    city: "Accra",
    address: "Teshie Bushroad, Rasta Junction, Accra",
    phone: "+233558523995",
    emergency: true,
    open24Hours: true,
    latitude: 5.5788,
    longitude: -0.1095,
  },
  {
    id: 15,
    name: "Arena Community Hospital",
    type: "Community Hospital",
    region: "Greater Accra",
    city: "Accra",
    address: "Derby Avenue, Accra",
    phone: "+233244514429",
    emergency: true,
    open24Hours: true,
    latitude: 5.5608,
    longitude: -0.2018,
  },
  {
    id: 16,
    name: "Rayan Medical Centre",
    type: "Medical Centre",
    region: "Greater Accra",
    city: "Accra",
    address: "92 Dansoman Road, Accra",
    phone: "+233302963991",
    emergency: true,
    open24Hours: true,
    latitude: 5.5549,
    longitude: -0.2485,
  },
];

const calculateDistance = (
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
) => {
  const earthRadius = 6371;

  const latitudeDifference = ((latitude2 - latitude1) * Math.PI) / 180;
  const longitudeDifference = ((longitude2 - longitude1) * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos((latitude1 * Math.PI) / 180) *
      Math.cos((latitude2 * Math.PI) / 180) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

const FindHealthcareFacility = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [nearbyOnly, setNearbyOnly] = useState(false);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [selectedFacility, setSelectedFacility] =
    useState<Facility | null>(null);

  const facilityTypes = [
    "All",
    ...Array.from(new Set(facilities.map((facility) => facility.type))),
  ];

  const regions = [
    "All",
    ...Array.from(new Set(facilities.map((facility) => facility.region))),
  ];

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        "Location services are not supported by this browser."
      );
      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setNearbyOnly(true);
        setLocationLoading(false);
      },
      () => {
        setLocationError(
          "We could not access your location. Please allow location access and try again."
        );
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const filteredFacilities = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const results = facilities
      .filter((facility) => {
        const matchesSearch =
          normalizedSearch === "" ||
          facility.name.toLowerCase().includes(normalizedSearch) ||
          facility.city.toLowerCase().includes(normalizedSearch) ||
          facility.address.toLowerCase().includes(normalizedSearch) ||
          facility.region.toLowerCase().includes(normalizedSearch);

        const matchesType =
          selectedType === "All" || facility.type === selectedType;

        const matchesRegion =
          selectedRegion === "All" || facility.region === selectedRegion;

        return matchesSearch && matchesType && matchesRegion;
      })
      .map((facility) => {
        if (!userLocation || facility.latitude === undefined || facility.longitude === undefined) {
          return {
            ...facility,
            distance: null as number | null,
          };
        }

        return {
          ...facility,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            facility.latitude,
            facility.longitude
          ),
        };
      });

    if (nearbyOnly && userLocation) {
      return results
        .filter(
          (facility) =>
            facility.distance !== null && facility.distance <= 50
        )
        .sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;

          return a.distance - b.distance;
        });
    }

    return results;
  }, [
    searchTerm,
    selectedType,
    selectedRegion,
    nearbyOnly,
    userLocation,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("All");
    setSelectedRegion("All");
    setNearbyOnly(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-4xl">🏥</span>
            <h1 className="text-3xl font-bold text-gray-800">
              Find Healthcare Facilities
            </h1>
          </div>

          <p className="max-w-3xl text-gray-600">
            Search for healthcare facilities across Ghana and find facilities
            near your current location.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-8 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-3">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Search
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search hospital, city, region or address..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Facility Type
              </label>

              <select
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
              >
                {facilityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Region
              </label>

              <select
                value={selectedRegion}
                onChange={(event) => setSelectedRegion(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-3">
              <button
                onClick={requestLocation}
                disabled={locationLoading}
                className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {locationLoading
                  ? "Finding you..."
                  : "📍 Find Nearby"}
              </button>

              <button
                onClick={clearFilters}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </div>

          {locationError && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {locationError}
            </div>
          )}

          {nearbyOnly && userLocation && (
            <div className="mt-4 rounded-xl bg-purple-50 p-4 text-sm text-purple-800">
              📍 Showing facilities within approximately 50 km of your current
              location.
            </div>
          )}
        </div>

        {/* Results summary */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-gray-600">
            Showing{" "}
            <span className="font-bold text-pink-600">
              {filteredFacilities.length}
            </span>{" "}
            healthcare facilities
          </p>

          <div className="rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
            ✓ HerBloom Facility Directory
          </div>
        </div>

        {/* Facility cards */}
        {filteredFacilities.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mb-3 text-5xl">🏥</div>

            <h2 className="text-xl font-bold text-gray-800">
              No facilities found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>

            {nearbyOnly && (
              <button
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-600"
              >
                Show All Facilities
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 text-3xl">🏥</div>

                    <h2 className="text-lg font-bold text-gray-800">
                      {facility.name}
                    </h2>

                    <p className="mt-1 text-sm text-pink-600">
                      {facility.type}
                    </p>
                  </div>

                  {facility.emergency && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                      Emergency
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    📍 <strong>{facility.city}</strong>, {facility.region}
                  </p>

                  <p>🏠 {facility.address}</p>

                  <p>📞 {facility.phone}</p>

                  {facility.open24Hours && (
                    <p className="font-semibold text-green-600">
                      🕐 Open 24 hours
                    </p>
                  )}

                  {facility.distance !== null &&
                    facility.distance !== undefined && (
                      <p className="font-semibold text-purple-600">
                        📍 {facility.distance.toFixed(1)} km away
                      </p>
                    )}
                </div>

                <div className="mt-5 flex gap-3">
                  <a
                    href={`tel:${facility.phone.replace(/\s/g, "")}`}
                    className="flex-1 rounded-xl bg-pink-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-pink-600"
                  >
                    📞 Call
                  </a>

                  <button
                    onClick={() => setSelectedFacility(facility)}
                    className="flex-1 rounded-xl border border-pink-200 px-4 py-3 text-sm font-semibold text-pink-700 transition hover:bg-pink-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details modal */}
        {selectedFacility && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 text-4xl">🏥</div>

                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedFacility.name}
                  </h2>

                  <p className="mt-1 text-pink-600">
                    {selectedFacility.type}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedFacility(null)}
                  className="rounded-full bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Location
                  </p>
                  <p className="mt-1 font-medium text-gray-800">
                    {selectedFacility.address}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Region
                  </p>
                  <p className="mt-1 font-medium text-gray-800">
                    {selectedFacility.city},{" "}
                    {selectedFacility.region}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Phone
                  </p>
                  <p className="mt-1 font-medium text-gray-800">
                    {selectedFacility.phone}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedFacility.emergency && (
                    <span className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
                      🚨 Emergency services
                    </span>
                  )}

                  {selectedFacility.open24Hours && (
                    <span className="rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-600">
                      🕐 Open 24 hours
                    </span>
                  )}
                </div>

                <a
                  href={`tel:${selectedFacility.phone.replace(/\s/g, "")}`}
                  className="block w-full rounded-xl bg-pink-500 px-5 py-3 text-center font-semibold text-white hover:bg-pink-600"
                >
                  📞 Call {selectedFacility.name}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-sm text-yellow-800">
          <strong>Important:</strong> Facility information can change. Please
          call the facility to confirm availability, services and opening
          information before travelling. For an emergency, use the emergency
          services available in your area.
        </div>
      </div>
    </div>
  );
};

export default FindHealthcareFacility;