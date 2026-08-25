import { ReactFlowProvider } from "@xyflow/react";
import { useState } from "react";
import { NotesCanvas } from "../UI/Graph/NotesCanvas";
import type { NoteGraph } from "../../data/types";

export function GraphView({ graph }: { graph: NoteGraph }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <ReactFlowProvider>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className="min-w-0 flex-1">
          <NotesCanvas
            graph={graph}
            onSelect={setSelectedId}
            selectedId={selectedId}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
