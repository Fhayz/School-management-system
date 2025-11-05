from app.db.database import Base
from app.models.school import School
from app.models.user import User
from app.models.subscription import SubscriptionPlan
from app.models.student import Student
from app.models.teacher import Teacher
from app.models.class_model import Class
from app.models.subject import Subject

# This ensures all models are imported when migrations run
__all__ = ["Base", "School", "User", "SubscriptionPlan", "Student", "Teacher", "Class", "Subject"]

