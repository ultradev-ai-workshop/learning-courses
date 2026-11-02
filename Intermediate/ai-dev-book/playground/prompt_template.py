import re
from pathlib import Path

VAR = re.compile(r"\{\{(\w+)}}")


class PromptTemplate:
    def __init__(self, name: str, version: str, directory: Path = Path("prompts")):
        self.id = f"{name}@{version}"                     # log this with every response
        self.text = (directory / f"{name}.{version}.txt").read_text()

    def render(self, escape=True, **values) -> str:
        def sub(m):
            if m.group(1) not in values:
                raise KeyError(f"missing value for {{{{{m.group(1)}}}}}")
            v = str(values[m.group(1)])
            return v.replace("<", "&lt;").replace(">", "&gt;") if escape else v
        return VAR.sub(sub, self.text)
