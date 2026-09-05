/**
 * Notifications state management for Admin
 */

export interface AdminNotification {
  id: string;
  type: string;
  title: string;
  contactName: string;
  companyName: string;
  projectTitle: string;
  serviceType: 'web_service' | 'mobile_service' | string;
  projectTier: string;
  status: string;
  createdAt: string | null;
  phone?: string;
  email?: string;
  alreadyConsulted?: boolean;
  url: string;
}

const STORAGE_KEY = 'admin_read_notification_ids';

class NotificationsStore {
  isOpen = $state(false);
  notifications = $state<AdminNotification[]>([]);
  readIds = $state<string[]>([]);
  isLoading = $state(false);

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.readIds = JSON.parse(stored);
      }
    } catch (e) {
      this.readIds = [];
    }
  }

  saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.readIds));
      } catch (e) {
        console.error('Failed to save read notification IDs to localStorage', e);
      }
    }
  }

  setInitialNotifications(initial: AdminNotification[]) {
    if (initial && initial.length > 0) {
      this.notifications = initial;
    }
  }

  get unreadCount(): number {
    return this.notifications.filter((n) => !this.readIds.includes(n.id)).length;
  }

  get unreadNotifications(): AdminNotification[] {
    return this.notifications.filter((n) => !this.readIds.includes(n.id));
  }

  isRead(id: string): boolean {
    return this.readIds.includes(id);
  }

  markAsRead(id: string) {
    if (!this.readIds.includes(id)) {
      this.readIds = [...this.readIds, id];
      this.saveToStorage();
    }
  }

  markAllAsRead() {
    const allIds = this.notifications.map((n) => n.id);
    const set = new Set([...this.readIds, ...allIds]);
    this.readIds = Array.from(set);
    this.saveToStorage();
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  async refresh() {
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        if (data.notifications) {
          this.notifications = data.notifications;
        }
      }
    } catch (e) {
      console.error('Failed to refresh notifications:', e);
    } finally {
      this.isLoading = false;
    }
  }
}

export const notificationStore = new NotificationsStore();
