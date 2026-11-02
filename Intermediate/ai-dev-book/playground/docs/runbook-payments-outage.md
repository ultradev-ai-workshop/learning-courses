# Runbook: payments outage

## Symptoms
Checkout returns 502 or 503 errors, the payment success rate on the dashboard drops below 95%, or the payments on-call is paged by the "checkout-errors" alert.

## First five minutes
1. Declare an incident in #incidents and set the severity. A full checkout outage is SEV1.
2. Check the payment provider status page. If the provider is down, switch to the backup provider with the `payments.provider=backup` feature flag.
3. Check the last deploy of the payments service. If it shipped in the last hour, roll it back with `deployctl rollback payments`.

## Escalation
If the success rate is still below 95% after 15 minutes, page the platform on-call and the payments engineering manager.
