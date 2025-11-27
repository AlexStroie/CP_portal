import {Routes} from '@angular/router';
import {SuperAdminGuard} from '../interceptors/super.admin.guard';
import {SuperAdminDashboardComponent} from './pages/dashboard/dashboard.component';
import {SuperAdminLayoutComponent} from './pages/layout/super-admin-layout.component';
import {SuperAdminProfileComponent} from './pages/profile/super-admin-profile.component';
import {SuperAdminChangePasswordComponent} from './pages/change-password/super-admin-change-password.component';
import {CabinetsListComponent} from './pages/cabinets/cabinets-list.component';
import {EditCabinetComponent} from './pages/cabinets/edit-cabinet.component';
import {UsersListComponent} from './pages/users/users-list.component';
import {EditUserComponent} from './pages/users/edit-user.component';

export const SUPER_ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [SuperAdminGuard],
    component: SuperAdminLayoutComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: SuperAdminDashboardComponent},
      {path: 'profile', component: SuperAdminProfileComponent},
      {path: 'change-password', component: SuperAdminChangePasswordComponent},
      //
      // // CRUD
      {path: 'cabinets', component: CabinetsListComponent},
      {path: 'cabinets/:id', component: EditCabinetComponent},
      //
      {path: 'users', component: UsersListComponent},
      {path: 'users/:id', component: EditUserComponent},
    ]
  }
];

