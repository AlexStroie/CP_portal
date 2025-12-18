import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
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

  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  patientControl = new FormControl('');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appointmentService: AppointmentService,
    private tokenStorage: TokenStorageService,
    public router: Router,
    private dialogRef: MatDialogRef<AppointmentCreateDialogComponent>
  ) {

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
      this.patients = data.patients();
      this.filteredPatients = this.patients;
    }


    // 👇 filtrare la tastare
    this.patientControl.valueChanges.subscribe(value => {
      this.filterPatients(value);
    });
  }

  onPatientSelected(event: MatAutocompleteSelectedEvent) {
    const fullName = event.option.value;
    this.data.patient = this.patients.find(
      p => `${p.firstName} ${p.lastName}` === fullName
    );
  }

  filterPatients(value: string | null) {
    const search = value?.toLowerCase().trim() || '';
    if (!search) {
      this.filteredPatients = this.patients;
      return;
    }

    this.filteredPatients = this.patients.filter(p =>
      p.firstName.toLowerCase().includes(search) ||
      p.lastName.toLowerCase().includes(search) ||
      (`${p.firstName} ${p.lastName}`).toLowerCase().includes(search)
    );
  }

  save() {

    if (!this.data.patient) {
      alert('Selectează un pacient');
      return;
    }

    const request: AppointmentRequest = {
      patientId: this.data.patient.id,
      cabinetId: Number(this.tokenStorage.getCabinetId()),
      userId: Number(this.tokenStorage.getUser().userId),

      date: this.formatDate(this.data.date),
      startTime: this.formatTime(this.data.startHour, this.data.startMinute),
      endTime: this.data.endTime,

      notes: this.data.notes
    };

    this.appointmentService.create(request).subscribe(() =>
      this.router.navigate(['/admin/appointments'])
    );
    this.dialogRef.close(this.data);
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
}
