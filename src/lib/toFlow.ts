import type { NoteGraph } from "../data/types";
import type { Positioned } from "./layout";
export function toFlow(graph: NoteGraph, layout: Positioned) {
  const flowNodes = graph.nodes.map((node) => ({
    id: node.id,
    type: node.type, // must match nodeTypes key
    position: layout[node.id] ?? { x: 0, y: 0 }, // later: dagre layout
    data: node, // passed into SectionNode as data
  }));
  //   const subsectionNodes = subsections.map((subsection, i) => ({
  //     id: subsection.id,
  //     type: "subsection", // must match nodeTypes key
  //     position: { x: 0, y: i * 180 }, // later: dagre layout
  //     data: subsection, // passed into SubsectionNode as data
  //   }));
  const edges = graph.edges.map((r) => ({
    id: r.id,
    source: r.source,
    target: r.target,
    relationship: r.relationship,
  }));
  return { nodes: flowNodes, edges };
}
