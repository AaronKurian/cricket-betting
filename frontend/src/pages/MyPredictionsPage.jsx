import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getPredictions } from "../api/api";

const filters = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
  { label: "Tie", value: "tie" },
];

function statusClass(status) {
  if (status === "won") return "border-emerald-300/20 text-emerald-200";
  if (status === "lost") return "border-red-300/20 text-red-200";
  if (status === "tie") return "border-amber-300/20 text-amber-200";
  return "border-cyan-300/20 text-cyan-200";
}

const MyPredictionsPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPredictions({ status, page })
      .then(({ predictions: loadedPredictions, pagination: loadedPagination }) => {
        setPredictions(loadedPredictions);
        setPagination(loadedPagination);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [page, status]);

  const handleFilterChange = (nextStatus) => {
    setLoading(true);
    setError("");
    setStatus(nextStatus);
    setPage(1);
  };

  const changePage = (nextPage) => {
    setLoading(true);
    setError("");
    setPage(nextPage);
  };

  return (
    <section className="space-y-6 p-6 sm:p-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">
          Player zone
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">My predictions</h1>
        <p className="mt-2 text-sm text-slate-400">Track every match-winner prediction in one place.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            className={`rounded-full border px-4 py-2 text-xs font-medium transition ${status === filter.value ? "border-fuchsia-300/60 bg-fuchsia-500/15 text-fuchsia-100" : "border-white/10 text-slate-400 hover:border-cyan-300/30 hover:text-white"}`}
            key={filter.value || "all"}
            onClick={() => handleFilterChange(filter.value)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-cyan-200">Loading predictions...</p>}
      {error && <p className="text-red-200">{error}</p>}
      {!loading && !error && predictions.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-slate-950/60 p-6 text-slate-400">
          No predictions found for this filter.
        </p>
      )}

      <div className="space-y-4">
        {predictions.map((prediction) => (
          <article
            className="rounded-xl border border-white/10 bg-slate-950/70 p-5"
            key={prediction._id}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-white">
                  {prediction.match?.title || "Match"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {prediction.match?.teamA} vs {prediction.match?.teamB}
                </p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs uppercase ${statusClass(prediction.status)}`}>
                {prediction.status}
              </span>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <p>
                Pick: <span className="text-white">{prediction.match?.[prediction.selectedTeam]}</span>
              </p>
              <p>
                Stake: <span className="text-fuchsia-200">{prediction.stake.toLocaleString()}</span>
              </p>
              <p>
                Actual payout: <span className="text-cyan-200">{prediction.actualPayout.toLocaleString()}</span>
              </p>
            </div>
            {prediction.match?.winner && (
              <p className="mt-4 text-sm text-emerald-200">
                Winner: {prediction.match.winner === "tie" ? "Tie" : prediction.match[prediction.match.winner]}
              </p>
            )}
          </article>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm">
          <button
            aria-label="Previous page"
            className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={page === 1}
            onClick={() => changePage(page - 1)}
            type="button"
          >
            <FiChevronLeft size={18} />
          </button>
          <span className="text-slate-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            aria-label="Next page"
            className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={page >= pagination.totalPages}
            onClick={() => changePage(page + 1)}
            type="button"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
};

export default MyPredictionsPage;
