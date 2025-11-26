import {ChangeDetectorRef, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  loading = false;
  registrationFailed = false;
  registrationSuccess = false;
  errorMessage = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private cdr: ChangeDetectorRef) {
  }

  onSubmit(): void {

    this.registrationFailed = false;
    this.registrationSuccess = false;
    this.errorMessage = '';
    this.loading = true;

    if (this.form.password !== this.form.confirmPassword) {
      this.loading = false;
      this.registrationFailed = true;
      this.errorMessage = 'Parolele nu coincid';
      return;
    }

    this.authenticationService.register(this.form.username, this.form.password)
      .subscribe({

        next: () => {
          this.loading = false;
          this.registrationSuccess = true;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1200);
        },

        error: err => {
          this.loading = false;
          this.registrationFailed = true;

          if (err.error) {
            try {
              const parsed = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
              this.errorMessage = parsed.error || 'Înregistrare eșuată';
            } catch {
              this.errorMessage = 'Înregistrare eșuată';
            }
          } else {
            this.errorMessage = 'Înregistrare eșuată';
          }
          this.cdr.detectChanges();
        }
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
