import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseMixin

class Subject(Base, BaseMixin):
    __tablename__ = "subjects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String, nullable=False)  # e.g., "Mathematics", "English"
    code = Column(String, nullable=True)  # e.g., "MATH101"
    description = Column(String, nullable=True)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"), nullable=False)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id"), nullable=True)  # Assigned teacher
    is_active = Column(Boolean, default=True)

    # Relationships
    school = relationship("School", back_populates="subjects")
    teacher = relationship("Teacher", back_populates="subjects")
    classes = relationship("Class", secondary="class_subjects", back_populates="subjects")
    attendance_records = relationship("Attendance", back_populates="subject")
    results = relationship("Result", back_populates="subject")
