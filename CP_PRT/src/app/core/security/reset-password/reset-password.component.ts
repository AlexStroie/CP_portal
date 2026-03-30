import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '../authentication.service';
import {RegisterRequest, ResetPasswordRequest} from '../../model/user.model';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form = {
    password: '',
    confirmPassword: ''
  };

  token: string = '';

  loading = false;
  resetFailed = false;
  resetSuccess = false;
  errorMessage = '';

  passwordStrength: 'weak' | 'medium' | 'strong' = 'weak';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.resetFailed = true;
      this.errorMessage = this.translate.instant('auth.reset.errors.invalidToken');
    }
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

    this.resetFailed = false;
    this.resetSuccess = false;
    this.errorMessage = '';
    this.loading = true;

    if (!this.passwordsMatch()) {
      this.loading = false;
      this.resetFailed = true;
      this.errorMessage = this.translate.instant('auth.reset.errors.passwordMismatch');
      return;
    }

    const request: ResetPasswordRequest = {
      token: this.token,
      password: this.form.password
    };

    this.authService.resetPassword(request).subscribe({
      next: () => {
        this.loading = false;
        this.resetSuccess = true;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000);
      },

      error: err => {
        this.loading = false;
        this.resetFailed = true;

        if (err.error) {
          try {
            const parsed = typeof err.error === 'string'
              ? JSON.parse(err.error)
              : err.error;

            this.errorMessage =
              parsed.error || this.translate.instant('auth.reset.errors.failed');

          } catch {
            this.errorMessage = this.translate.instant('auth.reset.errors.failed');
          }
        } else {
          this.errorMessage = this.translate.instant('auth.reset.errors.failed');
        }

        this.cdr.detectChanges();
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
