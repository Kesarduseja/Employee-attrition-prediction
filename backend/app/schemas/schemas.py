"""
Pydantic validation schemas for API requests and responses.
"""
from typing import Optional, Literal, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class EmployeePredictionInput(BaseModel):
    """Validated input features for predicting employee attrition."""
    employee_reference: Optional[str] = Field(default="EMP-PRED", description="Employee identifier or reference code")
    model_choice: Optional[str] = Field(default="best", description="Model algorithm: 'best', 'random_forest', or 'decision_tree'")

    # Numerical features
    Age: int = Field(..., ge=18, le=65, description="Employee age (18-65)")
    DailyRate: int = Field(default=800, ge=100, le=1500, description="Daily compensation rate")
    DistanceFromHome: int = Field(..., ge=1, le=50, description="Distance from home in miles (1-50)")
    Education: int = Field(default=3, ge=1, le=5, description="1='Below College', 2='College', 3='Bachelor', 4='Master', 5='Doctor'")
    EnvironmentSatisfaction: int = Field(..., ge=1, le=4, description="1='Low', 2='Medium', 3='High', 4='Very High'")
    HourlyRate: int = Field(default=65, ge=30, le=100, description="Hourly compensation rate")
    JobInvolvement: int = Field(..., ge=1, le=4, description="1='Low', 2='Medium', 3='High', 4='Very High'")
    JobLevel: int = Field(default=2, ge=1, le=5, description="Job level tier (1-5)")
    JobSatisfaction: int = Field(..., ge=1, le=4, description="1='Low', 2='Medium', 3='High', 4='Very High'")
    MonthlyIncome: int = Field(..., ge=1000, le=25000, description="Monthly gross income in USD")
    MonthlyRate: int = Field(default=14000, ge=2000, le=30000, description="Monthly billing rate")
    NumCompaniesWorked: int = Field(default=2, ge=0, le=15, description="Number of previous companies worked")
    PercentSalaryHike: int = Field(default=15, ge=10, le=30, description="Percentage salary increase last cycle")
    PerformanceRating: int = Field(default=3, ge=1, le=4, description="Performance evaluation rating (1-4)")
    RelationshipSatisfaction: int = Field(default=3, ge=1, le=4, description="1='Low', 2='Medium', 3='High', 4='Very High'")
    StockOptionLevel: int = Field(default=1, ge=0, le=3, description="Stock option equity level (0-3)")
    TotalWorkingYears: int = Field(..., ge=0, le=45, description="Total career years")
    TrainingTimesLastYear: int = Field(default=2, ge=0, le=10, description="Training sessions attended last year")
    WorkLifeBalance: int = Field(..., ge=1, le=4, description="1='Bad', 2='Good', 3='Better', 4='Best'")
    YearsAtCompany: int = Field(..., ge=0, le=45, description="Years with current employer")
    YearsInCurrentRole: int = Field(default=2, ge=0, le=30, description="Years in current designated role")
    YearsSinceLastPromotion: int = Field(default=1, ge=0, le=30, description="Years since last career promotion")
    YearsWithCurrManager: int = Field(default=2, ge=0, le=30, description="Years under current supervisor")

    # Categorical features
    BusinessTravel: Literal['Non-Travel', 'Travel_Frequently', 'Travel_Rarely']
    Department: Literal['Human Resources', 'Research & Development', 'Sales']
    EducationField: Literal['Human Resources', 'Life Sciences', 'Marketing', 'Medical', 'Other', 'Technical Degree']
    Gender: Literal['Female', 'Male']
    JobRole: Literal[
        'Healthcare Representative',
        'Human Resources',
        'Laboratory Technician',
        'Manager',
        'Manufacturing Director',
        'Research Director',
        'Research Scientist',
        'Sales Executive',
        'Sales Representative'
    ]
    MaritalStatus: Literal['Divorced', 'Married', 'Single']
    OverTime: Literal['No', 'Yes']


class PredictionResult(BaseModel):
    """Output prediction details returned by inference engine."""
    predicted_class: str
    risk_probability: float
    risk_percentage: float
    risk_category: str
    model_name: str
    threshold_used: float
    explanation: str
    key_factors: list[str]
    disclaimer: str
    history_id: Optional[int] = None
    created_at: Optional[str] = None


class PredictionRecordResponse(BaseModel):
    """Schema for stored prediction history record."""
    id: int
    employee_reference: str
    input_features: dict[str, Any]
    predicted_class: str
    risk_probability: float
    risk_category: str
    model_name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict[str, Any]
