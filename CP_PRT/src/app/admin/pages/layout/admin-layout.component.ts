import {Component} from '@angular/core';
import {RouterLink, RouterOutlet, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TokenStorageService} from '../../../core/security/token-storage.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {
  }

  logout() {
    this.tokenStorage.signOut();
    this.router.navigate(['/login']);
  }
}
