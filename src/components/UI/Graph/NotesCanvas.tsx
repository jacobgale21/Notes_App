import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
} from "@xyflow/react";
import { useMemo } from "react";
import { NodeNode } from "./SectionNodes";
import { toFlow } from "../../../lib/toFlow";
import { layoutGraph } from "../../../lib/layout";
import type { NodeKind, NoteGraph } from "../../../data/types";
import Inspector from "./Inspector";
import { useReactFlow } from "@xyflow/react";
import GraphSearch from "./GraphSearch";

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
  const { fitView } = useReactFlow();

  const layout = useMemo(() => layoutGraph(graph), [graph]);
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => toFlow(graph, layout),
    [graph, layout],
  );
  const [nodesState, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const selectedNode = graph.nodes.find((n) => n.id === selectedId) ?? null;

  function focusNode(id: string) {
    onSelect(id);
    window.requestAnimationFrame(() => {
      fitView({
        nodes: [{ id }],
        padding: 0.5,
        duration: 400,
        maxZoom: 1.25,
      });
    });
  }
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
          <Panel position="top-left" className="nodrag nopan w-80">
            <GraphSearch graph={graph} onPick={focusNode} />
          </Panel>
          <Background />
          <Controls />
          <MiniMap position="bottom-left" />
        </ReactFlow>
      </div>
      {selectedNode && <Inspector node={selectedNode} focusNode={focusNode} />}
    </div>
  );
}
