from triage import Triage


class InvalidLLMOutput(ValueError):
    pass


def check(t: Triage) -> Triage:
    if t.severity == "sev1" and not t.needs_human:
        t = t.model_copy(update={"needs_human": True})          # repair, don't fail
    if len(t.summary) > 200:
        raise InvalidLLMOutput(f"summary too long ({len(t.summary)} chars)")
    if t.severity in ("sev1", "sev2") and not t.services:
        raise InvalidLLMOutput("a sev1/sev2 ticket must name at least one service")
    return t
