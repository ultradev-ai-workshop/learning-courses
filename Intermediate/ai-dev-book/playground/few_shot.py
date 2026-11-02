EXAMPLES = [
    ("Since 09:10 UTC every call to /v2/orders returns 503 for all customers.",
     '{"category": "orders_api", "severity": "sev1"}'),
    ("Export is slow.", '{"category": "data_export", "severity": "needs_info"}'),
    ("The invoice PDF shows last month's logo.", '{"category": "billing", "severity": "sev3"}'),
]

def few_shot(examples):
    return "\n".join(
        f"<example>\n<ticket>{t}</ticket>\n<answer>{a}</answer>\n</example>" for t, a in examples)
