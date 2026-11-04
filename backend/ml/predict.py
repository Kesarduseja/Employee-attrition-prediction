"""
HR Insight - Prediction Engine
Loads saved machine learning pipeline, runs inference on new employee data,
computes risk score, risk level, and explains key contributing factors.
"""
import os
import joblib
import pandas as pd
import numpy as np
from ml.preprocessing import ALL_FEATURE_COLUMNS


class PredictionEngine:
    """Manages model loading and prediction inference with risk tiering."""
    
    _instance = None
    
    def __init__(self, model_dir: str = None):
        if model_dir is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            model_dir = os.path.join(base_dir, 'saved_models')
        self.model_dir = model_dir
        self.model_path = os.path.join(model_dir, 'best_model.joblib')
        self.pipeline = None
        self.selected_threshold = 0.48  # Tuned on validation split
        self._load_model()
        
    def _load_model(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(
                f"Model file not found at {self.model_path}. "
                "Please run 'python -m backend.ml.train' to train and save the model."
            )
        self.pipeline = joblib.load(self.model_path)
        
    def predict(self, input_data: dict, model_choice: str = "best") -> dict:
        """
        Run inference on single employee record dictionary.
        Returns:
            predicted_class: 'Yes' or 'No'
            risk_probability: float (0.0 to 1.0)
            risk_category: 'Low', 'Medium', or 'High'
            model_name: string
            threshold_used: float
            key_factors: list of notable risk drivers
            disclaimer: academic decision-support notice
        """
        # Ensure model is ready or load alternative model if specified
        if model_choice in ["decision_tree", "dt"]:
            dt_path = os.path.join(self.model_dir, 'decision_tree.joblib')
            active_pipeline = joblib.load(dt_path)
            model_name = "Decision Tree Classifier"
            threshold = 0.60
        elif model_choice in ["logistic_regression", "logistic", "lr"]:
            lr_path = os.path.join(self.model_dir, 'logistic_regression.joblib')
            active_pipeline = joblib.load(lr_path)
            model_name = "Logistic Regression Classifier"
            threshold = 0.72
        elif model_choice in ["random_forest", "rf"]:
            rf_path = os.path.join(self.model_dir, 'random_forest.joblib')
            active_pipeline = joblib.load(rf_path)
            model_name = "Random Forest Classifier"
            threshold = 0.48
        else:
            active_pipeline = self.pipeline
            model_name = "Random Forest Classifier (Best Selected)"
            threshold = self.selected_threshold

        # Prepare single row DataFrame with exact expected columns
        row_dict = {}
        for col in ALL_FEATURE_COLUMNS:
            if col in input_data:
                row_dict[col] = [input_data[col]]
            else:
                raise ValueError(f"Missing required feature: '{col}'")
                
        df_input = pd.DataFrame(row_dict)
        
        # Inference
        probs = active_pipeline.predict_proba(df_input)[0]
        # Attrition probability (class 1)
        attrition_prob = float(probs[1])
        
        # Apply tuned threshold
        prediction_val = int(attrition_prob >= threshold)
        predicted_class = "Yes" if prediction_val == 1 else "No"
        
        # Determine risk tier based on threshold
        # Low: prob < threshold * 0.75
        # Medium: threshold * 0.75 <= prob < threshold * 1.25
        # High: prob >= threshold * 1.25
        low_bound = round(threshold * 0.75, 3)
        high_bound = round(min(0.85, threshold * 1.25), 3)
        
        if attrition_prob < low_bound:
            risk_category = "Low Risk"
        elif attrition_prob < high_bound:
            risk_category = "Medium Risk"
        else:
            risk_category = "High Risk"
            
        # Identify top heuristic drivers for this specific employee
        key_factors = []
        if input_data.get('OverTime') == 'Yes':
            key_factors.append("Frequent Overtime recorded (significant historical correlation with attrition)")
        if input_data.get('MonthlyIncome', 5000) < 3000:
            key_factors.append("Lower compensation tier (< $3,000 / month)")
        if input_data.get('StockOptionLevel', 1) == 0:
            key_factors.append("Zero stock options (lower long-term equity retention)")
        if input_data.get('YearsAtCompany', 5) <= 2:
            key_factors.append("Early tenure phase (<= 2 years at company)")
        if input_data.get('EnvironmentSatisfaction', 3) <= 2:
            key_factors.append("Low workplace environment satisfaction reported")
        if input_data.get('JobSatisfaction', 3) <= 2:
            key_factors.append("Sub-optimal job satisfaction rating")
        if input_data.get('WorkLifeBalance', 3) <= 2:
            key_factors.append("Reported work-life balance strain")
        if input_data.get('DistanceFromHome', 10) > 15:
            key_factors.append(f"Extended commute distance ({input_data['DistanceFromHome']} miles)")
        if input_data.get('YearsWithCurrManager', 3) <= 1:
            key_factors.append("Recent management transition (<= 1 year with current manager)")

        if not key_factors:
            key_factors.append("Balanced profile across compensation, work-life balance, and tenure.")

        explanation = (
            f"The employee is predicted as '{predicted_class}' for attrition with an estimated probability "
            f"of {round(attrition_prob * 100, 1)}% ({risk_category}) based on the decision threshold of {threshold}. "
            f"{'Proactive HR retention and engagement discussion recommended.' if predicted_class == 'Yes' else 'Employee demonstrates low-to-moderate departure signals under current parameters.'}"
        )

        return {
            "predicted_class": predicted_class,
            "risk_probability": round(attrition_prob, 4),
            "risk_percentage": round(attrition_prob * 100, 1),
            "risk_category": risk_category,
            "model_name": model_name,
            "threshold_used": threshold,
            "explanation": explanation,
            "key_factors": key_factors,
            "disclaimer": (
                "Decision Support Disclaimer: This prediction is an estimate derived from statistical patterns "
                "in the IBM HR Analytics dataset. It is intended solely to guide supportive HR retention dialogues "
                "and talent development, NOT for automatic disciplinary or employment decisions."
            )
        }


# Singleton engine instance
_engine = None

def get_prediction_engine() -> PredictionEngine:
    global _engine
    if _engine is None:
        _engine = PredictionEngine()
    return _engine
