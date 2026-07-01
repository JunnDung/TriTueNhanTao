# Naive Bayes — Vietnamese Toxic Comment Detection

Phần Naive Bayes của bài tập lớn môn Trí tuệ nhân tạo (PTIT, dùng giáo trình AIMA 4th Edition).

## Cài đặt

```bash
cd naiveBayes
python -m venv .venv
.venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

## Chạy notebook

```bash
jupyter notebook notebooks/train_naive_bayes.ipynb
```

Kernel → Restart & Run All toàn bộ 12 cells.

## Cấu trúc

```
naiveBayes/
├── notebooks/        # train_naive_bayes.ipynb
├── src/              # preprocessing.py + emoji/teencode/stopwords
├── model/            # naive_bayes_model.pkl (sau khi train)
├── reports/          # classification_report.txt, confusion_matrix.png, metrics.json
├── tests/            # test_preprocessing.py
└── requirements.txt
```

## Lý thuyết (theo AIMA)

Multinomial Naive Bayes áp dụng giả định **naive conditional independence**:

```
P(c | x) ∝ P(c) · ∏ P(xᵢ | c)
```

Với Laplace smoothing:  `P(xᵢ | c) = (count(xᵢ,c) + α) / (Σ count + α·|V|)`

Xem chi tiết trong notebook Cell 2.

## Kết quả

| Metric | Value |
|---|---|
| Accuracy | 0.7758 |
| Macro F1 | 0.5667 |
| Weighted F1 | 0.7997 |
| F1 (clean) | 0.8775 |
| F1 (hate) | 0.3603 |
| F1 (offensive) | 0.4623 |

**Target: Macro F1 ≥ 0.65.** Kết quả đạt **0.5667** — thấp hơn target nhưng acceptable với rationale: Vietnamese text classification có class imbalance nặng (clean chiếm ~73%), hate speech vocabulary đa dạng và slang-heavy, và Naive Bayes là baseline model không có sequence awareness. MultinomialNB với TF-IDF + SMOTE + class weights là best effort trên constraints.

Chi tiết: `reports/metrics.json`

## Inference (sử dụng model)

```python
import joblib

artifact = joblib.load('naiveBayes/model/naive_bayes_model.pkl')
vectorizer = artifact['vectorizer']
model = artifact['model']
label_map = artifact['label_map']

def predict(text):
    from src.preprocessing import preprocess_text
    clean = preprocess_text(text)
    X = vectorizer.transform([clean])
    pred = model.predict(X)[0]
    return label_map[pred]

print(predict("Đồ ngu thật sự"))  # → 'hate' / 'offensive' / 'clean'
```

## Thành viên nhóm

- Neural MLP: (tên đồng đội)
- Naive Bayes: (tên của em)
