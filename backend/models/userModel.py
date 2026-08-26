import datetime
from typing import Optional
from sqlalchemy import String, DateTime, func, Uuid
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from db import Base
import uuid

class User(Base):
    __tablename__ = "users"
   
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid(),
    )
    
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    
    hashed_password: Mapped[str | None] = mapped_column(String(255))
    
    display_name: Mapped[Optional[str]] = mapped_column(String(100))
    
    is_active: Mapped[bool] = mapped_column(default=True)
    
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now()
    )