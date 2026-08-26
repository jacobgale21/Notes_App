import type { NoteGraph, Relationship } from "../data/types";
import type { Positioned } from "./layout";

import { MarkerType, type Edge } from "@xyflow/react";
const edgeLooks: Record<
  Relationship,
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
    markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
    style: { stroke: "#ffffff", strokeWidth: 2 },
  },
};
export function toFlow(graph: NoteGraph, layout: Positioned) {
  const flowNodes = graph.nodes.map((node) => ({
    id: node.id,
    type: node.type, // must match nodeTypes key
    position: layout[node.id] ?? { x: 0, y: 0 }, // later: dagre layout
    data: node, // passed into SectionNode as data
  }));
  const edges = graph.edges.map((r) => ({
    id: r.id,
    source: r.source,
    target: r.target,
    type: "step",
    ...edgeLooks[r.relationship],
  }));
  return { nodes: flowNodes, edges };
}
