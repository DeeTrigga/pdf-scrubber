import * as React from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastStyles: Record<ToastType, string> = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
};

const ToastIcon: React.FC<{ type: ToastType }> = ({ type }) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "error":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "warning":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  }
};

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-sm p-4 rounded-lg border shadow-lg transition-all transform translate-y-0 ${toastStyles[type]}`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <ToastIcon type={type} />
        <p className="flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};