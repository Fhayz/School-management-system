from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.schemas.auth import UserRegister, UserLogin, Token
from app.services.auth_service import register_user, authenticate_user, get_access_token
from app.core.dependencies import get_db
import uuid

router = APIRouter()

@router.post("/register", response_model=Token)
def register(data: UserRegister, db: Session = Depends(get_db)):
    # In multi-tenant SaaS, school_id might come from a slug or subdomain.
    school_id = uuid.UUID("550e8400-e29b-41d4-a716-446655440000")
    try:
        user = register_user(db, data, school_id)
        access_token = get_access_token(user)
        return Token(access_token=access_token)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    school_id = uuid.UUID("550e8400-e29b-41d4-a716-446655440000")
    user = authenticate_user(db, data, school_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    access_token = get_access_token(user)
    return Token(access_token=access_token)
