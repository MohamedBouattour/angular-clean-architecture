import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  patchState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap, catchError, of } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { BookService } from '../infrastructure/service';
import { Book } from '../domain/model';

interface BookState {
  items: Book[];
  loading: boolean;
  error: string | null;
  filter: string;
  sortField: keyof Book;
  sortDirection: 'asc' | 'desc';
}

export const BookStore = signalStore(
  { providedIn: 'root' },
  withState<BookState>({
    items: [],
    loading: false,
    error: null,
    filter: '',
    sortField: 'createdAt',
    sortDirection: 'desc',
  }),
  withComputed((state) => ({
    filteredAndSortedItems: computed(() => {
      let items = [...state.items()];

      // Apply filter
      const filter = state.filter().toLowerCase();
      if (filter) {
        items = items.filter((item) =>
          Object.values(item).some((val) =>
            String(val).toLowerCase().includes(filter),
          ),
        );
      }

      // Apply sort
      const field = state.sortField();
      const direction = state.sortDirection();
      items.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return direction === 'asc' ? comparison : -comparison;
      });

      return items;
    }),
  })),
  withMethods((store, service = inject(BookService)) => ({
    loadAll: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          service.getAll().pipe(
            tapResponse({
              next: (items) => patchState(store, { items, loading: false }),
              error: (error: Error) =>
                patchState(store, { error: error.message, loading: false }),
            }),
          ),
        ),
      ),
    ),

    create: rxMethod<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((data) =>
          service.create(data).pipe(
            tapResponse({
              next: (item) =>
                patchState(store, (state) => ({
                  items: [...state.items, item],
                  loading: false,
                })),
              error: (error: Error) =>
                patchState(store, { error: error.message, loading: false }),
            }),
          ),
        ),
      ),
    ),

    update: rxMethod<{ id: string; data: Partial<Book> }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ id, data }) =>
          service.update(id, data).pipe(
            tapResponse({
              next: (updated) =>
                patchState(store, (state) => ({
                  items: state.items.map((item) =>
                    item.id === id ? updated : item,
                  ),
                  loading: false,
                })),
              error: (error: Error) =>
                patchState(store, { error: error.message, loading: false }),
            }),
          ),
        ),
      ),
    ),

    delete: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap((id) =>
          service.delete(id).pipe(
            tapResponse({
              next: () =>
                patchState(store, (state) => ({
                  items: state.items.filter((item) => item.id !== id),
                  loading: false,
                })),
              error: (error: Error) =>
                patchState(store, { error: error.message, loading: false }),
            }),
          ),
        ),
      ),
    ),

    setFilter: (filter: string) => patchState(store, { filter }),

    setSort: (field: keyof Book, direction: 'asc' | 'desc') =>
      patchState(store, { sortField: field, sortDirection: direction }),
  })),
);
