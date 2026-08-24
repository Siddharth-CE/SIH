def test_list_games(client):
    response = client.get("/api/v1/games")
    assert response.status_code == 200
    games = response.json()
    assert len(games) == 6
    slugs = [g["slug"] for g in games]
    assert "memory" in slugs
    assert "recall" in slugs
    assert "pattern" in slugs


def test_save_game_session(client):
    session_payload = {
        "sessionId": "test-sess-001",
        "patientId": "pat-101",
        "gameId": "game-memory-match",
        "gameCategory": "memory",
        "difficulty": "gentle",
        "difficultyScore": 3,
        "score": 100,
        "maxPossibleScore": 100,
        "accuracy": 95,
        "attempts": 6,
        "successfulAttempts": 6,
        "averageResponseTimeMs": 2100,
        "timeSpentSeconds": 40,
        "feedbackGiven": "Splendid!",
    }
    response = client.post("/api/v1/games/sessions", json=session_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["patientId"] == "pat-101"
    assert data["accuracy"] == 95


def test_get_cognitive_metrics(client):
    response = client.get("/api/v1/patients/pat-101/metrics")
    assert response.status_code == 200
    metrics = response.json()
    assert len(metrics) == 6
    assert any(m["category"] == "memory" for m in metrics)
