"""Vietnamese text preprocessing for toxic comment detection.

Pipeline gồm 7 bước: lowercase → URL/mention/markdown → repeated chars →
emoji → teencode → tokenize → stopwords.
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path
from typing import Optional

# Vietnamese stopwords tối thiểu — sẽ được mở rộng ở Task 3
VIETNAMESE_STOPWORDS: set[str] = {
    "là", "thì", "của", "và", "có", "được", "cho", "trong", "với", "một",
    "những", "các", "đã", "đang", "sẽ", "rằng", "thế", "như", "nên",
    "thì", "mà", "đó", "này", "kia", "ở", "trên", "dưới", "vào", "ra",
    "lên", "xuống", "đi", "lại", "rồi", "nữa", "thôi", "nhé", "ạ", "ơi",
    "à", "nhỉ", "ha", "hả", "vẫn", "còn", "vì", "do", "bị", "bởi",
}

_RE_URL = re.compile(r"https?://\S+|www\.\S+")
_RE_EMAIL = re.compile(r"\S+@\S+\.\S+")
_RE_MENTION = re.compile(r"@\w+")
_RE_MD = re.compile(r"[`*_~#>]+")
_RE_REPEAT = re.compile(r"(.)\1{2,}")
_RE_NONWORD = re.compile(r"[^\w\s\u00C0-\u024F\u1E00-\u1EFF]+", re.UNICODE)


def _load_json(path: Path) -> dict:
    """Load JSON file, return empty dict if not found."""
    if not path.exists():
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def _normalize_repeats(text: str) -> str:
    """Reduce 3+ repeated chars to 2 (e.g. 'nguuu' -> 'nguu')."""
    return _RE_REPEAT.sub(r"\1\1", text)


def _replace_with_map(text: str, mapping: dict[str, str]) -> str:
    """Replace emojis/teencode using char-level mapping."""
    out = text
    for k, v in mapping.items():
        out = out.replace(k, f" {v} ")
    return out


def preprocess_text(
    text: str,
    emoji_map: Optional[dict] = None,
    teencode_map: Optional[dict] = None,
    stopwords: Optional[set[str]] = None,
) -> str:
    """Apply 7-step preprocessing to Vietnamese text.

    Args:
        text: raw comment string.
        emoji_map: dict mapping emoji → text. Defaults to file-based load.
        teencode_map: dict mapping shorthand → full word. Defaults to file-based load.
        stopwords: set of stopwords to remove. Defaults to VIETNAMESE_STOPWORDS.

    Returns:
        Cleaned, space-joined string ready for tokenization.
    """
    if not text or not text.strip():
        return ""

    # 1. Lowercase + Unicode normalize
    text = unicodedata.normalize("NFC", text).lower().strip()

    if emoji_map is None:
        emoji_map = _load_json(Path(__file__).parent / "emoji_map.json")
    if teencode_map is None:
        teencode_map = _load_json(Path(__file__).parent / "teencode.json")
    if stopwords is None:
        stopwords = VIETNAMESE_STOPWORDS

    # 2. Loại URL, email, mention
    text = _RE_URL.sub(" ", text)
    text = _RE_EMAIL.sub(" ", text)
    text = _RE_MENTION.sub(" ", text)

    # 3. Loại markdown/HTML cơ bản
    text = _RE_MD.sub(" ", text)

    # 4. Chuẩn hóa ký tự lặp
    text = _normalize_repeats(text)

    # 5. Emoji → text
    text = _replace_with_map(text, emoji_map)

    # 6. Teencode → full word
    text = _replace_with_map(text, teencode_map)

    # 7. Loại bỏ ký tự đặc biệt còn sót, giữ lại chữ cái + số + khoảng trắng
    text = _RE_NONWORD.sub(" ", text)

    # Tách token và loại stopwords
    tokens = text.split()
    tokens = [t for t in tokens if t and t not in stopwords]

    return " ".join(tokens)
