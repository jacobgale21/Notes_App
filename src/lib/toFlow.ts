import type { Relation, Node } from "../data/placeholder";

export function toFlow(nodes: Node[], relations: Relation[]) {
  const flowNodes = nodes.map((node, i) => ({
    id: node.id,
    type: node.type, // must match nodeTypes key
    position: { x: 0, y: i * 180 }, // later: dagre layout
    data: node, // passed into SectionNode as data
  }));
  //   const subsectionNodes = subsections.map((subsection, i) => ({
  //     id: subsection.id,
  //     type: "subsection", // must match nodeTypes key
  //     position: { x: 0, y: i * 180 }, // later: dagre layout
  //     data: subsection, // passed into SubsectionNode as data
  //   }));
  const edges = relations.map((r) => ({
    id: r.id,
    source: r.source,
    target: r.target,
    relationship: r.relationship,
  }));
  return { nodes: flowNodes, edges };
}
