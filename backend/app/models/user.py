import enum
from sqlalchemy import Column, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class UserRole(str, enum.Enum):
    PATIENT = "PATIENT"
    CAREGIVER = "CAREGIVER"
    HEALTHCARE_WORKER = "HEALTHCARE_WORKER"
    ADMIN = "ADMIN"


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=True)
    phone = Column(String(32), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.PATIENT)
    full_name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)

    patient_profile = relationship("Patient", back_populates="user", uselist=False)
    caregiver_assignments = relationship("CaregiverPatient", back_populates="caregiver", foreign_keys="CaregiverPatient.caregiver_id")
    healthcare_assignments = relationship("HealthcarePatient", back_populates="healthcare_worker", foreign_keys="HealthcarePatient.healthcare_worker_id")
