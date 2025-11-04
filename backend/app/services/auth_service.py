from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token
from sqlalchemy.orm import Session
from app.schemas.auth import UserRegister, UserLogin

def register_user(db: Session, data: UserRegister, school_id) -> User:
    # Check if user exists
    existing = db.query(User).filter(User.email == data.email, User.school_id == school_id).first()
    if existing:
        raise ValueError("Email already registered for this school")
    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        school_id=school_id,
        role='school_admin'
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, data: UserLogin, school_id):
    user = db.query(User).filter(User.email == data.email, User.school_id == school_id).first()
    if user and verify_password(data.password, user.password_hash):
        return user
    return None

def get_access_token(user: User):
    token_data = {
        "user_id": str(user.id),
        "email": user.email,
        "role": user.role,
        "school_id": str(user.school_id)
    }
    return create_access_token(token_data)
