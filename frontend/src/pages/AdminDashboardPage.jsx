import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboard } from "../api/api";

const statCards = [
  ["totalUsers", "Users", "text-fuchsia-200"],
  ["totalMatches", "Matches", "text-cyan-200"],
  ["upcomingMatches", "Upcoming", "text-purple-200"],
  ["liveMatches", "Live", "text-emerald-200"],
  ["totalCredits", "Virtual credits", "text-amber-200"],
  ["totalPredictions", "Predictions", "text-sky-200"],
];

const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminDashboard()
      .then(setDashboard)
      .catch((requestError) => setError(requestError.message));
  }, []);

  if (error) return <section className="p-8 text-red-200">{error}</section>;
  if (!dashboard) return <section className="p-8 text-cyan-200">Loading admin dashboard...</section>;

  return (
    <section className="space-y-6 p-6 sm:p-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">Admin zone</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Admin dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">A quick view of the platform state and recent operations.</p>
      </div>

      <div className="space-y-4">
        {Array.from({ length: Math.ceil(statCards.length / 6) }, (_, rowIndex) => (
          <div className="flex flex-wrap gap-4" key={rowIndex}>
            {statCards.slice(rowIndex * 6, rowIndex * 6 + 6).map(([key, label, color]) => (
              <div className="stat-card min-w-0 rounded-xl border border-white/10 bg-slate-950/70 p-5" key={key}>
                <p className="text-sm text-slate-400">{label}</p>
                <p className={`mt-2 text-3xl font-bold ${color}`}>{dashboard.statistics[key].toLocaleString()}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-slate-950/70 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-white">Top players</h2>
            <Link className="text-sm text-cyan-300 hover:text-cyan-200" to="/leaderboard">View all</Link>
          </div>
          {dashboard.topPlayers.length === 0 ? <p className="mt-5 text-sm text-slate-500">No players yet.</p> : (
            <div className="mt-4 space-y-3">
              {dashboard.topPlayers.map((player, index) => (
                <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3" key={player.userId}>
                  <p className="min-w-0 truncate text-sm text-slate-300"><span className="mr-3 text-cyan-300">#{index + 1}</span>{player.name}</p>
                  <p className="shrink-0 font-semibold text-fuchsia-200">{player.balance.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/70 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-white">Upcoming matches</h2>
            <Link className="text-sm text-cyan-300 hover:text-cyan-200" to="/admin/matches">View all</Link>
          </div>
          {dashboard.upcomingMatches.length === 0 ? <p className="mt-5 text-sm text-slate-500">No upcoming matches.</p> : (
            <div className="mt-4 space-y-3">
              {dashboard.upcomingMatches.map((match) => (
                <Link className="block rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-300 hover:border-cyan-300/40 hover:text-cyan-200" key={match._id} to={`/matches/${match._id}`}>
                  {match.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-slate-950/70 p-5">
        <h2 className="font-semibold text-white">Recent activity</h2>
        {dashboard.recentActivity.length === 0 ? <p className="mt-5 text-sm text-slate-500">No administrative activity yet.</p> : (
          <div className="mt-4 space-y-3">
            {dashboard.recentActivity.map((activity) => (
              <div className="flex flex-wrap justify-between gap-2 border-b border-white/10 pb-3 text-sm last:border-0 last:pb-0" key={activity._id}>
                <p className="text-slate-300"><span className="text-white">{activity.actor?.name || "Admin"}</span> · {activity.action.replaceAll("_", " ")}</p>
                <time className="text-slate-500" dateTime={activity.createdAt}>{new Date(activity.createdAt).toLocaleString()}</time>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDashboardPage;
