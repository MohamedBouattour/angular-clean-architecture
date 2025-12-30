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
import { MatCardModule } from '@angular/material/card';
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
    MatCardModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  template: `
    @let nameErrors = signupForm.get('name')?.errors;
    @let emailErrors = signupForm.get('email')?.errors;
    @let passwordErrors = signupForm.get('password')?.errors;
    @let isSubmitDisabled = !formValid() || authService.loading();

    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Sign Up</mat-card-title>
          <mat-card-subtitle>Create a new account</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @if (authService.error()) {
            <div class="error-banner">{{ authService.error() }}</div>
          }

          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input
                matInput
                formControlName="name"
                placeholder="Enter your name"
              />
              @if (nameErrors?.['required']) {
                <mat-error>Name is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
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

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
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
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 1rem;
    }
    .auth-card {
      width: 100%;
      max-width: 400px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }
    .submit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 48px;
    }
    .error-banner {
      background-color: #f44336;
      color: white;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    .auth-footer {
      margin-top: 24px;
      text-align: center;

      a {
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 500;
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
