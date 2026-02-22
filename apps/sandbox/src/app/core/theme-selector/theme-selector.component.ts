import {
  Component,
  inject,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export type Theme = 'light' | 'dark';

@Component({
  selector: 'app-theme-selector',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <button
      mat-icon-button
      [matTooltip]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
      (click)="toggleTheme()"
      class="!text-white/80 hover:!text-white"
    >
      <mat-icon>{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelectorComponent {
  readonly isDark = signal(this.getInitialTheme() === 'dark');

  constructor() {
    effect(() => {
      this.applyTheme(this.isDark() ? 'dark' : 'light');
    });
  }

  toggleTheme(): void {
    this.isDark.update((dark) => !dark);
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }
}
