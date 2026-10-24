import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -left-28 -z-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="w-full max-w-3xl text-center">
        <div className="mx-auto mb-8 flex w-fit items-center gap-3 rounded-full border border-cyan-300/20 bg-slate-950/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />
          Virtual credits only
        </div>

        <p className="mb-5 font-mono text-sm uppercase tracking-[0.42em] text-fuchsia-300">
          Welcome to the crease
        </p>
        <h1 className="bg-gradient-to-r from-cyan-200 via-fuchsia-300 to-purple-400 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-7xl">
          Cricket-Betting
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
          Predict cricket match outcomes, make your calls, and climb the
          leaderboard using virtual credits in a retro arcade-inspired arena.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            className="rounded-lg bg-fuchsia-500 px-7 py-3.5 font-bold text-white shadow-[0_0_24px_rgba(217,70,239,0.28)] transition hover:bg-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            to="/signup"
          >
            Sign Up
          </Link>
          <Link
            className="rounded-lg border border-cyan-300/30 bg-cyan-300/5 px-7 py-3.5 font-bold text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            to="/login"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
