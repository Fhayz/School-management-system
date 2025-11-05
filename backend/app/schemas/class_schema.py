from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID

class ClassCreate(BaseModel):
    name: str
    grade_level: Optional[int] = None
    section: Optional[str] = None
    academic_year: Optional[str] = None

class ClassUpdate(BaseModel):
    name: Optional[str] = None
    grade_level: Optional[int] = None
    section: Optional[str] = None
    academic_year: Optional[str] = None
    is_active: Optional[bool] = None

class ClassResponse(BaseModel):
    id: UUID
    name: str
    grade_level: Optional[int] = None
    section: Optional[str] = None
    academic_year: Optional[str] = None
    school_id: UUID
    is_active: bool

    class Config:
        from_attributes = True

class AddStudentsToClass(BaseModel):
    student_ids: List[UUID]

class AddSubjectsToClass(BaseModel):
    subject_ids: List[UUID]
