from fastapi import FastAPI

from app.core.config import settings
from app.routers.resume import router as resume_router
from app.core.exceptions import (resume_parse_exception_handler)
from app.services.resume_parser import ( ResumeParseError)
from app.routers.analysis import (
    router as analysis_router,
)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version
)

app.add_exception_handler(ResumeParseError,resume_parse_exception_handler)

@app.get("/health")
async def health_check():
    return {
        "success":True,
        "service":"ai-service",
        "status":"healthy"
    }

app.include_router(resume_router)
app.include_router(
    analysis_router
)