import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {TokenStorageService} from '../token-storage.service';

@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit{

  form = {
    username: '',
    password: ''
  };

  isLoggedIn = false;
  loading = false;
  errorMessage = '';
  isLoginFailed = false;

  constructor(
    private authService: AuthenticationService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.navigateToURL('/admin');
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
        sessionStorage.setItem('accessToken', data.accessToken);

        this.isLoginFailed = false;
        this.isLoggedIn = true;

        this.redirectByRole(data.role)
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

  redirectByRole(role: string) {
    switch (role) {
      case 'SUPER_ADMIN':
        this.navigateToURL('/admin/dashboard');
        break;

      case 'ADMIN':
        this.navigateToURL('/admin/dashboard');
        break;

      case 'USER':this.navigateToURL('/portal');
        break;

      default:
        // fallback
        this.navigateToURL('/login');
        break;
    }
  }

  goToRegister() {
    this.navigateToURL('/register');
  }

  protected navigateToURL(url: string): void {
    this.router.navigate([url.replace(/^\//, '')])
      .then(success => {
        if (!success) {
          console.warn('Navigarea a eșuat către', url);
        }
      })
      .catch(err => {
        console.error('Eroare la navigare:', err);
      });
  }
}
