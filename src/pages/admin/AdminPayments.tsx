import { useCallback, useEffect, useState } from "react";
import { getPayments, formatGhs, formatDateTime, type AdminPayment } from "../../api/adminApi";

const FILTERS = [
  { value: "", label: "All" },
  { value: "success", label: "Successful" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

const STATUS_STYLE: Record<string, string> = {
  success: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  abandoned: "bg-gray-100 text-gray-600",
};

function AdminPayments() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPayments(await getPayments(filter ? { status: filter } : {}));
    } catch {
      setError("Could not load payments.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const successTotal = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">💳 Payments</h2>
          <p className="text-sm text-gray-500">{payments.length} shown · {formatGhs(successTotal)} received</p>
        </div>
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

      {error ? <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div> : null}

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
        </div>
      ) : payments.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-4xl">💳</div>
          <p className="mt-3 text-gray-500">No payments here yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Purpose</th>
                <th className="px-5 py-4">Method</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Reference</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{p.user?.name || "—"}</p>
                    <p className="text-xs text-gray-500">{p.user?.email}</p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900">{formatGhs(p.amount)}</td>
                  <td className="px-5 py-4 capitalize text-gray-600">{p.purpose}</td>
                  <td className="px-5 py-4 capitalize text-gray-600">{p.channel ? p.channel.replace("_", " ") : "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLE[p.status] || "bg-gray-100 text-gray-600"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{formatDateTime(p.paidAt || p.createdAt)}</td>
                  <td className="px-5 py-4 text-xs text-gray-400">{p.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPayments;