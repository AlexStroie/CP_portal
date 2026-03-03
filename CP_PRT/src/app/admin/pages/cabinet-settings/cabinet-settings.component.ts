import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { CabinetsService } from '../../../shared/service/cabinets.service';
import { TokenStorageService } from '../../../core/security/token-storage.service';

@Component({
  selector: 'app-cabinet-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './cabinet-settings.component.html',
  styleUrls: ['./cabinet-settings.component.css']
})
export class CabinetSettingsComponent implements OnInit {

  private fb = inject(FormBuilder);
  private service = inject(CabinetsService);
  private tokenService = inject(TokenStorageService);
  private router = inject(Router);

  activeTab: 'general' | 'program' = 'general';

  private cabinetId!: number;

  loading = false;
  savingGeneral = false;
  savingProgram = false;

  // 🔹 General form
  form = this.fb.group({
    name: ['', Validators.required],
    address: [''],
    phone: [''],
    email: ['', Validators.email],
    description: [''],
    logoUrl: ['']
  });

  // 🔹 Program form
  programForm = this.fb.group({
    startHour: ['08:00', Validators.required],
    endHour: ['18:00', Validators.required],
    slotDuration: [30, Validators.required],
    workingDays: this.fb.group({
      mon: [true],
      tue: [true],
      wed: [true],
      thu: [true],
      fri: [true],
      sat: [false],
      sun: [false]
    })
  });

  ngOnInit(): void {

    const rawId = this.tokenService.getCabinetId();
    if (!rawId) {
      this.router.navigate(['/admin']);
      return;
    }

    const parsedId = Number(rawId);
    if (isNaN(parsedId)) {
      this.router.navigate(['/admin']);
      return;
    }

    this.cabinetId = parsedId;
    this.loadCabinet();
  }

  private loadCabinet(): void {
    this.loading = true;

    this.service.getById(this.cabinetId).subscribe({
      next: (cabinet) => {
        this.form.patchValue({
          name: cabinet.name,
          address: cabinet.address,
          phone: cabinet.phone,
          email: cabinet.email,
          description: cabinet.description,
          logoUrl: cabinet.logoUrl
        });

        // optional: patch program settings when backend supports it

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/admin']);
      }
    });
  }

  // =============================
  // SAVE GENERAL
  // =============================

  get canSaveGeneral(): boolean {
    return this.form.valid && this.form.dirty && !this.savingGeneral;
  }

  saveGeneral(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.savingGeneral = true;

    const payload = {
      ...this.form.value,
      cabinetId: this.cabinetId
    };

    this.service.updateCabinetDetails(this.cabinetId, payload).subscribe({
      next: () => {
        this.savingGeneral = false;
        this.form.markAsPristine();
      },
      error: () => {
        this.savingGeneral = false;
      }
    });
  }

  cancelGeneral(): void {
    this.form.reset();
    this.loadCabinet();
  }

  // =============================
  // SAVE PROGRAM
  // =============================

  get canSaveProgram(): boolean {
    return this.programForm.valid && this.programForm.dirty && !this.savingProgram;
  }

  saveProgram(): void {
    if (this.programForm.invalid) {
      this.programForm.markAllAsTouched();
      return;
    }

    this.savingProgram = true;

    const payload = {
      cabinetId: this.cabinetId,
      ...this.programForm.value
    };

    // TODO: implement endpoint in service
    console.log('Program payload', payload);

    setTimeout(() => {
      this.savingProgram = false;
      this.programForm.markAsPristine();
    }, 800);
  }

  hasError(control: string, error: string): boolean {
    const c = this.form.get(control);
    return !!(c && c.touched && c.hasError(error));
  }
}
