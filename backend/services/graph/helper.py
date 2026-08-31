import io
from pypdf import PdfReader
from fastapi import HTTPException, UploadFile

def read_pdf_file(pdf_file: UploadFile) -> str:
    if pdf_file.content_type not in ("application/pdf", "application/x-pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    data = pdf_file.file.read() 
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")

    try:
        reader = PdfReader(io.BytesIO(data))
        pages = [page.extract_text() or "" for page in reader.pages]
    except Exception as e:
        raise HTTPException(status_code=400, detail="Could not read PDF") from e

    text = "\n".join(pages).strip()
    if not text:
        raise HTTPException(
            status_code=400,
            detail="No text in this PDF (it may be scanned images)",
        )
    return text

