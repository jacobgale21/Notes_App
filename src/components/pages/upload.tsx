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
import { useStoreGraph } from "../../hooks/useCatalog";
import Loading from "../UI/loading";
import { X } from "lucide-react";
export default function Upload() {
  const [notes, setNotes] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState("upload");
  const navigate = useNavigate();
  const { mutate: storeGraph } = useStoreGraph();
  const { mutateAsync, isPending } = useStoreGraph();

  const handleSubmit = async (pdf_file: File | null) => {
    try {
      const formData = new FormData();
      if (!pdf_file) {
        const notes_text = editor?.getText().trim();
        if (!notes_text) throw new Error("No notes provided");

        formData.append("notes", notes_text);
      } else {
        formData.append("upload_file", pdf_file);
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

        {notes ? (
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
          <div className="flex flex-row items-center gap-2">
            <p className="mt-4 text-success">Selected file: {notes.name}</p>
            <button className="mt-4 w-fit" onClick={() => setNotes(null)}>
              <X size={24} />
            </button>
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
