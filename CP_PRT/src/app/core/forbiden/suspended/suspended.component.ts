import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AppStateService} from '../../../shared/service/app-state.service';
import {TokenStorageService} from '../../security/token-storage.service';

@Component({
  selector: 'app-suspended',
  imports: [],
  templateUrl: './suspended.component.html',
  styleUrl: './suspended.component.css',
})
export class SuspendedComponent {

  private router = inject(Router);
  private authService = inject(TokenStorageService);
  appState = inject(AppStateService);

  logout() {
    this.appState.reset();
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

}
