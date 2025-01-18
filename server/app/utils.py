# app/utils.py

import re

def remove_markdown(text: str) -> str:
    # Removes triple backtick blocks (```...```) and possibly other formatting.
    # You can adapt the regex for your needs.
    cleaned = re.sub(r"```(?:.|\n)*?```", "", text)
    # Remove leftover backticks if any
    cleaned = cleaned.replace("```", "")
    # Strip out possible leading/trailing spaces
    return cleaned.strip()
