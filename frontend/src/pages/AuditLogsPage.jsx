import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getAuditLogs } from "../api/api";

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAuditLogs({ page, action })
      .then(({ logs: loadedLogs, pagination: loadedPagination }) => {
        setLogs(loadedLogs);
        setPagination(loadedPagination);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [action, page]);

  return (
    <section className="space-y-6 p-6 sm:p-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">Admin zone</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Audit logs</h1>
        <p className="mt-2 text-sm text-slate-400">Administrative actions recorded by the platform.</p>
      </div>

      <select className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none" onChange={(event) => { setAction(event.target.value); setPage(1); }} value={action}>
        <option value="">All actions</option>
        <option value="match_created">Match created</option>
        <option value="match_updated">Match updated</option>
        <option value="match_status_updated">Match status updated</option>
        <option value="match_score_updated">Match score updated</option>
        <option value="match_settled">Match settled</option>
        <option value="user_role_changed">User role changed</option>
      </select>

      {loading && <p className="text-cyan-200">Loading audit logs...</p>}
      {error && <p className="text-red-200">{error}</p>}
      {!loading && !error && logs.length === 0 && <p className="rounded-xl border border-white/10 bg-slate-950/60 p-6 text-slate-400">No audit logs found.</p>}
      {!loading && !error && logs.length > 0 && (
        <div className="space-y-3">
          {logs.map((log) => (
            <article className="rounded-xl border border-white/10 bg-slate-950/70 p-5" key={log._id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium capitalize text-white">{log.action.replaceAll("_", " ")}</p>
                  <p className="mt-1 text-sm text-slate-400">By {log.actor?.name || "Unknown admin"} · {log.targetType}</p>
                </div>
                <time className="text-xs text-slate-500" dateTime={log.createdAt}>{new Date(log.createdAt).toLocaleString()}</time>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900/60 p-3 text-xs text-cyan-100">{JSON.stringify(log.details, null, 2)}</pre>
            </article>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm"><button aria-label="Previous page" className="rounded-lg border border-white/10 p-2 text-slate-300 disabled:opacity-40" disabled={page === 1} onClick={() => setPage(page - 1)} type="button"><FiChevronLeft size={18} /></button><span className="text-slate-400">Page {pagination.page} of {pagination.totalPages}</span><button aria-label="Next page" className="rounded-lg border border-white/10 p-2 text-slate-300 disabled:opacity-40" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)} type="button"><FiChevronRight size={18} /></button></div>}
    </section>
  );
};

export default AuditLogsPage;
