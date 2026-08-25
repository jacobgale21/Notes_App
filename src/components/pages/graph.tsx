import { ReactFlowProvider } from "@xyflow/react";
import { useState } from "react";
import { NotesCanvas } from "../UI/Graph/NotesCanvas";
import type { Node, Relation } from "../../data/placeholder";

export function GraphView({
  nodes,
  relations,
}: {
  nodes: Node[];
  relations: Relation[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <ReactFlowProvider>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className="min-w-0 flex-1">
          <NotesCanvas
            nodes={nodes}
            relations={relations}
            onSelect={setSelectedId}
            selectedId={selectedId}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
}
