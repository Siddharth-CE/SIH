import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["ENVIRONMENT"] = "testing"

from app.main import app
from app.db.session import Base, get_db
from app.db.seed import seed_initial_data
from app.core.security import create_access_token

engine_test = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine_test)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    db = TestingSessionLocal()
    seed_initial_data(db)
    db.close()

    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def patient_token():
    return create_access_token(subject="usr-101", role="PATIENT")


@pytest.fixture
def caregiver_token():
    return create_access_token(subject="usr-201", role="CAREGIVER")


@pytest.fixture
def healthcare_token():
    return create_access_token(subject="usr-301", role="HEALTHCARE_WORKER")
