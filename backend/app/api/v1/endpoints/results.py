from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import Optional
from uuid import UUID
from datetime import date

from app.models.result import Result
from app.schemas.result import ResultCreate, ResultUpdate, ResultResponse
from app.core.dependencies import get_db, get_current_user

router = APIRouter()

@router.post("/", response_model=ResultResponse, status_code=status.HTTP_201_CREATED)
def create_result(
    data: ResultCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    school_id = current_user.school_id
    result = Result(
        **data.dict(),
        school_id=school_id,
        marked_by=current_user.id
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result

@router.get("/", response_model=list[ResultResponse])
def list_results(
    student_id: Optional[UUID] = Query(None),
    class_id: Optional[UUID] = Query(None),
    subject_id: Optional[UUID] = Query(None),
    term: Optional[str] = Query(None),
    session: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    school_id = current_user.school_id
    query = db.query(Result).filter(Result.school_id == school_id)
    if student_id:
        query = query.filter(Result.student_id == student_id)
    if class_id:
        query = query.filter(Result.class_id == class_id)
    if subject_id:
        query = query.filter(Result.subject_id == subject_id)
    if term:
        query = query.filter(Result.term == term)
    if session:
        query = query.filter(Result.session == session)
    return query.all()

@router.get("/{result_id}", response_model=ResultResponse)
def get_result(
    result_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    school_id = current_user.school_id
    result = db.query(Result).filter(
        and_(
            Result.id == result_id,
            Result.school_id == school_id
        )
    ).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    return result

@router.put("/{result_id}", response_model=ResultResponse)
def update_result(
    result_id: UUID,
    data: ResultUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    school_id = current_user.school_id
    result = db.query(Result).filter(
        and_(
            Result.id == result_id,
            Result.school_id == school_id
        )
    ).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(result, key, value)
    db.commit()
    db.refresh(result)
    return result

@router.delete("/{result_id}", status_code=204)
def delete_result(
    result_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    school_id = current_user.school_id
    result = db.query(Result).filter(
        and_(
            Result.id == result_id,
            Result.school_id == school_id
        )
    ).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    db.delete(result)
    db.commit()
