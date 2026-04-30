import os

try:
    from groq import Groq
except ImportError:
    Groq = None

try:
    from .prediction import predict_price
    from .reasoning import generate_explanation
except ImportError:
    from services.prediction import predict_price
    from services.reasoning import generate_explanation

SYSTEM_PROMPT = """
You are an AI assistant for farmers using AgriChain.

Rules:
- Give a clear decision when useful.
- Always explain why.
- Use simple language.
- Use the provided prediction data.
- Be concise but helpful.
"""


def _fallback_response(message, predicted_price, explanation):
    lower_message = message.lower()
    action = "WAIT" if any(word in lower_message for word in ["wait", "hold", "sell"]) else "REVIEW"

    return (
        f"{action}: Current predicted price is Rs. {predicted_price}. "
        f"{explanation} Compare this with your mandi price, storage cost, and urgency before selling."
    )


def _get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")

    if not Groq or not api_key:
        return None

    return Groq(api_key=api_key)


def generate_response(message, history):
    predicted_price = predict_price()
    explanation = generate_explanation(predicted_price)
    client = _get_groq_client()

    if not client:
        return _fallback_response(message, predicted_price, explanation)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *history,
        {"role": "user", "content": message},
        {
            "role": "system",
            "content": f"Predicted Price: Rs. {predicted_price}. {explanation}",
        },
    ]

    response = client.chat.completions.create(
        model=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
        messages=messages,
    )

    return response.choices[0].message.content
