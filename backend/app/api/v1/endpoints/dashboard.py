from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.dependencies import get_db, get_current_user
from app.models import Student, Teacher, Class, Subject, Attendance, Result

router = APIRouter()

@router.get("/school-summary/")
def school_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    school_id = current_user.school_id

    total_students = db.query(Student).filter(Student.school_id == school_id).count()
    total_teachers = db.query(Teacher).filter(Teacher.school_id == school_id).count()
    total_classes = db.query(Class).filter(Class.school_id == school_id).count()
    total_subjects = db.query(Subject).filter(Subject.school_id == school_id).count()
    total_attendance = db.query(Attendance).filter(Attendance.school_id == school_id).count()
    present_attendance = db.query(Attendance).filter(
        Attendance.school_id == school_id,
        Attendance.status == "present"
    ).count()
    avg_attendance = (present_attendance / total_attendance * 100) if total_attendance else 0
    avg_score = db.query(func.avg(Result.score)
                        ).filter(Result.school_id == school_id).scalar() or 0

    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_classes": total_classes,
        "total_subjects": total_subjects,
        "average_attendance": round(avg_attendance, 2),
        "average_score": round(avg_score, 2)
    }
