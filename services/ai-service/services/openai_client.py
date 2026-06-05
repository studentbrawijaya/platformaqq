import os
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)


class OpenAIClient:
    def __init__(self) -> None:
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o")

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=4),
        retry=retry_if_exception_type(Exception),
    )
    def generate_text(self, prompt: str, temperature: float = 0.5) -> str:
        _ = temperature
        return f"TODO: implement model response for: {prompt[:100]}"
