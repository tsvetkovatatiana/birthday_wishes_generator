import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Birthday Wish Generator API"}

def test_generate_wish():
    payload = {
        "name": "Bob",
        "hobbies": ["coding", "gaming"],
        "personality": ["funny", "smart"],
        "specific_message": "Enjoy your special day!"
    }
    response = client.post("/generate_wish/", json=payload)
    assert response.status_code == 200
    assert "wish" in response.json()
    assert isinstance(response.json()["wish"], str)

def test_get_wish_not_found():
    response = client.get("/wishes/999")
    assert response.status_code == 404
    assert response.json() == {"detail": "Wish not found"}

def test_store_and_get_wish():
    store_payload = {"wish_text": "Another happy birthday!"}
    store_response = client.post("/store_wish/", json=store_payload)
    assert store_response.status_code == 200
    assert "wish" in store_response.json()
    wish_text = store_response.json()["wish"]

    # Assuming the wish_id counter starts at 1 and increments
    get_response = client.get("/wishes/1")
    assert get_response.status_code == 200
    assert get_response.json() == {"wish": wish_text}

def test_generate_wish_ollama_not_found():
    # Temporarily mock the subprocess.run to simulate Ollama not being found
    import subprocess
    original_run = subprocess.run
    def mock_run(*args, **kwargs):
        raise FileNotFoundError("Ollama not found")
    subprocess.run = mock_run

    payload = {"name": "Charlie"}
    response = client.post("/generate_wish/", json=payload)
    assert response.status_code == 500
    assert response.json() == {"detail": "Ollama command not found. Please ensure Ollama is installed and in your PATH."}

    # Restore the original subprocess.run
    subprocess.run = original_run
