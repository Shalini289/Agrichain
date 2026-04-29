import os

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

from .prediction import predict_price
from .reasoning import generate_explanation

MODEL_NAME = os.getenv("MODEL_NAME", "gpt-4o-mini")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

SYSTEM_PROMPT = """
You are an AI assistant for farmers using AgriChain.

Rules:
- Give a clear decision: SELL or WAIT.
- Explain why in simple language.
- Use the prediction data provided by the service.
- Be concise and practical.
"""


def _fallback_response(message, predicted_price, explanation):
    decision = "SELL" if predicted_price >= 35 else "WAIT"
    return (
        f"{decision}: Predicted market price is Rs. {predicted_price}. "
        f"{explanation} "
        f"Your question was: {message.strip()}"
    )


def generate_response(message, history=None):
    history = history or []
    predicted_price = predict_price()
    explanation = generate_explanation(predicted_price)

    if OpenAI is None or not OPENAI_API_KEY:
        return _fallback_response(message, predicted_price, explanation)

    client = OpenAI(api_key=OPENAI_API_KEY)
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *history,
        {"role": "user", "content": message},
        {
            "role": "system",
            "content": f"Predicted Price: Rs. {predicted_price}. {explanation}",
        },
    ]

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            temperature=0.4,
        )
        return response.choices[0].message.content
    except Exception:
        return _fallback_response(message, predicted_price, explanation)
