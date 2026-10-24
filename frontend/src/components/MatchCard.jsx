import { Link } from "react-router-dom";

function formatDate(value) {
  return new Date(value).toLocaleString();
}

const MatchCard = ({ match }) => {
  return (
    <Link
      className="block rounded-xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-300/30"
      to={`/matches/${match._id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            {match.status}
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            {match.title}
          </h2>
        </div>
        <span className="text-right text-xs text-slate-500">
          {formatDate(match.scheduledAt)}
        </span>
      </div>
      <div className="mt-6 flex items-center justify-between text-slate-200">
        <span>{match.teamA}</span>
        <span className="font-mono text-fuchsia-200">
          {match.scores.teamA} - {match.scores.teamB}
        </span>
        <span>{match.teamB}</span>
      </div>
    </Link>
  );
};

export default MatchCard;
