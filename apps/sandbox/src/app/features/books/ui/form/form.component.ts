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
} from '@angular/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Book } from '../../domain/model';

@Component({
  selector: 'app-book-form',
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
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Create' }} Book</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="form-container">
        <mat-form-field class="form-field">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" />
          @if (form.get('title')?.hasError('required')) {
          <mat-error>This field is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field class="form-field">
          <mat-label>Author</mat-label>
          <input matInput formControlName="author" />
          @if (form.get('author')?.hasError('required')) {
          <mat-error>This field is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field class="form-field">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" />
          @if (form.get('price')?.hasError('required')) {
          <mat-error>This field is required</mat-error>
          }
        </mat-form-field>

        <mat-checkbox formControlName="available" class="form-field">
          Available
        </mat-checkbox>
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
export class BookFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<BookFormComponent>);
  protected readonly data = inject<Partial<Book> | null>(MAT_DIALOG_DATA, {
    optional: true,
  });
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      title: [this.data?.title ?? '', Validators.required],

      author: [this.data?.author ?? '', Validators.required],

      price: [this.data?.price ?? 0, [Validators.required, Validators.min(0)]],

      available: [this.data?.available ?? false, Validators.required],
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
