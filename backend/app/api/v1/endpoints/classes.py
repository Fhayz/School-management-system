from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.class_model import Class
from app.models.student import Student
from app.models.subject import Subject
from app.schemas.class_schema import ClassCreate, ClassUpdate, ClassResponse, AddStudentsToClass, AddSubjectsToClass
from app.core.dependencies import get_db, get_current_user

router = APIRouter()

@router.post("/", response_model=ClassResponse, status_code=status.HTTP_201_CREATED)
def create_class(data: ClassCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    new_class = Class(**data.dict(), school_id=school_id)
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    return new_class

@router.get("/", response_model=list[ClassResponse])
def list_classes(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    classes = db.query(Class).filter(Class.school_id == school_id).all()
    return classes

@router.get("/{class_id}", response_model=ClassResponse)
def get_class(class_id, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    class_obj = db.query(Class).filter(Class.id == class_id, Class.school_id == school_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")
    return class_obj

@router.put("/{class_id}", response_model=ClassResponse)
def update_class(class_id, data: ClassUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    class_obj = db.query(Class).filter(Class.id == class_id, Class.school_id == school_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(class_obj, key, value)
    db.commit()
    db.refresh(class_obj)
    return class_obj

@router.delete("/{class_id}", status_code=204)
def delete_class(class_id, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    class_obj = db.query(Class).filter(Class.id == class_id, Class.school_id == school_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")
    db.delete(class_obj)
    db.commit()

@router.post("/{class_id}/students", status_code=200)
def add_students_to_class(class_id, data: AddStudentsToClass, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    class_obj = db.query(Class).filter(Class.id == class_id, Class.school_id == school_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")
    
    students = db.query(Student).filter(Student.id.in_(data.student_ids), Student.school_id == school_id).all()
    class_obj.students.extend(students)
    db.commit()
    return {"message": f"Added {len(students)} students to class"}

@router.post("/{class_id}/subjects", status_code=200)
def add_subjects_to_class(class_id, data: AddSubjectsToClass, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    school_id = current_user.school_id
    class_obj = db.query(Class).filter(Class.id == class_id, Class.school_id == school_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")
    
    subjects = db.query(Subject).filter(Subject.id.in_(data.subject_ids), Subject.school_id == school_id).all()
    class_obj.subjects.extend(subjects)
    db.commit()
    return {"message": f"Added {len(subjects)} subjects to class"}
