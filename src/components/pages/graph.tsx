import { ReactFlowProvider } from "@xyflow/react";
import { useState } from "react";
import { NotesCanvas } from "../UI/Graph/NotesCanvas";
// import { Inspector } from "./Inspector";
import type { Section, Relation } from "../../data/placeholder";

export function GraphView({
  sections,
  relations,
}: {
  sections: Section[];
  relations: Relation[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = sections.find((s) => s.id === selectedId) ?? null;

  return (
    <ReactFlowProvider>
      <div className="flex min-h-screen">
        <div className="min-w-0 flex-1">
          <NotesCanvas
            sections={sections}
            relations={relations}
            onSelect={setSelectedId}
          />
        </div>
        {/* {selected && <Inspector section={selected} />} */}
      </div>
    </ReactFlowProvider>
  );
}
