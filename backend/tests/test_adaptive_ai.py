def test_adaptive_difficulty_step_up(client):
    req = {
        "gameCategory": "memory",
        "currentDifficulty": "gentle",
        "currentDifficultyScore": 2,
        "accuracy": 95,
        "averageResponseTimeMs": 2100,
        "consecutiveSuccesses": 2,
        "consecutiveFailures": 0,
        "patientAge": 72,
    }
    res = client.post("/api/v1/ai/evaluate-difficulty", json=req)
    assert res.status_code == 200
    data = res.json()
    assert data["nextDifficultyScore"] == 3
    assert data["delta"] == "increased"


def test_voice_assistant_response(client):
    req = {
        "userVoiceText": "What medicine do I need to take?",
        "patientName": "Asha",
        "region": "Assam",
    }
    res = client.post("/api/v1/ai/voice-assist", json=req)
    assert res.status_code == 200
    data = res.json()
    assert "Telmisartan" in data["responseText"]
