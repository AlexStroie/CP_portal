import {ChangeDetectorRef, Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {UsersService} from '../../../shared/service/users.service';
import {UserResponse} from '../../../core/model/user.model';
import {TokenStorageService} from '../../../core/security/token-storage.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Utilizatori</h1>

    <div class="top-actions">
      <button routerLink="/super-admin/users/0">+ Adaugă Utilizator</button>
    </div>

    <table class="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Nume</th>
        <th>Username</th>
        <th>Email</th>
        <th>Rol</th>
        <th>Status</th>
        <th>Acțiuni</th>
      </tr>
      </thead>

      <tbody>
        @for (user of users(); track user.id) {
          <tr>
            <td>{{ user.id }}</td>
            <td>{{ user.fullName }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              @if (user.enabled) {
                <span style="color: green">✔ Enabled</span>
              } @else {
                <span style="color: red">✘ Disabled</span>
              }
            </td>
            <td>
              <button class="btn-edit" [routerLink]="['/super-admin/users', user.id]">
                Editează
              </button>
              <button class="btn-delete"
                      (click)="askDelete(user)"
                      [disabled]="user.role === 'SUPER_ADMIN' && user.username === currentUser()?.username"
              >Delete
              </button>
            </td>
          </tr>
        }
      </tbody>
    </table>

    <!-- DELETE CONFIRMATION -->
    @if (userToDelete()) {
      <div class="modal">
        <div class="modal-body">
          <h3>Delete User</h3>
          <p>Are you sure you want to delete <b>{{ userToDelete()?.fullName }}</b>?</p>

          <button (click)="confirmDelete()" style="color:red">Confirm</button>
          <button (click)="cancelDelete()">Cancel</button>
        </div>
      </div>
    }
  `,
  styles: [`
    h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #1e293b;
    }

    .top-actions {
      margin-bottom: 20px;
    }

    .top-actions button {
      background: #3b82f6;
      color: white;
      padding: 10px 15px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 500;
    }

    table.table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.08);
    }

    table th {
      text-align: left;
      background: #f1f5f9;
      padding: 12px;
      font-weight: 600;
      color: #1e293b;
      font-size: 14px;
    }

    table td {
      padding: 12px;
      border-top: 1px solid #e2e8f0;
      font-size: 14px;
    }

    .btn-edit {
      background: #0ea5e9;
      border: none;
      padding: 6px 12px;
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-edit:hover {
      background: #0284c7;
    }

    .btn-delete {
      background-color: #ff4d4d;
      border: none;
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.2s ease;
    }

    .btn-delete:hover {
      background-color: #e60000;
    }

    .btn-delete:disabled {
      background-color: #ccc !important;
      color: #666 !important;
      border-color: #bbb !important;
      opacity: 1;
      cursor: not-allowed;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-body {
      background: white;
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
      text-align: center;
    }

  `]
})
export class UsersListComponent implements OnInit {
  users = signal<UserResponse[]>([]);
  userToDelete = signal<UserResponse | null>(null);
  currentUser = signal<UserResponse | null>(null);

  constructor(private tokenStorageService: TokenStorageService,
              private usersService: UsersService) {
  }

  ngOnInit(): void {
    this.currentUser.set(this.tokenStorageService.getUser());
    this.usersService.getAll().subscribe(data => {
      this.users.set(data);
    });
  }

  refresh() {
    this.usersService.getAll().subscribe(data => {
      this.users.set(data);
    });
  }

  askDelete(user: UserResponse) {
    this.userToDelete.set(user);
  }

  confirmDelete() {
    const user = this.userToDelete();
    if (!user) return;

    this.usersService.delete(user.id).subscribe(() => {
      this.userToDelete.set(null);
      this.refresh();
    });
  }

  cancelDelete() {
    this.userToDelete.set(null);
  }
}
