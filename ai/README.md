# AgriChain AI Service

Run from the project root:

```powershell
python -m uvicorn ai.main:app --host 127.0.0.1 --port 8000 --reload
```

If your active Python does not have the server dependencies:

```powershell
python -m pip install -r ai\requirements.txt
```

Render deployment note:

- Keep `runtime.txt` and `.python-version` as `3.12.8` / `python-3.12.8`.
- In Render Dashboard, set `PYTHON_VERSION=3.12.8` in the service environment if logs still show Python 3.14.
- Python 3.14 can force older `pydantic-core` releases to build from Rust source during deploy, which may fail on Render.
- `requirements.txt` allows Pydantic 2.12+, so the app can still install on newer Python versions with compatible wheels.
- If the Render service root is `ai`, Render reads files in `ai`; if the service root is the repo root, it reads files in the root.

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
