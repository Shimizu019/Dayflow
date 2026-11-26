import { useEffect, useRef } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

export function Toast({ message, visible, onDismiss }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      timerRef.current = setTimeout(() => {
        onDismiss();
      }, 2200);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute top-14 left-1/2 -translate-x-1/2 z-50 opacity-0 transition-all duration-200 transform -translate-y-2">
      <div className="bg-ink-900/90 backdrop-blur-md text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap animate-in fade-in slide-in-from-bottom-4 duration-200">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span>{message}</span>
      </div>
    </div>
  );
}
