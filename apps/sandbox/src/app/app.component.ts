import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from './core/navbar/navbar.component';
import { MenuComponent } from './core/menu/menu.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    NavbarComponent,
    MenuComponent
],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
}
