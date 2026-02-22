import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BookService } from './service';
import { Book } from '../domain/model';
import { environment } from '../../../../environments/environment';
import { NetworkService } from '../../../shared/util/network/network.service';
import { signal } from '@angular/core';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  let networkMock: any;
  const apiUrl = `${environment.apiUrl}/features/books`;

  const mockItem: Book = {
    id: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    title: 'test',

    author: 'test',

    isbn: 'test',

    publishedDate: new Date(),
  } as Book;

  beforeEach(() => {
    networkMock = {
      isOnline: signal(true),
    };

    TestBed.configureTestingModule({
      providers: [
        BookService,
        { provide: NetworkService, useValue: networkMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all items', () => {
    const mockItems = [mockItem];

    service.getAll().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items).toEqual(mockItems);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
  });

  it('should create an item', () => {
    const newItem = { ...mockItem };
    delete (newItem as any).id;
    delete (newItem as any).createdAt;
    delete (newItem as any).updatedAt;

    service.create(newItem).subscribe((item) => {
      expect(item).toEqual(mockItem);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockItem);
  });

  it('should update an item', () => {
    const updateData = {
      title: mockItem.title,
      author: mockItem.author,
      isbn: mockItem.isbn,
      publishedDate: mockItem.publishedDate,
    };

    service.update('1', updateData).subscribe((item) => {
      expect(item).toEqual(mockItem);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockItem);
  });

  it('should delete an item', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
