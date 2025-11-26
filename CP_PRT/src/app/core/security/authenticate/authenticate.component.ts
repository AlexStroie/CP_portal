import {ChangeDetectorRef, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { TokenStorageService } from '../token-storage.service';

@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent {

  form = {
    username: '',
    password: ''
  };

  isLoggedIn = false;
  loading = false;
  errorMessage = '';
  isLoginFailed = false;
  loginInProgress = false;

  constructor(
    private authService: AuthenticationService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/admin']);
    }
  }

  onSubmit(): void {

    this.errorMessage = "";
    this.isLoginFailed = false;

    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({

      next: data => {

        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;


        this.router.navigate(['/admin']);
      },

      error: err => {


        this.isLoginFailed = true;

        if (err.error && err.error.error) {
          this.errorMessage = err.error.error;
        } else if (err.status === 401) {
          this.errorMessage = "Invalid username or password";
        } else {
          this.errorMessage = "Authentication failed";
        }
        this.cdr.detectChanges();
      }
    });
  }


  goToRegister() {
    this.router.navigate(['/register']);
  }
}
