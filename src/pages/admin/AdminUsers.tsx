import { useCallback, useEffect, useState } from "react";
import { getUsers, setUserStatus, formatDate, formatDateTime, apiErrorMessage, type AdminUser } from "../../api/adminApi";

function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers({ search: search.trim() || undefined, page });
      setUsers(data.users);
      setPages(data.pages);
      setTotal(data.total);
    } catch {
      setMessage("Could not load users.");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = async (user: AdminUser) => {
    const action = user.isActive ? "Deactivate" : "Reactivate";
    if (!window.confirm(`${action} ${user.name}'s account?`)) return;

    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u)));
    try {
      await setUserStatus(user.id, !user.isActive);
    } catch (error) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
      setMessage(apiErrorMessage(error, "Could not update that account."));
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">👥 Users</h2>
          <p className="text-sm text-gray-500">{total} accounts</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email..."
          className="w-72 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-pink-400"
        />
      </div>

      {message ? <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{message}</div> : null}

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-sm">No users found.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Last login</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                    {u.profile?.username ? <p className="text-xs text-pink-500">@{u.profile.username}</p> : null}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      u.role === "admin" ? "bg-gray-900 text-white" : u.role === "professional" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {u.premium ? (
                      <span className="rounded-full bg-gradient-to-r from-pink-100 to-purple-100 px-2.5 py-1 text-xs font-semibold capitalize text-pink-700">
                        💎 {u.premium.plan}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Free</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{formatDate(u.createdAt)}</td>
                  <td className="px-5 py-4 text-gray-600">{formatDateTime(u.lastLoginAt)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {u.isActive ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => toggleStatus(u)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${u.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
                    >
                      {u.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-500">Page {page} of {pages}</span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default AdminUsers;