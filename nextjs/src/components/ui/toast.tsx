"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle, Rocket } from 'lucide-react';

type ToastType = 'info' | 'success' | 'warning' | 'error' | 'coming-soon';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showComingSoon: (feature?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const toastIcons = {
  'info': Info,
  'success': CheckCircle,
  'warning': AlertTriangle,
  'error': AlertCircle,
  'coming-soon': Rocket,
};

const toastStyles = {
  'info': 'bg-slate-500/20 border-slate-500/30 text-slate-300',
  'success': 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
  'warning': 'bg-amber-500/20 border-amber-500/30 text-amber-300',
  'error': 'bg-red-500/20 border-red-500/30 text-red-300',
  'coming-soon': 'bg-violet-500/20 border-violet-500/30 text-violet-300',
};

const iconStyles = {
  'info': 'text-slate-400',
  'success': 'text-emerald-400',
  'warning': 'text-amber-400',
  'error': 'text-red-400',
  'coming-soon': 'text-violet-400',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 4000);
  }, []);

  const showComingSoon = useCallback((feature?: string) => {
    showToast({
      type: 'coming-soon',
      title: 'Coming Soon! 🚀',
      message: feature ? `${feature} is currently under development.` : 'This feature is under development.',
      duration: 3000,
    });
  }, [showToast]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showComingSoon }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const Icon = toastIcons[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm shadow-xl ${toastStyles[toast.type]}`}
              >
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconStyles[toast.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white">{toast.title}</p>
                  {toast.message && (
                    <p className="text-sm mt-0.5 opacity-80">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
