import numpy as np
from llmkit import embed


class VectorStore:
    """Exact cosine search over an in-memory matrix."""

    def __init__(self, embed_fn=embed):
        self.embed_fn, self.items, self.matrix = embed_fn, [], None

    def add(self, items, text_of=lambda x: x):
        vecs = np.array([self.embed_fn(text_of(it)) for it in items], dtype=np.float32)
        vecs /= np.linalg.norm(vecs, axis=1, keepdims=True) + 1e-12   # normalize: dot = cosine
        self.items += list(items)
        self.matrix = vecs if self.matrix is None else np.vstack([self.matrix, vecs])

    def search(self, query, k=3):
        q = np.array(self.embed_fn(query), dtype=np.float32)
        q /= np.linalg.norm(q) + 1e-12
        scores = self.matrix @ q                       # one dot product per row
        top = np.argsort(-scores, kind="stable")[:k]
        return [(self.items[i], float(scores[i])) for i in top]
