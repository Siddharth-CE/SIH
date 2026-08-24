from typing import Optional
from app.models.user import UserRole
from app.schemas.common import CamelModel


class LoginRequest(CamelModel):
    identifier: str  # Email or phone or username
    password: str


class TokenResponse(CamelModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    name: str
    patient_id: Optional[str] = None


class RefreshTokenRequest(CamelModel):
    refresh_token: str


class RegisterRequest(CamelModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str
    full_name: str
    role: UserRole = UserRole.PATIENT


class UserResponse(CamelModel):
    id: str
    email: Optional[str] = None
    phone: Optional[str] = None
    full_name: str
    role: UserRole
    is_active: bool
    patient_id: Optional[str] = None
