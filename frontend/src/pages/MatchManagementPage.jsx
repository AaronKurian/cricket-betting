import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createMatch,
  getMatches,
  updateMatch,
  updateMatchScore,
  updateMatchStatus,
} from "../api/api";
import Dialog from "../components/Dialog";

const emptyForm = { title: "", teamA: "", teamB: "", scheduledAt: "" };
const emptyScoreForm = { teamA: 0, teamB: 0 };

function toLocalDateTime(value) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

const inputClass = [
  "w-full rounded-lg border border-white/10 bg-slate-900",
  "px-3 py-2 text-sm text-white outline-none focus:border-cyan-300/50",
].join(" ");

const MatchManagementPage = () => {
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [scoreForm, setScoreForm] = useState(emptyScoreForm);

  const loadMatches = () =>
    getMatches()
      .then(({ matches: loadedMatches }) => setMatches(loadedMatches))
      .finally(() => setLoading(false));

  useEffect(() => {
    loadMatches().catch((requestError) => toast.error(requestError.message));
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      await createMatch({
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });
      setForm(emptyForm);
      toast.success("Match created.");
      await loadMatches();
    } catch (requestError) {
      toast.error(requestError.message);
    }
  };

  const openScoreDialog = (match) => {
    setScoreForm({ teamA: match.scores.teamA, teamB: match.scores.teamB });
    setDialog({ type: "score", match });
  };

  const handleScore = async (event) => {
    event.preventDefault();

    try {
      await updateMatchScore(dialog.match._id, {
        teamA: Number(scoreForm.teamA),
        teamB: Number(scoreForm.teamB),
      });
      toast.success("Score updated.");
      setDialog(null);
      await loadMatches();
    } catch (requestError) {
      toast.error(requestError.message);
    }
  };

  const openEditDialog = (match) => {
    setEditForm({
      title: match.title,
      teamA: match.teamA,
      teamB: match.teamB,
      scheduledAt: toLocalDateTime(match.scheduledAt),
    });
    setDialog({ type: "edit", match });
  };

  const handleEdit = async (event) => {
    event.preventDefault();

    try {
      await updateMatch(dialog.match._id, {
        ...editForm,
        scheduledAt: new Date(editForm.scheduledAt).toISOString(),
      });
      toast.success("Match updated.");
      setDialog(null);
      await loadMatches();
    } catch (requestError) {
      toast.error(requestError.message);
    }
  };

  const openCompleteDialog = (match) => {
    setDialog({ type: "complete", match });
  };

  const handleComplete = async (event) => {
    event.preventDefault();

    try {
      await updateMatchStatus(dialog.match._id, "completed");
      toast.success("Match completed.");
      setDialog(null);
      await loadMatches();
    } catch (requestError) {
      toast.error(requestError.message);
    }
  };

  return (
    <section className="space-y-6 p-6 sm:p-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">
          Admin zone
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">Match management</h1>
      </div>

      <form
        className="grid gap-4 rounded-xl border border-white/10 bg-slate-950/70 p-6 sm:grid-cols-2"
        onSubmit={handleCreate}
      >
        <h2 className="font-semibold text-white sm:col-span-2">Create match</h2>
        {["title", "teamA", "teamB"].map((name) => (
          <input
            className={inputClass}
            key={name}
            name={name}
            onChange={handleChange}
            placeholder={
              name === "teamA"
                ? "Team A"
                : name === "teamB"
                  ? "Team B"
                  : "Match title"
            }
            required
            value={form[name]}
          />
        ))}
        <input
          className={inputClass}
          name="scheduledAt"
          onChange={handleChange}
          required
          type="datetime-local"
          value={form.scheduledAt}
        />
        <button
          className={[
            "w-fit justify-self-center rounded-lg bg-fuchsia-500/80",
            "px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-500 sm:col-span-2",
          ].join(" ")}
          type="submit"
        >
          Create match
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="font-semibold text-white">Existing matches</h2>
        {loading && <p className="text-cyan-200">Loading matches...</p>}
        {!loading && matches.length === 0 && (
          <p className="rounded-xl border border-white/10 p-6 text-slate-500">
            No matches created yet.
          </p>
        )}
        {matches.map((match) => (
          <div
            className="rounded-xl border border-white/10 bg-slate-950/70 p-5"
            key={match._id}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                  {match.status}
                </p>
                <h3 className="mt-2 font-semibold text-white">{match.title}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  {match.teamA} vs {match.teamB}
                </p>
              </div>
              <p className="font-mono text-fuchsia-200">
                {match.scores.teamA} - {match.scores.teamB}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
                onClick={() => openEditDialog(match)}
                type="button"
              >
                Edit details
              </button>
              <button
                className="rounded-lg border border-cyan-300/20 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-300/10"
                onClick={() => openScoreDialog(match)}
                type="button"
              >
                Update score
              </button>
              {match.status === "live" && (
                <button
                  className="rounded-lg border border-fuchsia-300/20 px-3 py-2 text-xs text-fuchsia-200 hover:bg-fuchsia-300/10"
                  onClick={() => openCompleteDialog(match)}
                  type="button"
                >
                  Mark completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog
        onClose={() => setDialog(null)}
        open={dialog?.type === "edit"}
        title="Edit match"
      >
        <form className="space-y-4" onSubmit={handleEdit}>
          {["title", "teamA", "teamB"].map((name) => (
            <input
              className={inputClass}
              key={name}
              name={name}
              onChange={(event) =>
                setEditForm({ ...editForm, [name]: event.target.value })
              }
              placeholder={
                name === "teamA"
                  ? "Team A"
                  : name === "teamB"
                    ? "Team B"
                    : "Match title"
              }
              required
              value={editForm[name]}
            />
          ))}
          <input
            className={inputClass}
            name="scheduledAt"
            onChange={(event) =>
              setEditForm({ ...editForm, scheduledAt: event.target.value })
            }
            required
            type="datetime-local"
            value={editForm.scheduledAt}
          />
          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300"
              onClick={() => setDialog(null)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-fuchsia-500/80 px-4 py-2 text-sm font-semibold text-white"
              type="submit"
            >
              Save changes
            </button>
          </div>
        </form>
      </Dialog>

      <Dialog
        onClose={() => setDialog(null)}
        open={dialog?.type === "score"}
        title="Update score"
      >
        <form className="space-y-4" onSubmit={handleScore}>
          <label
            className="block space-y-2 text-sm text-slate-300"
            htmlFor="team-a-score"
          >
            {dialog?.match?.teamA} score
            <input
              className={inputClass}
              id="team-a-score"
              min="0"
              name="teamA"
              onChange={(event) =>
                setScoreForm({ ...scoreForm, teamA: event.target.value })
              }
              required
              type="number"
              value={scoreForm.teamA}
            />
          </label>
          <label
            className="block space-y-2 text-sm text-slate-300"
            htmlFor="team-b-score"
          >
            {dialog?.match?.teamB} score
            <input
              className={inputClass}
              id="team-b-score"
              min="0"
              name="teamB"
              onChange={(event) =>
                setScoreForm({ ...scoreForm, teamB: event.target.value })
              }
              required
              type="number"
              value={scoreForm.teamB}
            />
          </label>
          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300"
              onClick={() => setDialog(null)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-cyan-500/80 px-4 py-2 text-sm font-semibold text-white"
              type="submit"
            >
              Save score
            </button>
          </div>
        </form>
      </Dialog>

      <Dialog
        onClose={() => setDialog(null)}
        open={dialog?.type === "complete"}
        title="Mark match completed"
      >
        <form className="space-y-4" onSubmit={handleComplete}>
          <p className="text-sm text-slate-300">
            This will lock the match for settlement. You cannot move it back to live or upcoming.
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300"
              onClick={() => setDialog(null)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-fuchsia-500/80 px-4 py-2 text-sm font-semibold text-white"
              type="submit"
            >
              Mark completed
            </button>
          </div>
        </form>
      </Dialog>
    </section>
  );
};

export default MatchManagementPage;
