from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.chat import router as chat_router
from routes.health import router as health_router

app = FastAPI(
    title="AgriChain AI Service",
    description="AI + ML service for chatbot and predictions",
    version="1.0.0"
)

# 🌍 CORS (IMPORTANT for frontend + backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📌 Routes
app.include_router(health_router, prefix="")
app.include_router(chat_router, prefix="/chat")

# 🏠 Root endpoint
@app.get("/")
def root():
    return {
        "status": "AI Service Running",
        "endpoints": ["/chat", "/health"]
    }