import React, { useEffect, useRef, useState } from "react";
import {
  ToastContext,
  type ShowToastInput,
  type ToastTone,
} from "./toast-context";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

const toneClasses: Record<ToastTone, string> = {
  success:
    "border-emerald-200/80 bg-white text-slate-800 shadow-[0_20px_45px_rgba(16,185,129,0.16)]",
  error:
    "border-rose-200/80 bg-white text-slate-800 shadow-[0_20px_45px_rgba(244,63,94,0.16)]",
  info:
    "border-sky-200/80 bg-white text-slate-800 shadow-[0_20px_45px_rgba(56,189,248,0.16)]",
};

const toneAccentClasses: Record<ToastTone, string> = {
  success: "bg-emerald-500",
  error: "bg-rose-500",
  info: "bg-sky-500",
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutMapRef = useRef<Record<string, number>>({});

  useEffect(() => {
    return () => {
      Object.values(timeoutMapRef.current).forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  const dismissToast = (toastId: string) => {
    const timeoutId = timeoutMapRef.current[toastId];

    if (typeof timeoutId === "number") {
      window.clearTimeout(timeoutId);
      delete timeoutMapRef.current[toastId];
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId)
    );
  };

  const showToast = ({
    title,
    description,
    tone = "info",
    duration = 3400,
  }: ShowToastInput) => {
    const toastId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const nextToast: ToastItem = {
      id: toastId,
      title,
      description,
      tone,
    };

    setToasts((currentToasts) => [...currentToasts.slice(-2), nextToast]);

    timeoutMapRef.current[toastId] = window.setTimeout(() => {
      dismissToast(toastId);
    }, duration);

    return toastId;
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(100%-2rem,380px)] flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`crm-toast pointer-events-auto relative overflow-hidden rounded-[26px] border px-5 py-4 backdrop-blur-xl ${toneClasses[toast.tone]}`}
            role="status"
            aria-live="polite"
          >
            <div
              className={`absolute inset-y-0 left-0 w-1.5 ${toneAccentClasses[toast.tone]}`}
            />
            <div className="pl-3 pr-8">
              <p className="text-sm font-bold tracking-[0.01em]">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Dismiss notification"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="m6 6 12 12" />
                <path d="M18 6 6 18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
