import { useState } from "react";
import { UploadCloud, FileText, ChevronDown } from "lucide-react";
import "@xyflow/react/dist/style.css";
import { Button } from "../UI/button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import { useNavigate } from "react-router-dom";
import { useStoreGraph } from "../../hooks/useCatalog";
import Loading from "../UI/loading";
import { X, ChevronUp } from "lucide-react";
import type { StagedFile } from "../../data/types";

export default function Upload() {
  const [notes, setNotes] = useState<StagedFile[]>([]);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("upload");
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useStoreGraph();

  const handleSubmit = async (notes: StagedFile[]) => {
    try {
      const formData = new FormData();

      if (notes.length === 0) {
        const notes_text = editor?.getText().trim();
        if (!notes_text) throw new Error("No notes provided");
        formData.append("notes", notes_text);
      } else {
        for (const { file } of notes) {
          formData.append("upload_files", file);
        }
      }
      const graph = await mutateAsync(formData);
      navigate(`/graph/${graph.id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setNotes([]);
      setError("Please select a valid PDF or Word document.");
      return;
    }

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    const id =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${file.name}-${Math.random().toString(16).slice(2)}`;
    if (validTypes.includes(file.type)) {
      setNotes((prev) => [...prev, { id, file }]);
      setError("");
    } else {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setError("Please select a valid PDF or Word document.");
    }
    if (e.target) e.target.value = "";
  };
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Drop text here or click to paste",
      }),
      TextStyle,
      FontFamily,
    ],
    content: "<p></p>",
    editorProps: {
      attributes: {
        class:
          "border-2 border-black/50 rounded-md shadow-md p-2 bg-white min-h-40 w-full overflow-x-hidden break-words whitespace-pre-wrap outline-none",
      },
    },
  });

  const move = (index: number, delta: -1 | 1) => {
    setNotes((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16">
        <h1 className="max-w-xl text-center font-sans text-5xl leading-tight">
          Bring your notes to life
        </h1>
        <p className="mt-3 mb-8 text-center text-muted">
          Drop in your lecture notes and we'll turn the fragments into a map you
          can actually study from.
        </p>

        {notes.length > 0 ? (
          <>
            <span className="mb-5 text-danger">
              Delete file if you want to paste text
            </span>
          </>
        ) : (
          <>
            <div className="mb-5 flex gap-1 rounded-xl border border-black/70 bg-white/[.025] p-1 sm:w-fit">
              <button
                onClick={() => setSelectedTab("upload")}
                className={`rounded-lg p-2 text-xs font-semibold transition ${selectedTab === "upload" ? "bg-white/[.1] text-slate-500 border-2" : "text-slate-500 hover:text-slate-300"}`}
              >
                <UploadCloud size={14} className="mr-2 inline" />
                Upload file
              </button>
              <button
                onClick={() => setSelectedTab("paste")}
                className={`rounded-lg p-2 text-xs font-semibold transition ${selectedTab === "paste" ? "bg-white/[.1] text-slate-500 border-2" : "text-slate-500 hover:text-slate-300"}`}
              >
                <FileText size={14} className="mr-2 inline" />
                Paste text
              </button>
            </div>
          </>
        )}

        {selectedTab === "upload" ? (
          <>
            <label className="flex w-full max-w-lg cursor-pointer flex-col items-center rounded-2xl border border-dashed border-line bg-card px-8 py-14 shadow-sm transition hover:border-accent">
              <span className="text-lg">Drop file here</span>
              <span className="mt-1 text-sm text-muted">
                or click to browse · PDF, DOC, DOCX, JPEG, PNG
              </span>
              <input
                type="file"
                className="sr-only"
                multiple
                accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </label>
          </>
        ) : (
          <>
            <div className="w-full max-w-lg min-w-0">
              <EditorContent editor={editor} />
            </div>
          </>
        )}

        {error && <p className="mt-4 text-danger">{error}</p>}
        {notes.length > 0 && (
          <div className="mt-4 w-full max-w-lg">
            <p className="mb-2 text-sm text-muted">
              {notes.length} file{notes.length === 1 ? "" : "s"} · processed in
              this order
            </p>
            <ul className="flex flex-col gap-2">
              {notes.map((note, index) => (
                <li
                  key={note.id}
                  className="flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-2"
                >
                  <span className="w-6 shrink-0 text-sm text-muted">
                    {index + 1}
                  </span>
                  <FileText size={16} className="shrink-0" />
                  <span
                    className="min-w-0 flex-1 truncate"
                    title={note.file.name}
                  >
                    {note.file.name}
                  </span>
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    aria-label="Move up"
                  >
                    <ChevronUp size={18} />
                  </button>
                  <button
                    type="button"
                    disabled={index === notes.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label="Move down"
                  >
                    <ChevronDown size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNotes((prev) => prev.filter((n) => n.id !== note.id))
                    }
                    aria-label={`Remove ${note.file.name}`}
                  >
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {isPending ? (
          <Loading label="Submitting Notes..." />
        ) : (
          <Button
            asChild
            variant="brand"
            className="mt-4 w-full max-w-lg"
            onClick={() => handleSubmit(notes)}
          >
            Generate Knowledge Graph
          </Button>
        )}
      </main>
    </div>
  );
}
