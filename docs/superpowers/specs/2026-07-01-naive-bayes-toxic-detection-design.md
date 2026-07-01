# Naive Bayes — Vietnamese Toxic Comment Detection (Design Spec)

**Date:** 2026-07-01
**Status:** Approved (awaiting implementation)
**Author:** (member phụ trách Naive Bayes)
**Project:** TCSA — Toxic Content & Sentiment Analysis Platform
**Course:** Trí tuệ nhân tạo (AIMA, 4th Edition, Pearson Education)

---

## 1. Background & Context

Bài tập lớn môn Trí tuệ nhân tạo: xây dựng hệ thống phát hiện bình luận độc hại tiếng Việt. Nhóm chia làm 2 phần:

- **Neural MLP** — đồng đội đã hoàn thành (artifact: `neuralMLP/model.pkl`).
- **Naive Bayes** — em phụ trách (spec này).

Tài liệu tham khảo chính: Russell & Norvig, *Artificial Intelligence: A Modern Approach* (4th Edition), chương probabilistic reasoning / learning.

### Dataset

| Split | Rows | Class 0 (clean) | Class 1 (hate) | Class 2 (offensive) |
|---|---|---|---|---|
| Train | 24,048 | 19,886 (82.7%) | 1,606 (6.7%) | 2,556 (10.6%) |
| Validation | 2,672 | 2,190 | 212 | 270 |
| Test | 6,680 | 5,548 | 444 | 688 |

Format: `free_text,label_id` — CSV trong `neuralMLP/dataraw/ViHSD_*.csv`. **Imbalance nặng** về lớp clean.

---

## 2. Goals & Non-Goals

### Goals
- Huấn luyện Multinomial Naive Bayes phân loại 3 lớp (clean/hate/offensive).
- Đạt **Macro F1 ≥ 0.65** trên test set.
- Trình bày lý thuyết AIMA trong notebook.
- Lưu model artifact (`.pkl`) dùng được cho inference.

### Non-Goals
- Không xây FastAPI/Flask server (scope chỉ là notebook + `.pkl`).
- Không thay thế MLP — 2 model song song, nhóm sẽ so sánh sau.
- Không xử lý streaming / real-time.

---

## 3. Architecture

### 3.1 Pipeline end-to-end

```
CSV → Preprocess (regex + emoji + teencode + underthesea + stopwords)
     → TfidfVectorizer (word 1-2 gram, max_features≈30k, sublinear_tf)
     → SMOTE (chỉ trên train set, lớp 1, 2 → 80% của lớp 0)
     → MultinomialNB(alpha=0.1, class_weight='balanced')
     → Evaluate: macro-F1, confusion matrix, classification report
     → Persist artifact → naiveBayes/model/naive_bayes_model.pkl
```

### 3.2 Cấu trúc thư mục

```
naiveBayes/                              # MỚI
├── notebooks/
│   └── train_naive_bayes.ipynb
├── src/
│   ├── preprocessing.py
│   ├── teencode.json
│   ├── emoji_map.json
│   └── vietnamese_stopwords.txt
├── model/
│   └── naive_bayes_model.pkl
├── reports/
│   ├── confusion_matrix.png
│   ├── classification_report.txt
│   └── metrics.json
├── README.md
└── requirements.txt
```

---

## 4. Lý thuyết AIMA (trình bày trong notebook)

Multinomial Naive Bayes theo AIMA (xem chương probabilistic reasoning):

```
P(c | x₁, x₂, ..., xₙ) ∝ P(c) · ∏ᵢ P(xᵢ | c)
```

Trong đó:
- `P(c)` — prior probability của class `c` (ước lượng từ tần suất trong train).
- `P(xᵢ | c)` — likelihood của feature `xᵢ` cho trước class `c`.
- **Naive assumption:** các feature `xᵢ` độc lập có điều kiện với class → cho phép phép nhân đơn giản.

Laplace smoothing:
```
P(xᵢ | c) = (count(xᵢ, c) + α) / (Σⱼ count(xⱼ, c) + α · |V|)
```

---

## 5. Preprocessing

`preprocess_text(text: str) -> str` — 7 bước tuần tự:

| # | Bước | Ví dụ |
|---|---|---|
| 1 | Lowercase + Unicode normalize | `MUA HÀNG` → `mua hàng` |
| 2 | Loại URL, email, mention | `https://shop.vn` → `` |
| 3 | Loại markdown/HTML | `**đẹp**` → `đẹp` |
| 4 | Chuẩn hóa ký tự lặp | `nguuuuuu` → `ngu` |
| 5 | Emoji → text | `❤️` → `love`, `😂` → `haha` |
| 6 | Teencode normalization | `k` → `không`, `vs` → `với` |
| 7 | Tokenize + loại stopwords | dùng `underthesea.word_tokenize` |

**Ví dụ đầu cuối:**
- Input: `"Nguuuuu quá trời :))) https://example.com ❤️"`
- Output: `"ngu quá trời haha love"`

`emoji_map.json` chứa ~50 emoji phổ biến, `teencode.json` chứa ~100 từ viết tắt.

---

## 6. Vectorization

`TfidfVectorizer`:

```python
TfidfVectorizer(
    ngram_range=(1, 2),
    max_features=30_000,
    min_df=2,
    max_df=0.95,
    sublinear_tf=True,
    analyzer='word',
    token_pattern=r'(?u)\b\w+\b',
)
```

Lý do: TF-IDF giảm trọng số từ phổ biến; bigram bắt cụm mang tính độc hại; `sublinear_tf` giảm thiên lệch câu dài/ngắn.

---

## 7. Resample (SMOTE)

**Chỉ áp dụng trên TRAIN set** (giữ val/test ở phân phối thật).

```python
target_count_1 = int(19886 * 0.80)   # ≈ 15,909
target_count_2 = int(19886 * 0.80)   # ≈ 15,909

SMOTE(sampling_strategy={
    0: 19886,
    1: target_count_1,
    2: target_count_2,
}, random_state=42, k_neighbors=5)
```

Sau SMOTE: ~51,704 samples train.

---

## 8. Training

```python
MultinomialNB(alpha=0.1)
sample_weights = compute_sample_weight(class_weight='balanced', y=y_train_resampled)
model.fit(X_train_resampled, y_train_resampled, sample_weight=sample_weights)
```

`alpha=0.1`: Laplace smoothing vừa phải (phù hợp dataset 24k+ samples). Mini-grid `[0.01, 0.05, 0.1, 0.5, 1.0]` trên val set để chốt alpha.

---

## 9. Evaluation

**Trên test set (không qua SMOTE):**

| Metric | Target |
|---|---|
| Macro F1 | ≥ 0.65 |
| F1 class 0 | ≥ 0.90 |
| F1 class 1 | ≥ 0.45 |
| F1 class 2 | ≥ 0.55 |

Output:
- `reports/classification_report.txt`
- `reports/confusion_matrix.png`
- `reports/metrics.json`

---

## 10. Persist Model

Lưu **1 file pickle** chứa vectorizer + model + metadata:

```python
artifact = {
    'vectorizer': tfidf_vectorizer,
    'model': mnb_model,
    'label_map': {0: 'clean', 1: 'hate', 2: 'offensive'},
    'preprocessing_config': {...},
    'training_date': '2026-07-01',
    'metrics': {...},
}
joblib.dump(artifact, 'naiveBayes/model/naive_bayes_model.pkl')
```

---

## 11. Risks & Mitigations

| # | Risk | Mitigation |
|---|---|---|
| 1 | `underthesea` cài chậm trên Windows | Fallback `pyvi` hoặc regex tokenize |
| 2 | SMOTE trên sparse matrix chậm | Dùng `imblearn`; nếu quá chậm bỏ SMOTE, chỉ dùng class_weight |
| 3 | Macro F1 < 0.65 | Tăng n-gram, tăng max_features, điều chỉnh SMOTE ratio |
| 4 | Data leakage | SMOTE chỉ trên train |
| 5 | Emoji/teencode map thiếu | Bắt đầu ~50 emoji + ~100 teencode, mở rộng nếu cần |
| 6 | Pickle version conflict | Ghi rõ version trong `requirements.txt` |

---

## 12. Dependencies

```
pandas==2.2.2
numpy==1.26.4
scikit-learn==1.5.1
imbalanced-learn==0.12.3
underthesea==6.8.4
joblib==1.4.2
matplotlib==3.9.0
seaborn==0.13.2
```