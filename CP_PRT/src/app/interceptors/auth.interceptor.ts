import {HttpErrorResponse, HttpHandler, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import { inject } from '@angular/core';
import {TokenStorageService} from '../core/security/token-storage.service';
import {catchError, EMPTY, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AppStateService} from '../shared/service/app-state.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenStorageService);
  const token = tokenService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};


export const suspendedInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const appState = inject(AppStateService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 403 &&
        error.error?.message?.includes('suspendat')) {

        appState.setCabinetSuspended(true);
        // router.navigate(['/suspended']);
        return EMPTY;
      }

      return throwError(() => error);
    })
  );
};

export const tokenExpiredInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorageService = inject(TokenStorageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        tokenStorageService.signOut();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};
