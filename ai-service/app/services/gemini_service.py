from google import genai

from app.core.config import settings


class GeminiService:
    def __init__(self) -> None:
        self.client = genai.Client(
            api_key=settings.gemini_api_key
        )

        self.model = settings.gemini_model

    async def generate_structured(
        self,
        prompt: str,
        response_schema: type,
    ):
        response = await self.client.aio.models.generate_content(
            model=self.model,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": response_schema,
            },
        )

        return response


gemini_service = GeminiService()