import {
  ApplicationConfig,
  InjectionToken,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';

import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {HttpHeaders} from "@angular/common/http";


export let APP_CONFIG = new InjectionToken("app.config");

export interface IAppConfig extends ApplicationConfig {
  webEndpoint: string;
  apiEndpoint: string;
}

export const appConfig: IAppConfig = {
  webEndpoint: "http://localhost:8080/web/v1/",
  apiEndpoint: "http://localhost:9095/api/images/",
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};

const auth_token = 'Token Oi7qRgyi1RgdqpM_OUhjE89DoC2fQ9Yv';

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': auth_token
  })
};

export const httpMediaOptions = {
  headers: new HttpHeaders({
    'Authorization': auth_token
  })
};
