import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { BookStore } from '../application/store';
import { BookFormComponent } from './form/form.component';
import { Book } from '../domain/model';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent implements OnInit {
  protected readonly store = inject(BookStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  displayedColumns: string[] = [
    'title',
    'author',
    'price',
    'available',
    'actions',
  ];

  ngOnInit() {
    this.store.loadAll();
  }

  onFilterChange(value: string) {
    this.store.setFilter(value);
  }

  onSortChange(field: keyof Book, direction: 'asc' | 'desc') {
    this.store.setSort(field, direction);
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '500px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.create(result);
        this.snackBar.open('Book created successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  openEditDialog(item: Book) {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '500px',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.update({ id: item.id, data: result });
        this.snackBar.open('Book updated successfully', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  confirmDelete(item: Book) {
    const confirmed = confirm(`Are you sure you want to delete this book?`);
    if (confirmed) {
      this.store.delete(item.id);
      this.snackBar.open('Book deleted successfully', 'Close', {
        duration: 3000,
      });
    }
  }
}
