from pydantic import BaseModel, Field
from typing import List, Optional

class HeaderSchema(BaseModel):
    full_name: str
    professional_title: str
    city: str
    country: str
    phone: str
    email: str
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None  # Opcional
    portfolio_url: Optional[str] = None
    summary: str

class SkillCategorySchema(BaseModel):
    name: str
    skills: str
    sort_order: Optional[int] = 0

class ExperienceSchema(BaseModel):
    job_title: str
    company: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = "Presente"
    is_current: Optional[bool] = False
    bullets: List[str] = Field(default_factory=list)
    sort_order: Optional[int] = 0

class ProjectSchema(BaseModel):
    name: str
    technologies: str
    description: str
    project_url: Optional[str] = None
    sort_order: Optional[int] = 0

class EducationSchema(BaseModel):
    degree: str
    institution: str
    graduation_year: str
    sort_order: Optional[int] = 0

class CvDataSchema(BaseModel):
    header: HeaderSchema
    skill_categories: List[SkillCategorySchema] = Field(default_factory=list)
    experiences: List[ExperienceSchema] = Field(default_factory=list)
    projects: List[ProjectSchema] = Field(default_factory=list)
    education: List[EducationSchema] = Field(default_factory=list)

class TailorRequestSchema(BaseModel):
    cv_data: CvDataSchema
    job_description: str
    api_key: Optional[str] = None
    provider: Optional[str] = "gemini"  # "gemini" o "openai"

class TailorAuditReport(BaseModel):
    initial_match_score: int
    optimized_match_score: int
    extracted_job_keywords: List[str]
    missing_keywords: List[str]
    tailored_summary: str
    audit_notes: List[str]

class TailorResponseSchema(BaseModel):
    status: str
    audit_report: TailorAuditReport
    tailored_cv: CvDataSchema
