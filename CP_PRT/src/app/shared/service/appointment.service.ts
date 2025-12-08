import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APP_CONFIG, httpOptions, IAppConfig} from '../../app.config';
import {Appointment, AppointmentExtended, AppointmentRequest} from '../../core/model/appointment.model';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AppointmentService {

  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  getAll() {
    return this.http.get<Appointment[]>(this.config.webEndpoint + "api/admin/appointments", httpOptions);
  }

  get(id: number) {
    return this.http.get<Appointment>(this.config.webEndpoint + "api/admin/appointments/" + id, httpOptions);
  }

  getByCabinet(id: number) {
    return this.http.get<Appointment[]>(this.config.webEndpoint + "api/admin/appointments/by-cabinet/" + id, httpOptions);
  }

  create(ap: AppointmentRequest): Observable<any> {
    return this.http.post<Appointment[]>(this.config.webEndpoint + "api/admin/appointments", ap, httpOptions);
  }

  update(id: number, ap: AppointmentRequest): Observable<any> {
    return this.http.put<Appointment[]>(this.config.webEndpoint + "api/admin/appointments/" + id, ap, httpOptions);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<Appointment[]>(this.config.webEndpoint + "api/admin/appointments/" + id, httpOptions);
  }

  getExtendedForCabinet(cabinetId: number) {
    return this.http.get<AppointmentExtended[]>(this.config.webEndpoint + "api/admin/appointments/extended/cabinet/" + cabinetId, httpOptions);
  }
}
