// ============================================================
// useToast – Toast notification hook
// ============================================================
import { useState, useCallback, useRef } from 'react';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const toast = useCallback((message, { type = 'info', title, duration = 4000 } = {}) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, title }]);

    if (duration > 0) {
      timers.current[id] = setTimeout(() => dismiss(id), duration);
    }

    return id;
  }, [dismiss]);

  const success = useCallback((message, opts = {}) => toast(message, { type: 'success', ...opts }), [toast]);
  const error   = useCallback((message, opts = {}) => toast(message, { type: 'error',   ...opts }), [toast]);
  const warning = useCallback((message, opts = {}) => toast(message, { type: 'warning', ...opts }), [toast]);
  const info    = useCallback((message, opts = {}) => toast(message, { type: 'info',    ...opts }), [toast]);

  return { toasts, toast, success, error, warning, info, dismiss };
}
