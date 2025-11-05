from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate, SubjectResponse
from app.core.dependencies import get_db, get_current_user

router = APIRouter()

@router.post("/", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
def create_subject(data: SubjectCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    subject = Subject(**data.dict(), school_id=school_id)
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject

@router.get("/", response_model=list[SubjectResponse])
def list_subjects(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    subjects = db.query(Subject).filter(Subject.school_id == school_id).all()
    return subjects

@router.get("/{subject_id}", response_model=SubjectResponse)
def get_subject(subject_id, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.school_id == school_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject

@router.put("/{subject_id}", response_model=SubjectResponse)
def update_subject(subject_id, data: SubjectUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.school_id == school_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(subject, key, value)
    db.commit()
    db.refresh(subject)
    return subject

@router.delete("/{subject_id}", status_code=204)
def delete_subject(subject_id, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.school_id == school_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    db.delete(subject)
    db.commit()
