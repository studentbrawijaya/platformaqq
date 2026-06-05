import os
from qdrant_client import QdrantClient


class RagService:
    def __init__(self) -> None:
        self.client = QdrantClient(url=os.getenv("QDRANT_URL", "http://localhost:6333"))
        self.collection = os.getenv("QDRANT_COLLECTION", "materi")

    def search_context(self, query: str, top_k: int = 5) -> list[dict]:
        _ = query
        _ = top_k
        return []
