def test_get_patient_reminders(client):
    response = client.get("/api/v1/patients/pat-101/reminders")
    assert response.status_code == 200
    rems = response.json()
    assert len(rems) >= 3


def test_create_and_complete_reminder(client):
    payload = {
        "patientId": "pat-101",
        "title": "Evening Tea & Warm Water",
        "type": "hydration",
        "time": "05:00 PM",
        "timeOfDay": "evening",
        "dosageOrInstruction": "1 cup herbal tea",
        "status": "pending",
        "scheduledForDate": "2026-08-24",
    }
    create_res = client.post("/api/v1/reminders", json=payload)
    assert create_res.status_code == 201
    rem_id = create_res.json()["id"]

    # Mark completed
    update_res = client.patch(f"/api/v1/reminders/{rem_id}/status?status=completed")
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "completed"
