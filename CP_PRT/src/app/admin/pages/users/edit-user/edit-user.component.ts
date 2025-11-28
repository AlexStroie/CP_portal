import { Component, OnInit, signal } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {UsersService} from '../../../../shared/service/users.service';
import {UserRequest, UserResponse} from '../../../../core/model/user.model';

@Component({
  standalone: true,
  selector: 'app-users-edit',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  id = signal<number | null>(null);
  user = signal<UserResponse | null>(null);

  form = new FormGroup({
    fullName: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('USER', Validators.required),
    enabled: new FormControl(true),
    password: new FormControl('')
  });

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id.set(Number(idParam));
      this.loadUser(Number(idParam));
    }
  }

  loadUser(id: number) {
    this.usersService.getById(id).subscribe(user => {
      this.user.set(user);

      this.form.patchValue({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        enabled: user.enabled,
        password: ''
      });
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const req: UserRequest = {
      fullName: this.form.value.fullName!,
      username: this.form.value.username!,
      email: this.form.value.email!,
      role: this.form.value.role!,
      enabled: this.form.value.enabled!
    };

    if (this.id()) {
      this.usersService.update(this.id()!, req).subscribe(() => {
        this.router.navigate(['/admin/users']);
      });
    } else {
      this.usersService.create(req).subscribe(() => {
        this.router.navigate(['/admin/users']);
      });
    }
  }
}
