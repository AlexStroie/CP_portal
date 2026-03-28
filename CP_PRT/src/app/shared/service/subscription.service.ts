import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {APP_CONFIG, httpOptions, IAppConfig} from '../../app.config';
import {SubscriptionPlan} from '../../core/model/subscription.model';

@Injectable({providedIn: 'root'})
export class SubscriptionService {

  constructor(private http: HttpClient,
              @Inject(APP_CONFIG) private config: IAppConfig) {
  }

  getAllPlans(): Observable<any[]> {
    return this.http.get<SubscriptionPlan[]>(this.config.webEndpoint + "api/admin/subscriptions/plans", httpOptions);
  }

}
