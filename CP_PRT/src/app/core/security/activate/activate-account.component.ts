import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ActivateAccountRequest} from '../../model/user.model';
import {AuthUtilsService} from '../../services/auth-utils.service';
import {UsersService} from '../../../shared/service/users.service';

@Component({
  selector: 'app-activate',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    FormsModule
  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.css',
})
export class ActivateAccountComponent implements OnInit {

  private translate = inject(TranslateService);

  token = '';
  tokenType = signal<string | null>(null);

  form = {
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    cabinetName: ''
  };

  loading = false;
  success = false;
  error = false;
  errorMessage = '';
  tokenExpired = false;

  passwordStrength: string = 'weak';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private userService: UsersService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.error = true;
      this.errorMessage = 'Invalid token';
      return;
    }

    this.loading = true;

    this.authService.getActivateAccountType(this.token).subscribe({
      next: (res) => {
        this.tokenType.set(res.tokenType);

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    const request: ActivateAccountRequest = {
      token: this.token,
      cabinetName: this.form.cabinetName,
      password: this.form.password,
      username: this.form.username,
      fullName: this.form.fullName
    };

    this.authService.activateAccount(request).subscribe({

      next: () => {

        this.loading = false;
        this.success = true;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);

      },

      error: err => {

        this.loading = false;
        this.error = true;

        const raw = err.error;

        let parsed;

        if (typeof raw === 'string') {
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = null;
          }
        } else {
          parsed = raw;
        }

        const code = parsed?.code;

        if (code === 'TOKEN_EXPIRED') {
          this.tokenExpired = true;
        }

        this.errorMessage = '❗' + (this.translate.instant('error.code.' + code) || 'Activation failed');

      }
    });
  }

  passwordsMatch(): boolean {
    return this.form.password === this.form.confirmPassword;
  }

  protected checkStrength() {
    this.passwordStrength = AuthUtilsService.checkStrength(this.form.password);
  }

  protected resendActivation() {
    this.userService.invite(this.token).subscribe(() => {
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    });
  }
}
