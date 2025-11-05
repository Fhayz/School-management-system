import uuid
from sqlalchemy import Column, String, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseMixin
import enum

class AttendanceStatus(str, enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    EXCUSED = "excused"

class Attendance(Base, BaseMixin):
    __tablename__ = "attendance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"), nullable=True)
    date = Column(Date, nullable=False)
    status = Column(SQLEnum(AttendanceStatus), nullable=False, default=AttendanceStatus.PRESENT)
    notes = Column(String, nullable=True)
    marked_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)  # Teacher who marked
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"), nullable=False)

    # Relationships
    student = relationship("Student", back_populates="attendance_records")
    class_obj = relationship("Class", back_populates="attendance_records")
    subject = relationship("Subject", back_populates="attendance_records")
    marker = relationship("User")
    school = relationship("School", back_populates="attendance_records")
