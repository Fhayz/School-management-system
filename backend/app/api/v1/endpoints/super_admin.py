from fastapi import APIRouter, Depends, HTTPException, status
from app.core.dependencies import is_super_admin, get_db
from sqlalchemy.orm import Session
from app.models.school import School
from app.schemas.school import SchoolCreate, SchoolResponse
import uuid
import re

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
