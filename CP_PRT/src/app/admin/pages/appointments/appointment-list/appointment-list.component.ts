import {AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, signal, SimpleChanges} from '@angular/core';
import {AppointmentCalendar, AppointmentExtended} from '../../../../core/model/appointment.model';
import {AppointmentService} from '../../../../shared/service/appointment.service';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PatientsService} from '../../../../shared/service/patient.service';
import {TokenStorageService} from '../../../../core/security/token-storage.service';
import {AppointmentCalendarComponent} from '../appointment-calendar/appointment-calendar.component';
import {MatDialog} from '@angular/material/dialog';
import {AppointmentCreateDialogComponent} from '../appointment-create-dialog/appointment-create-dialog.component';
import {Patient} from '../../../../core/model/patient.model';
import {DateUtils} from '../utils/date-utils';

@Component({
  selector: 'app-appointment-list',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AppointmentCalendarComponent
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css',
})
export class AppointmentListComponent implements OnInit, OnChanges, AfterViewInit {

  // =========================
  // Signals
  // =========================

  appointments = signal<AppointmentExtended[]>([]);
  patients = signal<Patient[]>([]);
  appointmentsCalendar = signal<AppointmentCalendar[]>([]);

  selectedDate = new Date();
  date = new FormControl('');
  status = new FormControl('');


  constructor(
    private appointmentService: AppointmentService,
    private patientsService: PatientsService,
    private tokenStorageService: TokenStorageService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadAppointments();
  }

  private loadPatients() {
    this.patientsService.getAll().subscribe(data => this.patients.set(data));
  }

  private loadAppointments() {
    const cabinetId = Number(this.tokenStorageService.getCabinetId());
    this.appointmentService
      .getExtendedForCabinet(cabinetId)
      .subscribe(data => {
        this.appointments.set(data);
        this.appointmentsCalendar.set(this.mapToCalendar(data));
      });

  }

  private mapToCalendar(data: AppointmentExtended[]): AppointmentCalendar[] {
    return data.map(a => ({
      id: a.id,
      patientName: a.patientName,
      patientId: a.patientId,
      cabinetName: a.cabinetName,
      start: `${a.date}T${a.startTime}`,
      end: `${a.date}T${a.endTime}`,
      color: this.getColor(a)
    }));
  }

  private getColor(data: AppointmentExtended): string {
    if (DateUtils.isBeforeOrToday(data.date)) {
      return '#71788a';
    }
    return '#5b9bd5';
  }

  openCreateDialog(appt: { date: Date; startHour: number; startMinute: number; patients: Patient[] }) {
    const dialogRef = this.dialog.open(AppointmentCreateDialogComponent, {
      width: '400px',
      data: {...appt}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

  openEditDialog(appt: { date: Date; startHour: number; startMinute: number; patients: Patient[] }) {
    const dialogRef = this.dialog.open(AppointmentCreateDialogComponent, {
      width: '400px',
      data: {...appt}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

}
