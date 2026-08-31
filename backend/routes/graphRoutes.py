from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from services.graph.graphServices import create_graph_from_json, generate_graph, get_graph_by_id, get_all_graphs
from services.graph.helper import read_pdf_file, read_word_file
from schemas.graphSchema import GraphSchema, GraphSummary
from services.deps import get_current_user_id
from models.userModel import User as UserModel
from typing import List
from uuid import UUID
import uuid

router = APIRouter(prefix="/graph", tags=["graph"])


@router.post("/", response_model=GraphSchema)
async def seed_test_graph(db: Session = Depends(get_db)):
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        token.payload["sub"]
    else:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return create_graph_from_json(db, current_user)

@router.get("/getall", response_model=List[GraphSummary])
async def get_graphs(db: Session = Depends(get_db), current_user_id: uuid.UUID = Depends(get_current_user_id)):
    return get_all_graphs(db, current_user_id)

@router.get("/get/{id}", response_model=GraphSchema)
async def get_graph(id: UUID, db: Session = Depends(get_db), current_user_id: uuid.UUID = Depends(get_current_user_id)):
    return get_graph_by_id(db, current_user_id, id)

@router.post("/generate")
async def generate_graph_endpoint( db: Session = Depends(get_db), current_user_id: uuid.UUID = Depends(get_current_user_id), notes: str | None = Form(None), upload_file: UploadFile | None = File(None))->GraphSchema:
    # check if both notes and upload_file are provided, throw an error
    if notes and upload_file and upload_file.filename:
        raise HTTPException(400, "Send either notes or a PDF, not both")

    # read the file, determine the type of file and read the text
    if upload_file is not None and upload_file.filename:
        name = (upload_file.filename or "").lower()
        ctype = upload_file.content_type or ""

        if ctype in ("application/pdf", "application/x-pdf") or name.endswith(".pdf"):
            text = read_pdf_file(upload_file)
        elif (
            "wordprocessingml" in ctype
            or name.endswith(".docx")
        ):
            text = read_word_file(upload_file)
        else:
            raise HTTPException(400, "Unsupported file type")

    # if notes are provided through textbox, read the text
    elif notes and notes.strip():
        text = notes.strip()
    else:
        raise HTTPException(400, "No notes or PDF file provided")

    # generate the graph
    return generate_graph(db, current_user_id, text)