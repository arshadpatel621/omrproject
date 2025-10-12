import { Toast, ToastType } from '@/components/ui/toast';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';

interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextType {
  showToast: (toast: Omit<ToastData, 'id'>) => void;
  hideToast: (id: string) => void;
  showSuccess: (message: string, options?: Partial<ToastData>) => void;
  showError: (message: string, options?: Partial<ToastData>) => void;
  showWarning: (message: string, options?: Partial<ToastData>) => void;
  showInfo: (message: string, options?: Partial<ToastData>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, options?: Partial<ToastData>) => {
    showToast({ message, type: 'success', ...options });
  }, [showToast]);

  const showError = useCallback((message: string, options?: Partial<ToastData>) => {
    showToast({ message, type: 'error', ...options });
  }, [showToast]);

  const showWarning = useCallback((message: string, options?: Partial<ToastData>) => {
    showToast({ message, type: 'warning', ...options });
  }, [showToast]);

  const showInfo = useCallback((message: string, options?: Partial<ToastData>) => {
    showToast({ message, type: 'info', ...options });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{
      showToast,
      hideToast,
      showSuccess,
      showError,
      showWarning,
      showInfo,
    }}>
      {children}
      <View style={styles.toastContainer} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            visible={true}
            onDismiss={() => hideToast(toast.id)}
            duration={toast.duration}
            action={toast.action}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
