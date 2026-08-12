import re

def normalize_text(text:str)->str:
    text = text.replace("\x00","")

    text = re.sub(r"[ \t]+", " ",text)

    text = re.sub(r"\n{3}", "\n\n", text)

    lines = [
        line.strip()
        for line in text.splitlines()
    ]

    return "\n".join(lines).strip()

def count_words(text:str)->int:
    return len(text.split())

