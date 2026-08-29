import { ReactFlowProvider } from "@xyflow/react";
import { useState } from "react";
import { NotesCanvas } from "../UI/Graph/NotesCanvas";
import type { Graph } from "../../data/types";
import { createGraph } from "../../api";
import { Button } from "../UI/button";

export function GraphView() {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!graph) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button
          onClick={() => {
            setError(null);
            createGraph()
              .then(setGraph)
              .catch((err) => {
                console.error(err);
                setError(
                  err.response?.data?.detail ?? "Failed to create graph",
                );
              });
          }}
        >
          Create Graph
        </Button>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="flex h-[calc(100vh-4rem)] min-h-0">
        <div className="min-h-0 min-w-0 flex-1">
          <NotesCanvas
            key={graph.id}
            graph={graph}
            onSelect={setSelectedId}
            selectedId={selectedId}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
