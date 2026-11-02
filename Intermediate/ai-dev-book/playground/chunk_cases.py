CASES = [
    ("How do I promote the standby Postgres?", "runbook-db-failover#1"),
    ("pgctl status shows primary unreachable", "runbook-db-failover#1"),
    ("when should we fail over the orders database", "runbook-db-failover#0"),
    ("checkout is throwing 502s", "runbook-payments-outage#0"),
    ("switch to the backup payment provider", "runbook-payments-outage#1"),
    ("Are Kafka consumers allowed to see duplicates?", "adr-012-kafka#2"),
    ("internal sites don't load over the tunnel", "guide-vpn#1"),
    ("how fast must I acknowledge a page", "policy-oncall#0"),
    ("what counts as SEV2", "policy-incident-severity#0"),
    ("someone pasted an API key in Slack", "policy-secrets#1"),
    ("can I deploy on Friday afternoon?", "guide-deploy#2"),
    ("how long does a rollback take", "guide-deploy#1"),
    ("Idempotency-Key header", "api-orders#1"),
    ("what does a 409 from the orders API mean", "api-orders#2"),
    ("make bootstrap", "guide-dev-setup#1"),
]


def recall(search, k):
    return sum(expected in search(q, k) for q, expected in CASES) / len(CASES)
