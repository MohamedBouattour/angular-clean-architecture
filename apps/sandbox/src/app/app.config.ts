import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';

/**
 * Angular 21 Application Configuration
 * 
 * Features:
 * - Zoneless change detection (no zone.js)
 * - Async animations (lazy loaded)
 * - HttpClient ready by default
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
