import { of, tap } from 'rxjs';

/**
 * Cachable decorator for service methods returning Observables.
 * Automatically handles offline mode by returning cached data from localStorage.
 *
 * Requirements:
 * - The service must have 'networkService' injected.
 */
export function Cachable(cacheKey?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const key = cacheKey || `cache_${this.constructor.name}_${propertyKey}`;

      // Access the injected NetworkService from the instance
      const networkService = (this as any).networkService;

      if (networkService && !networkService.isOnline()) {
        const cached = localStorage.getItem(key);
        if (cached) {
          return of(JSON.parse(cached));
        }
      }

      return originalMethod.apply(this, args).pipe(
        tap((data) => {
          localStorage.setItem(key, JSON.stringify(data));
        }),
      );
    };
    return descriptor;
  };
}
