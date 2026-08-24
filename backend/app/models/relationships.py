from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class CaregiverPatient(Base, TimestampMixin):
    __tablename__ = "caregiver_patient"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    caregiver_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False, index=True)
    relation_type = Column("relationship", String(64), nullable=False)  # 'Son', 'Daughter', 'Nurse', etc.
    permissions = Column(String(64), default="FULL", nullable=False)  # 'VIEW', 'EDIT', 'FULL'

    caregiver = relationship("User", foreign_keys=[caregiver_id], back_populates="caregiver_assignments")
    patient = relationship("Patient", foreign_keys=[patient_id], back_populates="caregiver_links")


class HealthcarePatient(Base, TimestampMixin):
    __tablename__ = "healthcare_patient"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    healthcare_worker_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False, index=True)
    access_level = Column(String(64), default="CLINICAL_VIEW", nullable=False)  # 'VIEW', 'EDIT', 'ANALYTICS'

    healthcare_worker = relationship("User", foreign_keys=[healthcare_worker_id], back_populates="healthcare_assignments")
    patient = relationship("Patient", foreign_keys=[patient_id], back_populates="healthcare_links")
