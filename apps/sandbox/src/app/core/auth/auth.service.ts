import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Auth Service - handles authentication with backend API
 * Uses signals for reactive state management (Angular 21 zoneless compatible)
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // State signals
  private readonly _currentUser = signal<User | null>(
    this.loadUserFromStorage(),
  );
  private readonly _token = signal<string | null>(this.loadTokenFromStorage());
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signal for authentication status
  readonly isAuthenticated = computed(
    () => !!this._token() && !!this._currentUser(),
  );

  login(credentials: { email: string; password: string }) {
    this._loading.set(true);
    this._error.set(null);

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.setSession(response);
          this._loading.set(false);
        }),
        catchError((error) => {
          this._error.set(error.error?.message || 'Login failed');
          this._loading.set(false);
          return of(null);
        }),
      );
  }

  signup(userData: { name: string; email: string; password: string }) {
    this._loading.set(true);
    this._error.set(null);

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/signup`, userData)
      .pipe(
        tap((response) => {
          this.setSession(response);
          this._loading.set(false);
        }),
        catchError((error) => {
          this._error.set(error.error?.message || 'Signup failed');
          this._loading.set(false);
          return of(null);
        }),
      );
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
    this.clearSession();
    this.router.navigate(['/login']);
  }

  refreshUser() {
    if (!this._token()) return;

    this.http
      .get<User>(`${this.apiUrl}/me`)
      .pipe(
        catchError(() => {
          this.clearSession();
          return of(null);
        }),
      )
      .subscribe((user) => {
        if (user) {
          this._currentUser.set(user);
          this.saveUserToStorage(user);
        }
      });
  }

  private setSession(response: LoginResponse) {
    this._token.set(response.access_token);
    this._currentUser.set(response.user);
    this.saveTokenToStorage(response.access_token);
    this.saveUserToStorage(response.user);
  }

  private clearSession() {
    this._token.set(null);
    this._currentUser.set(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  private loadTokenFromStorage(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUserFromStorage(): User | null {
    if (typeof localStorage === 'undefined') return null;
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private saveTokenToStorage(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  private saveUserToStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}
