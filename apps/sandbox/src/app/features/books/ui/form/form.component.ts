import {
  Component,
  inject,
  ChangeDetectionStrategy,
  signal,
  computed,
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
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  template: `
    @let isEditMode = !!data;
    @let title = isEditMode ? 'Edit' : 'Create';

    <div class="p-2">
      <h2
        mat-dialog-title
        class="!m-0 !mb-6 text-2xl font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4"
      >
        {{ title }} Book
      </h2>

      <mat-dialog-content class="!p-0">
        <form
          [formGroup]="form"
          class="flex flex-col gap-4 min-w-[320px] md:min-w-[480px] py-4"
        >
          <mat-form-field class="w-full" appearance="outline">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" />
            @if (form.get('title')?.hasError('required')) {
              <mat-error>This field is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="w-full" appearance="outline">
            <mat-label>Author</mat-label>
            <input matInput formControlName="author" />
            @if (form.get('author')?.hasError('required')) {
              <mat-error>This field is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="w-full" appearance="outline">
            <mat-label>Isbn</mat-label>
            <input matInput formControlName="isbn" />
            @if (form.get('isbn')?.hasError('required')) {
              <mat-error>This field is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="w-full" appearance="outline">
            <mat-label>PublishedDate</mat-label>
            <input matInput formControlName="publishedDate" />
            @if (form.get('publishedDate')?.hasError('required')) {
              <mat-error>This field is required</mat-error>
            }
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions
        align="end"
        class="!px-0 !pt-6 border-t border-gray-100 dark:border-gray-700 mt-4"
      >
        <button mat-button (click)="onCancel()" class="!px-6">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSave()"
          class="!px-8 !rounded-full shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
          [disabled]="isFormInvalid()"
        >
          {{ title }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookFormComponent {
  private readonly dialogRef = inject(MatDialogRef<BookFormComponent>);
  protected readonly data = inject<Partial<Book> | null>(MAT_DIALOG_DATA, {
    optional: true,
  });
  private readonly fb = inject(FormBuilder);

  // Signal-based form state tracking
  private readonly formDirty = signal(false);
  private readonly formValid = signal(false);

  readonly form = this.fb.group({
    title: [this.data?.title ?? '', Validators.required],

    author: [this.data?.author ?? '', Validators.required],

    isbn: [this.data?.isbn ?? '', Validators.required],

    publishedDate: [this.data?.publishedDate ?? '', Validators.required],
  });

  // Computed signal for form validation state
  readonly isFormInvalid = computed(
    () => !this.formValid() || !this.formDirty(),
  );

  constructor() {
    // Track form state changes with signals for zoneless compatibility
    this.form.statusChanges.subscribe(() => {
      this.formValid.set(this.form.valid);
    });
    this.form.valueChanges.subscribe(() => {
      this.formDirty.set(this.form.dirty);
    });
    // Initial state
    this.formValid.set(this.form.valid);
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
