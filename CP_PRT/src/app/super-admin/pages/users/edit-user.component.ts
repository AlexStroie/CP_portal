import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h1>{{ isNew ? 'Adaugă Utilizator' : 'Editează Utilizator' }}</h1>

    <div class="form-container">
      <form [formGroup]="form" (ngSubmit)="save()">

        <div class="form-group">
          <label>Nume</label>
          <input formControlName="name">
        </div>

        <div class="form-group">
          <label>Email</label>
          <input formControlName="email">
        </div>

        <div class="form-group">
          <label>Rol</label>
          <select formControlName="role">
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ADMIN_CABINET">ADMIN_CABINET</option>
            <option value="USER">USER</option>
          </select>
        </div>

        <button type="submit" [disabled]="form.invalid">Salvează</button>
        <button class="back" routerLink="/super-admin/users">Înapoi</button>

      </form>
    </div>
  `,
  styles: [`
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: 600;
      color: #1e293b;
    }

    .form-container {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0px 3px 10px rgba(0,0,0,0.08);
      max-width: 500px;
    }

    .form-group {
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 600;
      margin-bottom: 5px;
    }

    .form-group input,
    .form-group select {
      padding: 10px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
    }

    button {
      padding: 10px 20px;
      background: #3b82f6;
      border: none;
      border-radius: 6px;
      color: white;
      margin-right: 10px;
      cursor: pointer;
      font-weight: 600;
    }

    button.back {
      background: #94a3b8;
    }
  `]
})
export class EditUserComponent implements OnInit {

  form!: FormGroup;
  id!: number;
  isNew = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isNew = this.id === 0;

    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER', Validators.required]
    });

    if (!this.isNew) {
      // Real data from backend
      // this.usersService.getById(this.id).subscribe(user => this.form.patchValue(user));

      // Mock data for now:
      this.form.patchValue({
        name: 'Utilizator Test',
        email: 'test@mail.com',
        role: 'USER'
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    const payload = this.form.value;

    if (this.isNew) {
      console.log("Create USER:", payload);
    } else {
      console.log("Update USER:", payload);
    }

    this.router.navigate(['/super-admin/users']);
  }
}
