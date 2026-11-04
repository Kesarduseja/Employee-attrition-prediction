"""
HR Insight - Employee Attrition Prediction & Analytics System
FastAPI Backend Application Entrypoint
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.session import Base, engine, SessionLocal
from app.models.db_models import ModelMetadata
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.analytics import router as analytics_router
from app.api.models import router as models_router
from app.api.predictions import router as predictions_router
from app.schemas.schemas import EmployeePredictionInput, PredictionResult
from app.api.predictions import create_prediction


# Ensure database tables exist immediately on import
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle event to ensure SQLite tables exist and initial metadata is registered."""
    Base.metadata.create_all(bind=engine)
    
    # Pre-populate ModelMetadata if empty and metadata.json is available
    db = SessionLocal()
    try:
        count = db.query(ModelMetadata).count()
        if count == 0:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            meta_path = os.path.join(base_dir, 'saved_models', 'metadata.json')
            if os.path.exists(meta_path):
                import json
                with open(meta_path, 'r') as f:
                    meta_data = json.load(f)
                entry = ModelMetadata(
                    model_name=meta_data.get("model_name", "Random Forest Classifier"),
                    algorithm=meta_data.get("algorithm", "Ensemble Random Forest"),
                    training_date=meta_data.get("training_date", "2026-11-01"),
                    evaluation_metrics=meta_data.get("evaluation_metrics", {}),
                    selected_threshold=meta_data.get("selected_threshold", 0.48)
                )
                db.add(entry)
                db.commit()
    except Exception as e:
        print(f"Notice during startup metadata population: {e}")
    finally:
        db.close()
        
    yield


app = FastAPI(
    title="HR Insight API",
    description="Enterprise Human Resource Attrition Prediction & Decision-Support System",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware for React Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(models_router, prefix="/api")
app.include_router(predictions_router, prefix="/api")


# Alias POST /api/predict directly to comply with Section 11 specifications
@app.post("/api/predict", response_model=PredictionResult, tags=["Predictions"])
def predict_alias(payload: EmployeePredictionInput):
    """Direct alias endpoint for POST /api/predict requested in project requirements."""
    db = SessionLocal()
    try:
        return create_prediction(payload=payload, db=db)
    finally:
        db.close()


@app.get("/api/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify backend operational readiness."""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    data_path = os.path.join(base_dir, 'data', 'WA_Fn-UseC_-HR-Employee-Attrition.csv')
    model_path = os.path.join(base_dir, 'saved_models', 'best_model.joblib')
    
    return {
        "status": "healthy",
        "service": "HR Insight – Employee Attrition Prediction API",
        "version": "1.0.0",
        "dataset_present": os.path.exists(data_path),
        "model_loaded": os.path.exists(model_path),
        "database": "SQLite operational"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
