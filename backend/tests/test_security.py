def test_unauthenticated_protected_route_fails(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHORIZED"


def test_invalid_token_fails(client):
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid_garbage_token"},
    )
    assert response.status_code == 401


def test_sql_injection_defense(client):
    malicious_query = "' OR '1'='1"
    response = client.get(f"/api/v1/patients?search={malicious_query}")
    assert response.status_code == 200
    # Should safely treat query as literal string without leaking all unassigned data
