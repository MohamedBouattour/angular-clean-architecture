import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="p-2">
      <h2
        mat-dialog-title
        class="!m-0 !mb-4 text-2xl font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4"
      >
        {{ data.title }}
      </h2>

      <mat-dialog-content class="!p-0 py-4">
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          {{ data.message }}
        </p>
      </mat-dialog-content>

      <mat-dialog-actions
        align="end"
        class="!px-0 !pt-6 border-t border-gray-100 dark:border-gray-700 mt-4"
      >
        <button mat-button (click)="onCancel()" class="!px-6">Cancel</button>
        <button
          mat-raised-button
          color="warn"
          (click)="onConfirm()"
          class="!px-8 !rounded-full shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 ml-2"
        >
          Confirm
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
