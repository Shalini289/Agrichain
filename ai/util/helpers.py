import re


# 🔤 Normalize text
def normalize_text(text: str) -> str:
    return text.lower().strip()


# 🚫 Basic input sanitization
def clean_input(text: str) -> str:
    text = re.sub(r"[^\w\s]", "", text)
    return text


# 🧠 Detect intent (simple but useful)
def detect_intent(text: str) -> str:
    text = normalize_text(text)

    if "price" in text:
        return "price"
    elif "sell" in text:
        return "sell"
    elif "profit" in text:
        return "profit"
    else:
        return "general"


# 💰 Format currency
def format_price(value: float) -> str:
    return f"₹{round(value, 2)}"