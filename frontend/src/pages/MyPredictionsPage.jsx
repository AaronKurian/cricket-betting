import { useEffect, useState } from "react";
import { getPredictions } from "../api/api";

const MyPredictionsPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPredictions()
      .then(({ predictions: loadedPredictions }) => setPredictions(loadedPredictions))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6 p-6 sm:p-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">
          Player zone
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">My predictions</h1>
      </div>
      {loading && <p className="text-cyan-200">Loading predictions...</p>}
      {error && <p className="text-red-200">{error}</p>}
      {!loading && !error && predictions.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-slate-950/60 p-6 text-slate-400">
          You have not placed any predictions yet.
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
              <span className="rounded-full border border-cyan-300/20 px-3 py-1 text-xs uppercase text-cyan-200">
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
                Payout: <span className="text-cyan-200">{prediction.actualPayout.toLocaleString()}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MyPredictionsPage;
