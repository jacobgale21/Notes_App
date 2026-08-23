from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Define your frontend URL (or use ["*"] to allow all origins temporarily)
origins = ["http://localhost:5174"] 


# Initialize the FastAPI app instance
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Simple GET Endpoint (Health Check / Welcome)
@app.get("/")
def read_root():
    return {"status": "Backend is running successfully!"}