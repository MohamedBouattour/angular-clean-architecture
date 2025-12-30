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
    >
      <mat-icon>{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `,
  styles: `
    button {
      color: inherit;
    }
  `,
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
    localStorage.setItem('theme', theme);
  }
}
