import { Component, OnInit, signal, computed } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CabinetsService } from '../../../../../shared/service/cabinets.service';
import {CabinetRequest} from '../../../../../core/model/cabinet.model';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-cabinet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './cabinet-form.component.html',
  styleUrls: ['./cabinet-form.component.css']
})
export class CabinetFormComponent implements OnInit {

  // ===== STATE =====

  id = signal<number | null>(null);
  isEditMode = computed(() => this.id() !== null);
  loading = signal(false);

  // ===== STATIC PLAN CONFIG (for defaults) =====

  plans = {
    BASIC: { price: 99 },
    PRO: { price: 199 },
    PREMIUM: { price: 399 }
  };

  // ===== FORM =====

  form = new FormGroup({

    // Cabinet
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    address: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null, Validators.email),
    description: new FormControl<string | null>(null),
    logoUrl: new FormControl<string | null>(null),

    // Subscription
    planCode: new FormControl<string>('BASIC', { nonNullable: true }),
    subscriptionStatus: new FormControl<string>('TRIAL', { nonNullable: true }),

    startDate: new FormControl<string | null>(this.today()),
    endDate: new FormControl<string | null>(null),
    trialEndDate: new FormControl<string | null>(this.addDays(14)),

    autoRenew: new FormControl<boolean>(false, { nonNullable: true }),
    price: new FormControl<number | null>(99),
    currency: new FormControl<string>('RON', { nonNullable: true })

  }, { validators: this.periodValidator });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cabinetService: CabinetsService
  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.initDynamicLogic();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam && !isNaN(Number(idParam))) {
      this.id.set(Number(idParam));
      this.loadCabinet(this.id()!);
    }
  }

  // =====================================================
  // LOAD EXISTING CABINET (EDIT MODE)
  // =====================================================

  private loadCabinet(id: number): void {
    this.loading.set(true);

    this.cabinetService.getById(id).subscribe({
      next: (response) => {

        this.form.patchValue({
          name: response.name,
          address: response.address,
          phone: response.phone,
          email: response.email,
          description: response.description,
          logoUrl: response.logoUrl,

          planCode: response.planCode,
          subscriptionStatus: response.subscriptionStatus,

          startDate: this.toDateInput(response.startDate),
          endDate: this.toDateInput(response.endDate),
          trialEndDate: this.toDateInput(response.trialEndDate),

          autoRenew: response.autoRenew,
          price: response.price,
          currency: response.currency
        });

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  // =====================================================
  // SAVE (CREATE OR UPDATE)
  // =====================================================

  save(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: CabinetRequest = this.form.getRawValue();

    this.loading.set(true);

    if (this.isEditMode()) {
      this.cabinetService.update(this.id()!, payload)
        .subscribe(() => this.router.navigate(['/admin/cabinets']));
    } else {
      this.cabinetService.create(payload)
        .subscribe(() => this.router.navigate(['/admin/cabinets']));
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/cabinets']);
  }

  // =====================================================
  // DYNAMIC LOGIC
  // =====================================================

  private initDynamicLogic(): void {

    // Update price when plan changes (only if not manually modified)
    this.form.get('planCode')?.valueChanges.subscribe(plan => {
      const defaultPrice = this.plans[plan as keyof typeof this.plans]?.price;
      if (defaultPrice) {
        this.form.patchValue({ price: defaultPrice }, { emitEvent: false });
      }
    });

    // Status logic
    this.form.get('subscriptionStatus')?.valueChanges.subscribe(status => {

      const trialCtrl = this.form.get('trialEndDate');
      const endCtrl = this.form.get('endDate');

      if (status === 'TRIAL') {
        trialCtrl?.enable();
        trialCtrl?.setValue(this.addDays(14));
        endCtrl?.disable();
        endCtrl?.setValue(null);
      } else if (status === 'ACTIVE') {
        trialCtrl?.disable();
        trialCtrl?.setValue(null);
        endCtrl?.enable();
      } else {
        trialCtrl?.disable();
        trialCtrl?.setValue(null);
        endCtrl?.enable();
      }
    });
  }

  // =====================================================
  // VALIDATION
  // =====================================================

  private periodValidator(group: AbstractControl): ValidationErrors | null {

    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (start && end && new Date(end) <= new Date(start)) {
      return { invalidPeriod: true };
    }

    return null;
  }

  get invalidPeriod(): boolean {
    return !!this.form.errors?.['invalidPeriod'];
  }

  // =====================================================
  // HELPERS
  // =====================================================

  private today(): string {
    return new Date().toISOString().substring(0, 10);
  }

  private addDays(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().substring(0, 10);
  }

  private toDateInput(value: string | null): string | null {
    if (!value) return null;
    return value.substring(0, 10);
  }

  get pageTitleKey(): string {
    return this.isEditMode()
      ? 'cabinets.edit.title'
      : 'cabinets.create.title';
  }

  get pageSubtitleKey(): string {
    return this.isEditMode()
      ? 'cabinets.edit.subtitle'
      : 'cabinets.create.subtitle';
  }
}
