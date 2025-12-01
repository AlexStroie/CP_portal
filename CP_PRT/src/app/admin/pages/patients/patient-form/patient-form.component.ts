import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Patient} from '../../../../core/model/patient.model';
import {PatientsService} from '../../../../shared/service/patient.service';

@Component({
  standalone: true,
  selector: 'app-patient-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {

  id = signal<number | null>(null);
  patient = signal<Patient | null>(null);

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    notes: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private patientsService: PatientsService
  ) {
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const parsed = Number(idParam);
      this.id.set(parsed);

      this.loadPatient(parsed);
    }
  }

  loadPatient(id: number) {
    this.patientsService.getById(this.id()!).subscribe(c => {
      this.patient.set(c);

      this.form.patchValue({
        firstName: c.firstName,
        lastName: c.lastName,
        phone: c.phone,
        email: c.email,
        notes: c.notes
      });
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value as Patient;

    this.patientsService.save(data).subscribe(() => {
      this.router.navigate(['/admin/patients']);
    });
  }

}
