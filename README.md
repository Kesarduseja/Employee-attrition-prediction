# HR Insight – Employee Attrition Prediction & Analytics System

[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12%20%7C%203.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4+-F7931E.svg)](https://scikit-learn.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A complete, full-stack, enterprise-grade decision-support web application developed for the academic **Data Mining & Business Intelligence (DMBI)** capstone project. The system analyzes historical employee records, applies balanced machine learning classification algorithms, persists assessments into a relational SQLite database, and presents insights through an interactive dashboard.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Project Objectives](#3-project-objectives)
4. [Dataset Source & Setup](#4-dataset-source--setup)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Machine Learning Workflow](#7-machine-learning-workflow)
8. [Classification Algorithms & Imbalance Handling](#8-classification-algorithms--imbalance-handling)
9. [Database Design](#9-database-design)
10. [REST API Endpoints](#10-rest-api-endpoints)
11. [Installation & Prerequisites](#11-installation--prerequisites)
12. [How to Train the Models](#12-how-to-train-the-models)
13. [How to Run the Backend](#13-how-to-run-the-backend)
14. [How to Run the Frontend](#14-how-to-run-the-frontend)
15. [Automated Testing Instructions](#15-automated-testing-instructions)
16. [Application Pages Walkthrough](#16-application-pages-walkthrough)
17. [Screenshots Checklist](#17-screenshots-checklist)
18. [Limitations](#18-limitations)
19. [Ethical Considerations & Fair AI](#19-ethical-considerations--fair-ai)
20. [Future Scope](#20-future-scope)

---

## 1. Project Overview

**HR Insight** is an end-to-end predictive analytics web application designed to help Human Resource departments proactively identify employees who may be at risk of leaving an organization. Rather than relying on exit interviews after an employee has already resigned, HR departments can use this decision-support system to diagnose flight-risk factors and intervene with retention discussions, career growth planning, and compensation reviews.

> **Important Note:** This system is an assistive decision-support tool, **not** an automated mechanism for employee evaluation, disciplinary action, or termination.

---

## 2. Problem Statement

Employee turnover is one of the costliest operational challenges facing modern organizations:
- **Direct Costs:** Recruitment advertisements, interview cycles, third-party recruiter fees, and background checks.
- **Indirect Costs:** Productivity lag during onboarding, loss of domain knowledge, strain on remaining staff, and negative team morale.
- **Reactionary Deficit:** Conventional HR practices recognize employee dissatisfaction only after a resignation letter is handed in, when counter-offers often fail.

By utilizing machine learning on employee data (satisfaction metrics, compensation, overtime frequency, role tenure), HR Insight computes individualized flight probabilities and highlights the root drivers contributing to departure risk.

---

## 3. Project Objectives

1. **Exploratory Data Analysis (EDA):** Identify statistical patterns across departments, salary bands, overtime demands, and employee age cohorts.
2. **Handle Extreme Class Imbalance:** Correctly train classification models on imbalanced data (~16% attrition) using balanced class weights and threshold tuning instead of relying on deceptive accuracy scores.
3. **Compare Machine Learning Classifiers:** Evaluate a Decision Tree, Random Forest ensemble, and Naive Majority Baseline using Precision, Recall, F1-Score, and ROC-AUC.
4. **Real-Time Prediction Module:** Provide an intuitive 24+ feature input form for HR analysts to evaluate employees and view immediate probability scores and risk categories (Low / Medium / High).
5. **Relational Audit Persistence:** Store all prediction queries and factor weights in an SQLite database using SQLAlchemy ORM for compliance, filtering, and review.

---

## 4. Dataset Source & Setup

The system is built on the genuine **IBM HR Analytics Employee Attrition & Performance dataset** from Kaggle.

### Dataset Characteristics:
- **Total Records:** 1,470 employee records
- **Original Attributes:** 35 attributes (numerical, ordinal, categorical)
- **Target Feature:** `Attrition` (`'Yes'` = 237 records [16.12%], `'No'` = 1,233 records [83.88%])
- **File Location:** `data/WA_Fn-UseC_-HR-Employee-Attrition.csv`

### Feature Preprocessing & Cleaning:
- **Constant / Uninformative Columns Removed:**
  - `EmployeeCount` (constant value: 1)
  - `Over18` (constant value: 'Y')
  - `StandardHours` (constant value: 80)
  - `EmployeeNumber` (unique identifier)
- **Leakage Prevention:** Target variable `Attrition` is cleanly separated prior to feature transformation.
- **Categorical Columns (One-Hot Encoded):** `BusinessTravel`, `Department`, `EducationField`, `Gender`, `JobRole`, `MaritalStatus`, `OverTime`.
- **Numerical Columns (Standard Scaled):** `Age`, `DailyRate`, `DistanceFromHome`, `Education`, `EnvironmentSatisfaction`, `HourlyRate`, `JobInvolvement`, `JobLevel`, `JobSatisfaction`, `MonthlyIncome`, `MonthlyRate`, `NumCompaniesWorked`, `PercentSalaryHike`, `PerformanceRating`, `RelationshipSatisfaction`, `StockOptionLevel`, `TotalWorkingYears`, `TrainingTimesLastYear`, `WorkLifeBalance`, `YearsAtCompany`, `YearsInCurrentRole`, `YearsSinceLastPromotion`, `YearsWithCurrManager`.

---

## 5. Technology Stack

### Frontend:
- **Framework:** React.js (v18.3) with Vite build tool
- **Styling:** Tailwind CSS with custom enterprise design tokens
- **Routing:** React Router DOM (v6.29)
- **Data Visualization:** Recharts (v2.15) for interactive responsive charts
- **Icons:** Lucide React
- **HTTP Client:** Axios with response interceptors

### Backend & Machine Learning:
- **API Framework:** Python FastAPI with Pydantic V2 validation
- **ASGI Server:** Uvicorn
- **Machine Learning:** Scikit-Learn, NumPy, Pandas, Joblib
- **Database ORM:** SQLite with SQLAlchemy (v2.0)
- **Testing:** Pytest (9.2), HTTPX TestClient

---

## 6. System Architecture

```
                    ┌──────────────────────────────────────────┐
                    │      React.js + Vite Single Page App     │
                    │   (Tailwind CSS, Recharts, Lucide Icons) │
                    └─────────────────────┬────────────────────┘
                                          │ REST API (JSON)
                                          ▼
                    ┌──────────────────────────────────────────┐
                    │          FastAPI Backend Service         │
                    │   (Pydantic Validation, CORS, Lifespan)  │
                    └──┬──────────────────────┬──────────────┬─┘
                       │                      │              │
                       ▼                      ▼              ▼
            ┌───────────────────┐  ┌──────────────────┐  ┌───────────────┐
            │   EDA Analytics   │  │ Prediction Engine│  │ SQLAlchemy ORM│
            │      Service      │  │ (Joblib Pipeline)│  │ (SQLite DB)   │
            └─────────┬─────────┘  └────────┬─────────┘  └───────┬───────┘
                      │                     │                    │
                      ▼                     ▼                    ▼
            ┌───────────────────┐  ┌──────────────────┐  ┌───────────────┐
            │ Genuine IBM HR    │  │ Random Forest &  │  │ hr_insight.db │
            │   Dataset (CSV)   │  │  Decision Tree   │  │  (Audit Log)  │
            └───────────────────┘  └──────────────────┘  └───────────────┘
```

---

## 7. Machine Learning Workflow

1. **Stratified Split:** Data is partitioned into an 80% Training partition (1,176 records) and 20% strictly unseen Test partition (294 records) using stratified sampling to preserve the 16.12% target ratio.
2. **Validation Tuning:** The training partition is further split into train (940) and validation (236) to select the optimal decision threshold (maximizing F1-score) without ever touching the test partition.
3. **Pipeline Fitting:** A `ColumnTransformer` combines `StandardScaler` for numeric features and `OneHotEncoder(handle_unknown='ignore')` for categorical features. The transformer is fitted strictly on training data to prevent data leakage.
4. **Serialization:** The complete Scikit-Learn pipeline (`preprocessor` + `classifier`) is saved to disk via `joblib`.

---

## 8. Classification Algorithms & Imbalance Handling

### The Imbalance Challenge:
Because 83.9% of employees do not leave, a trivial naive model that always predicts "No" attains **83.9% Accuracy** while identifying **0 leavers (0% Recall)**. Therefore, **Accuracy alone is invalid for evaluation**.

### Actual Evaluated Results on Unseen Test Partition (294 Records):

| Algorithm | Decision Threshold | Accuracy | Precision | Recall | F1-Score | ROC-AUC | PR-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Naive Majority Baseline** | 0.50 | 84.01% | 0.00% | 0.00% | 0.0000 | 0.5000 | 0.1599 |
| **Decision Tree Classifier** | 0.60 | 78.91% | 37.29% | 46.81% | 0.4151 | 0.6320 | 0.3225 |
| **Random Forest Ensemble (Best)** | **0.48** | **82.31%** | **45.90%** | **59.57%** | **0.5185** | **0.7899** | **0.4410** |

### Top Predictive Feature Importances:
1. `MonthlyIncome` (Compensation bracket)
2. `Age` (Career stage)
3. `TotalWorkingYears` (Overall professional experience)
4. `YearsAtCompany` (Tenure loyalty)
5. `OverTime` (Workplace workload demand)
6. `YearsWithCurrManager` (Management relationship stability)
7. `StockOptionLevel` (Long-term equity retention)

---

## 9. Database Design

Implemented with **SQLite** and **SQLAlchemy ORM**.

### Table 1: `prediction_history`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | Auto-increment primary key |
| `employee_reference`| String(100) | Employee identifier (e.g. `EMP-9042`) |
| `input_features` | JSON | Complete set of 24+ evaluated attributes |
| `predicted_class` | String(10) | Predicted outcome (`Yes` or `No`) |
| `risk_probability` | Float | Estimated probability (0.0 to 1.0) |
| `risk_category` | String(50) | Risk level: `Low Risk`, `Medium Risk`, `High Risk` |
| `model_name` | String(100) | Algorithm utilized for inference |
| `created_at` | DateTime | UTC creation timestamp |

### Table 2: `model_metadata`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer (PK) | Model version ID |
| `model_name` | String(100) | Name of active best model |
| `algorithm` | String(100) | Architecture description |
| `training_date` | String(50) | Training timestamp |
| `evaluation_metrics`| JSON | Full dictionary of test metrics |
| `selected_threshold`| Float | Validation-tuned probability threshold |

---

## 10. REST API Endpoints

Interactive Swagger UI documentation is available at `http://127.0.0.1:8000/docs`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health status of backend, ML models, and SQLite |
| `POST` | `/api/auth/login` | HR analyst demo authentication |
| `GET` | `/api/dashboard/summary`| Top-level KPIs and department breakdowns |
| `GET` | `/api/analytics/overview`| Multi-dimensional aggregations with filter parameters |
| `GET` | `/api/analytics/department`| Department-level retention & attrition counts |
| `GET` | `/api/analytics/job-role`| Job role attrition rankings |
| `GET` | `/api/models/metrics` | Active model test metrics and top features |
| `GET` | `/api/models/comparison`| Side-by-side Baseline, Decision Tree, and Random Forest |
| `POST` | `/api/models/retrain` | Trigger live retraining on dataset |
| `POST` | `/api/predict` | Run ML inference and persist record to SQLite |
| `GET` | `/api/predictions` | Query historical prediction records (search/filter) |
| `GET` | `/api/predictions/{id}` | Retrieve individual prediction record with all inputs |
| `DELETE`| `/api/predictions/{id}` | Permanently delete a prediction record |

---

## 11. Installation & Prerequisites

### Prerequisites:
- **Python:** Python 3.11, 3.12, or 3.14 installed
- **Node.js:** Node.js v18+ (tested on v24.12) & npm

### Clone Repository & Navigate:
```powershell
git clone <repository_url>
cd "HR-Insight"
```

### Install Backend Dependencies:
```powershell
python -m pip install -r requirements.txt
```

### Install Frontend Dependencies:
```powershell
cd frontend
npm install
cd ..
```

---

## 12. How to Train the Models

To execute the training pipeline, split data, tune thresholds on validation, evaluate on unseen test data, and serialize models:
```powershell
python -m backend.ml.train
```
*Output will confirm trained pipelines saved in `saved_models/` (`best_model.joblib`, `decision_tree.joblib`, `random_forest.joblib`, `metadata.json`, and `metrics_summary.json`).*

---

## 13. How to Run the Backend

Start the FastAPI application on `http://127.0.0.1:8000`:
```powershell
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Open your browser at `http://127.0.0.1:8000/docs` to test interactive Swagger endpoints.*

---

## 14. How to Run the Frontend

Open a new PowerShell window, navigate to `frontend`, and launch the development server:
```powershell
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
*Open your browser at `http://127.0.0.1:5173/`.*

### Demo Credentials:
- **Admin:** `admin` / `hradmin123`
- **Analyst:** `analyst` / `analyst2026`

---

## 15. Automated Testing Instructions

Run the automated test suite covering unit tests, schema validation, ML predictions, and API integration:
```powershell
python -m pytest backend/tests -v
```
All 9 automated tests verify:
1. `test_health_check_api`: Backend health and model existence
2. `test_dashboard_summary_api`: Correct calculation of KPIs
3. `test_analytics_overview_api`: Dynamic filtering
4. `test_models_metrics_and_comparison_api`: Model comparison endpoints
5. `test_prediction_end_to_end_and_db_persistence`: End-to-end predict -> store -> query -> delete cycle
6. `test_prediction_invalid_input_validation`: Pydantic 422 error rejection
7. `test_dataset_loading`: Integrity of 1,470 records
8. `test_clean_features_drops_constant_columns`: ColumnTransformer integrity
9. `test_prediction_engine_valid_sample`: Prediction engine logic

---

## 16. Application Pages Walkthrough

1. **Login Portal (`/login`):** Demo access with role badges and one-click quick-fill buttons.
2. **Main Dashboard (`/`):** Summary metrics (1,470 workforce, 16.12% attrition), department bar charts, overtime breakdown, and analytical insights.
3. **Employee Analytics (`/analytics`):** Interactive multi-dimensional charts (department, job role, age group, income, tenure, satisfaction, overtime, business travel) with dynamic dropdown filters.
4. **Attrition Prediction (`/predict`):** Comprehensive 24-feature input form, algorithm selector, quick presets (High Risk, Low Risk, Balanced), probability meter, risk badges, factor diagnostics, and disclaimer banner.
5. **Model Performance (`/models`):** Side-by-side matrices comparing Baseline, Decision Tree, and Random Forest; confusion matrices; ROC curves; top feature weights; and live model retraining.
6. **Prediction History (`/history`):** Persistent audit log in SQLite with search, risk tier filtering, profile details inspection modal, and delete confirmations.
7. **About Project (`/about`):** Detailed DMBI project documentation, problem statement, data mining methodology, ethics, and future scope.

---

## 17. Screenshots Checklist

Saved in the `screenshots/` directory for project reports and viva demonstrations:
- `01_login_portal.png`
- `02_main_dashboard.png`
- `03_employee_analytics.png`
- `04_attrition_prediction_form.png`
- `05_prediction_result_high_risk.png`
- `06_model_performance_comparison.png`
- `07_prediction_history_audit.png`
- `08_swagger_api_docs.png`

---

## 18. Limitations

1. **Cross-Sectional Nature:** The dataset captures a point-in-time snapshot rather than longitudinal time-series sentiment over multi-year quarterly intervals.
2. **External Economic Factors:** Broader market conditions (e.g. tech industry hiring waves or general macroeconomic shifts) are not reflected in internal HR records.
3. **Static Thresholds:** While the decision threshold is tuned on validation, enterprise deployments should dynamically adapt thresholds based on organizational cost ratios between false negatives (missed flight risk) and false positives (unnecessary retention bonus).

---

## 19. Ethical Considerations & Fair AI

- **Assistive Support Only:** Predictions are estimates to identify retention risks and guide supportive mentorship, salary equity reviews, and workload balancing.
- **Prohibition of Adverse Actions:** The system must never be used to automate termination, penalize employees, or deny promotions.
- **Privacy Protection:** Personal employee names and arbitrary tracking IDs are omitted from predictive modeling.

---

## 20. Future Scope

- **SHAP / LIME Integration:** Incorporate individual-level waterfall Shapley plots to provide exact per-employee mathematical feature contributions.
- **Live HRIS Connectors:** Direct API connectors to enterprise HRIS platforms (Workday, BambooHR, SAP SuccessFactors).
- **Automated Retention Recommendations:** Prescriptive recommendation engine suggesting personalized retention packages based on identified risk drivers.

---

## Academic Submission Details
- **Project Name:** HR Insight – Employee Attrition Prediction & Analytics System
- **Domain:** Human Resource Analytics & Machine Learning
- **Course:** Data Mining & Business Intelligence (DMBI)
- **Year:** 2026
