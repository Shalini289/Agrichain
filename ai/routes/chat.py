from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List

from ..services.llm_service import generate_response
from ..services.prediction import predict_price
from ..services.reasoning import generate_explanation

router = APIRouter()

# 📦 Request schema
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    history: List[dict] = Field(default_factory=list)


# 📦 Response schema
class ChatResponse(BaseModel):
    reply: str


class PredictionResponse(BaseModel):
    predicted_price: float
    explanation: str
    predictions: List[float]


# 🤖 Chat endpoint
@router.post("/", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        reply = generate_response(req.message, req.history)

        if not reply:
            raise ValueError("Empty response from AI")

        return {"reply": reply}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI processing failed: {str(e)}"
        )


@router.get("/predict", response_model=PredictionResponse)
def predict():
    predicted_price = predict_price()
    return {
        "predicted_price": predicted_price,
        "explanation": generate_explanation(predicted_price),
        "predictions": [round(predicted_price + offset, 2) for offset in (-2, -1, 0, 1, 2)],
    }
