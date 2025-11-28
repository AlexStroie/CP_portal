import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {UsersService} from '../../../shared/service/users.service';
import {UserRequest, UserResponse} from '../../../core/model/user.model';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h1>{{ isNew ? 'Adaugă Utilizator' : 'Editează Utilizator' }}</h1>

    <div class="form-container">
      <form [formGroup]="form" (ngSubmit)="save()">

        <div class="form-group">
          <label>Full Name</label>
          <input type="text" formControlName="fullName"/>
        </div>

        <div class="form-group">
          <label>Username</label>
          <input type="text" formControlName="username"/>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" formControlName="email"/>
        </div>

        <div class="form-group">
          <label>Rol</label>
          <select formControlName="role">
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="USER">User</option>
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
      box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.08);
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

  // usersService.getById() -> user
  user = signal<UserResponse | null>(null);

  // Form
  form = new FormGroup({
    fullName: new FormControl<string>('', Validators.required),
    username: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    role: new FormControl<string>('USER', Validators.required),
    enabled: new FormControl<boolean>(true)
  });

  id!: number;
  isNew = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) {
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isNew = this.id === 0;

    if (!this.isNew) {
      // Real data from backend
      this.usersService.getById(this.id).subscribe(user => {
        this.user.set(user);

        // populate form
        this.form.patchValue({
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          role: user.role,
          enabled: user.enabled
        });
      });
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const req: UserRequest = {
      fullName: this.form.value.fullName ?? '',
      username: this.form.value.username ?? '',
      email: this.form.value.email ?? '',
      role: this.form.value.role ?? 'USER',
      enabled: this.form.value.enabled ?? true
    };

    if (!this.isNew) {
      this.usersService.update(this.id, req).subscribe(() => {
        this.router.navigate(['/super-admin/users']);
      });
    } else {
      this.usersService.create(req).subscribe(() => {
        this.router.navigate(['/super-admin/users']);
      });
    }

  }
}
