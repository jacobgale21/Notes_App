export type Section = {
  id: string;
  heading: string;
  subsections: {
    heading: string;
    bullets: {
      text: string;
      relatedSectionIds?: string[];
    }[];
  }[];
};
export type Relation = {
  id: string;
  source: string; // section id
  target: string;
  kind: "sequence" | "related" | "contrast";
  label?: string;
};
export const demoSections: Section[] = [
  {
    id: "arrays",
    heading: "Arrays",
    subsections: [{ heading: "Indexing", bullets: [{ text: "O(1) access" }] }],
  },
  {
    id: "lists",
    heading: "Linked lists",
    subsections: [{ heading: "Nodes", bullets: [{ text: "O(1) insert" }] }],
  },
];
export const demoRelations: Relation[] = [
  {
    id: "r1",
    source: "arrays",
    target: "lists",
    kind: "contrast",
    label: "vs",
  },
];
