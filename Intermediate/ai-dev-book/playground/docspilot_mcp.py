from mcp.server import MCPServer
from mcp.server.mcpserver.exceptions import ToolError
from docspilot_app import DocsPilot, BudgetExceeded
from docspilot_config import USERS
from llmkit import ONCALL, TICKETS


def build_server(pilot: DocsPilot, user: str) -> MCPServer:
    mcp = MCPServer("docspilot")

    @mcp.tool()
    def docs_ask(question: str) -> str:
        """Ask DocsPilot an engineering question. Returns a cited answer, or says it isn't in the docs."""
        try:
            r = pilot.ask(user, question)
        except BudgetExceeded as e:
            raise ToolError(str(e))
        sources = "\n".join(f'[{c["doc"]}] "{c["quote"]}"' for c in r.citations)
        return r.answer + ("\n\nSources:\n" + sources if sources else "")

    @mcp.tool()
    def docs_search(query: str) -> str:
        """Search the docs the user may read. Returns section titles."""
        return "\n".join(pilot.by_id[i].path for i in pilot._search(query, USERS[user]["groups"], 5))

    @mcp.tool()
    def tickets_get(key: str) -> str:
        """Fetch one ticket by key (e.g. OPS-101). Read-only."""
        if key not in TICKETS:
            raise ToolError(f"ticket {key} not found")
        t = TICKETS[key]
        return f"{key} · {t['title']} · {t['status']} · {t['team']} · {t['severity']}"

    @mcp.tool()
    def oncall_get(team: str) -> str:
        """Who is on call right now for a team (payments, platform, data or web)."""
        if team not in ONCALL:
            raise ToolError("team must be payments, platform, data or web")
        return ONCALL[team]

    return mcp
