import {Component, OnInit, signal} from '@angular/core';
import {SubscriptionPlan} from '../../../core/model/subscription.model';
import {SubscriptionService} from '../../../shared/service/subscription.service';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {DatePipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-subscriptions',
  imports: [
    TranslatePipe,
    RouterLink,
    DatePipe,
    NgClass
  ],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css',
})
export class SubscriptionsComponent implements OnInit{

  plans = signal<SubscriptionPlan[]>([]);
  planToDelete = signal<SubscriptionPlan | null>(null);

  constructor(
    private plansService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.plansService.getAllPlans().subscribe(data => this.plans.set(data));
  }

  askDelete(plan: SubscriptionPlan) {
    this.planToDelete.set(plan);
  }

  confirmDelete() {
    const plan = this.planToDelete();
    if (!plan) return;

    // this.plansService.delete(plan.id).subscribe(() => {
    //   this.planToDelete.set(null);
    //   this.refresh();
    // });
  }

  cancelDelete() {
    this.planToDelete.set(null);
  }

  getPlanClass(code: string) {
    switch (code) {
      case 'BRONZE':
        return 'badge-plan-bronze';
      case 'SILVER':
        return 'badge-plan-silver';
      case 'GOLD':
        return 'badge-plan-gold';
      case 'PLATINUM':
        return 'badge-plan-platinum';
      default:
        return 'badge-plan';
    }
  }
}
