import {AfterViewInit, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TokenStorageService} from '../../../core/security/token-storage.service';
import {UserResponse} from '../../../core/model/user.model';
import {AuthenticationService} from '../../../core/security/authentication.service';
import {AppStateService} from '../../../shared/service/app-state.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, TranslatePipe],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {

  isSuperAdmin: boolean = false;
  userFullName: string = 'Admin';
  isDelegated: boolean = false;

  appState = inject(AppStateService);

  constructor(
    public tokenStorage: TokenStorageService,
    public authService: AuthenticationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isSuperAdmin = this.tokenStorage.isSuperAdmin();
    this.isDelegated = this.tokenStorage.isDelegated();

    const user: UserResponse = this.tokenStorage.getUser();
    if (user && user.username) {
      this.userFullName = user.username;
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  logout() {
    this.tokenStorage.signOut();
    this.router.navigate(['/login']);
  }

  exitImpersonation() {
    this.authService.exitDelegation()
      .subscribe(() => {
        this.router.navigate(['/admin/cabinets']);
      });
  }
}
