import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {TokenStorageService} from '../../../core/security/token-storage.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="layout">

      <aside>
        <h2>Super Admin</h2>

        <nav>
          <a routerLink="/admin/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/admin/cabinets" routerLinkActive="active">Cabinete</a>
          <a routerLink="/admin/users" routerLinkActive="active">Utilizatori</a>
          <a routerLink="/admin/profile" routerLinkActive="active">Profil</a>
          <a routerLink="/admin/change-password" routerLinkActive="active">Schimbă parola</a>
        </nav>

        <div class="logout-container">
          <button (click)="logout()">Logout</button>
        </div>
      </aside>

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
      background: #f5f7fa;
      font-family: Arial, sans-serif;
    }

    aside {
      width: 240px;
      background: #1e293b;
      color: #fff;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    aside h2 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      text-align: center;
    }

    nav a {
      display: block;
      padding: 10px 15px;
      color: #cbd5e1;
      text-decoration: none;
      border-radius: 6px;
      margin-bottom: 10px;
      transition: 0.2s;
      font-size: 14px;
    }

    nav a:hover, nav a.active {
      background: #334155;
      color: #fff;
    }

    .logout-container {
      margin-top: auto;
      padding-top: 20px;
      border-top: 1px solid #475569;
    }

    .logout-container button {
      width: 100%;
      padding: 10px;
      background: #ef4444;
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      font-weight: 600;
      transition: 0.2s;
    }

    .logout-container button:hover {
      background: #dc2626;
    }

    main {
      flex: 1;
      padding: 30px;
      overflow-y: auto;
    }
  `]
})
export class AdminLayoutComponent {

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  logout() {
    this.tokenStorage.signOut();
    this.router.navigate(['/login']);
  }
}
