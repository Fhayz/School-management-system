from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate, StudentResponse
from app.core.dependencies import get_db, get_current_user

router = APIRouter()

@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(data: StudentCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    student = Student(**data.dict(), school_id=school_id)
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@router.get("/", response_model=list[StudentResponse])
def list_students(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    students = db.query(Student).filter(Student.school_id == school_id).all()
    return students

@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    student = db.query(Student).filter(Student.id == student_id, Student.school_id == school_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{student_id}", response_model=StudentResponse)
def update_student(student_id, data: StudentUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    student = db.query(Student).filter(Student.id == student_id, Student.school_id == school_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(student, key, value)
    db.commit()
    db.refresh(student)
    return student

@router.delete("/{student_id}", status_code=204)
def delete_student(student_id, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    student = db.query(Student).filter(Student.id == student_id, Student.school_id == school_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
