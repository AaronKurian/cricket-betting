import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboard } from "../api/api";

function DashboardSection({ title, items, empty, renderItem }) {
  return (
    <div className="min-h-40 rounded-xl border border-white/10 bg-slate-950/60 p-5">
      <h2 className="font-semibold text-white">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">{empty}</p>
      ) : renderItem ? (
        <div className="mt-5 space-y-3">{items.map(renderItem)}</div>
      ) : (
        <p className="mt-6 text-sm text-slate-300">{items.length} item(s)</p>
      )}
    </div>
  );
}

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then(setDashboard)
      .catch((requestError) => setError(requestError.message));
  }, []);

  if (error) {
    return <section className="p-8 text-red-200">{error}</section>;
  }

  if (!dashboard) {
    return (
      <section className="p-8 text-cyan-200">Loading dashboard...</section>
    );
  }

  return (
    <section className="space-y-6 p-6 sm:p-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">
          Player dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">
          Welcome, {dashboard.user.name}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-fuchsia-300/15 bg-slate-950/70 p-5">
          <p className="text-sm text-slate-400">Virtual credits</p>
          <p className="mt-2 text-3xl font-bold text-fuchsia-200">
            {dashboard.balance.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-cyan-300/15 bg-slate-950/70 p-5">
          <p className="text-sm text-slate-400">Predictions</p>
          <p className="mt-2 text-3xl font-bold text-cyan-200">
            {dashboard.statistics.totalPredictions}
          </p>
        </div>
        <div className="rounded-xl border border-purple-300/15 bg-slate-950/70 p-5">
          <p className="text-sm text-slate-400">Win rate</p>
          <p className="mt-2 text-3xl font-bold text-purple-200">
            {dashboard.statistics.winRate}%
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardSection
          title="Upcoming matches"
          items={dashboard.upcomingMatches}
          empty="No upcoming matches yet."
          renderItem={(match) => (
            <Link
              className="block rounded-lg border border-white/10 bg-slate-900/50 p-3 font-medium text-white hover:border-cyan-300/30"
              key={match._id}
              to={`/matches/${match._id}`}
            >
              {match.title}
            </Link>
          )}
        />
        <DashboardSection
          title="Recent predictions"
          items={dashboard.recentPredictions}
          empty="No predictions yet."
          renderItem={(prediction) => (
            <div
              className="rounded-lg border border-white/10 bg-slate-900/50 p-3 text-sm"
              key={prediction._id}
            >
              <p className="font-medium text-white">
                {prediction.match?.title || "Match"}
              </p>
              <p className="mt-1 text-slate-400">
                Picked {prediction.match?.[prediction.selectedTeam]} · {prediction.stake.toLocaleString()} credits
              </p>
            </div>
          )}
        />
        <DashboardSection
          title="Recent transactions"
          items={dashboard.recentTransactions}
          empty="No transactions yet."
        />
      </div>
    </section>
  );
};

export default DashboardPage;
