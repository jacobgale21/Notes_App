import type { Graph, GraphNode, NodeKind, RelType } from "../data/types";
import type { Positioned } from "./layout";

import { MarkerType, type Edge, type Node as FlowNode } from "@xyflow/react";

export type CanvasNode = FlowNode<GraphNode, NodeKind>;
const edgeLooks: Record<
  RelType,
  Pick<Edge, "style" | "animated" | "label" | "markerEnd">
> = {
  contains: {
    style: { stroke: "#0f766e", strokeWidth: 2 },
  },
  related: {
    animated: true,
    style: { stroke: "#78716c", strokeWidth: 1.5, strokeDasharray: "6 4" },
  },
  depends_on: {
    label: "depends on",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color: "#c2410c",
    },
    style: { stroke: "#c2410c", strokeWidth: 2 },
  },
};
export function toFlow(
  graph: Graph,
  layout: Positioned,
): { nodes: CanvasNode[]; edges: Edge[] } {
  const flowNodes: CanvasNode[] = graph.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: layout[node.id] ?? { x: 0, y: 0 },
    data: node,
  }));
  const edges: Edge[] = graph.edges.map((r) => ({
    id: r.id,
    source: r.source,
    target: r.target,
    type: r.rel_type === "contains" ? "smoothstep" : "default",
    ...edgeLooks[r.rel_type],
  }));
  return { nodes: flowNodes, edges };
}
