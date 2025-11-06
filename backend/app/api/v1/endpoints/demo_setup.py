from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.models import Student, Teacher, Class, Subject
from datetime import date

router = APIRouter()

@router.post("/demo-setup/")
def demo_setup(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    school_id = current_user.school_id

    # Create classes
    class1 = Class(name="Grade 10A", grade_level=10, section="A", academic_year="2025/2026", school_id=school_id)
    class2 = Class(name="Grade 10B", grade_level=10, section="B", academic_year="2025/2026", school_id=school_id)
    db.add_all([class1, class2])
    db.commit(); db.refresh(class1); db.refresh(class2)

    # Create subjects
    subj_math = Subject(name="Mathematics", code="MATH101", school_id=school_id)
    subj_eng = Subject(name="English", code="ENG101", school_id=school_id)
    subj_phy = Subject(name="Physics", code="PHY101", school_id=school_id)
    db.add_all([subj_math, subj_eng, subj_phy])
    db.commit(); db.refresh(subj_math); db.refresh(subj_eng); db.refresh(subj_phy)

    # Create teachers (use your model's fields)
    teacher1 = Teacher(
        first_name="Ada",
        last_name="Obi",
        middle_name="",
        gender="Female",
        date_of_birth=date(1982, 6, 7),
        email="ada@school.com",
        phone="08012345678",
        address="Lagos",
        qualification="BSc Math",
        subject_specialty="Mathematics",
        school_id=school_id
    )
    teacher2 = Teacher(
        first_name="Bola",
        last_name="Ade",
        middle_name="",
        gender="Male",
        date_of_birth=date(1980, 3, 15),
        email="bola@school.com",
        phone="08087654321",
        address="Abuja",
        qualification="BSc Physics",
        subject_specialty="Physics",
        school_id=school_id
    )
    db.add_all([teacher1, teacher2])
    db.commit(); db.refresh(teacher1); db.refresh(teacher2)

    # Create students (use your model's fields)
    student1 = Student(
        first_name="John",
        last_name="Doe",
        middle_name="",
        gender="Male",
        date_of_birth=date(2010, 2, 16),
        email="john.doe@example.com",
        phone="08023456789",
        address="Lagos",
        guardian_name="Jane Doe",
        guardian_phone="08098765432",
        school_id=school_id
    )
    student2 = Student(
        first_name="Jane",
        last_name="Smith",
        middle_name="",
        gender="Female",
        date_of_birth=date(2010, 4, 20),
        email="jane.smith@example.com",
        phone="08034567890",
        address="Abuja",
        guardian_name="James Smith",
        guardian_phone="08012349876",
        school_id=school_id
    )
    db.add_all([student1, student2])
    db.commit(); db.refresh(student1); db.refresh(student2)

    return {
        "classes": [
            {"id": str(class1.id), "name": class1.name},
            {"id": str(class2.id), "name": class2.name}
        ],
        "subjects": [
            {"id": str(subj_math.id), "name": subj_math.name},
            {"id": str(subj_eng.id), "name": subj_eng.name},
            {"id": str(subj_phy.id), "name": subj_phy.name}
        ],
        "teachers": [
            {"id": str(teacher1.id), "name": f"{teacher1.first_name} {teacher1.last_name}"},
            {"id": str(teacher2.id), "name": f"{teacher2.first_name} {teacher2.last_name}"}
        ],
        "students": [
            {"id": str(student1.id), "name": f"{student1.first_name} {student1.last_name}"},
            {"id": str(student2.id), "name": f"{student2.first_name} {student2.last_name}"}
        ]
    }
