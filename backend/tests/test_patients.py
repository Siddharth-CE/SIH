def test_list_patients(client):
    response = client.get("/api/v1/patients")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    assert any(p["id"] == "pat-101" for p in data)


def test_get_patient_by_id(client):
    response = client.get("/api/v1/patients/pat-101")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Asha Das"
    assert data["region"] == "assam"
    assert data["medicationAdherenceRate"] == 94


def test_update_patient_hydration(client):
    response = client.post("/api/v1/patients/pat-101/hydration?count=5")
    assert response.status_code == 200
    data = response.json()
    assert data["hydrationCurrentGlasses"] == 5
