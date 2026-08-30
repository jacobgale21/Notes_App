import {
  Upload,
  Sparkles,
  Network,
  BookOpen,
  Brain,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "../UI/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const steps = [
  {
    icon: Upload,
    title: "Upload your notes",
    body: "Drop in a PDF, paste text, or snap a photo of handwritten pages. OCR handles the messy bits.",
  },
  {
    icon: Sparkles,
    title: "AI finds the structure",
    body: "Headings become topics, details become concepts, and related ideas get linked automatically.",
  },
  {
    icon: Network,
    title: "Explore the graph",
    body: "Pan, zoom and focus on any concept to see its key points and every idea it connects to.",
  },
  {
    icon: BookOpen,
    title: "Study what matters",
    body: "Flashcards and quizzes generated straight from your own material, not generic decks.",
  },
];

const features = [
  {
    icon: Brain,
    title: "Concept extraction",
    body: "Every idea becomes a node with its own key-point summary.",
  },
  {
    icon: Network,
    title: "Linked thinking",
    body: "Contains, related and depends-on edges show how topics relate.",
  },
  {
    icon: Zap,
    title: "Instant recall",
    body: "Auto-built flashcards and quizzes with explanations for each answer.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 halo blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-5 pb-24 pt-24 text-center sm:pt-32">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered study graphs
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
          >
            Turn your notes into a knowledge graph
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground"
          >
            Upload lecture notes or photos of your handwriting. NoteGraph
            extracts every concept, maps how they connect, and turns it all into
            flashcards and quizzes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild variant="brand" size="lg" className="glow-ring">
              <Link to="/upload">
                <Upload className="mr-2 h-4 w-4" /> Upload your notes
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              See a live graph
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="mt-16 rounded-3xl border border-border glass p-3 elevated"
          >
            <div className="rounded-2xl border border-border/70 bg-surface-2/60 p-6 text-left">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  "Computer Architecture",
                  "Memory Hierarchy",
                  "Instruction Cycle",
                ].map((label, i) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border bg-surface px-4 py-3 float-soft"
                    style={{ animationDelay: `${i * 0.6}s` }}
                  >
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {i === 0 ? "root · 5 topics" : "concept · linked"}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-xs text-muted-foreground">
                42 concepts extracted from one lecture PDF
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          How it works
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </span>
              <p className="mt-4 text-xs font-semibold text-primary">
                Step {i + 1}
              </p>
              <h3 className="mt-1 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 rounded-2xl border border-border glass p-5"
            >
              <f.icon className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-10">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center">
          <div className="pointer-events-none absolute inset-0 halo opacity-60" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight">
              Study smarter tonight
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Sign up for NoteGraph to start creating your own study graphs.
            </p>
            <Button asChild variant="brand" size="lg" className="mt-7">
              <Link to="/signup">
                Sign up for NoteGraph <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        NoteGraph — built for students who think in connections.
      </footer>
    </div>
  );
}
