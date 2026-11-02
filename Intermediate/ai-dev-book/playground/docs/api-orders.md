# API reference: orders service

## GET /orders/{id}
Returns one order with its items and status. Status is one of `pending`, `paid`, `shipped`, `cancelled`.

## POST /orders
Creates an order. Requires an `Idempotency-Key` header; a repeated key returns the original order instead of creating a second one.

## Errors
404 when the order does not exist, 409 when the idempotency key was used with a different body, 429 when the client exceeds 100 requests per second.
