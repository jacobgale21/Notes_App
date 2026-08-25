import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { NodeNode } from "./SectionNodes";
import { toFlow } from "../../../lib/toFlow";
import Inspector from "./Inspector";
import type { Relation, Node, NodeKind } from "../../../data/placeholder";

const nodeTypes: Record<NodeKind, typeof NodeNode> = {
  root: NodeNode,
  topic: NodeNode,
  concept: NodeNode,
};

export function NotesCanvas({
  nodes,
  relations,
  onSelect,
  selectedId,
}: {
  nodes: Node[];
  relations: Relation[];
  onSelect: (id: string | null) => void;
  selectedId: string | null;
}) {
  const { nodes: initialNodes, edges: initialEdges } = toFlow(nodes, relations);
  const [nodesState, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;
  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodesState}
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
        <div className="flex justify-end items-center h-full">
          {selectedNode && <Inspector node={selectedNode} />}
        </div>
      </ReactFlow>
    </div>
  );
}
