
import React from 'react';
import { Toaster } from "sonner";

export const ToastProvider: React.FC = () => {
  return <Toaster position="top-right" richColors />;
};
