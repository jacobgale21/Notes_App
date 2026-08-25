import {
  BookOpen,
  FileText,
  Home,
  Heart,
  Network,
  Plus,
  Settings,
} from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";

const allButtons = [
  {
    icon: Home,
    label: "Home",
    to: "/",
  },
  {
    icon: Network,
    label: "My Graphs",
    to: "/graph",
  },
  {
    icon: FileText,
    label: "Notes",
    to: "/notes",
  },
  {
    icon: BookOpen,
    label: "Study",
    to: "/study",
  },
  {
    icon: Settings,
    label: "Recent",
    to: "/recent",
  },
  {
    icon: Heart,
    label: "Favorites",
    to: "/favorites",
  },
];
export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full border-r border-black/50 p-4 gap-4">
      <header className="flex flex-row items-center mb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand">
          <Network className="h-4 w-4 text-primary-foreground" />
        </span>
        <span className="text-base font-semibold tracking-tight">
          NoteGraph
        </span>
      </header>
      <Button asChild variant="outline" onClick={() => navigate("/upload")}>
        <div className="flex flex-row items-start justify-start">
          <Plus className="h-4 w-4" />
          <span>New Notes</span>
        </div>
      </Button>
      <div className="flex flex-col mt-4 gap-2">
        {allButtons.map((button) => (
          <Button
            asChild
            variant="ghost"
            key={button.label}
            onClick={() => navigate(button.to)}
          >
            <div className="flex flex-row items-start justify-start">
              <button.icon className="h-4 w-4" />
              <span>{button.label}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
