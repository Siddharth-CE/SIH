import type { ISyncService, SyncResult } from '../interfaces';
import type { SyncEvent } from '../../types';
import { getDB } from '../../utils/db';

export class MockSyncService implements ISyncService {
  private onlineOverride: boolean | null = null;
  private listeners: ((online: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.notifyListeners());
      window.addEventListener('offline', () => this.notifyListeners());
    }
  }

  isOnline(): boolean {
    if (this.onlineOverride !== null) {
      return this.onlineOverride;
    }
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  setSimulatedNetworkStatus(online: boolean): void {
    this.onlineOverride = online;
    this.notifyListeners();
  }

  toggleSimulatedNetwork(): boolean {
    const nextState = !this.isOnline();
    this.setSimulatedNetworkStatus(nextState);
    return nextState;
  }

  subscribeToNetworkStatus(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback);
    callback(this.isOnline());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(): void {
    const status = this.isOnline();
    this.listeners.forEach((fn) => fn(status));
  }

  async queueEvent(event: Omit<SyncEvent, 'id' | 'timestamp' | 'status' | 'retryCount'>): Promise<void> {
    const db = await getDB();
    const syncItem: SyncEvent = {
      ...event,
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
    };
    await db.put('sync_queue', syncItem);

    // If online, trigger quick automatic background sync
    if (this.isOnline()) {
      setTimeout(() => this.sync(), 800);
    }
  }

  async sync(): Promise<SyncResult> {
    if (!this.isOnline()) {
      return {
        success: false,
        syncedEventsCount: 0,
        failedEventsCount: 0,
        lastSyncedTimestamp: new Date().toISOString(),
      };
    }

    const db = await getDB();
    const all = await db.getAll('sync_queue');
    const pending = all.filter((e) => e.status === 'pending' || e.status === 'failed');

    if (pending.length === 0) {
      return {
        success: true,
        syncedEventsCount: 0,
        failedEventsCount: 0,
        lastSyncedTimestamp: new Date().toISOString(),
      };
    }

    // Mark as syncing then resolve
    const tx = db.transaction('sync_queue', 'readwrite');
    for (const item of pending) {
      await tx.objectStore('sync_queue').put({
        ...item,
        status: 'synced',
      });
    }
    await tx.done;

    return {
      success: true,
      syncedEventsCount: pending.length,
      failedEventsCount: 0,
      lastSyncedTimestamp: new Date().toISOString(),
    };
  }

  async getPendingCount(): Promise<number> {
    const db = await getDB();
    const all = await db.getAll('sync_queue');
    return all.filter((e) => e.status === 'pending' || e.status === 'failed').length;
  }
}

export const mockSyncService = new MockSyncService();
