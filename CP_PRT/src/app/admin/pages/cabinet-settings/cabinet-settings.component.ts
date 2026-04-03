import {Component, OnInit, inject} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup, NonNullableFormBuilder
} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';

import {CabinetsService} from '../../../shared/service/cabinets.service';
import {TokenStorageService} from '../../../core/security/token-storage.service';
import {CabinetSettings} from '../../../core/model/cabinet.model';
import {NotificationService} from '../../../core/services/notification.service';

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
class CabinetSettingsComponent implements OnInit {

  private fb = inject(FormBuilder);
  private programFormBuilder = inject(NonNullableFormBuilder);
  private service = inject(CabinetsService);
  private notification = inject(NotificationService);
  private tokenService = inject(TokenStorageService);
  private translate = inject(TranslateService);
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
  programForm = this.programFormBuilder.group({
    startHour: ['08:00', Validators.required],
    endHour: ['18:00', Validators.required],
    slotDuration: [30, Validators.required],
    workingDays: this.programFormBuilder.group({
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: false,
      sun: false
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

    this.service.getCabinetSettingsById(this.cabinetId).subscribe({
      next: (cabinetSettings) => {

        const days = cabinetSettings.workingDays ?? [];

        this.programForm.patchValue({
          startHour: cabinetSettings.startHour,
          endHour: cabinetSettings.endHour,
          slotDuration: cabinetSettings.slotDurationMin,
          workingDays: {
            mon: days.includes('1'),
            tue: days.includes('2'),
            wed: days.includes('3'),
            thu: days.includes('4'),
            fri: days.includes('5'),
            sat: days.includes('6'),
            sun: days.includes('7')
          }
        });

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

        this.notification.success(this.translate.instant('settings.messages.saved'));
      },
      error: () => {
        this.savingGeneral = false;
        this.notification.error(this.translate.instant('settings.messages.error'));
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

    const cabinetSettings = this.buildCabinetSettings();

    this.service.updateCabinetSettings(this.cabinetId, cabinetSettings)
      .subscribe({
        next: () => {
          this.savingProgram = false;
          this.programForm.markAsPristine();

          this.notification.success(this.translate.instant('settings.program.save.success'));
        },
        error: () => {
          this.savingProgram = false;

          this.notification.error(this.translate.instant('settings.program.save.error'));
        }
      });
  }

  hasError(control: string, error: string): boolean {
    const c = this.form.get(control);
    return !!(c && c.touched && c.hasError(error));
  }

  private buildCabinetSettings(): CabinetSettings {

    const form = this.programForm.getRawValue();

    const dayMap: Record<string, number> = {
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
      sun: 7
    };

    const workingDays = Object.entries(form.workingDays)
      .filter(([_, enabled]) => enabled)
      .map(([day]) => dayMap[day]);

    return {
      cabinetId: this.cabinetId,
      startHour: form.startHour,
      endHour: form.endHour,
      slotDurationMin: form.slotDuration,
      workingDays: workingDays.join(',')
    };
  }
}

export default CabinetSettingsComponent
