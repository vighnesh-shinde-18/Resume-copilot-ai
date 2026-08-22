from pydantic import ValidationError

from app.prompts.extraction import (
    build_extraction_prompt,
)

from app.schemas.extraction import (
    StructuredResume,
)

from app.services.gemini_service import (
    gemini_service,
)


class AIAnalysisError(Exception):
    """Raised when AI analysis fails."""


class AnalysisService:

    async def extract_resume(
        self,
        resume_text: str,
    ) -> StructuredResume:

        prompt = build_extraction_prompt(
            resume_text
        )

        try:
            response = (
                await gemini_service.generate_structured(
                    prompt=prompt,
                    response_schema=StructuredResume,
                )
            )

            if not response.text:
                raise AIAnalysisError(
                    "Gemini returned an empty response"
                )

            return StructuredResume.model_validate_json(
                response.text
            )

        except ValidationError as exc:
            raise AIAnalysisError(
                "Gemini returned invalid resume data"
            ) from exc

        except AIAnalysisError:
            raise

        except Exception as exc:
            raise AIAnalysisError(
                "Resume extraction failed"
            ) from exc


analysis_service = AnalysisService()