import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const links = [
  { label: "Dashboard", to: "/admin" },
  { activePaths: ["/matches"], label: "Matches", to: "/admin/matches" },
  { label: "Users", to: "/admin/users" },
  { label: "Audit Logs", to: "/admin/audit-logs" },
  { label: "Leaderboard", to: "/leaderboard" },
];

const AdminLayout = () => {
  return (
    <div className="h-screen overflow-hidden bg-arcade">
      <Sidebar label="Admin zone" links={links} />
      <main className="h-screen min-w-0 overflow-y-auto pt-16 md:ml-60 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
