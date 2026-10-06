import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-16 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-lg bg-[#16181D] border border-neutral-800 shadow-2xl text-[#F5F5F0] transition-all duration-150"
          role="status"
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{toast.title}</p>
            {toast.description && (
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                {toast.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label={`Dismiss notification ${toast.title}`}
            className="text-neutral-500 hover:text-neutral-200 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
