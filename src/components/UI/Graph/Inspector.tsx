import type {
  Graph,
  Node,
  NodePatchInput,
  Relation,
} from "../../../data/types";
import { motion, AnimatePresence } from "framer-motion";
import { BookIcon, BrainIcon, Pencil, StarIcon, TrashIcon } from "lucide-react";
import { Button } from "../button";
import { useEffect, useRef, useState } from "react";
import { useDeleteNode, usePatchNode } from "../../../hooks/useCatalog";
const studyOptions = [
  {
    icon: StarIcon,
    title: "Explain this",
  },
  {
    icon: BookIcon,
    title: "Create flashcards",
  },
  {
    icon: BrainIcon,
    title: "Quiz me",
  },
];

type RelatedEdge = {
  edge: Relation;
  source: Node;
  target: Node;
};
function relatedEdges(graph: Graph, nodeId: string): RelatedEdge[] {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const out: RelatedEdge[] = [];
  for (const edge of graph.edges) {
    if (edge.source !== nodeId && edge.target !== nodeId) continue;
    const source = byId.get(edge.source);
    const target = byId.get(edge.target);
    if (!source || !target) continue;
    out.push({ edge, source, target });
  }
  return out;
}

function EditableField({
  value,
  onSave,
  placeholder = "Add content...",
  className = "",
}: {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const startEditing = () => {
    setDraft(value);
    setEditing(true);
  };

  const save = () => {
    const trimmed = draft.trim();

    if (trimmed !== value) {
      onSave(trimmed);
    }

    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === "Escape") {
      cancel();
    }

    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      save();
    }
  };

  if (editing) {
    const sharedClasses = `
      w-full
      rounded-lg
      border border-accent/40
      bg-paper
      px-3 py-2
      text-ink
      outline-none
      ring-2 ring-accent/10
      transition
      ${className}
    `;

    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${sharedClasses} min-h-[100px] resize-none`}
      />
    );
  }
  return (
    <button
      type="button"
      onClick={startEditing}
      className={`
        group
        w-full
        rounded-lg
        text-left
        transition
        hover:bg-paper
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          {value || <span className="text-muted/60">{placeholder}</span>}
        </span>

        <Pencil
          className="
            mt-0.5
            h-3.5
            w-3.5
            shrink-0
            text-muted
            opacity-0
            transition-opacity
            group-hover:opacity-100
          "
        />
      </div>
    </button>
  );
}

export default function Inspector({
  node,
  graph,
  focusNode,
}: {
  node: Node;
  graph: Graph;
  focusNode: (id: string) => void;
}) {
  const related = relatedEdges(graph, node.id);
  const { mutate } = usePatchNode();
  const { mutate: deleteNode } = useDeleteNode();
  const handleUpdateNode = (updates: NodePatchInput) => {
    mutate({ graph_id: graph.id, node_id: node.id, node: updates });
  };
  const handleDeleteNode = () => {
    deleteNode(node);
  };
  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-full w-80 shrink-0 border-l border-line bg-card rounded-lg "
      >
        <header className="px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Concept
          </p>
          <EditableField
            value={node.title}
            placeholder="Untitled concept"
            onSave={(value) => handleUpdateNode({ title: value })}
            className="
              mt-1
              px-1
              py-1
              font-sans
              text-2xl
              font-medium
              leading-tight
              text-ink
            "
          />
        </header>
        <div className="p-4 rounded-lg bg-paper shadow-sm w-9/10 mx-auto">
          <EditableField
            value={node.description}
            placeholder="Add description..."
            onSave={(value) => handleUpdateNode({ description: value })}
            className="p-3 text-sm leading-6 text-muted"
          />
        </div>
        <section className="px-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-accent">Key Points</h4>

            <span className="text-xs text-muted">{node.content.length}</span>
          </div>

          <div className="space-y-1">
            {node.content.length ? (
              node.content.map((bullet, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-paper"
                >
                  <span className="mt-2 text-accent">•</span>

                  <EditableField
                    value={bullet.text}
                    placeholder="Add key point..."
                    onSave={(value) => {
                      handleUpdateNode({
                        content: node.content.map((b, i) =>
                          i === index ? { ...b, text: value } : b,
                        ),
                      });
                    }}
                    className="text-sm leading-6 text-muted"
                  />
                </div>
              ))
            ) : (
              <p className="px-2 text-sm text-muted/60">No key points yet.</p>
            )}
          </div>
        </section>
        <section>
          <h4 className="text-md font-medium text-muted px-5 py-2">
            Related Topics
          </h4>
          <div className="flex flex-col gap-2 px-5">
            {related.length ? (
              related.map((rel) => (
                <div
                  key={rel.edge.id}
                  className="flex w-full items-center gap-2 rounded-md bg-paper px-2 py-1.5 shadow-sm"
                >
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left text-sm text-muted"
                    onClick={() =>
                      focusNode(
                        rel.source.id === node.id
                          ? rel.target.id
                          : rel.source.id,
                      )
                    }
                  >
                    <span className="block truncate font-medium text-ink">
                      {rel.source.title}
                    </span>
                    <span className="block text-xs text-muted">
                      {rel.edge.rel_type.replace("_", " ")} → {rel.target.title}
                    </span>
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted hover:text-destructive"
                    aria-label="Delete relationship"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted/60">No related topics</p>
            )}
          </div>
        </section>
        <h4 className="text-md font-medium text-muted px-5 pt-4">Study</h4>
        {studyOptions.map((option) => (
          <div
            key={option.title}
            className="flex flex-row items-center justify-start gap-2 px-5 my-1 rounded-md  cursor-pointer"
          >
            <Button
              variant="outline"
              className="text-sm text-muted flex flex-row items-center justify-start gap-2 w-full py-2 hover:bg-paper"
            >
              <option.icon className="w-4 h-4" />
              <span>{option.title}</span>
            </Button>
          </div>
        ))}
        <Button
          variant="destructive"
          className="text-sm text-muted flex flex-row items-center justify-start gap-2 px-5 py-2 hover:bg-paper w-8/9 mx-auto"
          onClick={handleDeleteNode}
        >
          <TrashIcon className="w-4 h-4" />
          <span>Delete</span>
        </Button>
      </motion.aside>
    </AnimatePresence>
  );
}
