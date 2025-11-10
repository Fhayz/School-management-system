from fastapi import APIRouter, Depends, HTTPException, status
from app.core.dependencies import is_super_admin, get_db
from sqlalchemy.orm import Session
from app.models.school import School
from app.schemas.school import SchoolCreate, SchoolResponse
import uuid
import re
from app.schemas.auth import UserRegister, UserResponse, UserUpdate
from app.services.auth_service import register_user
from app.models.user import User

#Simple slugify function
def slugify(text):
    """Convert text to a URL-friendly slug."""
    text = str(text).lower().strip()
    text = re.sub(r'[\w\s-]', '', text) #To remove special characters
    text = re.sub(r'[-\s]+', '-', text)  #Replace spaces and hyphens with single hyphen
    return text

router = APIRouter()

@router.post("/schools", response_model=SchoolResponse, status_code=status.HTTP_201_CREATED)
def create_school(data: SchoolCreate, db: Session = Depends(get_db), current_user=Depends(is_super_admin)):
    slug = slugify(data.name)
    existing = db.query(School).filter(School.slug == slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="School name already taken")
    # Create school (ID automatically assigned)
    school = School(
        name=data.name,
        slug=slug,
        email=data.email,
        phone=data.phone,
        address=data.address,
        subscription_status="trial"
    )
    db.add(school)
    db.commit()
    db.refresh(school)
    return school

@router.get("/schools", response_model=list[SchoolResponse])
def list_schools(db: Session = Depends(get_db), current_user=Depends(is_super_admin)):
    return db.query(School).all()

@router.get("/schools/{school_id}", response_model=SchoolResponse)
def get_school_details(school_id: uuid.UUID, db: Session = Depends(get_db), current_user=Depends(is_super_admin)):
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return school

@router.put("/schools/{school_id}", response_model=SchoolResponse)
def update_school(
    school_id: uuid.UUID,
    data: SchoolCreate,   # or a dedicated SchoolUpdate schema if you want
    db: Session = Depends(get_db),
    current_user=Depends(is_super_admin)
):
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    school.name = data.name
    school.slug = slugify(data.name)
    school.email = data.email
    school.phone = data.phone
    school.address = data.address
    db.commit()
    db.refresh(school)
    return school

@router.delete("/schools/{school_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_school(
    school_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(is_super_admin)
):
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    db.delete(school)
    db.commit()
    return # No content

@router.post("/schools/{school_id}/admins", response_model=UserResponse)
def create_school_admin(
    user: UserRegister,
    school_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(is_super_admin)
):
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    try:
        user_obj = register_user(db, user, school_id)
        return user_obj
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# CREATE: already implemented as /schools/{school_id}/admins

@router.get("/schools/{school_id}/admins", response_model=list[UserResponse])
def list_school_admins(school_id: uuid.UUID, db: Session = Depends(get_db), current_user=Depends(is_super_admin)):
    return db.query(User).filter(User.role == 'school_admin', User.school_id == school_id).all()

@router.get("/schools/{school_id}/admins/{admin_id}", response_model=UserResponse)
def get_school_admin(school_id: uuid.UUID, admin_id: uuid.UUID, db: Session = Depends(get_db), current_user=Depends(is_super_admin)):
    admin = db.query(User).filter(User.id == admin_id, User.school_id == school_id, User.role == 'school_admin').first()
    if not admin:
        raise HTTPException(status_code=404, detail="School admin not found")
    return admin

@router.put("/schools/{school_id}/admins/{admin_id}", response_model=UserResponse)
def update_school_admin(
    school_id: uuid.UUID,
    admin_id: uuid.UUID,
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(is_super_admin)
):
    admin = db.query(User).filter(User.id == admin_id, User.school_id == school_id, User.role == 'school_admin').first()
    if not admin:
        raise HTTPException(status_code=404, detail="School admin not found")
    # Update desired fields
    for k, v in data.dict(exclude_unset=True).items():
        setattr(admin, k, v)
    db.commit()
    db.refresh(admin)
    return admin

@router.delete("/schools/{school_id}/admins/{admin_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_school_admin(
    school_id: uuid.UUID,
    admin_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(is_super_admin)
):
    admin = db.query(User).filter(User.id == admin_id, User.school_id == school_id, User.role == 'school_admin').first()
    if not admin:
        raise HTTPException(status_code=404, detail="School admin not found")
    db.delete(admin)
    db.commit()
    return

