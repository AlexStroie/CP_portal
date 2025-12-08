import {Routes} from '@angular/router';
import {AdminDashboardComponent} from './pages/dashboard/dashboard.component';
import {UsersListComponent} from './pages/users/users-list/users-list.component';
import {EditUserComponent} from './pages/users/edit-user/edit-user.component';
import {AdminChangePasswordComponent} from './pages/change-password/admin-change-password.component';
import {AdminProfileComponent} from './pages/profile/admin-profile.component';
import {AdminLayoutComponent} from './pages/layout/admin-layout.component';
import {AdminGuard} from '../interceptors/admin.guard';
import {CabinetsListComponent} from './pages/cabinets/cabinets-list/cabinets-list.component';
import {CabinetFormComponent} from './pages/cabinets/cabinet-form/cabinet-form/cabinet-form.component';
import {SuperAdminGuard} from '../interceptors/super-admin.guard';
import {PatientsListComponent} from './pages/patients/patients-list/patients-list.component';
import {PatientFormComponent} from './pages/patients/patient-form/patient-form.component';
import {AppointmentListComponent} from './pages/appointments/appointment-list/appointment-list.component';
import {AppointmentFormComponent} from './pages/appointments/appointment-form/appointment-form.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    component: AdminLayoutComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: AdminDashboardComponent},
      {path: 'profile', component: AdminProfileComponent},
      {path: 'change-password', component: AdminChangePasswordComponent},

      {path: 'patients', component: PatientsListComponent},
      {path: 'patients/:id', component: PatientFormComponent},

      {path: 'appointments', component: AppointmentListComponent},
      {path: 'appointments/:id', component: AppointmentFormComponent},

      {
        path: 'cabinets',
        component: CabinetsListComponent,
        canActivate: [SuperAdminGuard],
        data: {roles: ['SUPER_ADMIN']}
      },
      {
        path: 'cabinets/:id',
        component: CabinetFormComponent,
        canActivate: [SuperAdminGuard],
        data: {roles: ['SUPER_ADMIN']}
      },

      {
        path: 'users',
        component: UsersListComponent,
        canActivate: [SuperAdminGuard],
        data: {roles: ['SUPER_ADMIN']}
      },

      {
        path: 'users/:id',
        component: EditUserComponent,
        canActivate: [SuperAdminGuard],
        data: {roles: ['SUPER_ADMIN']}
      },
    ]
  }
];

