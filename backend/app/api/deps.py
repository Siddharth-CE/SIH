from typing import Optional, List
from fastapi import Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import decode_token
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.models.user import User, UserRole
from app.repositories.user_repo import UserRepository
from app.repositories.patient_repo import PatientRepository

security = HTTPBearer(auto_error=False)


def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    if not auth:
        raise UnauthorizedException("Authentication token required.")

    payload = decode_token(auth.credentials)
    if not payload or payload.get("type") != "access":
        raise UnauthorizedException("Invalid or expired access token.")

    user_id = payload.get("sub")
    user_repo = UserRepository(db)
    user = user_repo.get(user_id)
    if not user or not user.is_active:
        raise UnauthorizedException("User not found or inactive.")

    return user


def get_optional_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> Optional[User]:
    if not auth:
        return None
    try:
        payload = decode_token(auth.credentials)
        if not payload or payload.get("type") != "access":
            return None
        user_id = payload.get("sub")
        user_repo = UserRepository(db)
        return user_repo.get(user_id)
    except Exception:
        return None


def require_role(roles: List[UserRole]):
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles and current_user.role != UserRole.ADMIN:
            raise ForbiddenException(
                f"Requires one of the following roles: {[r.value for r in roles]}"
            )
        return current_user

    return role_checker
