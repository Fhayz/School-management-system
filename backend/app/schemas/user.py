from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    role: str
    school_id: uuid.UUID
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True  # Allows Pydantic to work with SQLAlchemy models
