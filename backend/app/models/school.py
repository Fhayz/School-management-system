from sqlalchemy import Column, String, Integer, Date, VARCHAR, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseMixin


class School(Base, BaseMixin):
    __tablename__ = "schools"
    
    
    # Basic Info
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=False)
    phone = Column(String(20))
    address = Column(Text)
    logo_url = Column(String(500))
    website = Column(String(255))
    
    # Subscription
    subscription_plan_id = Column(UUID(as_uuid=True), nullable=True)
    subscription_status = Column(String(20), default='trial')  # trial, active, suspended, cancelled
    trial_ends_at = Column(DateTime(timezone=True))
    subscription_starts_at = Column(DateTime(timezone=True))
    subscription_ends_at = Column(DateTime(timezone=True))
    
    # Limits
    max_students = Column(Integer, default=100)
    max_teachers = Column(Integer, default=20)
    max_storage_mb = Column(Integer, default=1000)
    
    # Settings
    timezone = Column(String(50), default='Africa/Lagos')
    academic_year_start = Column(Date)
    academic_year_end = Column(Date)
    currency = Column(String(3), default='NGN')
    
    def __repr__(self):
        return f"<School {self.name}>"
    
    #Relationships
    students = relationship("Student", back_populates="school", cascade="all, delete")
    teachers = relationship("Teacher", back_populates="school", cascade="all, delete")
    classes = relationship("Class", back_populates="school", cascade="all, delete")
    subjects = relationship("Subject", back_populates="school", cascade="all, delete")
    attendance_records = relationship("Attendance", back_populates="school", cascade="all, delete")

