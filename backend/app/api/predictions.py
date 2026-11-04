"""
HR Insight - Predictions Router
Handles real-time inference requests, database persistence in SQLite,
and retrieval/filtering/deletion of historical predictions.
"""
from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.database.session import get_db
from backend.app.models.db_models import PredictionHistory
from backend.app.schemas.schemas import (
    EmployeePredictionInput,
    PredictionResult,
    PredictionRecordResponse
)
from backend.ml.predict import get_prediction_engine

router = APIRouter(prefix="/predictions", tags=["Predictions"])


@router.post("", response_model=PredictionResult)
def create_prediction(payload: EmployeePredictionInput, db: Session = Depends(get_db)):
    """
    Run machine learning model on validated employee features,
    calculate risk probability & tier, and persist in SQLite history.
    """
    engine = get_prediction_engine()
    input_dict = payload.model_dump()
    employee_ref = input_dict.pop('employee_reference', 'EMP-PRED')
    model_choice = input_dict.pop('model_choice', 'best')

    try:
        result = engine.predict(input_dict, model_choice=model_choice)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Inference error: {str(e)}")

    # Persist in SQLite via SQLAlchemy
    history_entry = PredictionHistory(
        employee_reference=employee_ref,
        input_features=input_dict,
        predicted_class=result["predicted_class"],
        risk_probability=result["risk_probability"],
        risk_category=result["risk_category"],
        model_name=result["model_name"],
        created_at=datetime.now(timezone.utc)
    )
    db.add(history_entry)
    db.commit()
    db.refresh(history_entry)

    result["history_id"] = history_entry.id
    result["created_at"] = history_entry.created_at.strftime("%Y-%m-%d %H:%M:%S")

    return result


@router.get("", response_model=list[PredictionRecordResponse])
def list_predictions(
    search: Optional[str] = Query(None, description="Search employee reference"),
    risk_category: Optional[str] = Query(None, description="Filter by risk category"),
    predicted_class: Optional[str] = Query(None, description="Filter by class (Yes/No)"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Retrieve historical prediction records with search, filter, and pagination."""
    query = db.query(PredictionHistory)

    if search:
        query = query.filter(PredictionHistory.employee_reference.ilike(f"%{search.strip()}%"))
    if risk_category and risk_category != "All":
        query = query.filter(PredictionHistory.risk_category == risk_category)
    if predicted_class and predicted_class != "All":
        query = query.filter(PredictionHistory.predicted_class == predicted_class)

    records = query.order_by(desc(PredictionHistory.created_at)).offset(offset).limit(limit).all()
    return records


@router.get("/{prediction_id}", response_model=PredictionRecordResponse)
def get_prediction_by_id(prediction_id: int, db: Session = Depends(get_db)):
    """Retrieve single prediction record details by ID."""
    record = db.query(PredictionHistory).filter(PredictionHistory.id == prediction_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prediction record with ID {prediction_id} not found."
        )
    return record


@router.delete("/{prediction_id}")
def delete_prediction(prediction_id: int, db: Session = Depends(get_db)):
    """Delete a prediction record with confirmation."""
    record = db.query(PredictionHistory).filter(PredictionHistory.id == prediction_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prediction record with ID {prediction_id} not found."
        )
    db.delete(record)
    db.commit()
    return {"status": "success", "message": f"Prediction record {prediction_id} successfully deleted."}
