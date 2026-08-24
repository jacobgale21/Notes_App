import type { Relation, Section } from "../components/pages/graph";

export function toFlow(sections: Section[], relations: Relation[]) {
  const nodes = sections.map((section, i) => ({
    id: section.id,
    type: "section", // must match nodeTypes key
    position: { x: 0, y: i * 180 }, // later: dagre layout
    data: section, // passed into SectionNode as data
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
    label: r.label ?? r.kind,
  }));
  return { nodes, edges };
}
