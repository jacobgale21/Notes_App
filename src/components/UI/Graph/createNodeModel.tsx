import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../button";
import { Trash2, Plus, Loader2 } from "lucide-react";
import type {
  ContentBlock,
  Graph,
  NodeCreateInput,
  ContentBlockType,
  NodeKind,
} from "../../../data/types";
import { useCreateNode } from "../../../hooks/useCatalog";
export default function CreateNodeModel({
  onClose,
  graph,
}: {
  onClose: () => void;
  graph: Graph;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleContent, setTitleContent] = useState([""]);
  const [content, setContent] = useState([""]);
  const { mutate, isPending, isError, error } = useCreateNode();

  const handleTitleContentChange = (index: number, value: string) => {
    const newInputs = [...titleContent];
    newInputs[index] = value;
    setTitleContent(newInputs);
  };
  const handleContentChange = (index: number, value: string) => {
    const newInputs = [...content];
    newInputs[index] = value;
    setContent(newInputs);
  };

  const handleAddContent = () => {
    setContent([...content, ""]);
    setTitleContent([...titleContent, ""]);
  };
  const handleRemoveContent = (index: number) => {
    if (content.length === 1) return;
    const newInputs = content.filter((_, i) => i !== index);
    setContent(newInputs);
    const newTitleInputs = titleContent.filter((_, i) => i !== index);
    setTitleContent(newTitleInputs);
  };
  const handleSubmit = async () => {
    const ContentBlocks: ContentBlock[] = titleContent.map((title, index) => ({
      id: title.replaceAll(" ", "-"),
      type: "text" as ContentBlockType,
      text: content[index],
    }));
    const newNode: NodeCreateInput = {
      title,
      description,
      type: "topic" as NodeKind,
      content: ContentBlocks,
      graph_id: graph.id,
    };
    await mutate(newNode);
  };
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
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Create
            </p>

            <h2 className="mt-1 text-lg font-semibold text-ink">New Node</h2>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full text-muted hover:text-ink"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </header>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">
              Title
            </label>

            <input
              type="text"
              className="
              mt-2 w-full rounded-lg
              border border-line
              bg-paper
              px-3 py-2.5
              text-sm text-ink
              outline-none
              transition
              placeholder:text-muted/60
              focus:border-accent
              focus:ring-2 focus:ring-accent/10
            "
              placeholder="Enter a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="mt-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">
              Description
            </label>

            <textarea
              className="
              mt-2 min-h-[90px] w-full resize-none
              rounded-lg
              border border-line
              bg-paper
              px-3 py-2.5
              text-sm leading-relaxed text-ink
              outline-none
              transition
              placeholder:text-muted/60
              focus:border-accent
              focus:ring-2 focus:ring-accent/10
            "
              placeholder="Add a short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Content */}
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-ink">Content</h3>

                <p className="mt-0.5 text-xs text-muted">
                  Add sections to this node
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {content.map((block, index) => (
                <div
                  key={index}
                  className="
                  rounded-lg
                  border border-line
                  bg-paper
                  p-3
                  transition
                  focus-within:border-accent
                "
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="
                      min-w-0 flex-1
                      bg-transparent
                      text-sm font-medium
                      text-ink
                      outline-none
                      placeholder:text-muted/60
                    "
                      placeholder="Section title"
                      value={titleContent[index]}
                      onChange={(e) =>
                        handleTitleContentChange(index, e.target.value)
                      }
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="
                      h-7 w-7 shrink-0
                      text-muted
                      hover:text-destructive
                    "
                      onClick={() => handleRemoveContent(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <textarea
                    className="
                    mt-2 min-h-[70px] w-full resize-none
                    bg-transparent
                    text-sm leading-relaxed
                    text-ink
                    outline-none
                    placeholder:text-muted/60
                  "
                    placeholder="Add content..."
                    value={block}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="ghost"
              className="
              mt-3 w-full justify-start
              gap-2
              text-muted
              hover:text-ink
            "
              onClick={handleAddContent}
            >
              <Plus className="h-4 w-4" />
              Add content block
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-line bg-card p-4">
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
              type="button"
              className="flex-1"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating node...
                </span>
              ) : (
                "Create Node"
              )}
            </Button>
          </div>
        </footer>
      </motion.aside>
    </AnimatePresence>
  );
}
