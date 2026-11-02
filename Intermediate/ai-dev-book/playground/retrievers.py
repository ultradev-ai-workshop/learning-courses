import re
import numpy as np
from rank_bm25 import BM25Okapi
from llmkit import embed, load_docs
from chunker import chunk_markdown

TOKEN = re.compile(r"[a-z0-9][a-z0-9_.-]*")

def words(text):
    return TOKEN.findall(text.lower())


class Index:
    def __init__(self, chunks, with_context=True):
        self.chunks = chunks
        texts = [(c.path + "\n" if with_context else "") + c.text for c in chunks]
        self.bm25 = BM25Okapi([words(t) for t in texts])
        m = np.array([embed(t) for t in texts])
        self.vectors = m / np.linalg.norm(m, axis=1, keepdims=True)

    def keyword(self, q, k=10):
        scores = self.bm25.get_scores(words(q))
        return [self.chunks[i].id for i in np.argsort(-scores, kind="stable")[:k] if scores[i] > 0]

    def vector(self, q, k=10):
        scores = self.vectors @ np.array(embed(q))
        return [self.chunks[i].id for i in np.argsort(-scores, kind="stable")[:k]]

    def hybrid(self, q, k=10):
        return rrf([self.vector(q, 30), self.keyword(q, 30)])[:k]


def rrf(rankings, k=60):
    """Reciprocal rank fusion: each list adds 1 / (k + rank) to every id it contains."""
    scores = {}
    for ranking in rankings:
        for rank, item in enumerate(ranking, start=1):
            scores[item] = scores.get(item, 0.0) + 1.0 / (k + rank)
    return sorted(scores, key=lambda i: -scores[i])


def default_index(with_context=True):
    return Index([c for d in load_docs() for c in chunk_markdown(d)], with_context)
