import { AnimatePresence, motion } from "framer-motion";
import type { Graph, Relation } from "../../../data/types";
import { Button } from "../button";
import {
  ArrowDown,
  ArrowRight,
  X,
  ChevronRight,
  Link2,
  GitBranch,
  Layers3,
  Loader2,
} from "lucide-react";
import { useState } from "react";
type RelType = "contains" | "related" | "depends_on";
export default function EdgePatch({
  graph,
  edge,
  onClose,
}: {
  graph: Graph;
  edge: Relation;
  onClose: () => void;
}) {
  const [rel_type, setRel_Type] = useState<RelType>(edge.rel_type);
  const [source, setSource] = useState<string>(edge.source);
  const [target, setTarget] = useState<string>(edge.target);
  const currentSource = graph.nodes.find((n) => n.id === source);
  const currentDestination = graph.nodes.find((n) => n.id === target);

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.25 }}
        className="
      flex h-full w-[360px] shrink-0 flex-col
      border-l border-line
      bg-card
      shadow-xl
    "
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Graph
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">
              Edit Relationship
            </h2>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="
          h-8 w-8 rounded-full
          text-muted
          hover:bg-paper
          hover:text-ink
        "
            aria-label="Close"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Instruction */}
          <div className="mb-6 rounded-lg border border-line bg-paper/60 p-3">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Link2 className="h-3.5 w-3.5" />
              </div>

              <div>
                <p className="text-sm font-medium text-ink">
                  Edit relationship
                </p>

                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Edit the relationship between two nodes.
                </p>
              </div>
            </div>
          </div>

          {/* Relationship Type */}
          <section>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-ink">
                Relationship type
              </h3>

              <p className="mt-0.5 text-xs text-muted">
                Edit the relationship between two nodes.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {[
                {
                  id: "related" as const,
                  title: "Related",
                  hint: "General connection",
                  Icon: ArrowRight,
                },
                {
                  id: "depends_on" as const,
                  title: "Depends On",
                  hint: "Requires another node",
                  Icon: GitBranch,
                },
                {
                  id: "contains" as const,
                  title: "Contains",
                  hint: "Groups another node",
                  Icon: Layers3,
                },
              ].map(({ id, title, hint, Icon }) => {
                const selected = rel_type === id;
                return (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setRel_Type(id)}
                    aria-pressed={rel_type === id}
                    className={`
      group h-auto w-full justify-between rounded-lg px-3 py-3 text-left
      ${
        rel_type === id
          ? "border border-accent bg-accent/15 hover:bg-accent/20"
          : "border border-line bg-paper hover:border-accent/40 hover:bg-accent/5"
      }
    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
    flex h-9 w-9 items-center justify-center rounded-md
    ${
      rel_type === id
        ? "bg-accent/20 text-accent"
        : "bg-muted/10 text-muted group-hover:bg-accent/10 group-hover:text-accent"
    }
  `}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{title}</p>
                        <p className="mt-0.5 text-xs text-muted">{hint}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted/50" />
                  </Button>
                );
              })}
              {/* Related */}
              {/* <Button
                variant="ghost"
                onClick={() => setRel_Type("related")}
                className="
              group h-auto w-full justify-between
              rounded-lg border border-line
              bg-paper
              px-3 py-3
              text-left
              hover:border-accent/40
              hover:bg-accent/5
            "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                flex h-9 w-9 items-center justify-center
                rounded-md bg-muted/10
                text-muted
                group-hover:bg-accent/10
                group-hover:text-accent
              "
                  >
                    <ArrowRight className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-ink">Related</p>

                    <p className="mt-0.5 text-xs text-muted">
                      General connection
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-muted/50" />
              </Button>

              {/* Depends On */}
              {/* <Button
                variant="ghost"
                onClick={() => setRel_Type("depends_on")}
                className="
              group h-auto w-full justify-between
              rounded-lg border border-line
              bg-paper
              px-3 py-3
              text-left
              hover:border-accent/40
              hover:bg-accent/5
            "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                flex h-9 w-9 items-center justify-center
                rounded-md bg-muted/10
                text-muted
                group-hover:bg-accent/10
                group-hover:text-accent
              "
                  >
                    <GitBranch className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-ink">Depends On</p>

                    <p className="mt-0.5 text-xs text-muted">
                      Requires another node
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-muted/50" />
              </Button> */}

              {/* Contains */}
              {/* <Button
                variant="ghost"
                onClick={() => setRel_Type("contains")}
                className="
              group h-auto w-full justify-between
              rounded-lg border border-line
              bg-paper
              px-3 py-3
              text-left
              hover:border-accent/40
              hover:bg-accent/5
            "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                flex h-9 w-9 items-center justify-center
                rounded-md bg-muted/10
                text-muted
                group-hover:bg-accent/10
                group-hover:text-accent
              "
                  >
                    <Layers3 className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-ink">Contains</p>

                    <p className="mt-0.5 text-xs text-muted">
                      Groups another node
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-muted/50" /> 
               </Button> */}
            </div>
          </section>

          {/* Connection */}
          <section className="mt-8">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-ink">Connection</h3>

              <p className="mt-0.5 text-xs text-muted">
                Select the two nodes on your graph.
              </p>
            </div>

            <div className="rounded-lg border border-line bg-paper overflow-hidden">
              {/* Source */}
              <div className="p-3">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent" />

                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Source
                  </span>
                </div>

                <div
                  className="
              flex min-h-[42px] items-center
              rounded-md border border-line
              bg-card
              px-3
            "
                >
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-ink outline-none"
                  >
                    {graph.nodes
                      .filter((n) => n.id !== target)
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.title}
                        </option>
                      ))}
                  </select>

                  {source && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-7 w-7 text-muted hover:text-ink"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Connector */}
              <div className="flex items-center px-4">
                <div className="h-px flex-1 bg-line" />
                <div
                  className="
              mx-2 flex h-7 w-7 items-center justify-center
              rounded-full border border-line
              bg-card
              text-muted
            "
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </div>
                <div className="h-px flex-1 bg-line" />
              </div>

              {/* Target */}
              <div className="p-3 pt-2">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted" />

                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Target
                  </span>
                </div>

                <div
                  className="
              flex min-h-[42px] items-center
              rounded-md border border-line
              bg-card
              px-3
            "
                >
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-ink outline-none"
                  >
                    {graph.nodes
                      .filter((n) => n.id !== source)
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.title}
                        </option>
                      ))}
                  </select>
                  {target && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-7 w-7 text-muted hover:text-ink"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
          <Button variant="destructive" className=" mt-4 w-full">
            Delete Relationship
          </Button>
        </div>

        {/* Footer */}
        <footer className="border-t border-line bg-card p-4">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="text-muted">
              {source && target ? "Ready to connect" : "Select two nodes"}
            </span>

            <span className="font-medium text-ink">
              {source && target ? "2 / 2" : source ? "1 / 2" : "0 / 2"}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="flex-1"
              disabled={!source || !target}
            >
              Save
            </Button>
          </div>
        </footer>
      </motion.aside>
    </AnimatePresence>
  );
}
