import { ReactFlowProvider } from "@xyflow/react";
import { useState } from "react";
import { NotesCanvas } from "../UI/Graph/NotesCanvas";
import { useParams } from "react-router-dom";
import { useGraph } from "../../hooks/useCatalog";

export function GraphView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { id } = useParams();
  const { data: graph, isPending, isError } = useGraph(id ?? "");

  if (!id || isPending) return <p>Loading…</p>;
  if (isError || !graph) return <p>Graph not found</p>;

  console.log(graph);

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
