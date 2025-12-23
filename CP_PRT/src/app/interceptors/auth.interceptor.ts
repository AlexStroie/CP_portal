import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {TokenStorageService} from '../core/security/token-storage.service';

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
