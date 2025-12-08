import {Component, computed, OnInit, signal} from '@angular/core';
import {AppointmentExtended} from '../../../../core/model/appointment.model';
import {AppointmentService} from '../../../../shared/service/appointment.service';
import {RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CabinetsService} from '../../../../shared/service/cabinets.service';
import {PatientsService} from '../../../../shared/service/patient.service';
import {UsersService} from '../../../../shared/service/users.service';
import {debounceTime} from 'rxjs/operators';
import {TokenStorageService} from '../../../../core/security/token-storage.service';
import {UserResponse} from '../../../../core/model/user.model';

@Component({
  selector: 'app-appointment-list',
  imports: [
    RouterLink,
    NgClass,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css',
})
export class AppointmentListComponent implements OnInit {

  // =========================
  // Signals
  // =========================

  appointments = signal<AppointmentExtended[]>([]);
  appointmentToDelete = signal<AppointmentExtended | null>(null);

  // filters
  patientName = new FormControl('');
  date = new FormControl('');
  status = new FormControl('');

  // maps for readable names
  cabinetMap = new Map<number, string>();
  patientMap = new Map<number, string>();
  userMap = new Map<number, string>();

  // sorting
  sortField = signal<string | null>(null);
  sortDir = signal<string>('asc');

  private filterState = signal({
    patientName: '',
    date: '',
    status: ''
  });

  constructor(
    private appointmentService: AppointmentService,
    private cabinetsService: CabinetsService,
    private patientsService: PatientsService,
    private userService: UsersService,
    private tokenStorage: TokenStorageService
  ) {
  }

  ngOnInit(): void {
    this.loadMaps();
    this.bindFilters();
    this.refresh();
  }

  // =========================
  // Load map data
  // =========================

  loadMaps() {
    this.cabinetsService.getAll().subscribe(cabs => {
      cabs.forEach(c => this.cabinetMap.set(c.id, c.name));
    });

    this.patientsService.getAll().subscribe(ps => {
      ps.forEach(p => this.patientMap.set(p.id, `${p.lastName} ${p.firstName}`));
    });

    this.userService.getAll().subscribe(users => {
      users.forEach(u => this.userMap.set(u.id, u.fullName));
    });
  }

  // =========================
  // Filter binding
  // =========================

  private bindFilters() {
    this.patientName.valueChanges.pipe(debounceTime(300))
      .subscribe(() => this.updateFilterState());

    this.date.valueChanges.subscribe(() => this.updateFilterState());
    this.status.valueChanges.subscribe(() => this.updateFilterState());
  }

  private updateFilterState() {
    this.filterState.set({
      patientName: this.patientName.value ?? '',
      date: this.date.value ?? '',
      status: this.status.value ?? ''
    });
  }

  // =========================
  // Filtered + Sorted computed list
  // =========================

  filteredAppointments = computed(() => {
    const list = this.appointments();
    const f = this.filterState();

    let result = list.filter(ap => {
      if (f.patientName) {
        const pn = (ap.patientName ?? '').toLowerCase();
        if (!pn.includes(f.patientName.toLowerCase())) return false;
      }

      if (f.date && ap.date !== f.date) return false;

      if (f.status && ap.status !== f.status) return false;

      return true;
    });

    return this.sortList(result);
  });

  private sortList(list: AppointmentExtended[]) {
    const field = this.sortField();
    const dir = this.sortDir();

    if (!field) return list;

    return [...list].sort((a, b) => {
      const valA = this.getSortValue(a, field);
      const valB = this.getSortValue(b, field);

      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private getSortValue(ap: AppointmentExtended, field: string): any {
    switch (field) {
      case 'patient':
        return ap.patientName.toLowerCase();
      case 'date':
        return ap.date;
      case 'status':
        return ap.status;
      default:
        return '';
    }
  }

  // =========================
  // Actions
  // =========================

  refresh() {
    const user: UserResponse = this.tokenStorage.getUser();
    const cabinetId = user.cabinetId;

    this.appointmentService.getExtendedForCabinet(Number(cabinetId))
      .subscribe(data => this.appointments.set(data));
  }

  askDelete(ap: AppointmentExtended) {
    this.appointmentToDelete.set(ap);
  }

  confirmDelete() {
    const ap = this.appointmentToDelete();
    if (!ap) return;

    this.appointmentService.delete(ap.id).subscribe(() => {
      this.appointmentToDelete.set(null);
      this.refresh();
    });
  }

  cancelDelete() {
    this.appointmentToDelete.set(null);
  }

  isDeleteDisabled(ap: AppointmentExtended) {
    return ap.status === 'COMPLETED';
  }
}
