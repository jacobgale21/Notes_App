import { Outlet } from "react-router-dom";
import { Button } from "./button";
import { Link } from "react-router-dom";
import { Network } from "lucide-react";

export default function NavBar() {
  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand">
            <Network className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            NoteGraph
          </span>
          <nav className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">Home</Link>
            </Button>
            <Button asChild variant="brand" size="sm">
              <Link to="/upload">Upload</Link>
            </Button>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
