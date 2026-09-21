import { useEffect, useMemo, useState } from "react";
import {
  getFacilities,
  callNumber,
  openDirections,
  distanceKm,
  getCurrentLocation,
  type Facility,
} from "../../api/emergencyApi";

const NEARBY_KM = 50;

const labelOf = (f: Facility) => f.category || (f.type === "clinic" ? "Clinic" : "Hospital");
const phoneOf = (f: Facility) => f.emergencyPhone || f.phone || "";
const isEmergency = (f: Facility) => f.services.includes("emergency");

const FindHealthcareFacility = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [nearbyOnly, setNearbyOnly] = useState(false);

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setFacilities(await getFacilities());
      } catch {
        setFacilities([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const facilityTypes = ["All", ...Array.from(new Set(facilities.map(labelOf)))];
  const regions = ["All", ...Array.from(new Set(facilities.map((f) => f.region).filter(Boolean) as string[]))];

  const requestLocation = async () => {
    setLocationLoading(true);
    setLocationError("");
    const location = await getCurrentLocation();
    if (location) {
      setUserLocation(location);
      setNearbyOnly(true);
    } else {
      setLocationError("We could not access your location. Please allow location access and try again.");
    }
    setLocationLoading(false);
  };

  const filteredFacilities = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const results = facilities
      .filter((f) => {
        const matchesSearch =
          !search ||
          f.name.toLowerCase().includes(search) ||
          (f.city || "").toLowerCase().includes(search) ||
          (f.address || "").toLowerCase().includes(search) ||
          (f.region || "").toLowerCase().includes(search);
        const matchesType = selectedType === "All" || labelOf(f) === selectedType;
        const matchesRegion = selectedRegion === "All" || f.region === selectedRegion;
        return matchesSearch && matchesType && matchesRegion;
      })
      .map((f) => ({
        ...f,
        distanceKm:
          userLocation && f.latitude !== null && f.longitude !== null
            ? distanceKm(userLocation.latitude, userLocation.longitude, f.latitude, f.longitude)
            : undefined,
      }));

    if (nearbyOnly && userLocation) {
      return results
        .filter((f) => f.distanceKm !== undefined && f.distanceKm <= NEARBY_KM)
        .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    }
    return results;
  }, [facilities, searchTerm, selectedType, selectedRegion, nearbyOnly, userLocation]);

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
            <h1 className="text-3xl font-bold text-gray-800">Find Healthcare Facilities</h1>
          </div>
          <p className="max-w-3xl text-gray-600">
            Search for healthcare facilities across Ghana and find facilities near your current location.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-8 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-3">
              <label className="mb-2 block text-sm font-semibold text-gray-700">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search hospital, city, region or address..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Facility Type</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500">
                {facilityTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Region</label>
              <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500">
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-3">
              <button
                onClick={requestLocation}
                disabled={locationLoading}
                className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {locationLoading ? "Finding you..." : "📍 Find Nearby"}
              </button>
              <button onClick={clearFilters} className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                Clear
              </button>
            </div>
          </div>

          {locationError ? <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{locationError}</div> : null}

          {nearbyOnly && userLocation ? (
            <div className="mt-4 rounded-xl bg-purple-50 p-4 text-sm text-purple-800">
              📍 Showing facilities within approximately {NEARBY_KM} km of your current location, nearest first.
            </div>
          ) : null}
        </div>

        {/* Results summary */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-gray-600">
            Showing <span className="font-bold text-pink-600">{filteredFacilities.length}</span> healthcare facilities
          </p>
          <div className="rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">✓ HerBloom Facility Directory</div>
        </div>

        {/* Facility cards */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mb-3 text-5xl">🏥</div>
            <h2 className="text-xl font-bold text-gray-800">No facilities found</h2>
            <p className="mt-2 text-gray-500">Try changing your search or filters.</p>
            {nearbyOnly ? (
              <button onClick={clearFilters} className="mt-5 rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-600">
                Show All Facilities
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredFacilities.map((f) => (
              <div key={f.id} className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 text-3xl">🏥</div>
                    <h2 className="text-lg font-bold text-gray-800">{f.name}</h2>
                    <p className="mt-1 text-sm text-pink-600">{labelOf(f)}</p>
                  </div>
                  {isEmergency(f) ? <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">Emergency</span> : null}
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <p>📍 <strong>{f.city}</strong>{f.region ? `, ${f.region}` : ""}</p>
                  {f.address ? <p>🏠 {f.address}</p> : null}
                  {phoneOf(f) ? <p>📞 {phoneOf(f)}</p> : null}
                  {f.is24Hours ? <p className="font-semibold text-green-600">🕐 Open 24 hours</p> : null}
                  {f.distanceKm !== undefined ? <p className="font-semibold text-purple-600">📍 {f.distanceKm.toFixed(1)} km away</p> : null}
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => callNumber(phoneOf(f))}
                    className="flex-1 rounded-xl bg-pink-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-pink-600"
                  >
                    📞 Call
                  </button>
                  <button
                    onClick={() => setSelectedFacility(f)}
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
        {selectedFacility ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 text-4xl">🏥</div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedFacility.name}</h2>
                  <p className="mt-1 text-pink-600">{labelOf(selectedFacility)}</p>
                </div>
                <button onClick={() => setSelectedFacility(null)} className="rounded-full bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200">
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase text-gray-500">Location</p>
                  <p className="mt-1 font-medium text-gray-800">{selectedFacility.address || "—"}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase text-gray-500">Region</p>
                  <p className="mt-1 font-medium text-gray-800">
                    {selectedFacility.city}{selectedFacility.region ? `, ${selectedFacility.region}` : ""}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase text-gray-500">Phone</p>
                  <p className="mt-1 font-medium text-gray-800">{phoneOf(selectedFacility) || "—"}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {isEmergency(selectedFacility) ? (
                    <span className="rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-600">🚨 Emergency services</span>
                  ) : null}
                  {selectedFacility.is24Hours ? (
                    <span className="rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-600">🕐 Open 24 hours</span>
                  ) : null}
                </div>

                <button
                  onClick={() => callNumber(phoneOf(selectedFacility))}
                  className="block w-full rounded-xl bg-pink-500 px-5 py-3 text-center font-semibold text-white hover:bg-pink-600"
                >
                  📞 Call {selectedFacility.name}
                </button>

                {selectedFacility.latitude !== null && selectedFacility.longitude !== null ? (
                  <button
                    onClick={() => openDirections(selectedFacility.latitude as number, selectedFacility.longitude as number)}
                    className="block w-full rounded-xl border border-pink-200 px-5 py-3 text-center font-semibold text-pink-700 hover:bg-pink-50"
                  >
                    🧭 Get Directions
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-sm text-yellow-800">
          <strong>Important:</strong> Facility information can change. Please call the facility to confirm availability,
          services and opening information before travelling. For an emergency, use the emergency services available in your area.
        </div>
      </div>
    </div>
  );
};

export default FindHealthcareFacility;