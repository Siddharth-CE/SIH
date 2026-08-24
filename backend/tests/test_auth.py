def test_login_success(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"identifier": "asha.das@nercare.in", "password": "patient123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "accessToken" in data
    assert "refreshToken" in data
    assert data["role"] == "patient"
    assert data["patientId"] == "pat-101"


def test_login_invalid_password(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"identifier": "asha.das@nercare.in", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHORIZED"


def test_get_current_user(client, patient_token):
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {patient_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "asha.das@nercare.in"
    assert data["role"] == "PATIENT"
