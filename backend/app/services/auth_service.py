from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.repositories.user_repo import UserRepository
from app.repositories.patient_repo import PatientRepository
from app.repositories.audit_repo import AuditRepository
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.exceptions import (
    UnauthorizedException,
    BadRequestException,
    ConflictException,
)
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    RegisterRequest,
    UserResponse,
)


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.patient_repo = PatientRepository(db)
        self.audit_repo = AuditRepository(db)

    def authenticate_user(self, login_data: LoginRequest) -> TokenResponse:
        user = self.user_repo.get_by_identifier(login_data.identifier)
        if not user or not verify_password(login_data.password, user.password_hash):
            raise UnauthorizedException("Invalid email/phone or password.")

        if not user.is_active:
            raise UnauthorizedException("Account has been deactivated.")

        user.last_login_at = datetime.now(timezone.utc)
        self.db.commit()

        # Audit log
        self.audit_repo.log(
            action="LOGIN_SUCCESS",
            resource_type="USER",
            resource_id=user.id,
            user_id=user.id,
        )

        patient = self.patient_repo.get_by_user_id(user.id)

        access_token = create_access_token(subject=user.id, role=user.role.value)
        refresh_token = create_refresh_token(subject=user.id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user_id=user.id,
            role=user.role.value.lower(),
            name=user.full_name,
            patient_id=patient.id if patient else None,
        )

    def refresh_token(self, refresh_token_str: str) -> TokenResponse:
        payload = decode_token(refresh_token_str)
        if not payload or payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid or expired refresh token.")

        user_id = payload.get("sub")
        user = self.user_repo.get(user_id)
        if not user or not user.is_active:
            raise UnauthorizedException("User not found or inactive.")

        patient = self.patient_repo.get_by_user_id(user.id)
        new_access = create_access_token(subject=user.id, role=user.role.value)
        new_refresh = create_refresh_token(subject=user.id)

        return TokenResponse(
            access_token=new_access,
            refresh_token=new_refresh,
            user_id=user.id,
            role=user.role.value.lower(),
            name=user.full_name,
            patient_id=patient.id if patient else None,
        )

    def register_user(self, reg_data: RegisterRequest) -> UserResponse:
        if reg_data.email and self.user_repo.get_by_email(reg_data.email):
            raise ConflictException("Email is already registered.")
        if reg_data.phone and self.user_repo.get_by_phone(reg_data.phone):
            raise ConflictException("Phone number is already registered.")

        new_user = User(
            email=reg_data.email,
            phone=reg_data.phone,
            password_hash=get_password_hash(reg_data.password),
            full_name=reg_data.full_name,
            role=reg_data.role,
            is_active=True,
        )
        created = self.user_repo.create(new_user)

        self.audit_repo.log(
            action="USER_REGISTER",
            resource_type="USER",
            resource_id=created.id,
            user_id=created.id,
        )

        return UserResponse(
            id=created.id,
            email=created.email,
            phone=created.phone,
            full_name=created.full_name,
            role=created.role,
            is_active=created.is_active,
        )
