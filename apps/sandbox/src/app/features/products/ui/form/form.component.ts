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
import { Product } from '../../domain/model';

@Component({
  selector: 'app-product-form',
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

    <h2 mat-dialog-title>{{ title }} Product</h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="form-container">
        <mat-form-field class="form-field" appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          @if (form.get('name')?.hasError('required')) {
            <mat-error>This field is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field class="form-field" appearance="outline">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" />
          @if (form.get('price')?.hasError('required')) {
            <mat-error>This field is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field class="form-field" appearance="outline">
          <mat-label>Description</mat-label>
          <input matInput formControlName="description" />
          @if (form.get('description')?.hasError('required')) {
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
        [disabled]="isFormInvalid()"
      >
        {{ title }}
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
export class ProductFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ProductFormComponent>);
  protected readonly data = inject<Partial<Product> | null>(MAT_DIALOG_DATA, {
    optional: true,
  });
  private readonly fb = inject(FormBuilder);

  // Signal-based form state tracking
  private readonly formDirty = signal(false);
  private readonly formValid = signal(false);

  readonly form = this.fb.group({
    name: [this.data?.name ?? '', Validators.required],

    price: [this.data?.price ?? 0, [Validators.required, Validators.min(0)]],

    description: [this.data?.description ?? '', Validators.required],
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
