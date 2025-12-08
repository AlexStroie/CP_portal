import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TokenStorageService} from '../../../core/security/token-storage.service';
import {UserResponse} from '../../../core/model/user.model';
import {CabinetsService} from '../../../shared/service/cabinets.service';
import {UsersService} from '../../../shared/service/users.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

  title: string = "Dashboard Admin";
  isSuperAdmin: boolean = false;

  stats = {
    cabinets: 0,
    users: 0
  };

  constructor(
    private usersService: UsersService,
    private cabinetService: CabinetsService,
    private tokenStorage: TokenStorageService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.isSuperAdmin = this.tokenStorage.isSuperAdmin();

    if (!this.isSuperAdmin) {
      const user: UserResponse = this.tokenStorage.getUser();
      this.cabinetService.getById(Number(user.cabinetId)).subscribe(data => {
        this.title = data.name;
      });
    }

    this.loadStats();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  loadStats() {
    if (this.isSuperAdmin) {
      this.usersService.getStats().subscribe(count => {
        this.stats.users = count;
      });

      this.cabinetService.getStats().subscribe(count => {
        this.stats.cabinets = count;
      });
    }
  }
}
