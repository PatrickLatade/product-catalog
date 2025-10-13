import React from "react";

interface ToastProps {
  toast: {
    message: string;
    type: "success" | "error";
  } | null;
}

export function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  return (
    <div className="toast toast-top toast-end z-50">
      <div
        className={`alert ${
          toast.type === "success" ? "alert-success" : "alert-error"
        } shadow-lg animate-slide-in-right`}
      >
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
