"""
Microservicio de Generación de Currículums ATS
Construido con FastAPI y python-docx.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="ATS Resume Generator Microservice",
    description="Microservicio RESTful para generar CVs en formato DOCX/PDF optimizados estrictamente para ATS",
    version="1.0.0"
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ATS Resume Generator Microservice (FastAPI)",
        "version": "1.0.0"
    }
