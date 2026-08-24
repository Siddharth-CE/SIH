import type { ISyncService, SyncResult } from '../interfaces';
import type { SyncEvent } from '../../types';
import { apiClient } from './apiClient';

const SYNC_QUEUE_KEY = 'ner_sync_queue';

export class ApiSyncService implements ISyncService {
  private online: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: ((online: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
    }
  }

  private handleNetworkChange(online: boolean) {
    this.online = online;
    this.listeners.forEach((cb) => cb(online));
    if (online) {
      this.sync().catch(console.error);
    }
  }

  async queueEvent(
    event: Omit<SyncEvent, 'id' | 'timestamp' | 'status' | 'retryCount'>
  ): Promise<void> {
    const queue = this.getQueue();
    const newEvent: SyncEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
      ...event,
    };
    queue.push(newEvent);
    this.saveQueue(queue);

    if (this.isOnline()) {
      this.sync().catch(console.error);
    }
  }

  async sync(): Promise<SyncResult> {
    const queue = this.getQueue().filter((e) => e.status === 'pending');
    if (queue.length === 0) {
      return {
        success: true,
        syncedEventsCount: 0,
        failedEventsCount: 0,
        lastSyncedTimestamp: new Date().toISOString(),
      };
    }

    try {
      const response = await apiClient.post<SyncResult>('/sync', {
        deviceId: 'web-client-01',
        events: queue.map((e) => ({
          id: e.id,
          entityType: e.entityType,
          action: e.action,
          payload: e.payload,
          timestamp: e.timestamp,
        })),
      });

      // Clear successfully synced events
      this.saveQueue([]);
      return response;
    } catch {
      return {
        success: false,
        syncedEventsCount: 0,
        failedEventsCount: queue.length,
        lastSyncedTimestamp: new Date().toISOString(),
      };
    }
  }

  async getPendingCount(): Promise<number> {
    return this.getQueue().filter((e) => e.status === 'pending').length;
  }

  isOnline(): boolean {
    return this.online;
  }

  subscribeToNetworkStatus(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private getQueue(): SyncEvent[] {
    try {
      const raw = localStorage.getItem(SYNC_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: SyncEvent[]) {
    try {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('Failed to save sync queue to localStorage', e);
    }
  }
}

export const apiSyncService = new ApiSyncService();
