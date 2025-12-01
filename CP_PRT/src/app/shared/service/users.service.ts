import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {APP_CONFIG, httpOptions, IAppConfig} from '../../app.config';
import {UserResponse} from '../../core/model/user.model';

@Injectable({providedIn: 'root'})
export class UsersService {

  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  getAll(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.config.webEndpoint + "api/admin/users", httpOptions);
  }

  getById(id: number): Observable<any> {
    return this.http.get<UserResponse[]>(this.config.webEndpoint + "api/admin/users/" + id, httpOptions);
  }

  create(user: any): Observable<any> {
    return this.http.post<UserResponse[]>(this.config.webEndpoint + "api/admin/users", user, httpOptions);
  }

  update(id: number, user: any): Observable<any> {
    return this.http.put<UserResponse[]>(this.config.webEndpoint + "api/admin/users/" + id, user, httpOptions);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<UserResponse[]>(this.config.webEndpoint + "api/admin/users/" + id, httpOptions);
  }

  getStats(): Observable<number> {
    return this.http.get<number>(this.config.webEndpoint + "api/admin/users/count", httpOptions);
  }
}
