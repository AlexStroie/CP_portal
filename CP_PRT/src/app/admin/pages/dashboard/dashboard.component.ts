import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Dacă ai services, le imporți aici
// import { CabinetsService } from '../services/cabinets.service';
// import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Dashboard Super Admin</h1>

    <div class="stats">
      <div class="stat-box">
        <div class="label">Cabinete</div>
        <div class="value">{{ stats.cabinets }}</div>
      </div>

      <div class="stat-box">
        <div class="label">Utilizatori</div>
        <div class="value">{{ stats.users }}</div>
      </div>
    </div>

    <div class="quick-actions">
      <button routerLink="/admin/cabinets">Gestionare Cabinete</button>
      <button routerLink="/admin/users">Gestionare Utilizatori</button>
      <button routerLink="/admin/profile">Profil</button>
    </div>
  `,
  styles: [`
    h1 {
      font-size: 26px;
      margin-bottom: 25px;
      font-weight: 600;
      color: #1e293b;
    }

    .stats {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-box {
      flex: 1;
      background: #ffffff;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.08);
      text-align: center;
    }

    .label {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .value {
      font-size: 32px;
      font-weight: 700;
      color: #0f172a;
    }

    .quick-actions {
      display: flex;
      gap: 15px;
      margin-top: 10px;
    }

    .quick-actions button {
      padding: 12px 18px;
      border: none;
      border-radius: 8px;
      background: #3b82f6;
      color: #fff;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: 0.2s;
    }

    .quick-actions button:hover {
      background: #2563eb;
    }
  `]
})
export class SuperAdminDashboardComponent implements OnInit {

  stats = {
    cabinets: 0,
    users: 0
  };

  constructor(
    // private cabinetsService: CabinetsService,
    // private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    // Când implementezi backend-ul, decomentezi:

    /*
    this.cabinetsService.getStats().subscribe(count => {
      this.stats.cabinets = count;
    });

    this.usersService.getStats().subscribe(count => {
      this.stats.users = count;
    });
    */

    // Deocamdată MOCK data ca să nu crape UI-ul
    this.stats = {
      cabinets: 3,
      users: 12
    };
  }
}
