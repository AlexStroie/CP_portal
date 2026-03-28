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
      case 'BASIC':
        return 'badge-plan-basic';
      case 'PRO':
        return 'badge-plan-pro';
      case 'PREMIUM':
        return 'badge-plan-premium';
      default:
        return 'badge-plan';
    }
  }
}
