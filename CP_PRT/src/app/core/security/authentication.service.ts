import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {APP_CONFIG, httpOptions, IAppConfig} from '../../app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.config.webEndpoint + 'api/auth/login', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, password: string) {
    return this.http.post(this.config.webEndpoint + 'api/auth/register', {
      username,
      password
    }, httpOptions);
  }

  activateAccount(req: { token: string, password: string }) {
    return this.http.post(this.config.webEndpoint + 'api/auth/activate', req, { responseType: 'text' });
  }
}
