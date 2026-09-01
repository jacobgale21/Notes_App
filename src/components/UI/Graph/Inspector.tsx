import type { Graph, Node } from "../../../data/types";
import { motion, AnimatePresence } from "framer-motion";
import { BookIcon, BrainIcon, Pencil, StarIcon } from "lucide-react";
import { Button } from "../button";
import { useEffect, useRef, useState } from "react";
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

function relatedNodes(graph: Graph, nodeId: string): Node[] {
  const ids = new Set<string>();
  for (const edge of graph.edges) {
    if (edge.source === nodeId) ids.add(edge.target);
    if (edge.target === nodeId) ids.add(edge.source);
  }
  return graph.nodes.filter((n) => ids.has(n.id));
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
  onUpdateNode,
}: {
  node: Node;
  graph: Graph;
  focusNode: (id: string) => void;
  onUpdateNode: (id: string, updates: Partial<Node>) => void;
}) {
  const related = relatedNodes(graph, node.id);
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
            onSave={(value) =>
              onUpdateNode(node.id, {
                title: value,
              })
            }
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
            onSave={(value) =>
              onUpdateNode(node.id, {
                description: value,
              })
            }
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
                      const updatedContent = [...node.content];

                      updatedContent[index] = {
                        ...updatedContent[index],
                        text: value,
                      };

                      onUpdateNode(node.id, {
                        content: updatedContent,
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
          <div className="flex flex-row items-center justify-start gap-2 px-5">
            {related.length
              ? related.map((topic) => {
                  return (
                    <span
                      key={topic.id}
                      className="text-sm text-muted shadow-sm rounded-md px-2 py-1 bg-paper cursor-pointer"
                      onClick={() => focusNode(topic.id)}
                    >
                      {topic.title}
                    </span>
                  );
                })
              : "No related topics"}
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
      </motion.aside>
    </AnimatePresence>
  );
}
