CONFIG = {
    "models": {"router": "claude-haiku-5-5", "answer": "claude-sonnet-5-5", "agent": "claude-sonnet-5-5"},
    "prices": {"claude-haiku-5-5": (0.10, 0.50), "claude-sonnet-5-5": (2.00, 10.00), "claude-opus-5-5": (4.00, 20.00)},
    "max_question_tokens": 500,
    "context_budget_tokens": 600,
    "min_vector_score": 0.3,
    "team_daily_tokens": 50_000,
    "agent_max_steps": 8,
}
ACL = {"policy-secrets": "security"}            # doc id -> group; everything else is readable by "all"
USERS = {"asha": {"team": "payments", "groups": {"all"}},
         "sam": {"team": "security", "groups": {"all", "security"}}}


def cost(model, input_tokens, output_tokens):
    pin, pout = CONFIG["prices"][model]
    return input_tokens * pin / 1e6 + output_tokens * pout / 1e6
