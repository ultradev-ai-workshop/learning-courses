from typing import Literal
from pydantic import BaseModel, Field


class IncidentNote(BaseModel):
    likely_cause: str = Field(description="One sentence, or 'unclear'")
    evidence: list[str] = Field(description="Each item quotes or cites a tool result")
    suggested_runbook: str = Field(description="Doc id from search_docs, or empty")
    next_checks: list[str] = Field(description="Concrete commands or dashboards")
    confidence: Literal["low", "medium", "high"]
