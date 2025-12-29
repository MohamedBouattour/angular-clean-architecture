import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Author } from '../../domain/model';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Create' }} Author</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="form-container">
        <mat-form-field class="form-field">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          @if (form.get('name')?.hasError('required')) {
          <mat-error>This field is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field class="form-field">
          <mat-label>Bio</mat-label>
          <input matInput formControlName="bio" />
          @if (form.get('bio')?.hasError('required')) {
          <mat-error>This field is required</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSave()"
        [disabled]="form.invalid || form.pristine"
      >
        {{ data ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 400px;
      padding: 1rem 0;
    }
    
    .form-field {
      width: 100%;
    }
  `,
})
export class AuthorFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<AuthorFormComponent>);
  protected readonly data = inject<Partial<Author> | null>(MAT_DIALOG_DATA, {
    optional: true,
  });
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.data?.name ?? '', Validators.required],

      bio: [this.data?.bio ?? '', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
