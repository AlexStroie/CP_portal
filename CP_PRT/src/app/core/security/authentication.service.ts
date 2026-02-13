import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {APP_CONFIG, httpOptions, IAppConfig} from '../../app.config';
import {Role} from '../../shared/types/role';
import {LoginResponse, SwitchRequest} from '../model/user.model';
import {TokenStorageService} from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient,
              private tokenStorage: TokenStorageService,
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

  activateAccount(req: { token: string, newPassword: string }) {
    return this.http.post(this.config.webEndpoint + 'api/auth/activate', req, {responseType: 'text'});
  }

  switchContext(request: SwitchRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.config.webEndpoint + 'api/auth/switchContext',
      request,
      httpOptions
    ).pipe(
      tap(response => {
        this.tokenStorage.saveToken(response.accessToken);
        this.tokenStorage.saveUser(response);
        sessionStorage.setItem('accessToken', response.accessToken);
      })
    );
  }

  exitDelegation(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.config.webEndpoint + 'api/auth/exitDelegation',
      {}
    ).pipe(
      tap(response => {
        this.tokenStorage.saveToken(response.accessToken);
        this.tokenStorage.saveUser(response);
      })
    );
  }
}
