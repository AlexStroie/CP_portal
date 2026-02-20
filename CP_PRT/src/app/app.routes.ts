import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {AuthenticateComponent} from './core/security/authenticate/authenticate.component';
import {RegisterComponent} from './core/security/register/register.component';
import {ActivateComponent} from './core/security/activate/activate.component';
import {SuspendedComponent} from './core/forbiden/suspended/suspended.component';

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
    path: 'activate',
    component: ActivateComponent
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
