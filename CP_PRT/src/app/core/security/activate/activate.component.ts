import {Component, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-activate',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.css',
})
export class ActivateComponent {

  token = signal<string | null>(null);
  success = signal<boolean>(false);
  error = signal<string | null>(null);

  form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.token.set(this.route.snapshot.queryParamMap.get('token'));
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const pwd = this.form.value.password!;
    const confirm = this.form.value.confirmPassword!;

    if (pwd !== confirm) {
      this.error.set("Passwords do not match");
      return;
    }

    this.error.set(null);

    this.authService.activateAccount({
      token: this.token()!,
      password: pwd
    }).subscribe({
      next: () => {
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => {
        this.error.set("Activation failed" + err);
      }
    });
  }
}
