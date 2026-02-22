import {
  Component,
  inject,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

/**
 * Signup component - connects to backend API
 */
@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  template: `
    @let nameErrors = signupForm.get('name')?.errors;
    @let emailErrors = signupForm.get('email')?.errors;
    @let passwordErrors = signupForm.get('password')?.errors;
    @let isSubmitDisabled = !formValid() || authService.loading();

    <div class="auth-container">
      <div class="auth-card">
        <!-- Header -->
        <div class="auth-header">
          <div class="auth-icon">
            <mat-icon>person_add</mat-icon>
          </div>
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Join us and get started</p>
        </div>

        <!-- Error -->
        @if (authService.error()) {
          <div class="error-banner">
            <mat-icon>error_outline</mat-icon>
            <span>{{ authService.error() }}</span>
          </div>
        }

        <!-- Form -->
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="auth-field">
            <mat-label>Name</mat-label>
            <mat-icon matPrefix>person</mat-icon>
            <input
              matInput
              formControlName="name"
              placeholder="Enter your name"
            />
            @if (nameErrors?.['required']) {
              <mat-error>Name is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="auth-field">
            <mat-label>Email</mat-label>
            <mat-icon matPrefix>email</mat-icon>
            <input
              matInput
              formControlName="email"
              type="email"
              placeholder="Enter your email"
            />
            @if (emailErrors?.['required']) {
              <mat-error>Email is required</mat-error>
            }
            @if (emailErrors?.['email']) {
              <mat-error>Please enter a valid email</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="auth-field">
            <mat-label>Password</mat-label>
            <mat-icon matPrefix>lock</mat-icon>
            <input
              matInput
              formControlName="password"
              type="password"
              placeholder="Enter your password"
            />
            @if (passwordErrors?.['required']) {
              <mat-error>Password is required</mat-error>
            }
            @if (passwordErrors?.['minlength']) {
              <mat-error>Password must be at least 6 characters</mat-error>
            }
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="isSubmitDisabled"
            class="submit-btn"
          >
            @if (authService.loading()) {
              <mat-spinner diameter="20"></mat-spinner>
              <span>Creating account...</span>
            } @else {
              Sign Up
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Login</a></p>
        </div>
      </div>
    </div>
  `,
  styles: `
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 2rem 1rem;
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      background: var(--color-bg-card);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 2.5rem 2rem;
      box-shadow: var(--shadow-lg);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(
        135deg,
        var(--color-primary),
        var(--color-primary-light)
      );
      margin-bottom: 1rem;

      mat-icon {
        color: white;
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }
    .auth-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--color-text);
      margin: 0 0 0.25rem;
      letter-spacing: -0.02em;
    }
    .auth-subtitle {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      margin: 0;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .auth-field {
      width: 100%;
    }
    .submit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 48px;
      border-radius: 12px !important;
      font-weight: 600;
      font-size: 0.95rem;
      margin-top: 8px;
      letter-spacing: 0.02em;
    }
    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: var(--color-error-bg);
      color: var(--color-error);
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 16px;
      border: 1px solid var(--color-error);
      font-size: 0.9rem;
    }
    .auth-footer {
      margin-top: 1.5rem;
      text-align: center;
      color: var(--color-text-secondary);

      p {
        margin: 4px 0;
      }

      a {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 600;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly formValid = signal(false);

  readonly signupForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    this.signupForm.statusChanges.subscribe(() => {
      this.formValid.set(this.signupForm.valid);
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      this.authService
        .signup({ name: name!, email: email!, password: password! })
        .subscribe((response) => {
          if (response) {
            this.router.navigate(['/']);
          }
        });
    }
  }
}
