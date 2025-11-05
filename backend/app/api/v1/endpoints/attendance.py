from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional
from datetime import date
from uuid import UUID

from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate, AttendanceUpdate, AttendanceResponse
from app.core.dependencies import get_db, get_current_user

router = APIRouter()

@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(
    data: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Mark attendance for a student"""
    school_id = current_user.school_id
    
    # Create attendance record
    attendance = Attendance(
        **data.dict(),
        school_id=school_id,
        marked_by=current_user.id
    )
    
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance

@router.get("/", response_model=list[AttendanceResponse])
def list_attendance(
    class_id: Optional[UUID] = Query(None),
    student_id: Optional[UUID] = Query(None),
    subject_id: Optional[UUID] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """List attendance records with optional filters"""
    school_id = current_user.school_id
    
    query = db.query(Attendance).filter(Attendance.school_id == school_id)
    
    # Apply filters
    if class_id:
        query = query.filter(Attendance.class_id == class_id)
    if student_id:
        query = query.filter(Attendance.student_id == student_id)
    if subject_id:
        query = query.filter(Attendance.subject_id == subject_id)
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    
    attendance_records = query.all()
    return attendance_records

@router.get("/student/{student_id}", response_model=list[AttendanceResponse])
def get_student_attendance(
    student_id: UUID,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get all attendance records for a specific student"""
    school_id = current_user.school_id
    
    query = db.query(Attendance).filter(
        and_(
            Attendance.student_id == student_id,
            Attendance.school_id == school_id
        )
    )
    
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    
    attendance_records = query.all()
    return attendance_records

@router.get("/{attendance_id}", response_model=AttendanceResponse)
def get_attendance(
    attendance_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific attendance record"""
    school_id = current_user.school_id
    
    attendance = db.query(Attendance).filter(
        and_(
            Attendance.id == attendance_id,
            Attendance.school_id == school_id
        )
    ).first()
    
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    return attendance

@router.put("/{attendance_id}", response_model=AttendanceResponse)
def update_attendance(
    attendance_id: UUID,
    data: AttendanceUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update an attendance record"""
    school_id = current_user.school_id
    
    attendance = db.query(Attendance).filter(
        and_(
            Attendance.id == attendance_id,
            Attendance.school_id == school_id
        )
    ).first()
    
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(attendance, key, value)
    
    db.commit()
    db.refresh(attendance)
    return attendance

@router.delete("/{attendance_id}", status_code=204)
def delete_attendance(
    attendance_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete an attendance record"""
    school_id = current_user.school_id
    
    attendance = db.query(Attendance).filter(
        and_(
            Attendance.id == attendance_id,
            Attendance.school_id == school_id
        )
    ).first()
    
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    
    db.delete(attendance)
    db.commit()
