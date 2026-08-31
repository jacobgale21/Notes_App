import type { Graph } from "../data/types";

export type Positioned = Record<string, { x: number; y: number }>;

const COL_WIDTH = 340;
const ROW_HEIGHT = 250;

/**
 * Simple deterministic hierarchical (left-to-right tree) layout.
 * Kept separate from UI so a real layout engine can replace it later.
 */
export function layoutGraph(graph: Graph): Positioned {
  const children = new Map<string, string[]>();
  const hasParent = new Set<string>();

  for (const edge of graph.edges) {
    if (edge.rel_type !== "contains") continue;
    const list = children.get(edge.source) ?? [];
    if (!list.includes(edge.target)) list.push(edge.target);
    children.set(edge.source, list);
    hasParent.add(edge.target);
  }

  const roots = graph.nodes
    .filter((n) => !hasParent.has(n.id))
    .map((n) => n.id);
  const positions: Positioned = {};
  let cursor = 0;
  const visited = new Set<string>();

  const place = (id: string, depth: number): number => {
    if (visited.has(id)) return cursor * ROW_HEIGHT;
    visited.add(id);
    const kids = children.get(id) ?? [];
    let y: number;
    if (kids.length === 0) {
      y = cursor * ROW_HEIGHT;
      cursor += 1;
    } else {
      const ys = kids.map((k) => place(k, depth + 1)).filter(Number.isFinite);
      y =
        ys.length > 0
          ? (Math.min(...ys) + Math.max(...ys)) / 2
          : cursor * ROW_HEIGHT;
    }
    positions[id] = { x: depth * COL_WIDTH, y };
    return y;
  };

  roots.forEach((r) => place(r, 0));

  // Any node not reachable through "contains" edges gets appended in a column.
  graph.nodes.forEach((node) => {
    if (!positions[node.id]) {
      positions[node.id] = { x: 0, y: cursor * ROW_HEIGHT };
      cursor += 1;
    }
  });

  return positions;
}
