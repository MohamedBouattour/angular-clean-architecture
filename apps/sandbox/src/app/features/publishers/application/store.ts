import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  patchState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { PublisherService } from '../infrastructure/service';
import { Publisher } from '../domain/model';
import { ToastService } from '../../../shared/util/toast/toast.service';

interface PublisherState {
  items: Publisher[];
  loading: boolean;
  error: string | null;
  filter: string;
  sortField: keyof Publisher;
  sortDirection: 'asc' | 'desc';
}

export const PublisherStore = signalStore(
  { providedIn: 'root' },
  withState<PublisherState>({
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
  withMethods(
    (
      store,
      service = inject(PublisherService),
      toastService = inject(ToastService),
    ) => ({
      loadAll: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(() =>
            service.getAll().pipe(
              tapResponse({
                next: (items) => patchState(store, { items, loading: false }),
                error: (error: any) => {
                  toastService.error(error);
                  patchState(store, {
                    error: error?.message || 'Unknown error',
                    loading: false,
                  });
                },
              }),
            ),
          ),
        ),
      ),

      create: rxMethod<Omit<Publisher, 'id' | 'createdAt' | 'updatedAt'>>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap((data) =>
            service.create(data).pipe(
              tapResponse({
                next: (item) => {
                  toastService.success('Publisher created successfully');
                  patchState(store, (state) => ({
                    items: [...state.items, item],
                    loading: false,
                  }));
                },
                error: (error: any) => {
                  toastService.error(error);
                  patchState(store, {
                    error: error?.message || 'Unknown error',
                    loading: false,
                  });
                },
              }),
            ),
          ),
        ),
      ),

      update: rxMethod<{ id: string; data: Partial<Publisher> }>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(({ id, data }) =>
            service.update(id, data).pipe(
              tapResponse({
                next: (updated) => {
                  toastService.success('Publisher updated successfully');
                  patchState(store, (state) => ({
                    items: state.items.map((item) =>
                      item.id === id ? updated : item,
                    ),
                    loading: false,
                  }));
                },
                error: (error: any) => {
                  toastService.error(error);
                  patchState(store, {
                    error: error?.message || 'Unknown error',
                    loading: false,
                  });
                },
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
                next: () => {
                  toastService.success('Publisher deleted successfully');
                  patchState(store, (state) => ({
                    items: state.items.filter((item) => item.id !== id),
                    loading: false,
                  }));
                },
                error: (error: any) => {
                  toastService.error(error);
                  patchState(store, {
                    error: error?.message || 'Unknown error',
                    loading: false,
                  });
                },
              }),
            ),
          ),
        ),
      ),

      setFilter: (filter: string) => patchState(store, { filter }),

      setSort: (field: keyof Publisher, direction: 'asc' | 'desc') =>
        patchState(store, { sortField: field, sortDirection: direction }),
    }),
  ),
);
