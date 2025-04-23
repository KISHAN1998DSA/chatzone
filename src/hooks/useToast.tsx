import React, { useState, useCallback } from 'react';
import {
  Toast,
  ToastAction,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../components/ui/toast';

type ToastProps = {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
};

export const useToast = () => {
  const [open, setOpen] = useState(false);
  const [toastProps, setToastProps] = useState<ToastProps>({});

  const toast = useCallback((props: ToastProps) => {
    setToastProps(props);
    setOpen(true);
  }, []);

  const ToastComponent = () => (
    <ToastProvider>
      <Toast open={open} onOpenChange={setOpen} duration={toastProps.duration || 5000}>
        {toastProps.title && <ToastTitle>{toastProps.title}</ToastTitle>}
        {toastProps.description && (
          <ToastDescription>{toastProps.description}</ToastDescription>
        )}
        {toastProps.action && (
          <ToastAction altText={toastProps.action.label} onClick={toastProps.action.onClick}>
            {toastProps.action.label}
          </ToastAction>
        )}
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );

  return { toast, ToastComponent };
}; 