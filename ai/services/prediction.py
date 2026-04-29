import os

try:
    import joblib
    import numpy as np
except ImportError:
    joblib = None
    np = None

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "model.pkl")

model = None
if joblib is not None:
    try:
        model = joblib.load(MODEL_PATH)
    except Exception:
        model = None


def predict_price():
    current_price = 30
    demand = 100
    season = 1

    if model is not None and np is not None:
        data = np.array([[current_price, demand, season]])
        prediction = model.predict(data)[0]
        return round(float(prediction), 2)

    return round(float(current_price + 5), 2)
