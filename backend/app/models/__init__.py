from app.db.database import Base
from app.models.school import School
from app.models.user import User
from app.models.subscription import SubscriptionPlan

# This ensures all models are imported when migrations run
__all__ = ["Base", "School", "User", "SubscriptionPlan"]
