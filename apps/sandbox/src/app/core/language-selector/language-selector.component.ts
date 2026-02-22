import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '../translate/translate.service';

@Component({
  selector: 'app-language-selector',
  imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  template: `
    <button
      mat-button
      [matMenuTriggerFor]="menu"
      class="!flex !items-center !px-3 !h-10 !rounded-full !bg-white/10 !text-white hover:!bg-white/20 transition-all"
    >
      <mat-icon class="!text-xl">translate</mat-icon>
      <span
        class="mx-1 font-medium uppercase text-[0.85rem] hidden sm:inline"
        >{{ currentLangLabel() }}</span
      >
      <mat-icon class="!m-0 !w-[18px] !h-[18px] !text-[18px]"
        >arrow_drop_down</mat-icon
      >
    </button>

    <mat-menu #menu="matMenu" xPosition="before">
      @for (lang of languages; track lang.code) {
        <button
          mat-menu-item
          (click)="changeLang(lang.code)"
          [class.!text-primary]="translate.currentLang() === lang.code"
          [class.!font-bold]="translate.currentLang() === lang.code"
        >
          @if (translate.currentLang() === lang.code) {
            <mat-icon>check</mat-icon>
          }
          <span>{{ lang.label }}</span>
        </button>
      }
    </mat-menu>
  `,
  styles: [],
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
