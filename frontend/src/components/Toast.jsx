import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-purple-500/30';
        let bgClass = 'bg-[#121218]/95';
        let textClass = 'text-purple-400';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-500/40';
          textClass = 'text-emerald-400';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-rose-500/40';
          textClass = 'text-rose-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500/40';
          textClass = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border ${borderClass} ${bgClass} shadow-2xl shadow-black/80 backdrop-blur-xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-2`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${textClass}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white tracking-tight">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-zinc-400 mt-0.5 break-words">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-500 hover:text-white transition-colors p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
