import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {TokenStorageService} from '../core/security/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("INTERCEPTOR A RULAT!");

  const tokenService = inject(TokenStorageService);
  const token = tokenService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  console.log("REQ:", req.url);
  console.log("REQ:", req.headers);

  return next(req);
};
