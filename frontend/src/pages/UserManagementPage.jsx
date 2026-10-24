import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getAdminUsers, updateUserRole } from "../api/api";
import Dialog from "../components/Dialog";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    return getAdminUsers({ page, search: query, role })
      .then(({ users: loadedUsers, pagination: loadedPagination }) => {
        setUsers(loadedUsers);
        setPagination(loadedPagination);
      })
      .catch((requestError) => toast.error(requestError.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getAdminUsers({ page, search: query, role })
      .then(({ users: loadedUsers, pagination: loadedPagination }) => {
        setUsers(loadedUsers);
        setPagination(loadedPagination);
      })
      .catch((requestError) => toast.error(requestError.message))
      .finally(() => setLoading(false));
  }, [page, query, role]);

  const applySearch = (event) => {
    event.preventDefault();
    setLoading(true);
    setQuery(search);
    setPage(1);
  };

  const handleRoleChange = async () => {
    setSaving(true);

    try {
      await updateUserRole(selectedUser._id, selectedUser.role === "admin" ? "player" : "admin");
      toast.success("User role updated.");
      setSelectedUser(null);
      await loadUsers();
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6 p-6 sm:p-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">Admin zone</p>
        <h1 className="mt-2 text-3xl font-bold text-white">User management</h1>
      </div>

      <form className="flex flex-wrap gap-3" onSubmit={applySearch}>
        <input className="min-w-56 flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/50" onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" value={search} />
        <select className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none" onChange={(event) => { setLoading(true); setRole(event.target.value); setPage(1); }} value={role}>
          <option value="">All roles</option>
          <option value="player">Players</option>
          <option value="admin">Admins</option>
        </select>
        <button className="rounded-lg bg-cyan-500/80 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500" type="submit">Search</button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/70">
        {loading ? <p className="p-6 text-cyan-200">Loading users...</p> : users.length === 0 ? <p className="p-6 text-slate-400">No users found.</p> : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-[0.16em] text-slate-500"><tr><th className="px-5 py-4">User</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Joined</th><th className="px-5 py-4 text-right">Action</th></tr></thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-5 py-4"><p className="font-medium text-white">{user.name}</p><p className="mt-1 text-slate-500">{user.email}</p></td>
                  <td className="px-5 py-4"><span className={`rounded-full border px-3 py-1 text-xs uppercase ${user.role === "admin" ? "border-fuchsia-300/20 text-fuchsia-200" : "border-cyan-300/20 text-cyan-200"}`}>{user.role}</span></td>
                  <td className="px-5 py-4 text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right"><button className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5" onClick={() => setSelectedUser(user)} type="button">{user.role === "admin" ? "Demote" : "Promote"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.totalPages > 1 && <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm"><button aria-label="Previous page" className="rounded-lg border border-white/10 p-2 text-slate-300 disabled:opacity-40" disabled={page === 1} onClick={() => { setLoading(true); setPage(page - 1); }} type="button"><FiChevronLeft size={18} /></button><span className="text-slate-400">Page {pagination.page} of {pagination.totalPages}</span><button aria-label="Next page" className="rounded-lg border border-white/10 p-2 text-slate-300 disabled:opacity-40" disabled={page >= pagination.totalPages} onClick={() => { setLoading(true); setPage(page + 1); }} type="button"><FiChevronRight size={18} /></button></div>}

      <Dialog actions={<><button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300" onClick={() => setSelectedUser(null)} type="button">Cancel</button><button className="rounded-lg bg-fuchsia-500/80 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={saving} onClick={handleRoleChange} type="button">{saving ? "Saving..." : "Confirm change"}</button></>} onClose={() => setSelectedUser(null)} open={Boolean(selectedUser)} title="Confirm role change"><p className="text-slate-300">Change <span className="font-semibold text-white">{selectedUser?.name}</span> from <span className="text-cyan-200">{selectedUser?.role}</span> to <span className="text-fuchsia-200">{selectedUser?.role === "admin" ? "player" : "admin"}</span>?</p><p className="mt-3 text-xs text-amber-200">Role changes are recorded in the audit log.</p></Dialog>
    </section>
  );
};

export default UserManagementPage;
