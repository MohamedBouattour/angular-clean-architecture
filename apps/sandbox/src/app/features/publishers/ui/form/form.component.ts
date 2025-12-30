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
import { Publisher } from '../../domain/model';

@Component({
  selector: 'app-publisher-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  template: `
    @let isEditMode = !!data; @let title = isEditMode ? 'Edit' : 'Create';

    <h2 mat-dialog-title>{{ title }} Publisher</h2>

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
          <mat-label>Location</mat-label>
          <input matInput formControlName="location" />
          @if (form.get('location')?.hasError('required')) {
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
export class PublisherFormComponent {
  private readonly dialogRef = inject(MatDialogRef<PublisherFormComponent>);
  protected readonly data = inject<Partial<Publisher> | null>(MAT_DIALOG_DATA, {
    optional: true,
  });
  private readonly fb = inject(FormBuilder);

  // Signal-based form state tracking
  private readonly formDirty = signal(false);
  private readonly formValid = signal(false);

  readonly form = this.fb.group({
    name: [this.data?.name ?? '', Validators.required],

    location: [this.data?.location ?? '', Validators.required],
  });

  // Computed signal for form validation state
  readonly isFormInvalid = computed(
    () => !this.formValid() || !this.formDirty()
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
