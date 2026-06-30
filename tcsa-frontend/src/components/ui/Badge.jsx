import { getSentimentLabel } from '../../utils/formatters';
import { Zap, CheckCircle, MinusCircle, XCircle, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function Badge({ type, label, size = 'sm' }) {
  const config = getBadgeConfig(type, label);
  return (
    <span className={`badge badge-${config.cls}`} style={{ fontSize: size === 'xs' ? 10 : 11 }}>
      {config.icon && <config.icon size={size === 'xs' ? 10 : 12} />}
      {config.label}
    </span>
  );
}

function getBadgeConfig(type, customLabel) {
  switch (type) {
    case 'positive':
      return { cls: 'positive', label: customLabel || getSentimentLabel('positive'), icon: CheckCircle };
    case 'negative':
      return { cls: 'negative', label: customLabel || getSentimentLabel('negative'), icon: XCircle };
    case 'neutral':
      return { cls: 'neutral', label: customLabel || getSentimentLabel('neutral'), icon: MinusCircle };
    case 'toxic':
      return { cls: 'toxic', label: customLabel || '⚠ Độc hại', icon: ShieldAlert };
    case 'clean':
      return { cls: 'clean', label: customLabel || '✓ An toàn', icon: ShieldCheck };
    case 'warning':
      return { cls: 'warning', label: customLabel || 'Cảnh báo', icon: Zap };
    default:
      return { cls: 'neutral', label: customLabel || type, icon: null };
  }
}
