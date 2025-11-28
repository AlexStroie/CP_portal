import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig, APP_CONFIG } from './app/app.config';
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    { provide: APP_CONFIG, useValue: appConfig },
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
});
