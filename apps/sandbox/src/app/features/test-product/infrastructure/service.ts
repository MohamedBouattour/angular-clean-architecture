import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestProduct } from '../domain/model';

@Injectable({ providedIn: 'root' })
export class TestProductService {
  private readonly apiUrl = '/api/test-products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TestProduct[]> {
    return this.http.get<TestProduct[]>(this.apiUrl);
  }

  getById(id: string): Observable<TestProduct> {
    return this.http.get<TestProduct>(`${this.apiUrl}/${id}`);
  }

  create(
    data: Omit<TestProduct, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<TestProduct> {
    return this.http.post<TestProduct>(this.apiUrl, data);
  }

  update(id: string, data: Partial<TestProduct>): Observable<TestProduct> {
    return this.http.put<TestProduct>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
