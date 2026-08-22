from pydantic import BaseModel, Field

SYSTEM_INSTRUCTION = """
You are a resume information extraction engine.

Your job is to extract only information explicitly present
in the provided resume.

Rules:

1. Never invent information.
2. Never infer a skill that is not present.
3. Preserve the meaning of the original resume.
4. If information is missing, use null or an empty list.
5. Do not improve or rewrite the resume.
6. Do not evaluate the candidate.
7. Do not provide career advice.
8. Extract factual information only.
"""

class ContactInfo(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    location: str | None = None
    linkedin: str | None = None
    github: str | None = None


class ExperienceItem(BaseModel):
    company: str
    role: str
    location: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    responsibilities: list[str] = Field(
        default_factory=list
    )


class EducationItem(BaseModel):
    institution: str
    degree: str | None = None
    field_of_study: str | None = None
    start_date: str | None = None
    end_date: str | None = None


class ProjectItem(BaseModel):
    name: str
    description: str | None = None
    technologies: list[str] = Field(
        default_factory=list
    )


class StructuredResume(BaseModel):
    contact: ContactInfo

    summary: str | None = None

    skills: list[str] = Field(
        default_factory=list
    )

    experience: list[ExperienceItem] = Field(
        default_factory=list
    )

    education: list[EducationItem] = Field(
        default_factory=list
    )

    projects: list[ProjectItem] = Field(
        default_factory=list
    )

    certifications: list[str] = Field(
        default_factory=list
    )

def build_extraction_prompt(
    resume_text: str,
) -> str:

    return f"""
{SYSTEM_INSTRUCTION}

Extract the resume into the required structured schema.

RESUME:

---BEGIN RESUME---
{resume_text}
---END RESUME---
"""