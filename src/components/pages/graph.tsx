import { ReactFlowProvider } from "@xyflow/react";
import { useState } from "react";
import { NotesCanvas } from "../UI/Graph/NotesCanvas";
// import { Inspector } from "./Inspector";
import type { Section, Relation } from "../../data/placeholder";
import Inspector from "../UI/Graph/Inspector";

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
      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className="min-w-0 flex-1">
          <NotesCanvas
            sections={sections}
            relations={relations}
            onSelect={setSelectedId}
          />
        </div>
        {selected ? (
          <Inspector section={selected} />
        ) : (
          <aside className="flex w-80 shrink-0 items-center justify-center border-l border-line bg-card px-6 text-center text-sm text-muted">
            Select a section to read it
          </aside>
        )}
      </div>
    </ReactFlowProvider>
  );
}
