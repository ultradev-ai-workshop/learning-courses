# Runbook: database failover

## When to fail over
Fail over the orders Postgres cluster when the primary is unreachable for more than 2 minutes, or when replication lag on the primary exceeds 30 seconds and keeps growing.

## Steps
1. Confirm the primary is really down: `pgctl status orders` must show `primary: unreachable`.
2. Promote the standby with `pgctl promote orders-replica-1`. Promotion takes about 40 seconds.
3. Point the services at the new primary by updating the `orders-db` DNS record; the TTL is 30 seconds.
4. Open a ticket to rebuild the old primary as a new replica.

## After the failover
Writes made in the last seconds before the failure can be lost. Check the outbox table for gaps and replay missing events.
