import {AfterViewInit, ChangeDetectorRef, Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {TokenStorageService} from '../../../core/security/token-storage.service';
import {UserResponse} from '../../../core/model/user.model';
import {CabinetsService} from '../../../shared/service/cabinets.service';
import {UsersService} from '../../../shared/service/users.service';
import {AppointmentExtended} from '../../../core/model/appointment.model';
import {AppointmentService} from '../../../shared/service/appointment.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Cabinet} from '../../../core/model/cabinet.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

  shouldDisplayExpiryWarning: boolean = false;
  expiryMessage: string = "";
  remainingDays: number = 0;

  title: string;
  setupCompleted: boolean = true;
  isSuperAdmin: boolean = false;

  stats = {
    totalCabinets: 0,
    totalUsers: 0,
    totalPatients: 0,
    totalAppointments: 0,
    monthlyGrowth: 0,
    activeCabinets: 0
  };

  todayAppointments = signal<AppointmentExtended[]>([]);
  now = signal(new Date());

  constructor(
    private usersService: UsersService,
    private appointmentService: AppointmentService,
    private cabinetService: CabinetsService,
    private tokenStorage: TokenStorageService,
    private translate: TranslateService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.title = this.translate.instant('dashboard.title');
  }

  ngOnInit(): void {
    this.isSuperAdmin = this.tokenStorage.isSuperAdmin();

    if (!this.isSuperAdmin) {
      const user: UserResponse = this.tokenStorage.getUser();
      this.cabinetService.getById(Number(user.cabinetId)).subscribe(data => {
        this.title = data.name;
        this.setupCompleted = data.setupCompleted;
        this.shouldDisplayExpiryWarning = this.shouldShowExpiryWarning(data);
        this.expiryMessage = this.getExpiryMessage(data);
        this.remainingDays = this.getDaysRemaining(data);
      });

      const cabinetId = Number(this.tokenStorage.getCabinetId());
      this.appointmentService
        .getTodayExtendedForCabinet(cabinetId)
        .subscribe(data => {
          this.todayAppointments.set(data)
        });
    }

    // refresh "now" la fiecare minut
    setInterval(() => this.now.set(new Date()), 60000);
    this.loadStats();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  loadStats() {
    if (this.isSuperAdmin) {
      this.usersService.getStats().subscribe(count => {
        this.stats.totalUsers = count;
      });

      this.cabinetService.getStats().subscribe(count => {
        this.stats.totalCabinets = count;
      });
    }
  }

  isPast(appt: AppointmentExtended): boolean {
    return appt.endTime.substring(0, 5) < this.now().getHours() + ':' + this.now().getMinutes();
  }

  isNow(appt: AppointmentExtended): boolean {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const [sh, sm] = appt.startTime.substring(0, 5).split(':').map(Number);
    const [eh, em] = appt.endTime.substring(0, 5).split(':').map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }

  isNext(a: AppointmentExtended): boolean {
    return this.getNextAppointment()?.id === a.id;
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }

  getNextAppointment(): AppointmentExtended | null {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    return this.todayAppointments().find(a => {
      const [h, m] = a.startTime.substring(0, 5).split(':').map(Number);
      const apptMinutes = h * 60 + m;
      return apptMinutes >= nowMinutes;
    }) ?? null;
  }

  getMinutesUntil(startTime: string): number {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();

    const [h, m] = startTime.substring(0, 5).split(':').map(Number);
    const apptMin = h * 60 + m;

    return apptMin - nowMin;
  }

  protected goToSettings() {
    this.router.navigate(['/admin/cabinet-settings']);
  }

  dismiss(event: Event) {
    event.stopPropagation();
    this.setupCompleted = false;
  }

  getEffectiveExpiryDate(cabinet: Cabinet): Date | null {
    if (cabinet.subscriptionStatus === 'TRIAL' && cabinet.trialEndDate) {
      return new Date(cabinet.trialEndDate);
    }

    if (cabinet.subscriptionStatus === 'ACTIVE' && cabinet.endDate) {
      return new Date(cabinet.endDate);
    }

    return null;
  }

  getDaysRemaining(cabinet: Cabinet): number {
    const expiryDate = this.getEffectiveExpiryDate(cabinet);

    if (!expiryDate) {
      return 0;
    }

    const diffMs = expiryDate.getTime() - Date.now();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(0, days);
  }

  shouldShowExpiryWarning(cabinet: Cabinet): boolean {
    const days = this.getDaysRemaining(cabinet);

    return days !== null && days >= 0 && days <= 7;
  }

  getExpiryMessage(cabinet: Cabinet): string {
    const days = this.getDaysRemaining(cabinet);

    const plural = days > 1;

    if (cabinet.subscriptionStatus === 'TRIAL') {
      if (days == 0) {
        return 'subscription.message.expiresTodayTrial';
      }
      return plural
        ? 'subscription.message.trialExpiresPlural'
        : 'subscription.message.trialExpires';
    }

    if (cabinet.subscriptionStatus === 'ACTIVE') {
      if (days == 0) {
        return 'subscription.message.expiresTodaySubscription';
      }
      return plural
        ? 'subscription.message.subscriptionExpiresPlural'
        : 'subscription.message.subscriptionExpires';
    }

    return '';
  }
}
