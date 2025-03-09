
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  title?: string;
  description: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const DEFAULT_TITLES: Record<ToastType, string> = {
  success: "Success",
  error: "Error",
  info: "Information",
  warning: "Warning"
};

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
  warning: <AlertCircle className="h-5 w-5" />
};

export function showToast(type: ToastType, options: ToastOptions) {
  const { title = DEFAULT_TITLES[type], description, duration = 5000, action } = options;
  
  const toastOptions = {
    duration,
    icon: ICONS[type],
    ...(action ? {
      action: {
        label: action.label,
        onClick: action.onClick
      }
    } : {})
  };
  
  switch (type) {
    case "success":
      toast.success(title, {
        description,
        ...toastOptions
      });
      break;
    case "error":
      toast.error(title, {
        description,
        ...toastOptions
      });
      break;
    case "info":
      toast.info(title, {
        description,
        ...toastOptions
      });
      break;
    case "warning":
      toast.warning(title, {
        description,
        ...toastOptions
      });
      break;
  }
}

export const enhancedToast = {
  success: (options: Omit<ToastOptions, "type">) => showToast("success", options),
  error: (options: Omit<ToastOptions, "type">) => showToast("error", options),
  info: (options: Omit<ToastOptions, "type">) => showToast("info", options),
  warning: (options: Omit<ToastOptions, "type">) => showToast("warning", options),
};
