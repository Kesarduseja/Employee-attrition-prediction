"""
HR Insight - Data Preprocessing Pipeline
Handles data cleaning, constant column removal, feature transformation,
and train/validation/test stratified splitting.
"""
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

# Columns to drop because they are constant, identifiers, or non-informative
COLUMNS_TO_DROP = ['EmployeeCount', 'Over18', 'StandardHours', 'EmployeeNumber']

CATEGORICAL_FEATURES = [
    'BusinessTravel',
    'Department',
    'EducationField',
    'Gender',
    'JobRole',
    'MaritalStatus',
    'OverTime'
]

NUMERICAL_FEATURES = [
    'Age',
    'DailyRate',
    'DistanceFromHome',
    'Education',
    'EnvironmentSatisfaction',
    'HourlyRate',
    'JobInvolvement',
    'JobLevel',
    'JobSatisfaction',
    'MonthlyIncome',
    'MonthlyRate',
    'NumCompaniesWorked',
    'PercentSalaryHike',
    'PerformanceRating',
    'RelationshipSatisfaction',
    'StockOptionLevel',
    'TotalWorkingYears',
    'TrainingTimesLastYear',
    'WorkLifeBalance',
    'YearsAtCompany',
    'YearsInCurrentRole',
    'YearsSinceLastPromotion',
    'YearsWithCurrManager'
]

ALL_FEATURE_COLUMNS = CATEGORICAL_FEATURES + NUMERICAL_FEATURES


def load_raw_dataset(data_path: str = None) -> pd.DataFrame:
    """Load the genuine IBM HR Analytics dataset and validate schema."""
    if data_path is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        data_path = os.path.join(base_dir, 'data', 'WA_Fn-UseC_-HR-Employee-Attrition.csv')
    
    if not os.path.exists(data_path):
        raise FileNotFoundError(
            f"Dataset file not found at: {data_path}. "
            "Please ensure 'WA_Fn-UseC_-HR-Employee-Attrition.csv' is placed in the 'data' directory."
        )
    
    df = pd.read_csv(data_path)
    
    # Validate expected key columns
    if 'Attrition' not in df.columns:
        raise ValueError("Invalid dataset schema: 'Attrition' column is missing.")
    if len(df) < 1000:
        raise ValueError(f"Dataset has only {len(df)} records; expected 1470 IBM HR records.")
        
    return df


def clean_features(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    """
    Remove constant / identifier columns, extract target variable,
    and return X (features) and y (binary target: 1 for Yes, 0 for No).
    """
    df_clean = df.copy()
    
    # Target encoding
    y = (df_clean['Attrition'].str.strip() == 'Yes').astype(int)
    
    # Drop target and constant/id columns
    drop_cols = [c for c in COLUMNS_TO_DROP if c in df_clean.columns]
    drop_cols.append('Attrition')
    
    X = df_clean.drop(columns=drop_cols)
    
    return X, y


def build_preprocessor() -> ColumnTransformer:
    """
    Build Scikit-Learn ColumnTransformer for numerical scaling and categorical one-hot encoding.
    Fitted only on training data to prevent data leakage.
    """
    numerical_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, NUMERICAL_FEATURES),
            ('cat', categorical_transformer, CATEGORICAL_FEATURES)
        ],
        remainder='drop'
    )
    return preprocessor


def get_stratified_split(X: pd.DataFrame, y: pd.Series, test_size: float = 0.2, random_state: int = 42):
    """
    Split data into train and test sets using stratified sampling to preserve the 16% attrition ratio.
    """
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=test_size,
        random_state=random_state,
        stratify=y
    )
    return X_train, X_test, y_train, y_test
