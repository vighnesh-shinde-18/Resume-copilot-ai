from fastapi import APIRouter, HTTPException

from app.schemas.extraction import (
    StructuredResume,
)

from app.services.analysis_service import (
    analysis_service,
    AIAnalysisError,
)


router = APIRouter(
    prefix="/api/v1/analysis",
    tags=["Analysis"],
)


@router.post(
    "/extract",
    response_model=StructuredResume,
)
async def extract_resume(
    resume_text: str,
) -> StructuredResume:

    try:
        return await analysis_service.extract_resume(
            resume_text
        )

    except AIAnalysisError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc