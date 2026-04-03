import { createContext } from "react";

export type ToastTone = "success" | "error" | "info";

export type ShowToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
};

export type ToastContextValue = {
  showToast: (input: ShowToastInput) => string;
  dismissToast: (toastId: string) => void;
};

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined
);
