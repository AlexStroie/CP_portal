import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { CabinetsService } from '../../../shared/service/cabinets.service';
import { TokenStorageService } from '../../../core/security/token-storage.service';
import { CommonModule } from '@angular/common';

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

  private cabinetId!: number;

  loading = false;
  saving = false;

  form = this.fb.group({
    name: ['', Validators.required],
    address: [''],
    phone: [''],
    email: ['', Validators.email],
    description: [''],
    logoUrl: ['']
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
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/admin']);
      }
    });
  }

  get canSave(): boolean {
    return this.form.valid && this.form.dirty && !this.saving;
  }

  save(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const payload = {
      ...this.form.value,
      cabinetId: this.cabinetId
    };

    this.service.updateCabinetDetails(this.cabinetId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.form.markAsPristine();
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  cancel(): void {
    this.form.reset();
    this.loadCabinet();
  }

  hasError(control: string, error: string): boolean {
    const c = this.form.get(control);
    return !!(c && c.touched && c.hasError(error));
  }
}
