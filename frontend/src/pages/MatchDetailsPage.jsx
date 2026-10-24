import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMatch } from "../api/api";

const MatchDetailsPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMatch(id)
      .then(({ match: loadedMatch }) => setMatch(loadedMatch))
      .catch((requestError) => setError(requestError.message));
  }, [id]);

  if (error)
    return <section className="p-6 text-red-200 sm:p-10">{error}</section>;
  if (!match)
    return (
      <section className="p-6 text-cyan-200 sm:p-10">Loading match...</section>
    );

  return (
    <section className="space-y-6 p-6 sm:p-10">
      <Link className="text-sm text-cyan-300 hover:text-cyan-200" to="/matches">
        ← Back to matches
      </Link>
      <div className="rounded-xl border border-white/10 bg-slate-950/70 p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-fuchsia-300">
          {match.status}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">{match.title}</h1>
        <div className="mt-10 grid gap-6 text-center sm:grid-cols-3 sm:items-center">
          <p className="text-xl text-slate-200">{match.teamA}</p>
          <p className="font-mono text-3xl text-cyan-200">
            {match.scores.teamA} - {match.scores.teamB}
          </p>
          <p className="text-xl text-slate-200">{match.teamB}</p>
        </div>
        <div className="mt-10 text-sm text-slate-400">
          <p>
            Scheduled:{" "}
            <span className="text-slate-200">
              {new Date(match.scheduledAt).toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default MatchDetailsPage;
