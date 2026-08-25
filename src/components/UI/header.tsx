import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./button";

export default function Header({ title }: { title: string }) {
  return (
    <header className="flex flex-row p-3 bg-background border-b border-black/50">
      <h3 className="ml-4 self-start text-2xl font-semibold">{title}</h3>
      <div className="ml-auto mr-4 gap-2 flex flex-row items-center">
        <input
          type="text"
          placeholder="Search Concepts"
          className="border border-black/50 rounded-lg p-2 h-9"
        />
        <Button asChild variant="outline">
          <Link
            to="/upload"
            className="flex flex-row items-start justify-start"
          >
            <Plus className="h-4 w-4" />
            <span>New Notes</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
