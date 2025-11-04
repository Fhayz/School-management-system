from app.db.database import Base
from app.models.school import School
from app.models.user import User
from app.models.subscription import SubscriptionPlan
from app.models.student import Student

# This ensures all models are imported when migrations run
__all__ = ["Base", "School", "User", "SubscriptionPlan", "Student"]

