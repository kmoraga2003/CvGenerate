import os
import uuid
from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.schemas.cv_schema import CvDataSchema, TailorRequestSchema, TailorResponseSchema
from app.services.docx_builder import build_ats_docx
from app.services.ai_tailorer import tailor_cv_to_job

load_dotenv()

app = FastAPI(
    title="ATS Resume Generator & AI Tailoring Microservice",
    description="Microservicio RESTful para generar CVs en formato DOCX optimizados estrictamente para ATS y adaptados con IA a descripciones de empleo",
    version="1.1.0"
)

# Permitir CORS para comunicación directa con el frontend o API de PHP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = os.getenv("OUTPUT_DIR", os.path.join(os.path.dirname(os.path.dirname(__file__)), "generated_docs"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ATS Resume Generator & AI Tailoring Microservice (FastAPI)",
        "version": "1.1.0"
    }

@app.post("/api/generate-docx")
def generate_docx_endpoint(cv: CvDataSchema):
    """
    Genera y descarga el archivo .docx aplicando estrictamente el estándar ATS:
    - 1 Columna, alineación a la izquierda
    - Viñetas sólidas nativas
    - Tipografía limpia Calibri
    """
    try:
        clean_name = cv.header.full_name.replace(" ", "_").strip() or "Candidato"
        doc_filename = f"CV_{clean_name}_{uuid.uuid4().hex[:6]}.docx"
        file_path = os.path.join(OUTPUT_DIR, doc_filename)

        build_ats_docx(cv, file_path)

        if not os.path.exists(file_path):
            raise HTTPException(status_code=500, detail="Error al generar el documento DOCX")

        return FileResponse(
            path=file_path,
            filename=f"CV_{clean_name}_ATS.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fallo en la generación DOCX: {str(e)}")

@app.post("/api/tailor-cv", response_model=TailorResponseSchema)
def tailor_cv_endpoint(payload: TailorRequestSchema):
    """
    Audita el CV contra la oferta de empleo y devuelve el análisis de coincidencia (Match ATS %)
    junto al CV optimizado bajo las Reglas de Oro y la Fórmula XYZ de Google.
    """
    try:
        if not payload.job_description.strip():
            raise HTTPException(status_code=400, detail="La descripción de la oferta de trabajo no puede estar vacía.")

        result = tailor_cv_to_job(
            cv=payload.cv_data,
            job_description=payload.job_description,
            api_key=payload.api_key,
            provider=payload.provider
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fallo en la adaptación con IA: {str(e)}")

@app.post("/api/tailor-and-generate-docx")
def tailor_and_generate_docx_endpoint(payload: TailorRequestSchema):
    """
    Adapta el CV a la oferta de trabajo con IA y genera directamente el archivo .docx descargable.
    """
    try:
        tailor_result = tailor_cv_to_job(
            cv=payload.cv_data,
            job_description=payload.job_description,
            api_key=payload.api_key,
            provider=payload.provider
        )

        clean_name = payload.cv_data.header.full_name.replace(" ", "_").strip() or "Candidato"
        doc_filename = f"CV_{clean_name}_Tailored_{uuid.uuid4().hex[:6]}.docx"
        file_path = os.path.join(OUTPUT_DIR, doc_filename)

        build_ats_docx(tailor_result.tailored_cv, file_path)

        return FileResponse(
            path=file_path,
            filename=f"CV_{clean_name}_Tailored_ATS.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fallo en el proceso integrado: {str(e)}")
