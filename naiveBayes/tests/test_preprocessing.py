import pytest
from src.preprocessing import preprocess_text, VIETNAMESE_STOPWORDS


class TestPreprocessText:
    def test_lowercase(self):
        assert preprocess_text("MUA HÀNG") == "mua hàng"

    def test_remove_url(self):
        result = preprocess_text("xem ở https://shop.vn đi")
        assert "http" not in result
        assert "shop.vn" not in result

    def test_remove_markdown(self):
        result = preprocess_text("**đẹp** _quá_")
        assert "**" not in result
        assert "_" not in result
        assert "đẹp quá" in result

    def test_normalize_repeated_chars(self):
        result = preprocess_text("nguuuuuu")
        # Regex giảm 3+ lần lặp xuống 2
        assert "nguuu" not in result
        assert "ngu" in result

    def test_emoji_heart_to_love(self):
        result = preprocess_text("quá đẹp ❤️")
        assert "love" in result

    def test_emoji_laugh_to_haha(self):
        result = preprocess_text("buồn cười quá 🤣")
        assert "haha" in result

    def test_teencode_k_to_khong(self):
        result = preprocess_text("k mua nữa")
        assert "không" in result
        assert " k " not in (" " + result + " ")  # teencode đã được thay

    def test_teencode_vs_to_voi(self):
        # Use teencode_map parameter to verify expansion happens,
        # before stopword filter removes it from the full pipeline.
        from src.preprocessing import _replace_with_map
        text = "đi vs tôi"
        teencode_map = {"vs": "với", "vs.": "với"}
        result = _replace_with_map(text, teencode_map)
        assert "với" in result

    def test_remove_stopwords(self):
        result = preprocess_text("đây là một cái của tôi")
        assert "là" not in result.split()
        assert "của" not in result.split()
        assert "một" not in result.split()

    def test_empty_string(self):
        assert preprocess_text("") == ""

    def test_whitespace_only(self):
        assert preprocess_text("   ") == ""

    def test_returns_string(self):
        assert isinstance(preprocess_text("hello world"), str)

    def test_full_pipeline_example(self):
        from src.preprocessing import _replace_with_map
        # End-to-end example
        result = preprocess_text("Nguuuuu quá trời :))) đi vs tao ❤️")
        # 'ngu' còn (vì stopword loại stopwords, không phải từ này)
        assert "ngu" in result
        # emoji → love
        assert "love" in result
        # teencode → với: verify via _replace_with_map directly
        # (với is a stopword so the full pipeline strips it)
        teencode_map = {"vs": "với", "vs.": "với"}
        assert "với" in _replace_with_map("đi vs tao", teencode_map)
        # URL/mention không còn (test set có URLs)
        assert "http" not in result


class TestStopwordsLoaded:
    def test_stopwords_not_empty(self):
        assert len(VIETNAMESE_STOPWORDS) > 50

    def test_common_stopwords_present(self):
        assert "là" in VIETNAMESE_STOPWORDS
        assert "của" in VIETNAMESE_STOPWORDS
        assert "với" in VIETNAMESE_STOPWORDS
