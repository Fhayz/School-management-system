import uuid
from sqlalchemy import Column, Float, String, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseMixin

class Result(Base, BaseMixin):
    __tablename__ = "results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id"), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id"), nullable=False)
    score = Column(Float, nullable=False)
    assessment_type = Column(String, nullable=False)  # e.g., "Test", "Exam", "Assignment"
    date = Column(Date, nullable=True)
    term = Column(String, nullable=True)              # e.g., "First Term", "Second Term"
    session = Column(String, nullable=True)           # e.g., "2025/2026"
    notes = Column(String, nullable=True)
    marked_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"), nullable=False)

    student = relationship("Student", back_populates="results")
    class_obj = relationship("Class", back_populates="results")
    subject = relationship("Subject", back_populates="results")
    marker = relationship("User")
    school = relationship("School", back_populates="results")
