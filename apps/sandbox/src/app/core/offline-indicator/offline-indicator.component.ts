import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NetworkService } from '../../shared/util/network/network.service';

/**
 * Offline indicator component that appears when the application loses internet connection.
 */
@Component({
  selector: 'app-offline-indicator',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (!networkService.isOnline()) {
      <div
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-bounce"
      >
        <div
          class="flex items-center gap-3 px-6 py-3 bg-red-600 text-white rounded-full shadow-2xl border-2 border-white/20"
        >
          <mat-icon class="!w-5 !h-5 !text-[20px]">wifi_off</mat-icon>
          <span class="font-bold tracking-wide uppercase text-xs"
            >Offline Mode</span
          >
          <div class="w-2 h-2 rounded-full bg-white animate-pulse"></div>
        </div>
      </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineIndicatorComponent {
  protected readonly networkService = inject(NetworkService);
}
