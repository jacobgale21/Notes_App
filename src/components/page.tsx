import { useState } from "react";
import { getNotes } from "../api";
import { UploadCloud, FileText } from "lucide-react";
import type { Section, Relation } from "./graph";
import { GraphView } from "./graph";
import "@xyflow/react/dist/style.css";
const demoSections: Section[] = [
  {
    id: "arrays",
    heading: "Arrays",
    subsections: [{ heading: "Indexing", bullets: [{ text: "O(1) access" }] }],
  },
  {
    id: "lists",
    heading: "Linked lists",
    subsections: [{ heading: "Nodes", bullets: [{ text: "O(1) insert" }] }],
  },
];
const demoRelations: Relation[] = [
  {
    id: "r1",
    source: "arrays",
    target: "lists",
    kind: "contrast",
    label: "vs",
  },
];

export default function Page() {
  const [notes, setNotes] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("upload");
  const [sections, setSections] = useState<Section[] | null>(null);
  const [relations, setRelations] = useState<Relation[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setNotes(null);
      setError("Please select a valid PDF or Word document.");
      return;
    }

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (validTypes.includes(file.type)) {
      setNotes(file);
      setError("");
    } else {
      setNotes(null);
      setError("Please select a valid PDF or Word document.");
    }
  };
  const handleGetNotes = async () => {
    const response = await getNotes();
    console.log(response);
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="px-6 py-4 text-sm font-medium tracking-wide">
        Notes App
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16">
        <h1 className="max-w-xl text-center font-sans text-5xl leading-tight">
          Bring your notes to life
        </h1>
        <p className="mt-3 mb-8 text-center text-muted">
          Drop in your lecture notes and we'll turn the fragments into a map you
          can actually study from.
        </p>
        <div className="mb-5 flex gap-1 rounded-xl border border-white/[.07] bg-white/[.025] p-1 sm:w-fit">
          <button
            onClick={() => setSelectedTab("upload")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${selectedTab === "upload" ? "bg-white/[.1] text-slate-100" : "text-slate-500 hover:text-slate-300"}`}
          >
            <UploadCloud size={14} className="mr-2 inline" />
            Upload file
          </button>
          <button
            onClick={() => setSelectedTab("paste")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${selectedTab === "paste" ? "bg-white/[.1] text-slate-100" : "text-slate-500 hover:text-slate-300"}`}
          >
            <FileText size={14} className="mr-2 inline" />
            Paste text
          </button>
        </div>

        <label className="flex w-full max-w-lg cursor-pointer flex-col items-center rounded-2xl border border-dashed border-line bg-card px-8 py-14 shadow-sm transition hover:border-accent">
          <span className="text-lg">Drop file here</span>
          <span className="mt-1 text-sm text-muted">
            or click to browse · PDF, DOC, DOCX
          </span>
          <input
            type="file"
            className="sr-only"
            accept="..."
            onChange={handleFileChange}
          />
        </label>

        {error && <p className="mt-4 text-danger">{error}</p>}
        {notes && (
          <p className="mt-4 text-success">Selected file: {notes.name}</p>
        )}
        <button
          className="mt-4 border-2 border-black/70 text-black px-4 py-2 rounded-md"
          onClick={handleGetNotes}
        >
          Get Notes
        </button>
      </main>
      <div className="w-full h-full">
        <GraphView sections={demoSections} relations={demoRelations} />
      </div>
    </div>
  );
}
