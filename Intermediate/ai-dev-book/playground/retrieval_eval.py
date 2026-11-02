CASES = [
    ("How do I promote the standby Postgres?", "runbook-db-failover"),
    ("checkout is throwing 502s", "runbook-payments-outage"),
    ("Why did we choose PostgreSQL for orders?", "adr-007-postgres"),
    ("Are Kafka consumers allowed to see duplicates?", "adr-012-kafka"),
    ("what should I install on my new laptop", "guide-dev-setup"),
    ("internal sites don't load over the tunnel", "guide-vpn"),
    ("how fast must I acknowledge a page", "policy-oncall"),
    ("what counts as SEV2", "policy-incident-severity"),
    ("someone pasted an API key in Slack", "policy-secrets"),
    ("can I deploy on Friday afternoon?", "guide-deploy"),
    ("what does a 409 from the orders API mean", "api-orders"),
    ("how long does a rollback take", "guide-deploy"),
]


def recall_at_k(search, k, cases=CASES):
    """search(question, k) -> list of doc ids."""
    hits = [expected in search(q, k) for q, expected in cases]
    return sum(hits) / len(cases), [q for (q, _), h in zip(cases, hits) if not h]
