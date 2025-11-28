import React, { createContext, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  return (
    <ToastContext.Provider value={{}}>
      <Toaster position="bottom-right" />
      {children}
    </ToastContext.Provider>
  );
}

// FIX: rename to match usage across the project
export function useToast() {
  return {
    push: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg)
  };
}
