import React, { useEffect, useState } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import './NetworkStatusBanner.css';

export const NetworkStatusBanner: React.FC = () => {
  const { isOnline, hasNetworkError } = useNetworkStatus();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!isOnline || hasNetworkError) {
      setShowBanner(true);
    } else {
      const timer = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, hasNetworkError]);

  if (!showBanner) return null;

  return (
    <div className={`network-banner ${isOnline ? 'warning' : 'offline'}`}>
      <span className="network-icon">
        {isOnline ? '⚠️' : '📡'}
      </span>
      <span className="network-message">
        {isOnline 
          ? '网络连接不稳定，数据已保存到本地，网络恢复后将自动同步' 
          : '当前处于离线模式，数据已保存到本地'}
      </span>
    </div>
  );
};
