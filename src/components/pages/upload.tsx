import { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import "@xyflow/react/dist/style.css";
import { Button } from "../UI/button";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import { useNavigate } from "react-router-dom";
import { useGenerateGraph } from "../../hooks/useCatalog";

export default function Upload() {
  const [notes, setNotes] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("upload");
  const navigate = useNavigate();

  const { mutate: generateGraph } = useGenerateGraph();
  const { mutateAsync, isPending } = useGenerateGraph();
  const handleSubmit = async () => {
    const notes = editor?.getText().trim();
    if (!notes) return;
    const graph = await mutateAsync(notes);
    navigate(`/graph/${graph.id}`);
  };

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
        {selectedTab === "upload" ? (
          <>
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
          </>
        ) : (
          <>
            <div className="w-full max-w-lg min-w-0">
              <EditorContent editor={editor} />
            </div>
          </>
        )}

        {error && <p className="mt-4 text-danger">{error}</p>}
        {notes && (
          <p className="mt-4 text-success">Selected file: {notes.name}</p>
        )}
        <Button
          asChild
          variant="brand"
          className="mt-4 w-full max-w-lg"
          onClick={handleSubmit}
        >
          Generate Knowledge Graph
        </Button>
      </main>
    </div>
  );
}
