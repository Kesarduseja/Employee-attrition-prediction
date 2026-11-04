"""
Automated unit tests for ML pipeline, preprocessing, and prediction engine.
"""
import pytest
import os
import pandas as pd
from ml.preprocessing import load_raw_dataset, clean_features, build_preprocessor, ALL_FEATURE_COLUMNS
from ml.predict import get_prediction_engine


def test_dataset_loading():
    """Verify genuine IBM HR dataset loads with exactly 1,470 records and 35 columns."""
    df = load_raw_dataset()
    assert df is not None
    assert len(df) == 1470
    assert "Attrition" in df.columns
    assert "Age" in df.columns
    assert "MonthlyIncome" in df.columns
    assert "OverTime" in df.columns


def test_clean_features_drops_constant_columns():
    """Verify constant columns (EmployeeCount, Over18, StandardHours, EmployeeNumber) are removed."""
    df = load_raw_dataset()
    X, y = clean_features(df)
    
    assert "EmployeeCount" not in X.columns
    assert "Over18" not in X.columns
    assert "StandardHours" not in X.columns
    assert "EmployeeNumber" not in X.columns
    assert "Attrition" not in X.columns
    assert len(y) == 1470
    assert set(y.unique()) == {0, 1}


def test_prediction_engine_valid_sample():
    """Test inference on a valid employee record."""
    engine = get_prediction_engine()
    
    sample_employee = {
        'Age': 32,
        'BusinessTravel': 'Travel_Frequently',
        'DailyRate': 650,
        'Department': 'Sales',
        'DistanceFromHome': 18,
        'Education': 3,
        'EducationField': 'Life Sciences',
        'EnvironmentSatisfaction': 1,
        'Gender': 'Male',
        'HourlyRate': 60,
        'JobInvolvement': 2,
        'JobLevel': 1,
        'JobRole': 'Sales Representative',
        'JobSatisfaction': 1,
        'MaritalStatus': 'Single',
        'MonthlyIncome': 2400,
        'MonthlyRate': 12000,
        'NumCompaniesWorked': 3,
        'OverTime': 'Yes',
        'PercentSalaryHike': 12,
        'PerformanceRating': 3,
        'RelationshipSatisfaction': 2,
        'StockOptionLevel': 0,
        'TotalWorkingYears': 4,
        'TrainingTimesLastYear': 2,
        'WorkLifeBalance': 1,
        'YearsAtCompany': 1,
        'YearsInCurrentRole': 1,
        'YearsSinceLastPromotion': 0,
        'YearsWithCurrManager': 0
    }
    
    res = engine.predict(sample_employee)
    assert res is not None
    assert res['predicted_class'] in ['Yes', 'No']
    assert 0.0 <= res['risk_probability'] <= 1.0
    assert res['risk_category'] in ['Low Risk', 'Medium Risk', 'High Risk']
    assert len(res['key_factors']) > 0
    assert "Decision Support Disclaimer" in res['disclaimer']
