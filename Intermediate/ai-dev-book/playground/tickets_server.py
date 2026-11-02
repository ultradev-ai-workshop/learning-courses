"""acme-tickets MCP server: a read-only wrapper over the ticket system and runbooks."""
import re
from pathlib import Path
from mcp.server import MCPServer
from mcp.server.mcpserver.exceptions import ToolError
from llmkit import TICKETS

KEY = re.compile(r"^[A-Z]+-\d+$")
mcp = MCPServer("acme-tickets")


@mcp.tool()
def tickets_get(key: str) -> str:
    """Fetch one ticket by key (e.g. OPS-101): title, status, team and severity.
    Use when the user mentions a ticket key. Read-only."""
    if not KEY.match(key):
        raise ToolError("key must look like OPS-101")
    if key not in TICKETS:
        raise ToolError(f"ticket {key} not found")
    t = TICKETS[key]
    return f"{key} · {t['title']} · {t['status']} · {t['team']} · {t['severity']}"


@mcp.tool()
def tickets_search(query: str, status: str = "open") -> str:
    """Search tickets by words in the title. status is one of open, in_progress, closed, all.
    Returns one line per ticket: key, title, status. Use when no key is given."""
    if status not in {"open", "in_progress", "closed", "all"}:
        raise ToolError("status must be open, in_progress, closed or all")
    words = re.findall(r"[a-z0-9]+", query.lower())
    hits = [f"{k} · {t['title']} · {t['status']}" for k, t in TICKETS.items()
            if (status == "all" or t["status"] == status) and any(w in t["title"].lower() for w in words)]
    return "\n".join(hits) or "no results"


@mcp.resource("runbook://{name}")
def runbook(name: str) -> str:
    """A runbook from the docs folder, as Markdown."""
    if not re.fullmatch(r"[a-z0-9-]+", name):
        raise ValueError("invalid runbook name")
    return (Path("docs") / f"runbook-{name}.md").read_text(encoding="utf-8")


@mcp.prompt()
def triage(key: str) -> str:
    """Triage a ticket: severity, owner and next step."""
    return (f"Look up ticket {key} with tickets_get, decide whether its severity is right "
            "according to the incident severity policy, and suggest who should own it.")


if __name__ == "__main__":
    mcp.run(transport="stdio")          # or "streamable-http" for a shared server
