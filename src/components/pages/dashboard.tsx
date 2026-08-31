import Sidebar from "../UI/sidebar";
import { Button } from "../UI/button";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Loader,
  Network,
  Notebook,
} from "lucide-react";
import Header from "../UI/header";
import { useDeleteGraph, useGetGraphs } from "../../hooks/useCatalog";
import type { GraphSummary } from "../../data/types";
import { useState } from "react";
import { formatUpdatedAt } from "../../lib/format";
import { useMutation } from "@tanstack/react-query";
// Placeholder data for the dashboard: will fetch from the user database when developed
const placeholderData = [
  {
    title: "Knowledge Graphs",
    value: 0,
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

export default function Dashboard() {
  const { data: graphs } = useGetGraphs();
  const [numberOfGraphs, setNumberOfGraphs] = useState(graphs?.length ?? 0);
  const { mutate, isPending, isError, error } = useDeleteGraph();
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
            {placeholderData.map((item, index) =>
              index === 0 ? (
                <div
                  key={item.title}
                  className="flex flex-col items-start justify-center gap-2 bg-background rounded-lg shadow-lg w-full p-6"
                >
                  <item.icon className="h-6 w-6" />
                  <h3>{numberOfGraphs}</h3>
                  <span className="text-md text-muted-foreground">
                    {item.title}
                  </span>
                </div>
              ) : (
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
              ),
            )}
          </section>
          <section className="mt-6 w-full">
            <h2>Your Graphs</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-between gap-2 w-full">
              {graphs?.map((graph: GraphSummary) => (
                <div
                  key={graph.title}
                  className="group relative flex flex-col items-start justify-center gap-2 bg-background rounded-lg shadow-lg w-full p-4 hover:bg-paper"
                  onClick={() => navigate(`/graph/${graph.id}`)}
                >
                  <div className="flex items-center justify-between w-full mb-4">
                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase bg-secondary/80 px-2.5 py-1 rounded-md">
                      {graph.subject}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        mutate(graph.id);
                      }}
                    >
                      {isPending ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </div>

                  {/* Content Area */}
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold tracking-tight text-foreground">
                      {graph.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatUpdatedAt(graph.updated_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
