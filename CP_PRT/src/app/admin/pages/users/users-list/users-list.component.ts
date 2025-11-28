import { Component, OnInit, signal } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import {UserResponse} from '../../../../core/model/user.model';
import {UsersService} from '../../../../shared/service/users.service';
import {TokenStorageService} from '../../../../core/security/token-storage.service';
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-users-list',
  imports: [NgClass, RouterLink],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users = signal<UserResponse[]>([]);
  userToDelete = signal<UserResponse | null>(null);
  currentUser = signal<any | null>(null);

  constructor(
    private usersService: UsersService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.currentUser.set(this.tokenStorage.getUser());
    this.refresh();
  }

  refresh() {
    this.usersService.getAll().subscribe(data => this.users.set(data));
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

  isDeleteDisabled(user: UserResponse): boolean {
    return user.role === 'SUPER_ADMIN' &&
      user.username === this.currentUser()?.username;
  }

  roleClass(role: string) {
    return {
      'badge-admin': role === 'ADMIN',
      'badge-super': role === 'SUPER_ADMIN',
      'badge-user': role === 'USER'
    };
  }
}
