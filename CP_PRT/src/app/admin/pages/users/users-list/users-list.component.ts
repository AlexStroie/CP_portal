import {Component, OnInit, signal} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {RegisterRequest, UserResponse} from '../../../../core/model/user.model';
import {UsersService} from '../../../../shared/service/users.service';
import {TokenStorageService} from '../../../../core/security/token-storage.service';
import {RouterLink} from '@angular/router';
import {Role} from '../../../../shared/types/role';
import {CabinetsService} from '../../../../shared/service/cabinets.service';
import {Cabinet} from '../../../../core/model/cabinet.model';
import {TranslatePipe} from '@ngx-translate/core';
import {AuthenticationService} from '../../../../core/security/authentication.service';

@Component({
  standalone: true,
  selector: 'app-users-list',
  imports: [NgClass, RouterLink, TranslatePipe],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users = signal<UserResponse[]>([]);
  cabinets = signal<Cabinet[]>([]);
  userToDelete = signal<UserResponse | null>(null);
  currentUser = signal<any | null>(null);

  inviteModalOpen = signal(false);
  inviteEmail = signal('');

  constructor(
    private usersService: UsersService,
    private cabinetService: CabinetsService,
    private tokenStorage: TokenStorageService
  ) {
  }

  ngOnInit(): void {
    this.currentUser.set(this.tokenStorage.getUser());
    this.refresh();
  }

  refresh() {
    this.usersService.getAll().subscribe(data => this.users.set(data));
    this.cabinetService.getAll().subscribe(data => this.cabinets.set(data));
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
    return user.role === Role.SUPER_ADMIN &&
      user.username === this.currentUser()?.username;
  }

  getCabinetName(cabinetId: string): string {
    const id = Number(cabinetId);
    const cabinet = this.cabinets().find(c => c.id === id);
    return cabinet ? cabinet.name : '—';
  }

  roleClass(role: string) {
    return {
      'badge-admin': role === Role.ADMIN,
      'badge-super': role === Role.SUPER_ADMIN,
      'badge-user': role === Role.USER
    };
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'active';
      case 'PENDING':
        return 'pending';
      case 'LOCKED':
        return 'locked';
      case 'DISABLED':
        return 'disabled';
      case 'DELETED':
        return 'deleted';
      default:
        return 'unknown';
    }
  }

  getStatusLabel(status: string): string {
    return `users.status.${status.toLowerCase()}`;
  }

  openInviteModal() {
    this.inviteModalOpen.set(true);
  }

  closeInviteModal() {
    this.inviteModalOpen.set(false);
    this.inviteEmail.set('');
    this.refresh();
  }

  sendInvite() {
    const email = this.inviteEmail();

    if (!email) return;

    this.usersService.invite(email).subscribe(() => {
      this.closeInviteModal();
    });
  }

  resendInvite(email: string) {
    if (!email) return;

    this.usersService.invite(email).subscribe(() => {
      this.closeInviteModal();
    });
  }
}
