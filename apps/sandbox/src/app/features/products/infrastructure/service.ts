import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../domain/model';
import { environment } from '../../../../environments/environment';
import { NetworkService } from '../../../shared/util/network/network.service';
import { Cachable } from '../../../shared/util/cache/cachable.decorator';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  protected readonly networkService = inject(NetworkService);
  private readonly apiUrl = `${environment.apiUrl}/features/products`;

  @Cachable('products_getAll')
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
