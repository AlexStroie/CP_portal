import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CommonModule, DatePipe} from '@angular/common';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatOption} from '@angular/material/select';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {Patient} from '../../../../core/model/patient.model';
import {AppointmentService} from '../../../../shared/service/appointment.service';
import {AppointmentRequest} from '../../../../core/model/appointment.model';
import {Router} from '@angular/router';
import {TokenStorageService} from '../../../../core/security/token-storage.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'cp-appointments-calendar',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatFormField,
    MatLabel,
    FormsModule,
    MatOption,
    MatAutocomplete,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatInput
  ],
  templateUrl: './appointment-create-dialog.component.html',
  styleUrls: ['./appointment-create-dialog.component.css']
})
export class AppointmentCreateDialogComponent {

  errorMessage = '';
  isEdit = false;
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  patientControl = new FormControl();
  displayPatient = (p: Patient | null): string =>
    p ? `${p.firstName} ${p.lastName}` : '';

  editDate!: string;      // yyyy-MM-dd
  editStartTime!: string; // HH:mm
  private appointmentId: number = 0;
  patientName: string = "";

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appointmentService: AppointmentService,
    private tokenStorage: TokenStorageService,
    public router: Router,
    private dialogRef: MatDialogRef<AppointmentCreateDialogComponent>
  ) {

    this.isEdit = !!this.data.appointment;

    // endTime default
    if (!data.endTime) {
      const start = `${data.startHour.toString().padStart(2, '0')}:${data.startMinute
        .toString()
        .padStart(2, '0')}`;

      data.endTime = this.addMinutes(start, 45); // 14:45 ✔️
    }

    if (!data.status) {
      data.status = 'pending';
    }

    // 👇 pacienți veniți din părinte
    if (data.patients) {
      this.patients = data.patients;
      this.filteredPatients = this.patients;
    }

    if (data.appointment && this.data.appointment?.patientId) {
      const patient = this.patients.find(
        p => p.id === this.data.appointment.patientId
      );

      if (patient) {
        this.patientControl.setValue(patient, {emitEvent: false});
      }
    }

    if (this.isEdit) {
      this.appointmentId = this.data.appointment.id;
      const start = new Date(this.data.appointment.start);

      var patientEdit = this.patients.find(
        p => p.id === this.data.appointment.patientId
      );
      if (patientEdit) {
        this.patientName = patientEdit.firstName + ' ' + patientEdit.lastName;
      }

      this.editDate = start.toISOString().split('T')[0]; // yyyy-MM-dd
      this.editStartTime = `${start.getHours().toString().padStart(2, '0')}:${start
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    } else {

      // 👇 filtrare la tastare
      this.patientControl.valueChanges.subscribe(value => {
        this.filterPatients(value);
      });
    }
  }

  onPatientSelected(event: MatAutocompleteSelectedEvent) {
    const fullName = event.option.value;
    this.data.patient = this.patients.find(
      p => `${p.firstName} ${p.lastName}` === fullName
    );
  }

  filterPatients(value: string | Patient | null) {
    const search =
      typeof value === 'string'
        ? value.toLowerCase()
        : value
          ? `${value.firstName} ${value.lastName}`.toLowerCase()
          : '';

    if (!search) {
      this.filteredPatients = this.patients;
      return;
    }

    this.filteredPatients = this.patients.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(search)
    );
  }

  save() {
    const selectedPatient = this.patientControl.value;

    if (!selectedPatient) {
      this.errorMessage = 'Selectează un pacient';

      setTimeout(() => {
        this.errorMessage = '';
      }, 10000);
      return;
    }

    if (this.isEdit) {
      const [h, m] = this.editStartTime.split(':').map(Number);

      this.data.date = new Date(this.editDate);
      this.data.startHour = h;
      this.data.startMinute = m;
    } else {
      this.appointmentId = 0;
    }

    const request: AppointmentRequest = {
      appointmentId: this.appointmentId,
      patientId: selectedPatient.id,
      cabinetId: Number(this.tokenStorage.getCabinetId()),
      userId: Number(this.tokenStorage.getUser().userId),

      date: this.formatDate(this.data.date),
      startTime: this.formatTime(this.data.startHour, this.data.startMinute),
      endTime: this.data.endTime,

      notes: this.data.notes
    };

    this.appointmentService.create(request).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.router.navigate(['/admin/appointments']);
      },
      error: (err) => {
        this.errorMessage = '⚠ ' + err.error?.message || '⚠ ';

        setTimeout(() => {
          this.errorMessage = '';
        }, 10000)
      }
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatTime(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`;
  }

  close() {
    this.dialogRef.close(null);
  }

  addMinutes(time: string, minutesToAdd: number): string {
    const [h, m] = time.split(':').map(Number);
    const total = h * 60 + m + minutesToAdd;

    const hh = Math.floor(total / 60) % 24;
    const mm = total % 60;

    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  }

  protected cancelAppointment() {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '360px',
        data: {
          message: 'Ești sigur că vrei să anulezi această programare?'
        }
      })
      .afterClosed()
      .subscribe(result => {
        if (result === true) {
          this.deleteAppointment();
        }
      });
  }

  private deleteAppointment() {
    this.appointmentService.delete(this.data.appointment.id).subscribe(() => {
        this.dialogRef.close(true); // trimitem semnal că s-a creat
      }
    );
  }
}
