# ADR-012: Publish domain events through Kafka

## Status
Accepted, September 2025.

## Context
Five services poll the orders database for changes. Polling adds load and delays notifications by up to a minute.

## Decision
The orders service writes events to an outbox table in the same transaction as the order. A relay publishes them to the `orders.events` Kafka topic. Consumers must be idempotent, because the relay delivers each event at least once.

## Consequences
Events arrive in under a second. Teams must handle duplicates and keep their consumers backward compatible with old event versions.
