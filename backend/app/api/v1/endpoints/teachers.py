from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.teacher import Teacher
from app.schemas.teacher import TeacherCreate, TeacherUpdate, TeacherResponse
from app.core.dependencies import get_db, get_current_user

router = APIRouter()

@router.post("/", response_model=TeacherResponse, status_code=status.HTTP_201_CREATED)
def create_teacher(data: TeacherCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    teacher = Teacher(**data.dict(), school_id=school_id)
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher

@router.get("/", response_model=list[TeacherResponse])
def list_teachers(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    teachers = db.query(Teacher).filter(Teacher.school_id == school_id).all()
    return teachers

@router.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher(teacher_id, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id, Teacher.school_id == school_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher

@router.put("/{teacher_id}", response_model=TeacherResponse)
def update_teacher(teacher_id, data: TeacherUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id, Teacher.school_id == school_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(teacher, key, value)
    db.commit()
    db.refresh(teacher)
    return teacher

@router.delete("/{teacher_id}", status_code=204)
def delete_teacher(teacher_id, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id, Teacher.school_id == school_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    db.delete(teacher)
    db.commit()
