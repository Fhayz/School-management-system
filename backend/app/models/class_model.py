import uuid
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseMixin

# Association table for many-to-many relationship between classes and subjects
class_subjects = Table(
    'class_subjects',
    Base.metadata,
    Column('class_id', UUID(as_uuid=True), ForeignKey('classes.id'), primary_key=True),
    Column('subject_id', UUID(as_uuid=True), ForeignKey('subjects.id'), primary_key=True)
)

# Association table for many-to-many relationship between classes and students
class_students = Table(
    'class_students',
    Base.metadata,
    Column('class_id', UUID(as_uuid=True), ForeignKey('classes.id'), primary_key=True),
    Column('student_id', UUID(as_uuid=True), ForeignKey('students.id'), primary_key=True)
)

class Class(Base, BaseMixin):
    __tablename__ = "classes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String, nullable=False)  # e.g., "Grade 10A", "SS3 Science"
    grade_level = Column(Integer, nullable=True)  # e.g., 10, 11, 12
    section = Column(String, nullable=True)  # e.g., "A", "B", "Science", "Arts"
    academic_year = Column(String, nullable=True)  # e.g., "2024/2025"
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"), nullable=False)
    is_active = Column(Boolean, default=True)

    # Relationships
    school = relationship("School", back_populates="classes")
    subjects = relationship("Subject", secondary=class_subjects, back_populates="classes")
    students = relationship("Student", secondary=class_students, back_populates="classes")
    attendance_records = relationship("Attendance", back_populates="class_obj")
    results = relationship("Result", back_populates="class_obj")
