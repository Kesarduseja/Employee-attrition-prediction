"""
SQLAlchemy ORM models for Prediction History and Model Metadata.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from app.database.session import Base


class PredictionHistory(Base):
    """Stores predictions made via the UI or API."""
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    employee_reference = Column(String(100), nullable=False, index=True)
    input_features = Column(JSON, nullable=False)
    predicted_class = Column(String(10), nullable=False)
    risk_probability = Column(Float, nullable=False)
    risk_category = Column(String(50), nullable=False)
    model_name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class ModelMetadata(Base):
    """Stores trained model versions, evaluation metrics, and decision thresholds."""
    __tablename__ = "model_metadata"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)
    algorithm = Column(String(100), nullable=False)
    training_date = Column(String(50), nullable=False)
    evaluation_metrics = Column(JSON, nullable=False)
    selected_threshold = Column(Float, nullable=False)
