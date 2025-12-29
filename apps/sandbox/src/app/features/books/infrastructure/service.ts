import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../domain/model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly apiUrl = '/api/books';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
