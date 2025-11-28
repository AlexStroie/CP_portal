import {
  ApplicationConfig,
  InjectionToken,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';

import {provideRouter, RouteReuseStrategy} from '@angular/router';
import {routes} from './app.routes';
import {HttpHeaders} from "@angular/common/http";
import {DisableRouteReuseStrategy} from './core/disable-route-reuse.strategy';


export let APP_CONFIG = new InjectionToken("app.config");

export interface IAppConfig extends ApplicationConfig {
  webEndpoint: string;
}

export const appConfig: IAppConfig = {
  webEndpoint: "http://localhost:8080/web/v1/",
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
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

