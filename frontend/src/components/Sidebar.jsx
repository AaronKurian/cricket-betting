import { useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../api/api";
import { useAuth } from "../auth/AuthContext";

const Sidebar = ({ links, label }) => {
  const { user, logout: clearUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    clearUser();
    navigate("/login");
  };

  return (
    <>
      {!open && (
        <button
          aria-label="Open menu"
          className="fixed left-4 top-4 z-50 rounded-lg border border-cyan-300/20 bg-slate-950/90 p-2 text-cyan-200 md:hidden"
          onClick={() => setOpen(true)}
          type="button"
        >
          <FiMenu size={20} />
        </button>
      )}
      {open && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-950/60 md:hidden"
          onClick={() => setOpen(false)}
          type="button"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[85vw] max-w-80 shrink-0 flex-col overflow-hidden border-r border-cyan-300/10 bg-slate-950/95 p-5 transition-transform md:w-60 md:translate-x-0 md:bg-slate-950/70 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {open && (
          <button
            aria-label="Close menu"
            className="absolute right-4 top-4 rounded-lg border border-cyan-300/20 p-2 text-cyan-200 md:hidden"
            onClick={() => setOpen(false)}
            type="button"
          >
            <FiX size={20} />
          </button>
        )}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">
            {label}
          </p>
          <h1 className="mt-2 text-xl font-bold text-white">Cricket-Betting</h1>
        </div>
        <nav className="mt-10 space-y-2">
          {links.map((link) => (
            <NavLink
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition ${isActive || link.activePaths?.some((path) => location.pathname.startsWith(path)) ? "bg-fuchsia-500/20 text-fuchsia-200" : "text-slate-400 hover:bg-white/5 hover:text-white"}`
              }
              end={link.end ?? true}
              key={link.to}
              onClick={() => setOpen(false)}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-5">
          <p className="truncate text-sm text-slate-300">{user?.name}</p>
          <button
            aria-label="Log out"
            className="shrink-0 text-fuchsia-300 hover:text-fuchsia-200"
            onClick={handleLogout}
            title="Log out"
            type="button"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
