"""
HR Insight - Authentication Router
Provides simple local demo authentication for HR personnel.
"""
from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.schemas import LoginRequest, LoginResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Demo credentials for college demonstration
DEMO_USERS = {
    "admin": {
        "password": "hradmin123",
        "name": "HR Director (Admin)",
        "role": "Lead HR Analyst",
        "email": "hr.analytics@enterprise.org"
    },
    "analyst": {
        "password": "analyst2026",
        "name": "People Operations Specialist",
        "role": "HR Analyst",
        "email": "operations@enterprise.org"
    }
}


@router.post("/login", response_model=LoginResponse)
def login_for_access_token(credentials: LoginRequest):
    """
    Authenticate HR user with demo credentials.
    Demo user: username='admin', password='hradmin123'
    """
    user_info = DEMO_USERS.get(credentials.username.strip().lower())
    if not user_info or user_info["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password. (Demo: admin / hradmin123)",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {
        "access_token": f"demo-jwt-token-{credentials.username}",
        "token_type": "bearer",
        "user": {
            "username": credentials.username,
            "name": user_info["name"],
            "role": user_info["role"],
            "email": user_info["email"]
        }
    }
