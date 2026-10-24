import { useEffect, useState } from 'react'
import { getDashboard } from '../api/api'

function DashboardSection({ title, items, empty }) {
  return (
    <div className="min-h-40 rounded-xl border border-white/10 bg-slate-950/60 p-5">
      <h2 className="font-semibold text-white">{title}</h2>
      {items.length === 0 ? <p className="mt-6 text-sm text-slate-500">{empty}</p> : <p className="mt-6 text-sm text-slate-300">{items.length} item(s)</p>}
    </div>
  )
}


const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard()
      .then(setDashboard)
      .catch((requestError) => setError(requestError.message))
  }, [])

  if (error) {
    return <section className="p-8 text-red-200">{error}</section>
  }

  if (!dashboard) {
    return <section className="p-8 text-cyan-200">Loading dashboard...</section>
  }

  return (
    <section className="space-y-6 p-6 sm:p-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">Player dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Welcome, {dashboard.user.name}</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-fuchsia-300/15 bg-slate-950/70 p-5">
          <p className="text-sm text-slate-400">Virtual credits</p>
          <p className="mt-2 text-3xl font-bold text-fuchsia-200">{dashboard.balance.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-cyan-300/15 bg-slate-950/70 p-5">
          <p className="text-sm text-slate-400">Predictions</p>
          <p className="mt-2 text-3xl font-bold text-cyan-200">{dashboard.statistics.totalPredictions}</p>
        </div>
        <div className="rounded-xl border border-purple-300/15 bg-slate-950/70 p-5">
          <p className="text-sm text-slate-400">Win rate</p>
          <p className="mt-2 text-3xl font-bold text-purple-200">{dashboard.statistics.winRate}%</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardSection title="Upcoming matches" items={dashboard.upcomingMatches} empty="No upcoming matches yet." />
        <DashboardSection title="Recent predictions" items={dashboard.recentPredictions} empty="No predictions yet." />
        <DashboardSection title="Recent transactions" items={dashboard.recentTransactions} empty="No transactions yet." />
      </div>
    </section>
  )
}

export default DashboardPage
