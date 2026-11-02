import re

ABSTAIN = re.compile(r"couldn't find|not in the docs|don't know|cannot help", re.I)


def abstained(answer: str) -> bool:
    return bool(ABSTAIN.search(answer))


def citations_valid(citations, sent_titles) -> bool:
    return all(c["doc"] in sent_titles for c in citations)


def no_secrets(answer: str) -> bool:
    return not re.search(r"sk-ant-[A-Za-z0-9_-]{10,}|BEGIN (RSA|OPENSSH) PRIVATE KEY", answer)


def retrieved_expected(sent_chunk_ids, expected_doc) -> bool:
    return any(i.split("#")[0] == expected_doc for i in sent_chunk_ids)
