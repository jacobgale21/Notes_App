import type { Graph, Node } from "../../../data/types";
import { useState } from "react";

function matches(node: Node, q: string) {
  const hay =
    `${node.title} ${node.description} ${node.content.map((c) => c.text).join(" ")}`.toLowerCase();
  return hay.includes(q);
}

export default function GraphSearch({
  graph,
  onPick,
}: {
  graph: Graph;
  onPick: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results =
    q.length === 0 ? [] : graph.nodes.filter((n) => matches(n, q)).slice(0, 8);

  return (
    <div className="relative w-full max-w-md">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search sections…"
        className="w-full rounded-xl border border-line bg-card px-3 py-2 text-sm"
      />
      {results.length > 0 && (
        <ul className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-xl border border-line bg-card shadow-lg">
          {results.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-paper"
                onClick={() => {
                  onPick(n.id);
                  setQuery("");
                }}
              >
                <span className="text-sm text-ink">{n.title}</span>
                <span className="text-xs text-muted">{n.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
