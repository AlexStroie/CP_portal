import {AfterViewInit, ChangeDetectorRef, Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TokenStorageService} from '../../../core/security/token-storage.service';
import {UserResponse} from '../../../core/model/user.model';
import {CabinetsService} from '../../../shared/service/cabinets.service';
import {UsersService} from '../../../shared/service/users.service';
import {Appointment, AppointmentExtended} from '../../../core/model/appointment.model';
import {AppointmentService} from '../../../shared/service/appointment.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

  title: string = "Dashboard Admin";
  isSuperAdmin: boolean = false;

  stats = {
    cabinets: 0,
    users: 0
  };

  todayAppointments = signal<AppointmentExtended[]>([]);
  now = signal(new Date());

  constructor(
    private usersService: UsersService,
    private appointmentService: AppointmentService,
    private cabinetService: CabinetsService,
    private tokenStorage: TokenStorageService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.isSuperAdmin = this.tokenStorage.isSuperAdmin();

    if (!this.isSuperAdmin) {
      const user: UserResponse = this.tokenStorage.getUser();
      this.cabinetService.getById(Number(user.cabinetId)).subscribe(data => {
        this.title = data.name;
      });
    }

    const cabinetId = Number(this.tokenStorage.getCabinetId());
    this.appointmentService
      .getTodayExtendedForCabinet(cabinetId)
      .subscribe(data => {
        this.todayAppointments.set(data)
      });

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
        this.stats.users = count;
      });

      this.cabinetService.getStats().subscribe(count => {
        this.stats.cabinets = count;
      });
    }
  }

  isPast(appt: AppointmentExtended): boolean {
    return new Date(appt.endTime) < this.now();
  }

  isNext(appt: AppointmentExtended):
    boolean {
    const now = this.now().getTime();
    return new Date(appt.startTime).getTime() > now;
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }
}
