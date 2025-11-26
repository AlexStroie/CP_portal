import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {routes} from './app/app.routes';
import {APP_CONFIG, appConfig} from './app/app.config';
import {TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';
import {AuthInterceptor} from './app/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: APP_CONFIG, useValue: appConfig },
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
}).catch(err => console.error());
