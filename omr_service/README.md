# OMR Microservice

This is a minimal FastAPI service that exposes a /process endpoint for OMR.
It currently returns 'N' (no answer) for all questions as a placeholder.

## Requirements
- Python 3.10 – 3.12
- Poetry (recommended) or pip

## Setup (Poetry)
```
poetry install
poetry run uvicorn main:app --reload --port 8000
```

## Setup (pip)
```
python -m venv .venv
.\.venv\Scripts\activate
pip install fastapi uvicorn[standard] numpy opencv-python-headless requests
uvicorn main:app --reload --port 8000
```

Test health:
```
curl http://localhost:8000/health
```
