"""
HR Insight - Model Performance Router
Exposes genuine machine learning evaluation metrics, confusion matrices, ROC/PR curves,
and comparative algorithm performance against the naive baseline.
"""
import os
import json
from fastapi import APIRouter, HTTPException, status
from ml.train import train_and_evaluate_models
from ml.predict import get_prediction_engine

router = APIRouter(prefix="/models", tags=["Model Performance"])


def _load_metrics_summary() -> dict:
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    summary_path = os.path.join(base_dir, 'saved_models', 'metrics_summary.json')
    if not os.path.exists(summary_path):
        # Auto-train if not yet trained
        return train_and_evaluate_models()
    with open(summary_path, 'r') as f:
        return json.load(f)


@router.get("/metrics")
def get_model_metrics():
    """Retrieve active best model's metrics, dataset splits, threshold, and top features."""
    summary = _load_metrics_summary()
    best_name = summary.get("selected_best_model", "Random Forest Classifier")
    best_details = summary.get("models", {}).get(best_name, {})
    return {
        "model_name": best_name,
        "selected_threshold": summary.get("selected_threshold", 0.48),
        "dataset_stats": summary.get("dataset_stats", {}),
        "metrics": best_details.get("metrics", {}),
        "top_features": summary.get("top_features", []),
        "imbalance_explanation": summary.get("imbalance_explanation", ""),
        "why_selected_explanation": summary.get("why_selected_explanation", {})
    }


@router.get("/comparison")
def get_model_comparison():
    """Retrieve comparative analysis of Baseline, Decision Tree, Random Forest, and Logistic Regression."""
    summary = _load_metrics_summary()
    return {
        "selected_best_model": summary.get("selected_best_model"),
        "selected_threshold": summary.get("selected_threshold"),
        "models": summary.get("models", {}),
        "top_features": summary.get("top_features", []),
        "unified_curves": summary.get("unified_curves", {}),
        "imbalance_explanation": summary.get("imbalance_explanation", ""),
        "why_selected_explanation": summary.get("why_selected_explanation", {})
    }


@router.get("/{model_key}/details")
def get_model_details(model_key: str):
    """
    Retrieve specific model details by key.
    model_key can be: 'decision_tree', 'random_forest', 'logistic_regression', or 'baseline'.
    """
    summary = _load_metrics_summary()
    models_dict = summary.get("models", {})
    
    # Normalize model key
    key_norm = model_key.lower().replace("-", "_").replace(" ", "_")
    mapping = {
        "decision_tree": "Decision Tree Classifier",
        "dt": "Decision Tree Classifier",
        "random_forest": "Random Forest Classifier",
        "rf": "Random Forest Classifier",
        "logistic_regression": "Logistic Regression Classifier",
        "logistic": "Logistic Regression Classifier",
        "lr": "Logistic Regression Classifier",
        "baseline": "Naive Majority Baseline",
        "naive_baseline": "Naive Majority Baseline",
    }
    
    target_name = mapping.get(key_norm)
    if not target_name:
        for full_name in models_dict.keys():
            if key_norm in full_name.lower().replace(" ", "_"):
                target_name = full_name
                break
                
    if not target_name or target_name not in models_dict:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model '{model_key}' not found. Available models: {list(mapping.keys())}"
        )
        
    return {
        "model_key": model_key,
        "model_name": target_name,
        "details": models_dict[target_name]
    }


@router.post("/retrain")
def retrain_models():
    """Retrain all ML models on the dataset and refresh the prediction engine."""
    try:
        summary = train_and_evaluate_models()
        # Force re-instantiation of prediction engine
        engine = get_prediction_engine()
        engine._load_model()
        return {
            "status": "success",
            "message": "All 3 machine learning models and baseline successfully retrained and reloaded.",
            "best_model": summary.get("selected_best_model"),
            "threshold": summary.get("selected_threshold")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")
