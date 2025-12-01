import {Inject, Injectable} from '@angular/core';
import {Patient} from '../../core/model/patient.model';
import {HttpClient} from '@angular/common/http';
import {APP_CONFIG, httpOptions, IAppConfig} from '../../app.config';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientsService {

  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  getAll(): Observable<any[]> {
    return this.http.get<Patient[]>(this.config.webEndpoint + "api/admin/patients", httpOptions);
  }

  getById(id: number): Observable<Patient> {
    return this.http.get<Patient>(this.config.webEndpoint + "api/admin/patients/" + id, httpOptions);
  }

  save(patient: any): Observable<any> {
    return this.http.post<Patient[]>(this.config.webEndpoint + "api/admin/patients", patient, httpOptions);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<Patient[]>(this.config.webEndpoint + "api/admin/patients/" + id, httpOptions);
  }

  getStats(): Observable<number> {
    return this.http.get<number>(this.config.webEndpoint + "api/admin/patients/count", httpOptions);
  }
}
