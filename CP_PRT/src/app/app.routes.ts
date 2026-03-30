import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {AuthenticateComponent} from './core/security/authenticate/authenticate.component';
import {RegisterComponent} from './core/security/register/register.component';
import {ActivateAccountComponent} from './core/security/activate/activate-account.component';
import {SuspendedComponent} from './core/forbiden/suspended/suspended.component';
import {ForgotPasswordComponent} from './core/security/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './core/security/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'login',
    component: AuthenticateComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },

  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },

  {
    path: 'activate',
    component: ActivateAccountComponent
  },

  {
    path: 'suspended',
    component: SuspendedComponent
  },

  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },
];
