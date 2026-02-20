import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {UsersService} from '../../../shared/service/users.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  templateUrl: './admin-profile.component.html',
  imports: [
    TranslatePipe,
    ReactiveFormsModule
  ],
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  activeTab: 'profile' | 'security' = 'profile';

  profileForm!: FormGroup;
  securityForm!: FormGroup;

  savingProfile = false;
  savingPassword = false;

  constructor(private userService: UsersService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.profileForm = this.fb.group({
      email: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      role: [{ value: '', disabled: true }]
    });

    this.userService.getCurrentUser().subscribe(user => {

      this.profileForm = this.fb.group({
        email: [{value: user.email, disabled: true}],
        username: [{value: user.username, disabled: true}],
        name: [user.fullName || '', Validators.required],
        role: [{value: user.role, disabled: true}]
      });

      this.securityForm = this.fb.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, {validators: this.passwordMatchValidator});
    });

  }

  passwordMatchValidator(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : {passwordMismatch: true};
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    this.savingProfile = true;

    setTimeout(() => {
      this.savingProfile = false;
    }, 1000);
  }

  changePassword() {
    if (this.securityForm.invalid) return;

    this.savingPassword = true;

    setTimeout(() => {
      this.savingPassword = false;
      this.securityForm.reset();
    }, 1000);
  }

  hasProfileError(control: string, error: string): boolean {
    const c = this.profileForm.get(control);
    return !!(c && c.touched && c.hasError(error));
  }

  hasSecurityError(control: string, error: string): boolean {
    const c = this.securityForm.get(control);
    return !!(c && c.touched && c.hasError(error));
  }
}
