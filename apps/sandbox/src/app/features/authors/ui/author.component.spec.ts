import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flushMicrotasks,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthorComponent } from './author.component';
import { AuthorStore } from '../application/store';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { vi } from 'vitest';

describe('AuthorComponent', () => {
  let component: AuthorComponent;
  let fixture: ComponentFixture<AuthorComponent>;
  let storeMock: any;
  let dialogMock: any;
  let snackBarMock: any;

  beforeEach(async () => {
    storeMock = {
      loading: signal(false),
      error: signal(null),
      filter: signal(''),
      filteredAndSortedItems: signal([]),
      loadAll: vi.fn(),
      setFilter: vi.fn(),
      setSort: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    dialogMock = {
      open: vi.fn().mockReturnValue({
        afterClosed: () => of(null),
      }),
    };

    snackBarMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AuthorComponent, NoopAnimationsModule],
      providers: [{ provide: AuthorStore, useValue: storeMock }],
    })
      .overrideComponent(AuthorComponent, {
        set: {
          providers: [
            { provide: MatDialog, useValue: dialogMock },
            { provide: MatSnackBar, useValue: snackBarMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadAll on init', fakeAsync(() => {
    flushMicrotasks();
    expect(storeMock.loadAll).toHaveBeenCalled();
  }));

  it('should call setFilter when filter changes', () => {
    component.onFilterChange('test');
    expect(storeMock.setFilter).toHaveBeenCalledWith('test');
  });

  it('should call setSort when sort changes', () => {
    component.onSortChange('name', 'asc');
    expect(storeMock.setSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('should open create dialog and call create on result', fakeAsync(() => {
    const mockResult = { name: 'test' };
    dialogMock.open.mockReturnValue({ afterClosed: () => of(mockResult) });

    component.openCreateDialog();
    flushMicrotasks();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(storeMock.create).toHaveBeenCalledWith(mockResult);
    expect(snackBarMock.open).toHaveBeenCalled();
  }));

  it('should open edit dialog and call update on result', fakeAsync(() => {
    const mockItem = { id: '1' } as any;
    const mockResult = { name: 'updated' };
    dialogMock.open.mockReturnValue({ afterClosed: () => of(mockResult) });

    component.openEditDialog(mockItem);
    flushMicrotasks();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(storeMock.update).toHaveBeenCalledWith({
      id: mockItem.id,
      data: mockResult,
    });
    expect(snackBarMock.open).toHaveBeenCalled();
  }));

  it('should open confirm delete dialog and call delete on confirmation', fakeAsync(() => {
    const mockItem = { id: '1', name: 'Test' } as any;
    dialogMock.open.mockReturnValue({ afterClosed: () => of(true) });

    component.confirmDelete(mockItem);
    flushMicrotasks();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(storeMock.delete).toHaveBeenCalledWith(mockItem.id);
    expect(snackBarMock.open).toHaveBeenCalled();
  }));
});
