import pytest
from src.preprocessing import preprocess_text


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
        assert "ngu" in preprocess_text("nguuuuuu")
        # Ký tự lặp phải bị giảm về 1-2 lần lặp
        result = preprocess_text("nguuuuuu")
        assert "nguuuuuu" not in result

    def test_emoji_to_text(self):
        # Sử dụng emoji map trong preprocessing — test ở level integration
        pass  # Sẽ test riêng khi có emoji_map.json ở Task 3

    def test_remove_stopwords(self):
        # 'là', 'thì', 'của' phải bị loại
        result = preprocess_text("đây là một cái của tôi")
        assert "là" not in result.split()
        assert "của" not in result.split()

    def test_empty_string(self):
        assert preprocess_text("") == ""

    def test_whitespace_only(self):
        assert preprocess_text("   ") == ""

    def test_returns_string(self):
        assert isinstance(preprocess_text("hello world"), str)
