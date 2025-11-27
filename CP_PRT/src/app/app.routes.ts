import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {AuthenticateComponent} from './core/security/authenticate/authenticate.component';
import {RegisterComponent} from './core/security/register/register.component';
import {AuthGuard} from './interceptors/auth.guard';
import {AdminComponent} from './admin/admin/admin.component';

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
    path: 'admin',
    canActivate: [AuthGuard],
    component: AdminComponent
  },

  {
    path: 'super-admin',
    loadChildren: () => import('./super-admin/super-admin.routes')
      .then(m => m.SUPER_ADMIN_ROUTES)
  },
];
