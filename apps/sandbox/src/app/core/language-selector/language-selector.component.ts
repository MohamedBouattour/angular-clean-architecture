import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '../translate/translate.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  template: `
    <button mat-button [matMenuTriggerFor]="menu" class="lang-button">
      <mat-icon>translate</mat-icon>
      <span class="lang-label">{{ currentLangLabel() }}</span>
      <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
    </button>

    <mat-menu #menu="matMenu" xPosition="before">
      @for (lang of languages; track lang.code) {
      <button
        mat-menu-item
        (click)="changeLang(lang.code)"
        [class.active-lang]="translate.currentLang() === lang.code"
      >
        <mat-icon *ngIf="translate.currentLang() === lang.code">check</mat-icon>
        <span>{{ lang.label }}</span>
      </button>
      }
    </mat-menu>
  `,
  styles: [
    `
      .lang-button {
        display: flex;
        align-items: center;
        padding: 0 12px;
        height: 40px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        transition: background 0.3s ease;
      }

      .lang-button:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .lang-label {
        margin: 0 4px;
        font-weight: 500;
        text-transform: uppercase;
        font-size: 0.85rem;
      }

      .dropdown-icon {
        margin: 0;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }

      .active-lang {
        color: var(--primary-color, #3f51b5);
        font-weight: bold;
      }
    `,
  ],
})
export class LanguageSelectorComponent {
  translate = inject(TranslateService);

  languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
  ];

  currentLangLabel = computed(() => {
    const current = this.translate.currentLang();
    return this.languages.find((l) => l.code === current)?.label || current;
  });

  changeLang(lang: string) {
    this.translate.setLanguage(lang);
  }
}
