import React, { createContext, useContext, useState, useEffect } from 'react';
import { syncService } from '../services';

interface SyncContextType {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  toggleSimulatedNetwork: () => boolean;
  triggerManualSync: () => Promise<void>;
  lastSyncedAt: string | null;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(syncService.isOnline());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const refreshPendingCount = async () => {
    try {
      const count = await syncService.getPendingCount();
      setPendingCount(count);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const unsubscribe = syncService.subscribeToNetworkStatus((online) => {
      setIsOnline(online);
      if (online) {
        triggerManualSync();
      }
    });

    refreshPendingCount();
    const interval = setInterval(refreshPendingCount, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const toggleSimulatedNetwork = (): boolean => {
    const nextState = (syncService as unknown as { toggleSimulatedNetwork: () => boolean }).toggleSimulatedNetwork();
    setIsOnline(nextState);
    if (nextState) {
      triggerManualSync();
    }
    return nextState;
  };

  const triggerManualSync = async () => {
    if (!isOnline || isSyncing) return;
    setIsSyncing(true);
    try {
      const result = await syncService.sync();
      if (result.success) {
        setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
      await refreshPendingCount();
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        isSyncing,
        pendingCount,
        toggleSimulatedNetwork,
        triggerManualSync,
        lastSyncedAt,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = (): SyncContextType => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within SyncProvider');
  }
  return context;
};
