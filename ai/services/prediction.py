import joblib
import numpy as np
import os

MODEL_PATH = os.path.join("models", "model.pkl")

# Load model once
try:
    model = joblib.load(MODEL_PATH)
except:
    model = None
    print("⚠️ Model not found. Using fallback.")


def predict_price():

    # Example features:
    # [current_price, demand, season]
    data = np.array([[30, 100, 1]])

    if model:
        prediction = model.predict(data)[0]
    else:
        # fallback logic
        prediction = data[0][0] + 5

    return round(float(prediction), 2)