import Sidebar from "../UI/sidebar";
import { Button } from "../UI/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Brain, Network, Notebook } from "lucide-react";
import Header from "../UI/header";
import { useGetGraphs } from "../../hooks/useCatalog";
import type { GraphSummary } from "../../data/types";
// Placeholder data for the dashboard: will fetch from the user database when developed
const placehoderData = [
  {
    title: "Knowledge Graphs",
    value: 5,
    icon: Network,
  },
  {
    title: "Concepts Mapped",
    value: 40,
    icon: Brain,
  },
  {
    title: "Notes Processed",
    value: 4,
    icon: Notebook,
  },
  {
    title: "Day Study Streak",
    value: 3,
    icon: BookOpen,
  },
];

function formatUpdatedAt(isoDate: string): string {
  const then = new Date(isoDate.endsWith("Z") ? isoDate : `${isoDate}Z`);
  if (Number.isNaN(then.getTime())) return "unknown";
  const startOfThen = new Date(
    then.getFullYear(),
    then.getMonth(),
    then.getDate(),
  );
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfThen.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
}

export default function Dashboard() {
  const { data: graphs } = useGetGraphs();
  const navigate = useNavigate();
  return (
    <div className="flex flex-row h-screen">
      <div className="w-1/6 h-full">
        <Sidebar />
      </div>
      <div className="flex flex-col w-5/6 h-full ">
        <Header title="Home" />
        <div className="flex flex-col items-start justify-start w-9/10 mx-auto">
          <header className="mt-4 flex flex-col items-start justify-start p-4 bg-background rounded-lg shadow-lg w-full">
            <h2>Welcome back, Jacob</h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              You left off in Computer Architecture. Instruction Cycle and CPI
              are your weakest links — a quick quiz would help.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant="brand">
                <Link to="/graph/$graphId">
                  Resume graph <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="study/$graphId">Study now</Link>
              </Button>
            </div>
          </header>
          <section className="mt-6 flex flex-row justify-between gap-2 w-full">
            {placehoderData.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-start justify-center gap-2 bg-background rounded-lg shadow-lg w-full p-6"
              >
                <item.icon className="h-6 w-6" />
                <h3>{item.value}</h3>
                <span className="text-md text-muted-foreground">
                  {item.title}
                </span>
              </div>
            ))}
          </section>
          <section className="mt-6 w-full">
            <h2>Your Graphs</h2>
            <div className="mt-4 flex flex-row justify-between gap-2 w-full">
              {graphs?.map((graph: GraphSummary) => (
                <button
                  key={graph.title}
                  className="flex flex-col items-start justify-center gap-2 bg-background rounded-lg shadow-lg w-full p-6 hover:bg-paper"
                  onClick={() => navigate(`/graph/${graph.id}`)}
                >
                  <span className="text-sm text-muted-foreground rounded-full bg-paper py-1 px-2 mb-2">
                    {graph.subject}
                  </span>
                  <h4>{graph.title}</h4>
                  <span className="text-md text-muted-foreground">
                    Updated {formatUpdatedAt(graph.updated_at)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
