import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.chat import router as chat_router
from .routes.health import router as health_router

app = FastAPI(
    title="AgriChain AI Service",
    description="AI + ML service for chatbot and predictions",
    version="1.0.0",
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:5000",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="")
app.include_router(chat_router, prefix="/chat")


@app.get("/")
def root():
    return {
        "status": "AI Service Running",
        "endpoints": ["/chat", "/health"],
    }
