import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { useMemo } from "react";
import { NodeNode } from "./SectionNodes";
import { toFlow } from "../../../lib/toFlow";
import { layoutGraph } from "../../../lib/layout";
import type { NodeKind, NoteGraph } from "../../../data/types";
import Inspector from "./Inspector";

const nodeTypes: Record<NodeKind, typeof NodeNode> = {
  root: NodeNode,
  topic: NodeNode,
  concept: NodeNode,
};

export function NotesCanvas({
  graph,
  onSelect,
  selectedId,
}: {
  graph: NoteGraph;
  onSelect: (id: string | null) => void;
  selectedId: string | null;
}) {
  const layout = useMemo(() => layoutGraph(graph), [graph]);
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => toFlow(graph, layout),
    [graph, layout],
  );
  const [nodesState, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const selectedNode = graph.nodes.find((n) => n.id === selectedId) ?? null;

  return (
    <div className="flex h-full min-h-0 w-full">
      <div className="relative min-h-0 min-w-0 flex-1">
        <ReactFlow
          nodes={nodesState}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => onSelect(node.id)}
          onPaneClick={() => onSelect(null)}
          fitView
          className="h-full w-full"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      {selectedNode && <Inspector node={selectedNode} />}
    </div>
  );
}
