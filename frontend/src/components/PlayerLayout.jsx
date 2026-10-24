import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const links = [
  { label: "Dashboard", to: "/dashboard" },
  { end: false, label: "Matches", to: "/matches" },
  { label: "My Predictions", to: "/predictions" },
  { label: "Leaderboard", to: "/leaderboard" },
];

const PlayerLayout = () => {
  return (
    <div className="h-screen overflow-hidden bg-arcade">
      <Sidebar label="Player zone" links={links} />
      <main className="h-screen min-w-0 overflow-y-auto pt-16 md:ml-60 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default PlayerLayout;
