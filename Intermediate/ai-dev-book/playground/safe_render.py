import html
import re
from urllib.parse import urlparse

ALLOWED_LINK_HOSTS = {"docs.acme.internal", "platform.claude.com", "github.com"}
IMAGE = re.compile(r"!\[([^\]]*)\]\(([^)]*)\)")
LINK = re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)")


def safe_markdown(text):
    """Model output -> text safe to render: no images, no HTML, links only to allowed hosts."""
    text = html.escape(text)                                     # no raw HTML from the model
    text = IMAGE.sub(lambda m: f"[image removed: {m.group(1) or 'no alt text'}]", text)

    def link(m):
        host = urlparse(m.group(2)).hostname or ""
        return m.group(0) if host in ALLOWED_LINK_HOSTS else f"{m.group(1)} (link removed: {host})"
    return LINK.sub(link, text)
