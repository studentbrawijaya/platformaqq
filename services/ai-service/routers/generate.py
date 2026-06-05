from fastapi import APIRouter

from schemas.models import GenerateExplanationRequest, GenerateVariasiRequest

router = APIRouter()


@router.post("/generate-explanation")
def generate_explanation(payload: GenerateExplanationRequest) -> dict:
    return {
        "explanation": "TODO: implement",
        "key_concepts": [],
        "related_skills": [payload.skill_name],
    }


@router.post("/generate-variasi")
def generate_variasi(payload: GenerateVariasiRequest) -> dict:
    return {"questions": [], "count": payload.count}
