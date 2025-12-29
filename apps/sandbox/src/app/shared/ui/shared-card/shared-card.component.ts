import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="shared-card-container">
      <p>shared-card works!</p>
    </div>
  `,
  styles: `
    .shared-card-container {
      display: block;
    }
  `,
})
export class SharedCardComponent {}
