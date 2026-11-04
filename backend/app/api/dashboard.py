"""
HR Insight - Dashboard Router
Provides high-level KPI cards, summary breakdowns, and recent metrics.
"""
from fastapi import APIRouter
from backend.app.services.analytics_service import get_analytics_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def get_dashboard_summary():
    """Retrieve top-level organizational KPIs, department breakdown, and key insights."""
    service = get_analytics_service()
    return service.get_dashboard_summary()
