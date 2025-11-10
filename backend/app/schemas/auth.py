from pydantic import BaseModel, EmailStr
import uuid
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    

class TokenData(BaseModel):
    user_id: str = None
    email: str = None
    role: str = None
    school_id: str = None

class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    first_name: str
    last_name: str
    role: str
    school_id: Optional[uuid.UUID]
    # You can add other fields you want to expose (phone, created_at, etc.)
    class Config:
        from_attribute = True

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    school_id: Optional[uuid.UUID] = None