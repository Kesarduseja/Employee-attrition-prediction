"""
HR Insight - Analytics Router
Provides interactive multi-dimensional dataset aggregations with filter support.
"""
from typing import Optional
from fastapi import APIRouter, Query
from app.services.analytics_service import get_analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview")
def get_analytics_overview(
    department: Optional[str] = Query(None, description="Filter by department"),
    job_role: Optional[str] = Query(None, description="Filter by job role"),
    gender: Optional[str] = Query(None, description="Filter by gender"),
    age_group: Optional[str] = Query(None, description="Filter by age group"),
    overtime: Optional[str] = Query(None, description="Filter by overtime status"),
    business_travel: Optional[str] = Query(None, description="Filter by business travel")
):
    """Retrieve full analytics breakdowns with optional multi-dimensional filtering."""
    service = get_analytics_service()
    return service.get_full_analytics(
        department=department,
        job_role=job_role,
        gender=gender,
        age_group=age_group,
        overtime=overtime,
        business_travel=business_travel
    )


@router.get("/department")
def get_department_analytics():
    """Retrieve department-level attrition metrics."""
    service = get_analytics_service()
    data = service.get_dashboard_summary()
    return {"departments": data["department_breakdown"]}


@router.get("/job-role")
def get_job_role_analytics():
    """Retrieve job-role attrition rankings."""
    service = get_analytics_service()
    full = service.get_full_analytics()
    return {"job_roles": full.get("by_job_role", [])}
