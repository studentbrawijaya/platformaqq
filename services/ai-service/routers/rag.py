from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from schemas.models import ChatRequest

router = APIRouter()


@router.post("/chat")
def chat(payload: ChatRequest) -> StreamingResponse:
    def stream():
        yield f"data: TODO: {payload.message}\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")


@router.post("/ingest")
def ingest() -> dict:
    return {"indexed": 0, "failed": 0}
