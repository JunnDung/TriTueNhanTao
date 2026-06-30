// ============================================================
// Toxic Analyzer – Simulated AI Analysis
// ============================================================
import { toxicWords } from '../data/mockData';

const sentimentPositive = ['tuyệt', 'tốt', 'hay', 'thích', 'cảm ơn', 'hài lòng', 'xuất sắc', 'đỉnh', 'love', 'great'];
const sentimentNegative = ['xấu', 'tệ', 'ghét', 'không thích', 'thất vọng', 'buồn', 'tức', ...toxicWords];

/**
 * Simulate AI analysis of text content.
 * Returns: { toxicScore, sentiment, foundToxicWords, confidence, isProcessing }
 */
export function analyzeText(text) {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const lower = text.toLowerCase();

  // Find toxic words
  const foundToxicWords = toxicWords.filter(w => lower.includes(w));

  // Calculate toxic score
  let toxicScore = 0;
  if (foundToxicWords.length > 0) {
    toxicScore = Math.min(0.95, 0.3 + foundToxicWords.length * 0.2 + Math.random() * 0.15);
  } else {
    toxicScore = Math.random() * 0.12;
  }

  // Determine sentiment
  const positiveCount = sentimentPositive.filter(w => lower.includes(w)).length;
  const negativeCount = sentimentNegative.filter(w => lower.includes(w)).length;

  let sentiment;
  if (foundToxicWords.length >= 2 || toxicScore > 0.5) {
    sentiment = 'negative';
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
  } else if (positiveCount > negativeCount) {
    sentiment = 'positive';
  } else {
    sentiment = 'neutral';
  }

  // Confidence (slightly randomized for realism)
  const confidence = Math.min(0.99, toxicScore > 0.5
    ? 0.75 + Math.random() * 0.2
    : 0.6 + Math.random() * 0.25);

  return {
    toxicScore: parseFloat(toxicScore.toFixed(3)),
    sentiment,
    foundToxicWords,
    confidence: parseFloat(confidence.toFixed(3)),
    isToxic: toxicScore > 0.5,
  };
}

/**
 * Highlights toxic words in text by wrapping with <mark> spans.
 * Returns array of React-renderable segments.
 */
export function highlightToxicWords(text, foundWords) {
  if (!foundWords || foundWords.length === 0) return [{ text, toxic: false }];

  const segments = [];
  let remaining = text;
  let lastIndex = 0;

  const lowerText = text.toLowerCase();
  const positions = [];

  foundWords.forEach(word => {
    let idx = lowerText.indexOf(word);
    while (idx !== -1) {
      positions.push({ start: idx, end: idx + word.length, word });
      idx = lowerText.indexOf(word, idx + 1);
    }
  });

  positions.sort((a, b) => a.start - b.start);

  // Merge overlapping
  const merged = [];
  positions.forEach(pos => {
    if (merged.length === 0 || pos.start >= merged[merged.length - 1].end) {
      merged.push(pos);
    }
  });

  let cursor = 0;
  merged.forEach(({ start, end }) => {
    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), toxic: false });
    }
    segments.push({ text: text.slice(start, end), toxic: true });
    cursor = end;
  });

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), toxic: false });
  }

  return segments;
}

export function maskToxicContent(text, toxicWordsList) {
  if (!toxicWordsList || toxicWordsList.length === 0) return '*** *** ***';
  let masked = text;
  toxicWordsList.forEach(word => {
    const regex = new RegExp(word, 'gi');
    masked = masked.replace(regex, '*'.repeat(word.length));
  });
  return masked;
}
