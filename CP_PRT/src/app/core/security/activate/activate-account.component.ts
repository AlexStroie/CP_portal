import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {ActivateAccountRequest} from '../../model/user.model';

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

  token = '';

  form = {
    username: '',
    fullName: '',
    cabinetName: ''
  };

  loading = false;
  success = false;
  error = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit(): void {

    this.loading = true;

    const request: ActivateAccountRequest = {
      token: this.token,
      cabinetName: this.form.cabinetName,
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

        this.errorMessage =
          err?.error?.message || 'Activation failed';
      }
    });
  }

}
