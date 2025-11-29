import {Routes} from '@angular/router';
import {SuperAdminDashboardComponent} from './pages/dashboard/dashboard.component';
import {UsersListComponent} from './pages/users/users-list/users-list.component';
import {EditUserComponent} from './pages/users/edit-user/edit-user.component';
import {AdminChangePasswordComponent} from './pages/change-password/admin-change-password.component';
import {AdminProfileComponent} from './pages/profile/admin-profile.component';
import {AdminLayoutComponent} from './pages/layout/admin-layout.component';
import {AdminGuard} from '../interceptors/admin.guard';
import {CabinetsListComponent} from './pages/cabinets/cabinets-list/cabinets-list.component';
import {CabinetFormComponent} from './pages/cabinets/cabinet-form/cabinet-form/cabinet-form.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    component: AdminLayoutComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: SuperAdminDashboardComponent},
      {path: 'profile', component: AdminProfileComponent},
      {path: 'change-password', component: AdminChangePasswordComponent},
      //
      // // CRUD

      {path: 'cabinets', component: CabinetsListComponent},
      {path: 'cabinets/:id', component: CabinetFormComponent},

      //
      {path: 'users', component: UsersListComponent},
      {path: 'users/:id', component: EditUserComponent},
    ]
  }
];

