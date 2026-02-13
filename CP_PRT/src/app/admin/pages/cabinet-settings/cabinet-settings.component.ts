import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CabinetsService} from '../../../shared/service/cabinets.service';

@Component({
  selector: 'app-cabinet-settings',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './cabinet-settings.component.html',
  styleUrl: './cabinet-settings.component.css',
})
export class CabinetSettingsComponent implements OnInit {

  cabinetForm!: FormGroup;
  loading = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private cabinetService: CabinetsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCabinetDetails();
  }

  initForm() {
    this.cabinetForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      phone: [''],
      email: ['', Validators.email],
      description: [''],
      logoUrl: ['']
    });
  }

  loadCabinetDetails() {
    this.loading = true;
    this.cabinetService.getCabinetDetails().subscribe({
      next: (data) => {
        this.cabinetForm.patchValue(data);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  save() {
    if (this.cabinetForm.invalid) return;

    this.loading = true;
    this.cabinetService.updateCabinetDetails(this.cabinetForm.value)
      .subscribe({
        next: () => {
          this.successMessage = 'Datele au fost salvate cu succes.';
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }
}
