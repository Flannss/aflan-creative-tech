import { createContext, useContext } from 'react';

export interface ToastPayload {
  id: number;
  title: string;
  detail?: string;
}

export interface ToastContextValue {
  showToast: (title: string, detail?: string) => void;
}

export const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast(): ToastContextValue {
  return useContext(ToastContext);
}
