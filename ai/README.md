# AgriChain AI Service

Run from the project root:

```powershell
python -m uvicorn ai.main:app --host 127.0.0.1 --port 8000 --reload
```

If your active Python does not have the server dependencies:

```powershell
python -m pip install -r ai\requirements.txt
```

The base AI service uses a deterministic fallback response and does not require
OpenAI, NumPy, scikit-learn, or joblib.

Optional OpenAI support:

```powershell
python -m pip install -r ai\requirements-openai.txt
```

Optional local ML model support:

```powershell
python -m pip install -r ai\requirements-ml.txt
```

Endpoints:

- `GET /health`
- `POST /chat/`
- `GET /chat/predict`
