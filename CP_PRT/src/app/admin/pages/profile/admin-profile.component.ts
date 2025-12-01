import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h1>Profil Admin</h1>

    <div class="profile-container">
      <form [formGroup]="form" (ngSubmit)="saveProfile()">

        <div class="form-group">
          <label>Email</label>
          <input type="email" formControlName="email" [disabled]="form.controls['email'].disabled">
        </div>

        <div class="form-group">
          <label>Nume</label>
          <input type="text" formControlName="name">
        </div>

        <div class="form-group">
          <label>Rol</label>
          <input type="text" formControlName="role"  [disabled]="form.controls['role'].disabled">
        </div>

        <button type="submit" [disabled]="form.invalid">
          Salvează Profil
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

    .profile-container {
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

    button {
      width: 100%;
      margin-top: 15px;
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
export class AdminProfileComponent implements OnInit {

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    this.form = this.fb.group({
      email: [{ value: user.email, disabled: true }, Validators.required],
      name: [user.name || '', Validators.required],
      role: [{ value: user.role, disabled: true }]
    });
  }

  saveProfile() {
    if (this.form.invalid) return;

    const updatedUser = {
      ...JSON.parse(sessionStorage.getItem('user') || '{}'),
      ...this.form.value
    };

    // TODO În mod real, ai face request către backend:
    // this.accountService.updateProfile(updatedUser).subscribe(...)

    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  }
}
