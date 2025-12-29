import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author } from '../domain/model';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private readonly apiUrl = '/api/authors';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Author[]> {
    return this.http.get<Author[]>(this.apiUrl);
  }

  getById(id: string): Observable<Author> {
    return this.http.get<Author>(`${this.apiUrl}/${id}`);
  }

  create(
    data: Omit<Author, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Author> {
    return this.http.post<Author>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Author>): Observable<Author> {
    return this.http.put<Author>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
