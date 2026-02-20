import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {APP_CONFIG, httpOptions, IAppConfig} from '../../app.config';
import {Cabinet} from '../../core/model/cabinet.model';

@Injectable({providedIn: 'root'})
export class CabinetsService {

  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  getAll(): Observable<any[]> {
    return this.http.get<Cabinet[]>(this.config.webEndpoint + "api/admin/cabinets", httpOptions);
  }

  getById(id: number): Observable<Cabinet> {
    return this.http.get<Cabinet>(this.config.webEndpoint + "api/admin/cabinets/" + id, httpOptions);
  }

  create(cabinet: any): Observable<any> {
    return this.http.post<Cabinet[]>(this.config.webEndpoint + "api/admin/cabinets", cabinet, httpOptions);
  }

  update(id: number, cabinet: any): Observable<any> {
    return this.http.put<Cabinet[]>(this.config.webEndpoint + "api/admin/cabinets/" + id, cabinet, httpOptions);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<Cabinet[]>(this.config.webEndpoint + "api/admin/cabinets/" + id, httpOptions);
  }

  getStats(): Observable<number> {
    return this.http.get<number>(this.config.webEndpoint + "api/admin/cabinets/count", httpOptions);
  }

  updateCabinetDetails(id: number, cabinet: any): Observable<any> {
    return this.http.put<Cabinet[]>(this.config.webEndpoint + "api/admin/cabinets/" + id + "/details", cabinet, httpOptions);
  }
}
