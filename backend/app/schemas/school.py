from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class SchoolCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None

class SchoolUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    subscription_status: Optional[str] = None

class SchoolResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    email: EmailStr
    phone: Optional[str]
    address: Optional[str]
    website: Optional[str]
    subscription_status: str
    max_students: int
    max_teachers: int
    timezone: str
    currency: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True  # Allows Pydantic to work with SQLAlchemy models
