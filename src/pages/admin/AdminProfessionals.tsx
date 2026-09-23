import { useCallback, useEffect, useState } from "react";
import { getProfessionals, verifyProfessional, formatDate, apiErrorMessage, type AdminProfessional } from "../../api/adminApi";

const FILTERS = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
  { value: "", label: "All" },
];

function AdminProfessionals() {
  const [list, setList] = useState<AdminProfessional[]>([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setList(await getProfessionals(filter ? { status: filter } : {}));
    } catch {
      setMessage("Could not load professionals.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const decide = async (pro: AdminProfessional, status: "verified" | "rejected") => {
    const word = status === "verified" ? "Approve" : "Reject";
    if (!window.confirm(`${word} ${pro.name}?`)) return;

    setList((prev) => prev.filter((p) => p.id !== pro.id)); // leaves the current filter
    try {
      await verifyProfessional(pro.id, status);
      setMessage(`${pro.name} ${status === "verified" ? "approved ✅" : "rejected"}.`);
    } catch (error) {
      setMessage(apiErrorMessage(error, "Could not update that professional."));
      load();
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">🩺 Professional Verifications</h2>
        <p className="text-sm text-gray-500">Approve healthcare professionals so they appear in the directory.</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.value)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filter === f.value ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {message ? <div className="mb-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-700">{message}</div> : null}

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-4xl">🩺</div>
          <p className="mt-3 text-gray-500">
            {filter === "pending" ? "Nothing waiting for review. All caught up!" : "No professionals in this list."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((pro) => (
            <div key={pro.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{pro.name}</h3>
                  <p className="text-sm text-pink-600">{pro.specialty}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                  pro.verificationStatus === "verified" ? "bg-green-100 text-green-700"
                    : pro.verificationStatus === "rejected" ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {pro.verificationStatus}
                </span>
              </div>

              <div className="mt-4 space-y-1 text-sm text-gray-600">
                {pro.hospital ? <p>🏥 {pro.hospital}</p> : null}
                {pro.city ? <p>📍 {pro.city}</p> : null}
                {pro.user ? <p>✉️ {pro.user.email}</p> : null}
                {pro.licenseNumber ? <p>🪪 Licence: {pro.licenseNumber}</p> : null}
                <p className="text-xs text-gray-400">Applied {formatDate(pro.createdAt)}</p>
              </div>

              {pro.verificationStatus !== "verified" ? (
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => decide(pro, "verified")}
                    className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    ✓ Approve
                  </button>
                  {pro.verificationStatus === "pending" ? (
                    <button
                      onClick={() => decide(pro, "rejected")}
                      className="flex-1 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      ✕ Reject
                    </button>
                  ) : null}
                </div>
              ) : (
                <p className="mt-5 text-xs text-green-600">Verified {formatDate(pro.verifiedAt)}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProfessionals;