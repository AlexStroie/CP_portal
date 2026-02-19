import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../../../../core/model/patient.model';
import { PatientsService } from '../../../../shared/service/patient.service';
import { TokenStorageService } from '../../../../core/security/token-storage.service';
import { Cabinet } from '../../../../core/model/cabinet.model';
import { CabinetsService } from '../../../../shared/service/cabinets.service';

@Component({
  standalone: true,
  selector: 'app-patient-form',
  imports: [ReactiveFormsModule],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {

  isSuperAdmin = signal(false);
  id = signal<number | null>(null);
  cabinets = signal<Cabinet[]>([]);

  form = new FormGroup({
    id: new FormControl<number | null>(null),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    cabinetId: new FormControl('', Validators.required),
    notes: new FormControl('')
  });

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private patientsService: PatientsService,
    private cabinetService: CabinetsService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit() {
    this.isSuperAdmin.set(this.tokenStorage.isSuperAdmin());

    if (this.isSuperAdmin()) {
      this.form.get('cabinetId')?.setValidators([Validators.required]);
      this.cabinetService.getAll().subscribe(data => this.cabinets.set(data));
    } else {
      this.form.get('cabinetId')?.clearValidators();
      this.form.patchValue({
        cabinetId: this.tokenStorage.getCabinetId()
      });
    }

    this.form.get('cabinetId')?.updateValueAndValidity();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam && idParam !== 'create') {
      const parsed = Number(idParam);
      if (!isNaN(parsed)) {
        this.id.set(parsed);
        this.loadPatient(parsed);
      }
    }
  }

  loadPatient(id: number) {
    this.patientsService.getById(id).subscribe(p => {
      this.form.patchValue(p);
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.patientsService.save(this.form.value as Patient)
      .subscribe(() => this.router.navigate(['/admin/patients']));
  }

  hasError(control: string, error: string): boolean {
    const c = this.form.get(control);
    return !!(c && c.touched && c.hasError(error));
  }
}
