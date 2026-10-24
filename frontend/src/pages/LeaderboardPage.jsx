import { useEffect, useState } from "react";
import { FiAward, FiTrendingUp } from "react-icons/fi";
import { getLeaderboard } from "../api/api";

const LeaderboardPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getLeaderboard()
      .then(setData)
      .catch((requestError) => setError(requestError.message));
  }, []);

  if (error) return <section className="p-8 text-red-200">{error}</section>;
  if (!data) return <section className="p-8 text-cyan-200">Loading leaderboard...</section>;

  return (
    <section className="space-y-6 p-6 sm:p-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">
          Player zone
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Leaderboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Ranked by current virtual-credit balance.
        </p>
      </div>

      {data.leaderboard.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-6 text-slate-400">
          No players are ranked yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
          <div className="grid grid-cols-[3rem_minmax(0,1fr)_auto] gap-4 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-slate-500 sm:px-6">
            <span>#</span>
            <span>Player</span>
            <span>{data.metricLabel}</span>
          </div>
          <div className="divide-y divide-white/10">
            {data.leaderboard.map((player) => (
              <div
                className={`grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6 ${player.isCurrentUser ? "bg-fuchsia-500/[0.08]" : ""}`}
                key={`${player.rank}-${player.name}`}
              >
                <span className={`font-mono text-sm ${player.rank <= 3 ? "text-fuchsia-200" : "text-slate-500"}`}>
                  {player.rank.toString().padStart(2, "0")}
                </span>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-200">
                    {player.rank === 1 ? <FiAward size={17} /> : <FiTrendingUp size={16} />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{player.name}</p>
                    {player.isCurrentUser && (
                      <p className="text-xs text-fuchsia-300">You</p>
                    )}
                  </div>
                </div>
                <strong className="text-right text-fuchsia-200">
                  {player.balance.toLocaleString()}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default LeaderboardPage;
