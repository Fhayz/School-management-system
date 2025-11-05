from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date
from enum import Enum

class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    EXCUSED = "excused"

class AttendanceCreate(BaseModel):
    student_id: UUID
    class_id: UUID
    subject_id: Optional[UUID] = None
    date: date
    status: AttendanceStatus
    notes: Optional[str] = None

class AttendanceUpdate(BaseModel):
    status: Optional[AttendanceStatus] = None
    notes: Optional[str] = None

class AttendanceResponse(BaseModel):
    id: UUID
    student_id: UUID
    class_id: UUID
    subject_id: Optional[UUID] = None
    date: date
    status: AttendanceStatus
    notes: Optional[str] = None
    marked_by: Optional[UUID] = None
    school_id: UUID

    class Config:
        from_attributes = True
