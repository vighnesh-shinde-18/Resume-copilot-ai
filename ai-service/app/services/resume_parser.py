from pathlib import Path
from io import BytesIO
import pdfplumber 
from docx import Document

from app.core.config import settings
from app.schemas.resume import ResumeParseRespose
from app.utils.text import normalize_text, count_words

SUPPORTED_EXTENSIONS = {
    ".pdf":"pdf",
    ".docx":"docx"
}

class ResumeParseError(Exception):
    """Raised when a resume cannot be parsed"""

def extract_pdf_text(file_bytes:bytes)-> tuple[str,int]:
    try:
        page_text:list[str] = []
        with pdfplumber.open(BytesIO(file_bytes)) as pdf:
            page_count = len(pdf.pages)
            for page in pdf.pages:
                text = page.extract_text()

                if text:
                    page_text.append(text)

        return "\n\n".join(page_text), page_count
    except Exception as exc:
        raise ResumeParseError("Failed to parse PDF document") from exc

def extract_docx_text(file_bytes:bytes) -> tuple[str,None]:
    try:
        document = Document(BytesIO(file_bytes))
        paragraphs:list[str] = []
        for paragraph in document.paragraphs:
            text = paragraph.text.strip()
            
            if text: 
                paragraphs.append(text)

        
        return "\n".join(paragraphs),None
        
    except Exception as exc:
         
        raise ResumeParseError("Failed to parse DOCX document") from exc   

async def parse_resume(
        file_bytes:bytes,
        filename:str 
        ) -> ResumeParseRespose:
    if not file_bytes:
        raise ResumeParseError("Resume file is empty")

    if len(file_bytes) > settings.max_file_size:
        raise ResumeParseError("Resume file exceeds the maximum allowed size")

    extension = Path(filename).suffix.lower()
    file_type = SUPPORTED_EXTENSIONS.get(extension)

    if not file_type:
        raise ResumeParseError("Only PDF and DOCX files are supported")

    if file_type == "pdf":
        text, page_count = extract_pdf_text(file_bytes)
    else:
        text, page_count = extract_docx_text(file_bytes)

    text = normalize_text(text)

    if not text:
        raise ResumeParseError("No readable text could be extracted from the resume")

    if len(text) > settings.max_resume_characters:
        raise ResumeParseError("Extract resume text is too large")

    return ResumeParseRespose(
        success=True,
        file_type=file_type,
        file_name=filename,
        text=text,
        character_count=len(text),
        word_count=count_words(text),
        page_count=page_count        
    )
    
