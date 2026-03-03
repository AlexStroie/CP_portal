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

  create(ap: AppointmentRequest): Observable<any> {
    return this.http.post<Appointment[]>(this.config.webEndpoint + "api/admin/appointments", ap, httpOptions);
  }

  delete(id: number, series: boolean): Observable<void> {
    return this.http.delete<void>(
      `${this.config.webEndpoint}api/admin/appointments/${id}`,
      {
        ...httpOptions,
        params: {series: series}
      }
    );
  }

  getExtendedForCabinet(cabinetId: number) {
    return this.http.get<AppointmentExtended[]>(`${this.config.webEndpoint}api/admin/appointments/extended/cabinet/${cabinetId}`, httpOptions);
  }

  getTodayExtendedForCabinet(cabinetId: number) {
    return this.http.get<AppointmentExtended[]>(`${this.config.webEndpoint}api/admin/appointments/extended/today/cabinet/${cabinetId}`, httpOptions);
  }
}
