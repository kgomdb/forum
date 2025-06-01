import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav>
      <a routerLink="/home" routerLinkActive="active">Home</a> |
      <a routerLink="/profile" routerLinkActive="active">Profile</a> |
      <a routerLink="/admin" routerLinkActive="active">Admin</a>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    nav a {
      margin: 0 10px;
      text-decoration: none;
      color: blue;
    }
    nav a.active {
      font-weight: bold;
      color: darkblue;
    }
  `]
})
export class MenuComponent {}