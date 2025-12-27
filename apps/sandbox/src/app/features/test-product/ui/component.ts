import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestProductStore } from '../application/store';

@Component({
  selector: 'app-test-product-feature',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-product-feature">
      <h1>TestProduct Feature</h1>

      @if (store.loading()) {
      <p>Loading...</p>
      } @else {
      <p>Ready to build your test-product feature!</p>
      }
    </div>
  `,
  styles: `
    .test-product-feature {
      padding: 1rem;
    }

    h1 {
      color: #333;
      margin-bottom: 1rem;
    }
  `,
})
export class TestProductComponent {
  protected readonly store = inject(TestProductStore);
}
