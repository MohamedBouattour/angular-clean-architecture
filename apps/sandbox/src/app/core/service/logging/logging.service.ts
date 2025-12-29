import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private prefix = '[Logging]';

  constructor() {}

  log(message: any, ...args: any[]) {
    console.log(`${this.prefix} ${message}`, ...args);
  }

  error(message: any, ...args: any[]) {
    console.error(`${this.prefix} ${message}`, ...args);
  }

  warn(message: any, ...args: any[]) {
    console.warn(`${this.prefix} ${message}`, ...args);
  }

  info(message: any, ...args: any[]) {
    console.info(`${this.prefix} ${message}`, ...args);
  }
}
