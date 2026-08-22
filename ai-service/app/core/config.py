from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Resume Copilot AI Service"
    app_version:str = "1.0.0"
    max_file_size:int = 5*1024*1024
    max_resume_characters:int = 50000

    gemini_api_key: str
    gemini_model: str = "gemini-2.5-flash"
    gemini_timeout: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
 
 