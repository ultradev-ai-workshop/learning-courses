import threading
import time
import anthropic


class CircuitBreaker:
    """closed -> (failures >= threshold) -> open -> (after cooldown) -> half-open -> one probe."""

    def __init__(self, threshold=3, cooldown=30.0, clock=time.monotonic):
        self.threshold, self.cooldown, self.clock = threshold, cooldown, clock
        self.failures, self.opened_at = 0, None

    @property
    def state(self):
        if self.opened_at is None:
            return "closed"
        return "half-open" if self.clock() - self.opened_at >= self.cooldown else "open"

    def allow(self):
        return self.state != "open"

    def success(self):
        self.failures, self.opened_at = 0, None

    def failure(self):
        self.failures += 1
        if self.failures >= self.threshold or self.state == "half-open":
            self.opened_at = self.clock()


class Unavailable(Exception):
    pass


class ResilientClaude:
    def __init__(self, client, chain=("claude-sonnet-5-5", "claude-haiku-5-5"), max_in_flight=32, clock=time.monotonic):
        self.client, self.chain = client, list(chain)
        self.breakers = {m: CircuitBreaker(clock=clock) for m in self.chain}
        self.bulkhead = threading.BoundedSemaphore(max_in_flight)

    def create(self, **params):
        if not self.bulkhead.acquire(timeout=2):
            raise Unavailable("too many concurrent LLM calls")
        try:
            last = None
            for model in self.chain:
                if not self.breakers[model].allow():
                    continue
                try:
                    msg = self.client.messages.create(**{**params, "model": model})
                    self.breakers[model].success()
                    return msg                                    # msg.model says who answered
                except anthropic.APIStatusError as e:
                    if e.status_code < 500 and e.status_code != 429:
                        raise                                         # client errors: no fallback
                    self.breakers[model].failure()
                    last = e
                except anthropic.APIConnectionError as e:
                    self.breakers[model].failure()
                    last = e
            raise Unavailable("all models unavailable") from last   # the caller serves the non-LLM path
        finally:
            self.bulkhead.release()
