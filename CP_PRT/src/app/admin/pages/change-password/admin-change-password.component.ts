import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Schimbare Parolă</h1>

    <div class="change-password-container">

      <form [formGroup]="form" (ngSubmit)="submit()">

        <div class="form-group">
          <label>Parola veche</label>
          <input type="password" formControlName="oldPassword">
        </div>

        <div class="form-group">
          <label>Parola nouă</label>
          <input type="password" formControlName="newPassword">
        </div>

        <div class="form-group">
          <label>Confirmare parolă</label>
          <input type="password" formControlName="confirmPassword">
        </div>

        @if (form.errors?.['passwordMismatch']) {
          <div class="error">
            Parolele nu coincid.
          </div>
        }


        <button type="submit" [disabled]="form.invalid">
          Schimbă Parola
        </button>

      </form>
    </div>
  `,
  styles: [`
    h1 {
      font-size: 26px;
      margin-bottom: 25px;
      font-weight: 600;
      color: #1e293b;
    }

    .change-password-container {
      background: #ffffff;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0px 3px 10px rgba(0,0,0,0.08);
      max-width: 500px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
    }

    .form-group label {
      font-weight: 600;
      margin-bottom: 5px;
      color: #334155;
    }

    .form-group input {
      padding: 10px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 14px;
    }

    .error {
      color: #dc2626;
      margin-bottom: 10px;
      font-weight: 600;
    }

    button {
      width: 100%;
      margin-top: 10px;
      padding: 12px;
      border: none;
      background: #3b82f6;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    button:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }
  `]
})
export class AdminChangePasswordComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: [this.passwordMatchValidator] });
  }

  // 🔹 Validare parole identice
  passwordMatchValidator(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;

    return newPass === confirmPass ? null : { passwordMismatch: true };
  }

  submit() {
    if (this.form.invalid) return;

    const payload = {
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.newPassword
    };

    console.log('Prepared change password payload:', payload);

    // TODO când ai backend:
    // this.accountService.changePassword(payload).subscribe({
    //   next: () => alert("Parola a fost schimbată!"),
    //   error: () => alert("Eroare la schimbarea parolei")
    // });

    alert("Parola schimbată local (simulare).");
  }
}
