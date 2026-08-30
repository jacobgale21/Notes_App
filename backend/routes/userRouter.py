from fastapi import APIRouter
from schemas.User import User
from sqlalchemy.orm import Session
from db import get_db
from fastapi import Depends, Response, Cookie, HTTPException
from services.UserServices import create_user, login_user, access_token_create, refresh_token_create, set_refresh_cookie, clear_refresh_cookie
from services.deps import get_current_user
from models.userModel import User as UserModel
import jwt
import os
import uuid

router = APIRouter(prefix="/user", tags=["user"])

@router.post("/signup", status_code=200,)
async def signup(user: User, response: Response, db: Session = Depends(get_db)):
    db_user = create_user(db, user)
    access = access_token_create(db_user)
    refresh = refresh_token_create(db_user)
    set_refresh_cookie(response, refresh)
    return {"access_token": access, "token_type": "bearer"}

@router.post("/login", status_code=200,)
async def login(user: User, response: Response, db: Session = Depends(get_db) ):
    db_user = login_user(db, user)
    access = access_token_create(db_user)
    refresh = refresh_token_create(db_user)
    set_refresh_cookie(response, refresh)
    return {"access_token": access, "token_type": "bearer"}

@router.get("/me")
def me(current_user: UserModel = Depends(get_current_user)):
    return {"id": str(current_user.id), "email": current_user.email}


@router.post("/refresh")
def refresh(
    response: Response,
    db: Session = Depends(get_db),
    refresh_token: str | None = Cookie(default=None, alias="refresh_token"),
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")
    payload = jwt.decode(refresh_token, os.environ["SECRET_KEY"], algorithms=["HS256"])
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.get(UserModel, uuid.UUID(payload["sub"]))
    access = access_token_create(user)
    # new_refresh = refresh_token_create(user)
    # set_refresh_cookie(response, new_refresh)  # rotate
    return {"access_token": access, "token_type": "bearer"}

@router.post("/logout")
def logout(response: Response):
    clear_refresh_cookie(response)
    return {"ok": True}