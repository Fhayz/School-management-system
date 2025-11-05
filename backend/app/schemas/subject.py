from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class SubjectCreate(BaseModel):
    name: str
    code: Optional[str] = None
    description: Optional[str] = None
    teacher_id: Optional[UUID] = None

class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    teacher_id: Optional[UUID] = None
    is_active: Optional[bool] = None

class SubjectResponse(BaseModel):
    id: UUID
    name: str
    code: Optional[str] = None
    description: Optional[str] = None
    school_id: UUID
    teacher_id: Optional[UUID] = None
    is_active: bool

    class Config:
        from_attributes = True
