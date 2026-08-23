import { useState } from "react";
export default function Page() {
  const [notes, setNotes] = useState<File | null>(null);
  const [error, setError] = useState("");

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

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="px-6 py-4 text-sm font-medium tracking-wide">
        Notes App
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16">
        <h1 className="max-w-xl text-center font-sans text-5xl leading-tight">
          Turn notes into something useful
        </h1>
        <p className="mt-3 mb-8 text-center text-muted">
          Drop a PDF or Word file to get started.
        </p>

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
      </main>
    </div>
  );
}
