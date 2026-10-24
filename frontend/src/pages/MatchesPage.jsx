import { useEffect, useState } from "react";
import { getMatches } from "../api/api";
import MatchCard from "../components/MatchCard";

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches()
      .then(({ matches: loadedMatches }) => setMatches(loadedMatches))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6 p-6 sm:p-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">
          Match center
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Matches</h1>
      </div>
      {loading && <p className="text-cyan-200">Loading matches...</p>}
      {error && <p className="text-red-200">{error}</p>}
      {!loading && !error && matches.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-slate-950/60 p-6 text-slate-400">
          No matches available yet.
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {matches.map((match) => (
          <MatchCard key={match._id} match={match} />
        ))}
      </div>
    </section>
  );
};

export default MatchesPage;
