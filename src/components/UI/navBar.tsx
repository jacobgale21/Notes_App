import { NavLink, Outlet } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="flex items-center justify-between px-6 py-4">
        <span>Notes App</span>
        <nav className="flex gap-4 text-sm">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/graph">Map</NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
