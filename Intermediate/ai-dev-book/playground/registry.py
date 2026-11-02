import inspect
import json
from pydantic import ValidationError, create_model


class ToolError(Exception):
    """An error the model should see (and can recover from)."""


class Registry:
    def __init__(self):
        self.tools = {}

    def tool(self, fn):
        """Register fn as a tool. Its docstring is the description, its type hints the schema."""
        params = inspect.signature(fn).parameters
        fields = {n: (p.annotation, ... if p.default is p.empty else p.default) for n, p in params.items()}
        model = create_model(fn.__name__ + "_input", **fields)
        schema = model.model_json_schema()
        schema.pop("title", None)
        self.tools[fn.__name__] = (fn, model, {
            "name": fn.__name__,
            "description": inspect.cleandoc(fn.__doc__ or ""),
            "input_schema": {**schema, "additionalProperties": False},
        })
        return fn

    def definitions(self):
        return [d for _, _, d in self.tools.values()]

    def run(self, name, raw_input) -> tuple[str, bool]:
        """Returns (content, is_error). Never raises: errors go back to the model."""
        if name not in self.tools:
            return f"unknown tool {name}", True
        fn, model, _ = self.tools[name]
        try:
            args = model.model_validate(raw_input)
            result = fn(**args.model_dump())
            return result if isinstance(result, str) else json.dumps(result), False
        except ValidationError as e:
            return f"invalid input: {e.errors()[0]['msg']} at {e.errors()[0]['loc']}", True
        except ToolError as e:
            return str(e), True
