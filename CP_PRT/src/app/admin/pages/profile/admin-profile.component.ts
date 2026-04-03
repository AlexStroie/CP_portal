import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {UsersService} from '../../../shared/service/users.service';
import {AuthenticationService} from '../../../core/security/authentication.service';
import {ChangePasswordRequest, ResetPasswordRequest} from '../../../core/model/user.model';
import {TokenStorageService} from '../../../core/security/token-storage.service';
import {NotificationService} from '../../../core/services/notification.service';

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
              private tokenService: TokenStorageService,
              private authService: AuthenticationService,
              private notification: NotificationService,
              private translate: TranslateService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {

    this.profileForm = this.fb.group({
      email: [{value: '', disabled: true}],
      username: [{value: '', disabled: true}],
      name: ['', Validators.required],
      phone: [''],
      role: [{value: '', disabled: true}]
    });

    this.userService.getCurrentUser().subscribe(user => {

      this.profileForm = this.fb.group({
        email: [{value: user.email, disabled: true}],
        username: [{value: user.username, disabled: true}],
        name: [user.fullName || '', Validators.required],
        phone: [user.phone || ''],
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

    this.userService.updateNamePhone(this.profileForm.get('username')?.value,
      this.profileForm.get('name')?.value,
      this.profileForm.get('phone')?.value).subscribe({

      next: () => {
        this.notification.success(this.translate.instant('profile.message.success'));
        setTimeout(() => {
          this.savingPassword = false;
          this.securityForm.reset();
        }, 1000);
      },
      error: err => {

      }

    });

    setTimeout(() => {
      this.savingProfile = false;
    }, 1000);
  }

  changePassword() {
    if (this.securityForm.invalid) return;
    this.savingPassword = true;

    const request: ChangePasswordRequest = this.securityForm.value;
    request.username = this.tokenService.getUser().username;

    this.authService.changePassword(request).subscribe({
      next: () => {
        this.notification.success(this.translate.instant('auth.reset.success'));
        setTimeout(() => {
          this.savingPassword = false;
          this.securityForm.reset();
        }, 1000);
      },

      error: err => {

        if (err.error) {
          try {

            const parsed = typeof err.error === 'string'
              ? JSON.parse(err.error)
              : err.error;

            this.notification.error(
              `${this.translate.instant('settings.messages.error')}\n${this.translate.instant(parsed.code)}`
            );

          } catch {
            this.notification.error(this.translate.instant('settings.messages.error'));
          }
        } else {
          this.notification.error(this.translate.instant('settings.messages.error'));
        }
        setTimeout(() => {
          this.savingPassword = false;
        }, 1000);
      }
    });

    setTimeout(() => {
      this.savingPassword = false;
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
