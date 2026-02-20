import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AppStateService} from '../shared/service/app-state.service';

export const cabinetActiveGuard: CanActivateFn = () => {

  const appState = inject(AppStateService);
  const router = inject(Router);

  if (appState.isCabinetSuspended()) {
    // router.navigate(['/suspended']);
    return false;
  }

  return true;
}
