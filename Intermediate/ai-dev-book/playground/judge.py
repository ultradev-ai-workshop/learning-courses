from pydantic import BaseModel, ConfigDict

JUDGE_MODEL = "claude-opus-5-5"
JUDGE_PROMPT = """You grade answers from an internal docs assistant.
<question>{q}</question>
<reference_answer>{ref}</reference_answer>
<retrieved_context>{ctx}</retrieved_context>
<answer>{answer}</answer>
Decide:
- correct: the answer agrees with the reference on every point that matters to an engineer acting on it.
- grounded: every factual claim in the answer is supported by the retrieved context.
Explain your reasoning briefly first, then give the booleans."""


class Verdict(BaseModel):
    model_config = ConfigDict(extra="forbid")
    reasoning: str
    correct: bool
    grounded: bool


def judge(client, q, ref, ctx, answer) -> Verdict:
    res = client.messages.create(
        model=JUDGE_MODEL, max_tokens=1000,
        messages=[{"role": "user", "content": JUDGE_PROMPT.format(q=q, ref=ref, ctx=ctx, answer=answer)}],
        output_config={"format": {"type": "json_schema", "schema": Verdict.model_json_schema()}})
    return Verdict.model_validate_json(res.content[0].text)
