import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
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
import { AuthorStore } from '../application/store';
import { AuthorFormComponent } from './form/form.component';
import { Author } from '../domain/model';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-author-feature',
  standalone: true,
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
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorComponent implements OnInit {
  protected readonly store = inject(AuthorStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly displayedColumns: string[] = [
    'name',
    'bio',
    'birthDate',
    'actions',
  ];

  ngOnInit(): void {
    this.store.loadAll();
  }

  onFilterChange(value: string): void {
    this.store.setFilter(value);
  }

  onSortChange(field: keyof Author, direction: 'asc' | 'desc'): void {
    this.store.setSort(field, direction);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AuthorFormComponent, {
      width: '500px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.create(result);
        this.snackBar.open('Author created successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  openEditDialog(item: Author): void {
    const dialogRef = this.dialog.open(AuthorFormComponent, {
      width: '500px',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.update({ id: item.id, data: result });
        this.snackBar.open('Author updated successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  confirmDelete(item: Author): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete author',
        message: `Are you sure you want to delete this author?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.delete(item.id);
        this.snackBar.open('Author deleted successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }
}
