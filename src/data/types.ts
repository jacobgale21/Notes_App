import type { LucideIcon } from "lucide-react";

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

export type NoteGraph = {
  id: string;
  title: string;
  subject: string;
  updatedAt: string;
  nodes: Node[];
  edges: Relation[];
};
