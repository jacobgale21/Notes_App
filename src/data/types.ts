export type NodeKind = "root" | "topic" | "concept";
export type RelType = "contains" | "related" | "depends_on";
export type ContentBlockType = "text" | "definition" | "equation";

export interface User {
  email: string;
  password: string;
}

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  text: string;
}

export interface GraphNode {
  id: string;
  title: string;
  subtitle?: string | undefined;
  description: string;
  type: NodeKind;
  graph_id: string;
  content: ContentBlock[];
  category?: string;
}
export type Node = GraphNode;

export interface NodeCreateInput {
  title: string;
  subtitle?: string;
  description: string;
  type: NodeKind;
  content: ContentBlock[];
  graph_id: string;
}
export interface Relation {
  id: string;
  source: string;
  target: string;
  rel_type: RelType;
  graph_id: string;
}

export interface RelationCreate {
  source: string;
  target: string;
  rel_type: RelType;
  graph_id: string;
}

export interface Graph {
  id: string;
  title: string;
  subject: string;
  updated_at: string;
  nodes: Node[];
  edges: Relation[];
}

export interface GraphSummary {
  id: string;
  title: string;
  subject: string;
  updated_at: string;
}
