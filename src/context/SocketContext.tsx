import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import socketService from '../services/socketService';
import { useAuthStore } from '../store/authStore';

interface SocketContextType {
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
});

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = React.useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect();
      socketService.on('connected', () => setIsConnected(true));
      socketService.on('disconnected', () => setIsConnected(false));
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};