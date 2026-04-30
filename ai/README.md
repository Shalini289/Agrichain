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

- Keep `runtime.txt` as `python-3.12.8`.
- Python 3.14 can force `pydantic-core` to build from Rust source during deploy, which may fail on Render.
- If the Render service root is `ai`, Render reads `ai/runtime.txt`; if the service root is the repo root, it reads the root `runtime.txt`.

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
