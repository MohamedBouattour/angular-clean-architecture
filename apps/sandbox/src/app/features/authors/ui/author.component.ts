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
import { AuthorStore } from '../application/store';
import { AuthorFormComponent } from './form/form.component';
import { Author } from '../domain/model';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-author',
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
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorComponent implements OnInit {
  protected readonly store = inject(AuthorStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'bio', 'actions'];

  ngOnInit() {
    this.store.loadAll();
  }

  onFilterChange(value: string) {
    this.store.setFilter(value);
  }

  onSortChange(field: keyof Author, direction: 'asc' | 'desc') {
    this.store.setSort(field, direction);
  }

  openCreateDialog() {
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

  openEditDialog(item: Author) {
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

  confirmDelete(item: Author) {
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
