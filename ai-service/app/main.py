from fastapi import FastAPI

from app.core.config import settings
from app.routers.resume import router as resume_router

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version
)

@app.get("/health")
async def health_check():
    return {
        "success":True,
        "service":"ai-service",
        "status":"healthy"
    }

app.include_router(resume_router)