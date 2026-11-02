# AI for Developers: playground

The companion code for the *AI for Developers Study Book*.

```
git clone https://github.com/coderhop-learning/ai-book-playground.git
cd ai-book-playground
python3 -m venv .venv && source .venv/bin/activate
pip install anthropic openai pydantic numpy rank-bm25 "mcp>=2" opentelemetry-sdk
python llmkit.py serve      # then export the printed variables in another terminal
```

- `llmkit.py`: the book's offline toolkit (toy tokenizer, TinyLM, toy embeddings, the DocsPilot
  sample company, `FakeAnthropic`, and `mock_api()`, a local mock of the Messages API).
- `docs/`: DocsPilot's sample docs. `prompts/`, `evals/`: the prompt file and eval set.
- The other `.py` files are the modules the chapters build, exactly as shown in the book.
- `reference/`: Java versions of key classes, for reading.

Run `python llmkit.py serve` and export the printed variables to run the SDK examples without a key.
See playground-howto.html in the book for details.
