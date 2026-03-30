import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AuthenticationService} from '../authentication.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    TranslatePipe,
    RouterLink,
    FormsModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {

  email: string = '';
  loading = false;
  success = false;
  error: string | null = null;

  constructor(private authService: AuthenticationService,
              private router: Router) {
  }

  onSubmit() {
    if (!this.email) return;

    this.loading = true;
    this.error = null;

    this.authService.forgotPassword(this.email).subscribe();

    setTimeout(() => {
      this.loading = false;
      this.success = true;
      this.redirectAfterDelay();
    }, 1000);
  }

  private redirectAfterDelay() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }
}
