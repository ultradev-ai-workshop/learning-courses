from dataclasses import dataclass
from llmkit import count_tokens


@dataclass
class Chunk:
    id: str             # "runbook-db-failover#2"
    doc_id: str
    title: str          # the document title
    heading: str        # the section heading
    text: str

    @property
    def path(self):
        return f"{self.title} › {self.heading}"


def chunk_markdown(doc, max_tokens=200):
    """One chunk per '## ' section; long sections are split on blank lines."""
    chunks = []
    for section in doc.text.split("\n## ")[1:]:
        heading, _, body = section.partition("\n")
        parts, current = [], ""
        for para in body.strip().split("\n\n"):
            if current and count_tokens(current + para) > max_tokens:
                parts.append(current.strip())
                current = ""
            current += para + "\n\n"
        parts.append(current.strip())
        for p in parts:
            chunks.append(Chunk(f"{doc.id}#{len(chunks)}", doc.id, doc.title, heading.strip(), p))
    return chunks
