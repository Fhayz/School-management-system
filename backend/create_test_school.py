from app.db.database import SessionLocal
from app.models.school import School
import uuid

def create_test_school():
    db = SessionLocal()
    
    # Check if school already exists
    school_id = uuid.UUID("550e8400-e29b-41d4-a716-446655440000")
    existing = db.query(School).filter(School.id == school_id).first()
    
    if existing:
        print(f"School already exists: {existing.name}")
        return existing
    
    # Create new school
    school = School(
        id=school_id,
        name="Demo School",
        slug="demo-school",
        email="admin@demoschool.com",
        phone="+2348012345678",
        address="123 Demo Street, Lagos, Nigeria",
        subscription_status="trial",
        max_students=100,
        max_teachers=20,
        timezone="Africa/Lagos",
        currency="NGN"
    )
    
    db.add(school)
    db.commit()
    db.refresh(school)
    
    print(f"✅ Test school created: {school.name} (ID: {school.id})")
    db.close()
    return school

if __name__ == "__main__":
    create_test_school()
