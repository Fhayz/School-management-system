from pydantic import BaseModel
from typing import Optional
from uuid import UUID
import datetime 

class ResultCreate(BaseModel):
    student_id: UUID
    class_id: UUID
    subject_id: UUID
    score: float
    assessment_type: str
    date: Optional[datetime.date] = None
    term: Optional[str] = None
    session: Optional[str] = None
    notes: Optional[str] = None

class ResultUpdate(BaseModel):
    score: Optional[float] = None
    assessment_type: Optional[str] = None
    date: Optional[datetime.date] = None
    term: Optional[str] = None
    session: Optional[str] = None
    notes: Optional[str] = None

class ResultResponse(BaseModel):
    id: UUID
    student_id: UUID
    class_id: UUID
    subject_id: UUID
    score: float
    assessment_type: str
    date: Optional[datetime.date]
    term: Optional[str]
    session: Optional[str]
    notes: Optional[str]
    marked_by: Optional[UUID]
    school_id: UUID

    class Config:
        from_attributes = True
