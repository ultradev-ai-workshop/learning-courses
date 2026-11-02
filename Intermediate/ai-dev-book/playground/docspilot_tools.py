from typing import Literal
from llmkit import ONCALL, TICKETS
from registry import Registry, ToolError

registry = Registry()


@registry.tool
def get_oncall(team: Literal["payments", "platform", "data", "web"]) -> dict:
    """Returns the engineer currently on call for one team. Use when the user asks who is
    on call, who to page, or who owns an alert right now. Not for past schedules."""
    return {"team": team, "primary": ONCALL[team]}


@registry.tool
def get_ticket(key: str) -> dict:
    """Looks up one ticket by its key, such as OPS-101. Returns title, status, team and severity.
    Use when the user mentions a ticket key."""
    if key not in TICKETS:
        raise ToolError(f"ticket {key} not found")
    return {"key": key, **TICKETS[key]}
