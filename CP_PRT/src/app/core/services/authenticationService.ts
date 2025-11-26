import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APP_CONFIG, IAppConfig} from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) private config: IAppConfig) {
  }

}
