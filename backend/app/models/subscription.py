from sqlalchemy import Column, String, Integer, DECIMAL, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.database import Base
from app.models.base import BaseMixin


class SubscriptionPlan(Base, BaseMixin):
    __tablename__ = "subscription_plans"
    
    name = Column(String(100), nullable=False)  # Basic, Premium, Enterprise
    slug = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    
    # Pricing
    price_monthly = Column(DECIMAL(10, 2))
    price_yearly = Column(DECIMAL(10, 2))
    currency = Column(String(3), default='NGN')
    
    # Limits
    max_students = Column(Integer)
    max_teachers = Column(Integer)
    max_storage_mb = Column(Integer)
    
    # Features (JSON)
    features = Column(JSONB)  # {"attendance": true, "ai_reports": true, ...}
    
    # Metadata
    sort_order = Column(Integer, default=0)
    
    def __repr__(self):
        return f"<SubscriptionPlan {self.name}>"
