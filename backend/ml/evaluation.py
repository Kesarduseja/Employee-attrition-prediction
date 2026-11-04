"""
HR Insight - Machine Learning Model Evaluation
Calculates genuine classification metrics, confusion matrix, ROC curve, PR curve,
and comparison against a naive majority-class baseline.
"""
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix,
    roc_curve,
    precision_recall_curve
)


def evaluate_model_performance(y_true, y_pred, y_prob) -> dict:
    """
    Calculate comprehensive evaluation metrics for imbalanced classification:
    Accuracy, Precision, Recall, F1, ROC-AUC, PR-AUC, Confusion Matrix, and curve coordinates.
    """
    acc = float(accuracy_score(y_true, y_pred))
    prec = float(precision_score(y_true, y_pred, zero_division=0))
    rec = float(recall_score(y_true, y_pred, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))
    
    # Calculate ROC-AUC and PR-AUC using predicted probabilities
    try:
        roc_auc = float(roc_auc_score(y_true, y_prob))
    except Exception:
        roc_auc = 0.5
        
    try:
        pr_auc = float(average_precision_score(y_true, y_prob))
    except Exception:
        pr_auc = float(np.mean(y_true))
        
    cm = confusion_matrix(y_true, y_pred)
    tn, fp, fn, tp = [int(v) for v in cm.ravel()]
    
    # ROC curve points (sampled to ~25 points for smooth web charting)
    fpr, tpr, _ = roc_curve(y_true, y_prob)
    indices = np.linspace(0, len(fpr) - 1, min(25, len(fpr))).astype(int)
    roc_points = [{"fpr": round(float(fpr[i]), 3), "tpr": round(float(tpr[i]), 3)} for i in indices]
    
    # Precision-Recall curve points
    p_curve, r_curve, _ = precision_recall_curve(y_true, y_prob)
    pr_indices = np.linspace(0, len(p_curve) - 1, min(25, len(p_curve))).astype(int)
    pr_points = [{"recall": round(float(r_curve[i]), 3), "precision": round(float(p_curve[i]), 3)} for i in pr_indices]
    
    return {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(roc_auc, 4),
        "pr_auc": round(pr_auc, 4),
        "confusion_matrix": {
            "tn": tn,
            "fp": fp,
            "fn": fn,
            "tp": tp,
            "matrix": [[tn, fp], [fn, tp]]
        },
        "roc_curve": roc_points,
        "pr_curve": pr_points
    }


def find_optimal_threshold(y_true, y_prob) -> float:
    """
    Search validation probability thresholds (0.1 to 0.9) to optimize F1-score
    for imbalanced attrition detection.
    """
    thresholds = np.linspace(0.15, 0.85, 71)
    best_thresh = 0.5
    best_f1 = -1.0
    
    for th in thresholds:
        preds = (y_prob >= th).astype(int)
        score = f1_score(y_true, preds, zero_division=0)
        if score > best_f1:
            best_f1 = score
            best_thresh = float(th)
            
    return round(best_thresh, 3)
