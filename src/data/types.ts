export type NodeKind = "root" | "topic" | "concept";
export type RelType = "contains" | "related" | "depends_on";
export type ContentBlockType = "text" | "definition" | "equation";

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  text: string;
}

export interface Node {
  id: string;
  title: string;
  subtitle?: string | undefined;
  description: string;
  type: NodeKind;
  content: ContentBlock[];
  category?: string;
}

export interface Relation {
  id: string;
  source: string;
  target: string;
  rel_type: RelType;
}

export interface Graph {
  id: string;
  title: string;
  subject: string;
  updated_at: string;
  nodes: Node[];
  edges: Relation[];
}
