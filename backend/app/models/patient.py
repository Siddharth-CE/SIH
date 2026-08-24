from sqlalchemy import Column, String, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class Patient(Base, TimestampMixin):
    __tablename__ = "patients"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id"), unique=True, nullable=True)
    name = Column(String(255), nullable=False)
    preferred_name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(32), nullable=False)
    region = Column(String(64), nullable=False)  # 'assam', 'meghalaya', etc.
    primary_language = Column(String(16), nullable=False)  # 'en', 'as', 'bn', 'mni', 'kha'
    secondary_language = Column(String(16), nullable=True)
    stage = Column(String(32), nullable=False)  # 'early', 'mild', 'moderate'

    caregiver_id = Column(String(64), nullable=True)
    healthcare_worker_id = Column(String(64), nullable=True)

    emergency_contact = Column(JSON, nullable=False)  # {"name": "...", "relation": "...", "phone": "..."}
    accessibility_preferences = Column(JSON, nullable=True)

    daily_routine_goal = Column(Integer, default=4, nullable=False)
    hydration_goal_glasses = Column(Integer, default=6, nullable=False)
    hydration_current_glasses = Column(Integer, default=0, nullable=False)
    medication_adherence_rate = Column(Integer, default=90, nullable=False)
    overall_engagement = Column(String(32), default="high", nullable=False)
    status_summary = Column(String(500), nullable=True)
    current_streak_days = Column(Integer, default=0, nullable=False)

    user = relationship("User", back_populates="patient_profile")
    caregiver_links = relationship("CaregiverPatient", back_populates="patient")
    healthcare_links = relationship("HealthcarePatient", back_populates="patient")
    game_sessions = relationship("GameSession", back_populates="patient", cascade="all, delete-orphan")
    reminders = relationship("Reminder", back_populates="patient", cascade="all, delete-orphan")
    activities = relationship("DailyActivity", back_populates="patient", cascade="all, delete-orphan")
    mood_entries = relationship("MoodEntry", back_populates="patient", cascade="all, delete-orphan")
    memories = relationship("FamilyMemory", back_populates="patient", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="patient", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="patient", cascade="all, delete-orphan")
    hydration_logs = relationship("HydrationLog", back_populates="patient", cascade="all, delete-orphan")
    ai_insights = relationship("AIInsight", back_populates="patient", cascade="all, delete-orphan")
