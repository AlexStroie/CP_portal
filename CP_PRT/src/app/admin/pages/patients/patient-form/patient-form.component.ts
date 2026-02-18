import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Patient} from '../../../../core/model/patient.model';
import {PatientsService} from '../../../../shared/service/patient.service';
import {TokenStorageService} from '../../../../core/security/token-storage.service';
import {Cabinet} from '../../../../core/model/cabinet.model';
import {CabinetsService} from '../../../../shared/service/cabinets.service';

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
  isSuperAdmin: boolean = false;

  id = signal<number | null>(null);
  patient = signal<Patient | null>(null);
  cabinets = signal<Cabinet[]>([]);
  cabinetId: string | null = '';

  form = new FormGroup({
    id: new FormControl(0),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    cabinetId: new FormControl('', Validators.required),
    notes: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private patientsService: PatientsService,
    private cabinetService: CabinetsService,
    private tokenStorage: TokenStorageService
  ) {
  }

  ngOnInit() {
    this.isSuperAdmin = this.tokenStorage.isSuperAdmin();
    const idParam = this.route.snapshot.paramMap.get('id');

    if ('create' === idParam) {
      this.cabinetId = this.tokenStorage.getCabinetId();
      this.form.patchValue({
        cabinetId: this.cabinetId
      });
    }

    if (this.isSuperAdmin) {
      this.cabinetService.getAll().subscribe(data => this.cabinets.set(data));
    }

    if (idParam) {
      const parsed = Number(idParam);
      this.id.set(parsed);
      if (!isNaN(this.id()!)) {
        this.loadPatient(parsed);
      }
    }
  }

  loadPatient(id: number) {
    this.patientsService.getById(this.id()!).subscribe(c => {
      this.patient.set(c);

      this.form.patchValue({
        id: c.id,
        cabinetId: c.cabinetId,
        firstName: c.firstName,
        lastName: c.lastName,
        dateOfBirth: c.dateOfBirth,
        phone: c.phone,
        email: c.email,
        notes: c.notes
      });
    });
  }

  save() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          console.log(key, control.errors);
        }
      });
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value as Patient;

    this.patientsService.save(data).subscribe(() => {
      this.router.navigate(['/admin/patients']);
    });
  }

}
