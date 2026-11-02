# ADR-007: Use PostgreSQL for the orders service

## Status
Accepted, March 2024.

## Context
The orders service needs transactions across orders, payments and the outbox table, and the team already runs PostgreSQL for two other services.

## Decision
We use PostgreSQL 16 with one primary and two streaming replicas. Read-only reports go to a replica. Schema changes ship as Flyway migrations.

## Consequences
We need a failover runbook and replication-lag alerts. We give up the horizontal write scaling a distributed database would offer; at 300 orders per second we are far from the limit.
