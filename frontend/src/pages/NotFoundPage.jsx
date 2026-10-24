import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/15 blur-3xl" />

      <div className="w-full max-w-xl text-center">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">
          Error 404
        </p>
        <h1 className="mt-5 bg-gradient-to-r from-cyan-200 via-fuchsia-300 to-purple-400 bg-clip-text text-8xl font-black leading-none text-transparent sm:text-9xl">
          404
        </h1>
        <h2 className="mt-6 text-2xl font-bold text-slate-100 sm:text-3xl">
          This ball went out of bounds.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-400">
          The page you are looking for does not exist or has moved to another
          over.
        </p>
        <Link
          className="mt-8 inline-flex rounded-lg bg-fuchsia-500 px-6 py-3.5 font-bold text-white shadow-[0_0_24px_rgba(217,70,239,0.28)] transition hover:bg-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:ring-offset-2 focus:ring-offset-slate-950"
          to="/"
        >
          Return to home
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
