import { Injectable, signal } from '@angular/core';

/**
 * Service to track the browser's online/offline status using Signals.
 */
@Injectable({ providedIn: 'root' })
export class NetworkService {
  private readonly onlineSignal = signal(navigator.onLine);

  /**
   * Read-only signal representing the current network status.
   */
  readonly isOnline = this.onlineSignal.asReadonly();

  constructor() {
    window.addEventListener('online', () => this.onlineSignal.set(true));
    window.addEventListener('offline', () => this.onlineSignal.set(false));
  }
}
