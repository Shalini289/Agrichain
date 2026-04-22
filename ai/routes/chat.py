from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List

from services.llm_service import generate_response

router = APIRouter()

# 📦 Request schema
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    history: List[dict] = []


# 📦 Response schema
class ChatResponse(BaseModel):
    reply: str


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