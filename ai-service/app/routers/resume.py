from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.schemas.resume import ResumeParseRespose
from app.services.resume_parser import (
    ResumeParseError,
    parse_resume
)

router = APIRouter(
    prefix="/api/v1/resumes",
    tags=["Resumes"]
)

ALLOWED_EXTENTIONS = {".pdf",".docx"}

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

@router.post(
    "/parse",
    response_model=ResumeParseRespose,
    status_code=status.HTTP_200_OK,
)
async def parse_resume_endoint(
    file:UploadFile = File(...)
)-> ResumeParseRespose:
    extension = Path(file.filename or "").suffix.lower()

    if extension not in ALLOWED_EXTENTIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are supported"
        ) 

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type"
        )

    file_bytes = await file.read()

    try:
        return await parse_resume(
            file_bytes=file_bytes,
            filename=file.filename or "resume"
        )

    except ResumeParseError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc)
        ) from exc