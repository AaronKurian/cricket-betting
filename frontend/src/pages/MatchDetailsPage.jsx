import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiCheckCircle, FiCreditCard, FiTarget } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { createPrediction, getMatch, getPredictions, getWallet } from "../api/api";
import { useAuth } from "../auth/AuthContext";
import Dialog from "../components/Dialog";

const MatchDetailsPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [balance, setBalance] = useState(null);
  const [existingPrediction, setExistingPrediction] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("teamA");
  const [stake, setStake] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const numericStake = Number(stake);
  const validStake = stake !== "" && Number.isInteger(numericStake) && numericStake > 0;
  const remainingBalance = balance === null || stake === "" ? balance : balance - numericStake;
  const canPlacePrediction = balance !== null && validStake && remainingBalance >= 0;

  useEffect(() => {
    Promise.all([
      getMatch(id),
      user?.role === "player" ? getWallet() : Promise.resolve(null),
      user?.role === "player" ? getPredictions() : Promise.resolve(null),
    ])
      .then(([matchData, walletData, predictionsData]) => {
        setMatch(matchData.match);
        setBalance(walletData?.wallet.balance ?? null);
        setExistingPrediction(
          predictionsData?.predictions.find(
            (prediction) => prediction.match?._id === id,
          ) ?? null,
        );
      })
      .catch((requestError) => setError(requestError.message));
  }, [id, user?.role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const { prediction: createdPrediction } = await createPrediction({
        matchId: id,
        selectedTeam,
        stake: Number(stake),
        requestId: crypto.randomUUID(),
      });
      const { wallet } = await getWallet();
      setBalance(wallet.balance);
      setExistingPrediction(createdPrediction);
      setStake("");
      setConfirmOpen(false);
      toast.success("Prediction placed.");
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

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
          {match.winner && (
            <p className="mt-3 font-medium text-emerald-300">
              Winner: {match.winner === "tie" ? "Tie" : match[match.winner]}
            </p>
          )}
        </div>
        {user?.role === "player" && existingPrediction ? (
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-400/[0.10] via-slate-950/40 to-cyan-400/[0.06] p-5 sm:p-7">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/10 text-emerald-300">
                  <FiCheckCircle size={23} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-300">
                    Prediction placed
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Your pick is locked in</h2>
                  <p className="mt-1 text-sm text-slate-400">We’ll update the result after the match is completed.</p>
                </div>
              </div>
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-cyan-200">
                {existingPrediction.status}
              </span>
            </div>
            <div className="relative mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Your pick</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {existingPrediction.match?.[existingPrediction.selectedTeam] || match[existingPrediction.selectedTeam]}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Stake</p>
                <p className="mt-2 text-lg font-semibold text-fuchsia-200">
                  {existingPrediction.stake.toLocaleString()} credits
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Current balance</p>
                <p className="mt-2 text-lg font-semibold text-cyan-200">
                  {balance?.toLocaleString()} credits
                </p>
              </div>
            </div>
            <div className="relative mt-4 flex items-center gap-2 text-sm text-slate-400">
              <FiCheck className="text-emerald-300" size={16} />
              You can view this prediction in My Predictions.
            </div>
          </div>
        ) : user?.role === "player" && match.status === "upcoming" ? (
          <form
            className="relative mt-8 overflow-hidden rounded-2xl border border-fuchsia-300/15 bg-gradient-to-br from-fuchsia-500/[0.08] via-slate-950/40 to-cyan-500/[0.06] p-5 sm:p-7"
            onSubmit={(event) => {
              event.preventDefault();
              if (!Number.isInteger(Number(stake)) || Number(stake) < 1) {
                toast.error("Enter a whole-number stake greater than zero.");
                return;
              }
              if (Number(stake) > balance) {
                toast.error("Your stake is greater than your balance.");
                return;
              }
              setConfirmOpen(true);
            }}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-fuchsia-300">
                  <FiTarget size={14} />
                  Match winner
                </div>
                <h2 className="mt-2 text-2xl font-bold text-white">Who takes the win?</h2>
                <p className="mt-1 text-sm text-slate-400">Choose one team and stake your virtual credits.</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-2 text-sm text-cyan-100">
                <FiCreditCard className="text-cyan-300" size={16} />
                <span>Balance</span>
                <strong>{balance?.toLocaleString() ?? "Loading..."}</strong>
              </div>
            </div>

            <div className="relative mt-7">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Select your team
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {["teamA", "teamB"].map((team, index) => {
                  const selected = selectedTeam === team;

                  return (
                    <button
                      className={`group relative overflow-hidden rounded-xl border p-4 text-left transition ${selected ? "border-fuchsia-300/80 bg-fuchsia-500/15 shadow-lg shadow-fuchsia-950/30" : "border-white/10 bg-slate-950/35 text-slate-300 hover:border-cyan-300/30 hover:bg-white/[0.04]"}`}
                      key={team}
                      onClick={() => setSelectedTeam(team)}
                      type="button"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span>
                          <span className={`block text-xs uppercase tracking-[0.18em] ${selected ? "text-fuchsia-200" : "text-slate-500"}`}>
                            Team {index === 0 ? "A" : "B"}
                          </span>
                          <span className={`mt-2 block text-lg font-semibold ${selected ? "text-white" : "text-slate-200"}`}>
                            {match[team]}
                          </span>
                        </span>
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${selected ? "border-fuchsia-200 bg-fuchsia-300 text-slate-950" : "border-white/10 text-slate-600 group-hover:border-cyan-300/30"}`}>
                          {selected ? <FiCheck size={17} /> : <span className="h-2 w-2 rounded-full bg-current" />}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="relative mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <label className="text-sm text-slate-300">
                <span className="mb-2 block font-medium">Enter your stake</span>
                <span className="relative block">
                  <FiCreditCard className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
                  <input
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-fuchsia-300/60 focus:ring-2 focus:ring-fuchsia-300/10"
                    min="1"
                    onChange={(event) => setStake(event.target.value)}
                    placeholder="e.g. 500"
                    required
                    type="number"
                    value={stake}
                  />
                </span>
                <span className={`mt-2 block text-xs ${remainingBalance !== null && remainingBalance < 0 ? "text-red-300" : "text-slate-500"}`}>
                  Remaining balance: {remainingBalance?.toLocaleString() ?? "Loading..."} credits
                </span>
              </label>
              <button
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-500 px-6 py-3 font-semibold text-white shadow-lg shadow-fuchsia-950/30 transition hover:from-fuchsia-400 hover:to-purple-400 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-52"
                disabled={!canPlacePrediction}
                type="submit"
              >
                Place prediction
              </button>
            </div>
          </form>
        ) : null}
        {user?.role === "player" && match.status !== "upcoming" && (
          <p className="mt-8 border-t border-white/10 pt-8 text-sm text-slate-400">
            Predictions are closed for this match.
          </p>
        )}
      </div>
      <Dialog
        actions={
          <>
            <button
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300"
              onClick={() => setConfirmOpen(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-fuchsia-500/80 px-4 py-2 text-sm font-semibold text-white"
              disabled={submitting}
              onClick={handleSubmit}
              type="button"
            >
              {submitting ? "Placing..." : "Confirm prediction"}
            </button>
          </>
        }
        onClose={() => setConfirmOpen(false)}
        open={confirmOpen}
        title="Confirm prediction"
      >
        <p className="text-slate-300">
          Predict <span className="font-semibold text-white">{match?.[selectedTeam]}</span> with a stake of <span className="font-semibold text-fuchsia-200">{Number(stake).toLocaleString()}</span> virtual credits?
        </p>
      </Dialog>
    </section>
  );
};

export default MatchDetailsPage;
