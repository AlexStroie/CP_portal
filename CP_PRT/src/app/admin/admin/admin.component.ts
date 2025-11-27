import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {TokenStorageService} from '../../core/security/token-storage.service';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  username = localStorage.getItem('username');

  public constructor(protected tokenStorage: TokenStorageService,
                     protected router: Router) {
  }

  protected navigateToURL(url: string): void {
    this.router.navigate([url])
      .then(success => {
        if (!success) {
          console.warn('Navigarea a eșuat către', url);
        }
      })
      .catch(err => {
        console.error('Eroare la navigare:', err);
      });
  }

  logout(): void {
    this.tokenStorage.signOut();

    // optional – oprești și în memorie userul
    // this.authService.currentUser.next(null);

    this.router.navigate(['/login']);
  }
}
