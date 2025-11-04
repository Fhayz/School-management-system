from sqlalchemy import Column, String, Date, Boolean, Integer, Text, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
from app.models.base import BaseMixin


class User(Base, BaseMixin):
    __tablename__ = "users"
    
    school_id = Column(UUID(as_uuid=True), ForeignKey('schools.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Authentication
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(20))
    password_hash = Column(String(255), nullable=False)
    
    # Personal Info
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    middle_name = Column(String(100))
    date_of_birth = Column(Date)
    gender = Column(String(10))
    
    # Profile
    avatar_url = Column(String(500))
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100), default='Nigeria')
    
    # Role & Status
    role = Column(String(20), nullable=False)  # super_admin, school_admin, teacher, student, parent
    is_verified = Column(Boolean, default=False)
    email_verified_at = Column(DateTime(timezone=True))
    
    # Security
    last_login_at = Column(DateTime(timezone=True))
    last_login_ip = Column(String(45))
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime(timezone=True))
    
    # Relationships
    school = relationship("School", backref="users")
    
    def __repr__(self):
        return f"<User {self.email}>"
