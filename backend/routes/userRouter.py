from fastapi import APIRouter
from schemas.User import User
from sqlalchemy.orm import Session
from db import get_db
from fastapi import Depends

router = APIRouter(prefix="/user", tags=["user"])

@router.post("/signup", status_code=200,)
async def signup(user: User, db: Session = Depends(get_db)):
    user_dict = user.model_dump()
    return { "message": "User signed up", "user": user_dict}

@router.post("/login", status_code=200,)
async def login(user: User, db: Session = Depends(get_db)):
    user_dict = user.model_dump()
    return {"message": "User logged in", "user": user_dict}