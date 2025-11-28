import {
  ApplicationConfig,
  InjectionToken,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';

import {provideRouter, RouteReuseStrategy} from '@angular/router';
import {routes} from './app.routes';
import {HttpHeaders, provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {DisableRouteReuseStrategy} from './core/disable-route-reuse.strategy';
import {authInterceptor} from './interceptors/auth.interceptor';


export let APP_CONFIG = new InjectionToken("app.config");

export interface IAppConfig extends ApplicationConfig {
  webEndpoint: string;
}

export const appConfig: IAppConfig = {
  webEndpoint: "http://localhost:8080/web/v1/",
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    {
      provide: RouteReuseStrategy,
      useClass: DisableRouteReuseStrategy
    }
  ]
};

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

