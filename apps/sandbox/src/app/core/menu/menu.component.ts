import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  private readonly router = inject(Router);

  get features() {
    return this.router.config
      .filter((route) => route.path && route.path !== '')
      .map((route) => ({
        path: route.path,
        label:
          route.data?.['label'] ||
          route.path
            ?.split('-')
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(' '),
      }));
  }
}
