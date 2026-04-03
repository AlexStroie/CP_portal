import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {APP_CONFIG, httpOptions, IAppConfig} from '../../app.config';
import {Role} from '../../shared/types/role';
import {
  ActivateAccountRequest, ChangePasswordRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse, ResetPasswordRequest,
  SwitchRequest
} from '../model/user.model';
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

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      this.config.webEndpoint + 'api/auth/register',
      request,
      httpOptions
    );
  }

  activateAccount(request: ActivateAccountRequest) {
    return this.http.post(this.config.webEndpoint + 'api/auth/activate', request, {responseType: 'text'});
  }

  forgotPassword(emailAddress: string) {
    return this.http.post(this.config.webEndpoint + 'api/auth/forgotPassword', emailAddress, httpOptions);
  }

  resetPassword(resetRequest: ResetPasswordRequest) {
    return this.http.post(
      this.config.webEndpoint + 'api/auth/resetPassword',
      resetRequest,
      {responseType: 'text'}
    );
  }

 changePassword(changePasswordRequest: ChangePasswordRequest) {
    return this.http.post(
      this.config.webEndpoint + 'api/auth/changePassword',
      changePasswordRequest,
      {responseType: 'text'}
    );
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
