from fastapi import FastAPI

from routers.generate import router as generate_router
from routers.rag import router as rag_router
from routers.health import router as health_router

app = FastAPI(title="EduPath AI Service")

app.include_router(generate_router, prefix="/api/ai", tags=["generate"])
app.include_router(rag_router, prefix="/api/ai", tags=["rag"])
app.include_router(health_router, tags=["health"])
