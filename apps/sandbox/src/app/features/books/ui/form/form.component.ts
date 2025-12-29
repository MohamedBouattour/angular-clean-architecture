import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
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
import { Book } from '../../domain/model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
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
          <mat-label>Isbn</mat-label>
          <input matInput formControlName="isbn" />
          @if (form.get('isbn')?.hasError('required')) {
          <mat-error>This field is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field class="form-field">
          <mat-label>PublishedDate</mat-label>
          <input matInput formControlName="publishedDate" />
          @if (form.get('publishedDate')?.hasError('required')) {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<BookFormComponent>);
  protected readonly data = inject<Partial<Book> | null>(MAT_DIALOG_DATA, {
    optional: true,
  });
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.data?.title ?? '', Validators.required],

      author: [this.data?.author ?? '', Validators.required],

      isbn: [this.data?.isbn ?? '', Validators.required],

      publishedDate: [this.data?.publishedDate ?? '', Validators.required],
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
