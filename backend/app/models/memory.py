from sqlalchemy import Column, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class FamilyMemory(Base, TimestampMixin):
    __tablename__ = "family_memories"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    patient_id = Column(String(64), ForeignKey("patients.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    relationship_or_place = Column(String(255), nullable=False)
    category = Column(String(32), nullable=False)  # 'people', 'places', 'favorites', 'today'
    image_url = Column(String(500), nullable=True)
    audio_story_url = Column(String(500), nullable=True)
    date_or_era = Column(String(128), nullable=True)
    description = Column(String(1000), nullable=False)
    tags = Column(JSON, default=list, nullable=False)
    favorite = Column(Boolean, default=False, nullable=False)

    patient = relationship("Patient", back_populates="memories")
