import json
import os
import random
import time
import urllib.error
import urllib.request

RETRYABLE = {408, 409, 429, 500, 502, 503, 504, 529}      # 529 = overloaded


class ClaudeAPIError(Exception):
    def __init__(self, status, request_id, body):
        super().__init__(f"Claude API {status} (request-id {request_id}): {body}")
        self.status, self.request_id, self.body = status, request_id, body


class ClaudeHttp:
    def __init__(self, max_retries=3, timeout=120.0, base_url=None, api_key=None, sleep=time.sleep):
        self.base_url = base_url or os.environ.get("ANTHROPIC_BASE_URL", "https://api.anthropic.com")
        self.api_key = api_key if api_key is not None else os.environ["ANTHROPIC_API_KEY"]
        self.max_retries, self.timeout, self.sleep = max_retries, timeout, sleep

    def create(self, body: dict) -> dict:
        for attempt in range(self.max_retries + 1):
            req = urllib.request.Request(
                self.base_url + "/v1/messages", data=json.dumps(body).encode(), method="POST",
                headers={"x-api-key": self.api_key, "anthropic-version": "2023-06-01",
                         "content-type": "application/json"})
            try:
                with urllib.request.urlopen(req, timeout=self.timeout) as res:
                    return json.load(res)
            except urllib.error.HTTPError as e:              # the server answered with an error status
                retry = e.code in RETRYABLE and attempt < self.max_retries
                if not retry:
                    raise ClaudeAPIError(e.code, e.headers.get("request-id", "?"), e.read().decode()) from None
                self.sleep(backoff(attempt, e.headers.get("retry-after")))
            except urllib.error.URLError:                     # connection refused, DNS, timeout
                if attempt >= self.max_retries:
                    raise
                self.sleep(backoff(attempt, None))


def backoff(attempt, retry_after):
    """Honour retry-after when present; otherwise exponential backoff with full jitter."""
    if retry_after is not None:
        return float(retry_after)
    return random.uniform(0, min(30.0, 0.5 * 2 ** attempt))


def text(response: dict) -> str:
    return "".join(b["text"] for b in response["content"] if b["type"] == "text")
