from pydantic import BaseModel, Field

class ResumeParseRespose(BaseModel):
    success:bool = True
    file_type:str
    file_name:str
    text:str = Field(min_length=1)
    character_count:int
    word_count:int
    page_count:int | None = None