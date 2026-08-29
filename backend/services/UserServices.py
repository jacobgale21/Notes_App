# services/UserServices.py
from sqlalchemy.orm import Session
from models.userModel import User as UserModel
from schemas.User import User
from argon2 import PasswordHasher
import jwt
import os
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, Response

ph = PasswordHasher()

REFRESH_COOKIE = "refresh_token"


def create_user(db: Session, user: User) -> UserModel:
    # If user.password is not None, hash the password (Google Auth)
    hashed_password = None
    if user.password: 
        hashed_password = hash_password(user.password)
    db_user = UserModel(
        email=user.email,
        hashed_password=hashed_password,  # don't store plaintext
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def login_user(db: Session, user: User) -> UserModel:
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=409, detail="User not found")
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=409, detail="Invalid credentials")
    return db_user

def hash_password(password: str) -> str:
    return ph.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    try:
        ph.verify(hashed_password, password)
        return True
    except Exception as e:
        print(e)
        return False

# Create an access token
def access_token_create(user: UserModel) -> str:
    access_payload = {
        "sub": str(user.id),
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
        "type": "access"
    }
    return jwt.encode(access_payload, os.getenv("SECRET_KEY"), algorithm="HS256")
# Create a refresh token
def refresh_token_create(user: UserModel) -> str:
    refresh_payload = {
        "sub": str(user.id),
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    refresh_token = jwt.encode(refresh_payload, os.getenv("SECRET_KEY"), algorithm="HS256")

    return refresh_token

def set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=token,
        httponly=True,       
        secure=False,        
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/user",        
    )

