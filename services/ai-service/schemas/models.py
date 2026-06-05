from pydantic import BaseModel


class GenerateExplanationRequest(BaseModel):
    question_text: str
    options: list[dict[str, str]] | None = None
    correct_answer: list[str]
    skill_name: str
    context: str | None = None


class GenerateVariasiRequest(BaseModel):
    reference_question: dict
    count: int = 3
    difficulty_adjustment: float = 0.0


class ChatRequest(BaseModel):
    message: str
    session_history: list[dict[str, str]] = []
    context: dict | None = None
