import { getRelatedTopics, type Node } from "../../../data/placeholder";
import { motion, AnimatePresence } from "framer-motion";
import { BookIcon, BrainIcon, StarIcon } from "lucide-react";
import { Button } from "../button";
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

export default function Inspector({ node }: { node: Node }) {
  const relatedTopics = getRelatedTopics(node);
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
          <h2 className="mt-1 font-sans text-2xl leading-tight text-ink">
            {node.title}
          </h2>
        </header>
        <div className="p-4 rounded-lg bg-paper shadow-sm w-9/10 mx-auto">
          <p className="text-sm text-muted">{node.description}</p>
        </div>
        <div className="flex flex-col gap-2 px-5 py-4 mt-2">
          <h4 className="text-accent">Key Points</h4>
          <ul className="list-disc space-y-1.5 pl-4 text-sm marker:text-accent">
            {node.content.length
              ? node.content.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))
              : null}
          </ul>
        </div>
        <h4 className="text-md font-medium text-muted px-5 py-2">
          Related Topics
        </h4>
        <div className="flex flex-row items-center justify-start gap-2 px-5">
          <span className="text-sm text-muted shadow-sm rounded-md px-2 py-1 bg-paper">
            {relatedTopics.length
              ? relatedTopics.map((topic) => <span key={topic}>{topic}</span>)
              : "No related topics"}
          </span>
        </div>
        <h4 className="text-md font-medium text-muted px-5 pt-4">Study</h4>
        {studyOptions.map((option) => (
          <div
            key={option.title}
            className="flex flex-row items-center justify-start gap-2 px-5 my-1 rounded-md hover:bg-paper cursor-pointer"
          >
            <Button
              variant="outline"
              className="text-sm text-muted flex flex-row items-center justify-start gap-2 w-full py-2"
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
