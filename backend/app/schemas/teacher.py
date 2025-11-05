from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import date

class TeacherCreate(BaseModel):
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    qualification: Optional[str] = None
    subject_specialty: Optional[str] = None

class TeacherUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    qualification: Optional[str] = None
    subject_specialty: Optional[str] = None
    is_active: Optional[bool] = None

class TeacherResponse(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    qualification: Optional[str] = None
    subject_specialty: Optional[str] = None
    school_id: UUID
    is_active: bool

    class Config:
        from_attributes = True
