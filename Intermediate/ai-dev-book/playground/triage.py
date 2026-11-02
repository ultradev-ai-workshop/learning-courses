from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

Category = Literal["billing", "auth", "orders_api", "data_export", "other"]
Severity = Literal["sev1", "sev2", "sev3", "needs_info"]
Service = Literal["orders-api", "billing-svc", "auth-gateway", "export-worker"]


class Triage(BaseModel):
    model_config = ConfigDict(extra="forbid")          # -> "additionalProperties": false
    category: Category
    severity: Severity
    summary: str = Field(description="One sentence, under 200 characters")
    services: list[Service] = Field(description="Affected services; empty if unknown")
    needs_human: bool
