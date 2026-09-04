import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
} from "@xyflow/react";
import { useMemo, useState, useEffect } from "react";
import { NodeNode } from "./SectionNodes";
import { toFlow } from "../../../lib/toFlow";
import { layoutGraph } from "../../../lib/layout";
import type { NodeKind, Graph } from "../../../data/types";
import Inspector from "./Inspector";
import { useReactFlow } from "@xyflow/react";
import GraphSearch from "./GraphSearch";
import { Button } from "../button";
import CreateNodeModel from "./createNodeModel";
import CreateEdge from "./createEdge";
import EdgePatch from "./edgePatch";

type RelType = "contains" | "related" | "depends_on";

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
  graph: Graph;
  onSelect: (id: string | null) => void;
  selectedId: string | null;
}) {
  const { fitView } = useReactFlow();

  const layout = useMemo(() => layoutGraph(graph), [graph]);
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => toFlow(graph, layout),
    [graph, layout],
  );
  const [nodesState, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const selectedNode = graph.nodes.find((n) => n.id === selectedId) ?? null;
  const [createNodeModalOpen, setCreateNodeModalOpen] = useState(false);
  const [createEdgeModalOpen, setCreateEdgeModalOpen] = useState(false);
  const [relType, setRelType] = useState<RelType | null>(null);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const selectedEdge = graph.edges.find((e) => e.id === selectedEdgeId) ?? null;

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

  useEffect(() => {
    const nextLayout = layoutGraph(graph);
    const flow = toFlow(graph, nextLayout);
    setNodes(flow.nodes);
    setEdges(flow.edges);
  }, [graph, setNodes, setEdges]);
  return (
    <div className="flex h-full min-h-0 w-full">
      <div className="relative min-h-0 min-w-0 flex-1">
        <ReactFlow
          nodes={nodesState}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onEdgeClick={(_, edge) => {
            if (createEdgeModalOpen) return;
            onSelect(null);
            setSelectedEdgeId(edge.id);
          }}
          onNodeClick={(_, node) => {
            setSelectedEdgeId(null);
            if (!createEdgeModalOpen) {
              onSelect(node.id);
              return;
            }
            if (!sourceId) setSourceId(node.id);
            else if (!targetId && node.id !== sourceId) setTargetId(node.id);
          }}
          onPaneClick={() => {
            if (!createEdgeModalOpen) {
              onSelect(null);
              setSelectedEdgeId(null);
            }
          }}
          fitView
          className="h-full w-full"
        >
          <Panel position="top-left" className="nopan flex items-center gap-2">
            <Controls
              className="!relative !m-0 !top-auto !left-auto"
              orientation="horizontal"
            />
            <div className="nodrag w-80">
              <GraphSearch graph={graph} onPick={focusNode} />
            </div>
          </Panel>
          <Panel position="top-right" className="nopan flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCreateNodeModalOpen(true)}
            >
              Create New Node
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCreateEdgeModalOpen(true)}
            >
              Create New Edge
            </Button>
          </Panel>
          <Background />

          <MiniMap position="bottom-left" />
        </ReactFlow>
      </div>
      {createEdgeModalOpen && (
        <CreateEdge
          graph={graph}
          sourceId={sourceId ?? ""}
          targetId={targetId ?? ""}
          onClearSource={() => setSourceId(null)}
          onClearTarget={() => setTargetId(null)}
          onClose={() => {
            setCreateEdgeModalOpen(false);
            setRelType(null);
            setSourceId(null);
            setTargetId(null);
          }}
        />
      )}
      {selectedEdge && !createEdgeModalOpen && (
        <EdgePatch
          graph={graph}
          edge={selectedEdge}
          onClose={() => setSelectedEdgeId(null)}
        />
      )}
      {selectedNode &&
        !selectedEdge &&
        !createNodeModalOpen &&
        !createEdgeModalOpen && (
          <Inspector node={selectedNode} graph={graph} focusNode={focusNode} />
        )}
      {createNodeModalOpen && !selectedNode && !selectedEdge && (
        <CreateNodeModel
          graph={graph}
          onClose={() => setCreateNodeModalOpen(false)}
        />
      )}
    </div>
  );
}
