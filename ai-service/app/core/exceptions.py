from fastapi import Request
from fastapi.responses import JSONResponse

from app.services.resume_parser import ResumeParseError

async def resume_parse_exception_handler(
        request:Request,
        exc:ResumeParseError
):
    return JSONResponse(
        status_code=400,
        content={
            "success":False,
            "error":"DOCUMENT_PARSE_FAILED",
            "message": str(exc)
        }
    )