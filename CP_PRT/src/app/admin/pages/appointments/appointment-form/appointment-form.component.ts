import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PatientsService } from '../../../../shared/service/patient.service';
import { CabinetsService } from '../../../../shared/service/cabinets.service';

import { Patient } from '../../../../core/model/patient.model';
import { Cabinet } from '../../../../core/model/cabinet.model';
import {UserResponse} from '../../../../core/model/user.model';
import {UsersService} from '../../../../shared/service/users.service';
import {AppointmentService} from '../../../../shared/service/appointment.service';
import {Appointment, AppointmentRequest} from '../../../../core/model/appointment.model';
import {TimePickerComponent} from '../../../../core/utils/time-picker/time-picker.component';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TimePickerComponent],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css',
})
export class AppointmentFormComponent implements OnInit {

  hours = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));
  minutes = ['00', '15', '30', '45'];

  id = signal<number | null>(null);
  appointment = signal<Appointment | null>(null);

  patients = signal<Patient[]>([]);
  users = signal<UserResponse[]>([]);
  cabinets = signal<Cabinet[]>([]);

  form = new FormGroup({
    patientId: new FormControl(0, Validators.required),
    userId: new FormControl(0, Validators.required),
    cabinetId: new FormControl(0, Validators.required),

    date: new FormControl('', Validators.required),
    startTime: new FormControl('', Validators.required),
    endTime: new FormControl('', Validators.required),

    notes: new FormControl('')
  });

  constructor(
    private route: ActivatedRoute,
    public router: Router,

    private appointmentService: AppointmentService,
    private patientService: PatientsService,
    private userService: UsersService,
    private cabinetService: CabinetsService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    // load dropdown data
    this.patientService.getAll().subscribe(p => this.patients.set(p));
    this.userService.getAll().subscribe(u => this.users.set(u));
    this.cabinetService.getAll().subscribe(c => this.cabinets.set(c));

    if (idParam) {
      const parsed = Number(idParam);
      this.id.set(parsed);
      if (!isNaN(parsed)) {
        this.loadAppointment(parsed);
      }
    }
  }

  loadAppointment(id: number) {
    this.appointmentService.get(id).subscribe(ap => {
      this.appointment.set(ap);

      this.form.patchValue({
        patientId: ap.patientId,
        userId: ap.userId,
        cabinetId: ap.cabinetId,
        date: ap.date,
        startTime: ap.startTime,
        endTime: ap.endTime,
        notes: ap.notes
      });
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value as AppointmentRequest;

    if (this.id()) {
      this.appointmentService.update(this.id()!, data).subscribe(() =>
        this.router.navigate(['/admin/appointments'])
      );
    } else {
      this.appointmentService.create(data).subscribe(() =>
        this.router.navigate(['/admin/appointments'])
      );
    }
  }
}
