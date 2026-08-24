from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.auth_service import AuthService
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    RegisterRequest,
    UserResponse,
)
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse, summary="User login with JWT generation")
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.authenticate_user(login_data)


@router.post("/refresh", response_model=TokenResponse, summary="Refresh access token")
def refresh_token(req: RefreshTokenRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.refresh_token(req.refresh_token)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, summary="Register user")
def register(reg_data: RegisterRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.register_user(reg_data)


@router.get("/me", response_model=UserResponse, summary="Get current logged in profile")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    patient_id = current_user.patient_profile.id if current_user.patient_profile else None
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        phone=current_user.phone,
        full_name=current_user.full_name,
        role=current_user.role,
        is_active=current_user.is_active,
        patient_id=patient_id,
    )
