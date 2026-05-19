import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  hasNetworkError: boolean;
  lastErrorTime: number | null;
}

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    hasNetworkError: false,
    lastErrorTime: null
  });

  useEffect(() => {
    const handleOnline = () => {
      console.log('网络已恢复');
      setStatus(prev => ({ ...prev, isOnline: true, hasNetworkError: false }));
    };

    const handleOffline = () => {
      console.log('网络已断开');
      setStatus(prev => ({ ...prev, isOnline: false, hasNetworkError: true }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const reportNetworkError = useCallback(() => {
    setStatus(prev => ({
      ...prev,
      hasNetworkError: true,
      lastErrorTime: Date.now()
    }));
  }, []);

  const clearNetworkError = useCallback(() => {
    setStatus(prev => ({ ...prev, hasNetworkError: false }));
  }, []);

  return { ...status, reportNetworkError, clearNetworkError };
}
