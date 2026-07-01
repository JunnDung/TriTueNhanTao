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

# Vietnamese stopwords — mở rộng ở Task 3
VIETNAMESE_STOPWORDS: set[str] = {
    # đại từ
    "tôi", "bạn", "mình", "tao", "mày", "nó", "họ", "chúng", "ta", "chúng_ta",
    "chúng_tao", "chúng_mày", "anh", "chị", "em", "ông", "bà", "cô", "chú",
    # trợ động từ
    "là", "thì", "có", "được", "đã", "đang", "sẽ", "bị", "hãy", "cứ", "nên",
    # giới từ
    "của", "với", "trong", "ngoài", "trên", "dưới", "trước", "sau", "vào",
    "ra", "lên", "xuống", "từ", "đến", "về", "theo", "bằng",
    # liên từ
    "và", "hay", "hoặc", "nhưng", "mà", "vì", "do", "bởi", "nếu", "rằng",
    # mạo từ / chỉ từ
    "một", "những", "các", "này", "đó", "kia", "đây", "đấy", "ấy",
    # động từ phổ biến
    "đi", "lại", "rồi", "nữa", "thôi", "thêm", "cũng", "vẫn", "còn", "mới",
    "chỉ", "đều", "đâu", "đâu_đó", "chỉ_có", "cả", "cảm_ơn", "ơi", "à", "ạ",
    "nhé", "nhỉ", "ha", "hả", "vẫn",
    # số
    "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười",
}

_RE_URL = re.compile(r"https?://\S+|www\.\S+")
_RE_EMAIL = re.compile(r"\S+@\S+\.\S+")
_RE_MENTION = re.compile(r"@\w+")
_RE_MD = re.compile(r"[`*_~#>]+")
_RE_REPEAT = re.compile(r"(.)\1{2,}")
_RE_NONWORD = re.compile(
    # Keep: Unicode letters (incl. Vietnamese), digits, underscores, whitespace.
    # Remove: everything else — punctuation, emoji, symbols, combining diacritics.
    # Covers NFC Vietnamese (ă, â, đ, ê, ô, ơ, ư) and NFD combining marks
    # (U+0300–U+036F general diacritics, U+031B combining horn).
    r"[^\w\u00C0-\u024F\u1E00-\u1EFF\s\u0300-\u036F\u031B]",
    re.UNICODE,
)


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
    """Replace teencode using word-boundary-aware regex to prevent mid-word
    corruption (e.g. 'k' inside 'không' must not be replaced as a word).
    Emoji keys use simple string replacement since emoji are always isolated
    symbol tokens where \b boundaries are unreliable."""
    for k, v in mapping.items():
        # Emoji: simple string replace (emoji are never part of word characters,
        # so we can't use \b; we process them first and they only appear as tokens).
        # Teencode: use word boundaries to avoid replacing 'k' inside 'không'.
        if k.isascii():
            pattern = r"\b" + re.escape(k) + r"\b"
            text = re.sub(pattern, f" {v} ", text, flags=re.IGNORECASE)
        else:
            text = text.replace(k, f" {v} ")
    return text


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
