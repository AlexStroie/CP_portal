import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {AuthenticateComponent} from './core/security/authenticate/authenticate.component';
import {RegisterComponent} from './core/security/register/register.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},

  {path: 'login', component: AuthenticateComponent},
  {path: 'register', component: RegisterComponent},
];
