# Policy: secrets

## Rules
Secrets live in Vault, never in Git, tickets, chat or prompts. Services read them at startup through the Vault agent. API keys for external providers, including LLM providers, are rotated every 90 days.

## If a secret leaks
Rotate the secret first, then investigate. Report the leak in #security within one hour, even if you already rotated it.
