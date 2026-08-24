import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { SectionNode } from "./SectionNodes";
import { toFlow } from "../lib/toFlow";

import type { Relation, Section } from "./graph";
const nodeTypes = { section: SectionNode };

export function NotesCanvas({
  sections,
  relations,
  onSelect,
}: {
  sections: Section[];
  relations: Relation[];
  onSelect: (id: string | null) => void;
}) {
  const { nodes: initialNodes, edges: initialEdges } = toFlow(
    sections,
    relations,
  );
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onSelect(node.id)}
        onPaneClick={() => onSelect(null)}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
