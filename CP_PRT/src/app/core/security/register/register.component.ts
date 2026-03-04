import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {RegisterRequest} from '../../model/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  loading = false;
  registrationFailed = false;
  registrationSuccess = false;
  errorMessage = '';

  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {
  }

  passwordsMatch(): boolean {
    return this.form.password === this.form.confirmPassword;
  }

  checkStrength(): void {

    const password = this.form.password;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) this.passwordStrength = 'weak';
    else if (score <= 3) this.passwordStrength = 'medium';
    else this.passwordStrength = 'strong';
  }

  onSubmit(): void {

    this.registrationFailed = false;
    this.registrationSuccess = false;
    this.errorMessage = '';
    this.loading = true;

    if (!this.passwordsMatch()) {
      this.loading = false;
      this.registrationFailed = true;
      this.errorMessage = this.translate.instant('auth.register.errors.passwordMismatch');
      return;
    }

    const request: RegisterRequest = {
      email: this.form.email,
      password: this.form.password
    };

    this.authenticationService.register(request)
      .subscribe({

        next: response => {

          this.loading = false;

          if (!response.success) {

            this.registrationFailed = true;

            this.errorMessage =
              this.translate.instant(response.message) || this.translate.instant('auth.register.errors.failed');

            return;
          }

          this.registrationSuccess = true;

        },

        error: err => {

          this.loading = false;
          this.registrationFailed = true;

          if (err.error) {
            try {

              const parsed = typeof err.error === 'string'
                ? JSON.parse(err.error)
                : err.error;

              this.errorMessage =
                parsed.error || this.translate.instant('auth.register.errors.failed');

            } catch {
              this.errorMessage = this.translate.instant('auth.register.errors.failed');
            }
          } else {
            this.errorMessage = this.translate.instant('auth.register.errors.failed');
          }

          this.cdr.detectChanges();
        }
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
