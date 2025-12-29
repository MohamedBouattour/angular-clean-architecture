import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publisher } from '../domain/model';

@Injectable({ providedIn: 'root' })
export class PublisherService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/publishers';

  getAll(): Observable<Publisher[]> {
    return this.http.get<Publisher[]>(this.apiUrl);
  }

  getById(id: string): Observable<Publisher> {
    return this.http.get<Publisher>(`${this.apiUrl}/${id}`);
  }

  create(
    data: Omit<Publisher, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Publisher> {
    return this.http.post<Publisher>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Publisher>): Observable<Publisher> {
    return this.http.put<Publisher>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
