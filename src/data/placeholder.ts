import type { LucideIcon } from "lucide-react";
import { ListIcon, ListOrderedIcon } from "lucide-react";

export type NodeKind = "root" | "topic" | "concept";
export type Relationship = "contains" | "related" | "depends_on";

export type Node = {
  id: string;
  title: string;
  subtitle?: string | undefined;
  description: string;
  type: NodeKind;
  icon?: LucideIcon;
  content: string[];
  category?: string;
};
export type Relation = {
  id: string;
  source: string;
  target: string;
  relationship: Relationship;
};
export const demoSections: Node[] = [
  {
    id: "arrays",
    title: "Arrays",
    icon: ListOrderedIcon,
    description: "A contiguous block of memory",
    type: "topic",
    content: ["O(1) access", "O(n) insertion", "O(n) deletion"],
  },
  {
    id: "lists",
    title: "Linked lists",
    icon: ListIcon,
    description: "A linked list is a linear data structure",
    type: "topic",
    content: ["O(1) insert", "O(n) deletion", "O(n) search"],
  },
];
export const demoRelations: Relation[] = [
  {
    id: "r1",
    source: "arrays",
    target: "lists",
    relationship: "related",
  },
];

export function getRelatedTopics(node: Node): string[] {
  const relatedTo = new Map<string, Set<string>>();
  for (const r of demoRelations) {
    if (r.relationship !== "related") continue;
    if (!relatedTo.has(r.source)) relatedTo.set(r.source, new Set());
    if (!relatedTo.has(r.target)) relatedTo.set(r.target, new Set());
    relatedTo.get(r.source)!.add(r.target);
    relatedTo.get(r.target)!.add(r.source);
  }
  return [...(relatedTo.get(node.id) ?? [])];
}
