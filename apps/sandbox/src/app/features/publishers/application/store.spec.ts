import { TestBed } from '@angular/core/testing';
import { PublisherStore } from './store';
import { PublisherService } from '../infrastructure/service';
import { ToastService } from '../../../shared/util/toast/toast.service';
import { of, throwError } from 'rxjs';
import { Publisher } from '../domain/model';
import { vi } from 'vitest';

describe('PublisherStore', () => {
  let store: any;
  let serviceMock: any;
  let toastMock: any;

  const mockItem: Publisher = {
    id: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    name: 'test',

    location: 'test',
  } as Publisher;

  beforeEach(() => {
    serviceMock = {
      getAll: vi.fn().mockReturnValue(of([])),
      create: vi.fn().mockReturnValue(of(mockItem)),
      update: vi.fn().mockReturnValue(of(mockItem)),
      delete: vi.fn().mockReturnValue(of(void 0)),
    };

    toastMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: PublisherService, useValue: serviceMock },
        { provide: ToastService, useValue: toastMock },
      ],
    });

    store = TestBed.inject(PublisherStore);
  });

  it('should have initial state', () => {
    expect(store.items()).toEqual([]);
    expect(store.loading()).toBeFalsy();
    expect(store.error()).toBeNull();
  });

  it('should load all items', () => {
    const items = [mockItem];
    serviceMock.getAll.mockReturnValue(of(items));

    store.loadAll();

    expect(store.items()).toEqual(items);
    expect(store.loading()).toBeFalsy();
  });

  it('should handle error on load', () => {
    const error = { message: 'Failed to load' };
    serviceMock.getAll.mockReturnValue(throwError(() => error));

    store.loadAll();

    expect(store.error()).toBe(error.message);
    expect(store.loading()).toBeFalsy();
    expect(toastMock.error).toHaveBeenCalled();
  });

  it('should create an item', () => {
    serviceMock.create.mockReturnValue(of(mockItem));

    store.create({ name: mockItem.name, location: mockItem.location });

    expect(store.items()).toContain(mockItem);
    expect(store.loading()).toBeFalsy();
    expect(toastMock.success).toHaveBeenCalled();
  });

  it('should update an item', () => {
    const updatedItem = { ...mockItem, name: 'updated', location: 'updated' };

    // Initial state with one item
    serviceMock.getAll.mockReturnValue(of([mockItem]));
    store.loadAll();
    expect(store.items()).toContain(mockItem);

    serviceMock.update.mockReturnValue(of(updatedItem));
    store.update({ id: '1', data: updatedItem });

    expect(store.items()).toContain(updatedItem);
    expect(store.items().length).toBe(1);
    expect(store.loading()).toBeFalsy();
    expect(toastMock.success).toHaveBeenCalled();
  });

  it('should delete an item', () => {
    serviceMock.getAll.mockReturnValue(of([mockItem]));
    store.loadAll();
    expect(store.items()).toContain(mockItem);

    serviceMock.delete.mockReturnValue(of(void 0));
    store.delete('1');

    expect(store.items()).not.toContain(mockItem);
    expect(store.items().length).toBe(0);
    expect(store.loading()).toBeFalsy();
    expect(toastMock.success).toHaveBeenCalled();
  });

  it('should update filter', () => {
    store.setFilter('test');
    expect(store.filter()).toBe('test');
  });

  it('should update sort', () => {
    store.setSort('name', 'asc');
    expect(store.sortField()).toBe('name');
    expect(store.sortDirection()).toBe('asc');
  });
});
