export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'loading';
  message: string;
  duration?: number;
}

export class ToastState {
  toasts = $state<Toast[]>([]);

  add(message: string, type: Toast['type'] = 'info', duration = 3000): string {
    const id = Math.random().toString(36).substring(2, 9);
    this.toasts.push({ id, type, message, duration });
    
    if (type !== 'loading' && duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  success(message: string, duration = 3000): string {
    return this.add(message, 'success', duration);
  }

  error(message: string, duration = 4000): string {
    return this.add(message, 'error', duration);
  }

  info(message: string, duration = 3000): string {
    return this.add(message, 'info', duration);
  }

  loading(message: string): string {
    return this.add(message, 'loading', 0);
  }

  update(id: string, updates: Partial<Omit<Toast, 'id'>>) {
    const idx = this.toasts.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.toasts[idx] = { ...this.toasts[idx], ...updates };
      if (updates.type !== 'loading' && (updates.duration ?? 3000) > 0) {
        setTimeout(() => {
          this.dismiss(id);
        }, updates.duration ?? 3000);
      }
    }
  }
}
