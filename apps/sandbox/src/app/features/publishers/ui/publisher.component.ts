import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PublisherStore } from '../application/store';
import { PublisherFormComponent } from './form/form.component';
import { Publisher } from '../domain/model';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';

/**
 * Publisher feature component - CRUD operations with Angular Material
 *
 * Angular 21 Features Used:
 * - @let template syntax for local variables
 * - Signals via NgRx Signal Store
 * - ChangeDetectionStrategy.OnPush for zoneless compatibility
 * - inject() function for dependency injection
 */
@Component({
  selector: 'app-publisher-feature',
  imports: [
    FormsModule,
    DatePipe,
    DecimalPipe,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublisherComponent {
  // Dependency injection using inject() - Angular 14+ pattern
  protected readonly store = inject(PublisherStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  // Table columns configuration
  protected readonly displayedColumns: string[] = [
    'name',
    'location',
    'actions',
  ];

  // Load data on component init using constructor for zoneless compatibility
  constructor() {
    // Defer loading to allow store initialization
    queueMicrotask(() => this.store.loadAll());
  }

  onFilterChange(value: string): void {
    this.store.setFilter(value);
  }

  onSortChange(field: keyof Publisher, direction: 'asc' | 'desc'): void {
    this.store.setSort(field, direction);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(PublisherFormComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: null,
      panelClass: 'themed-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.create(result);
        this.showNotification('Publisher created successfully');
      }
    });
  }

  openEditDialog(item: Publisher): void {
    const dialogRef = this.dialog.open(PublisherFormComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: item,
      panelClass: 'themed-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.update({ id: item.id, data: result });
        this.showNotification('Publisher updated successfully');
      }
    });
  }

  confirmDelete(item: Publisher): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      data: {
        title: 'Delete publisher',
        message: `Are you sure you want to delete this publisher?`,
      },
      panelClass: 'themed-dialog',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.delete(item.id);
        this.showNotification('Publisher deleted successfully');
      }
    });
  }

  // Helper method for snackbar notifications
  private showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
