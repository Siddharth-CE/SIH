def test_sync_offline_batch_and_idempotency(client):
    event_id = "test-client-event-999"
    sync_payload = {
        "deviceId": "tablet-asha-01",
        "events": [
            {
                "id": event_id,
                "entityType": "reminder",
                "action": "create",
                "payload": {
                    "patient_id": "pat-101",
                    "title": "Offline Recorded Medication",
                    "type": "medication",
                    "time": "08:00 PM",
                    "status": "completed",
                },
                "timestamp": "2026-08-24T18:00:00Z",
            }
        ],
    }

    # 1. First sync batch
    res1 = client.post("/api/v1/sync", json=sync_payload)
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["success"] is True
    assert data1["syncedEventsCount"] == 1
    assert data1["duplicateEventsIgnored"] == 0

    # 2. Resend same batch (should be ignored safely via idempotency)
    res2 = client.post("/api/v1/sync", json=sync_payload)
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["success"] is True
    assert data2["syncedEventsCount"] == 0
    assert data2["duplicateEventsIgnored"] == 1
