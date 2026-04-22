import os
from openai import OpenAI

from services.prediction import predict_price
from services.reasoning import generate_explanation

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are an AI assistant for farmers using AgriChain.

Rules:
- Give clear decision (SELL / WAIT)
- Always explain WHY
- Use simple language
- Use real data provided
- Be concise but helpful
"""

def generate_response(message, history):

    msg = message.lower()

    # 🔥 Get prediction + reasoning
    predicted_price = predict_price()
    explanation = generate_explanation(predicted_price)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *history,
        {"role": "user", "content": msg},
        {
            "role": "system",
            "content": f"Predicted Price: ₹{predicted_price}. {explanation}"
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    return response.choices[0].message.content