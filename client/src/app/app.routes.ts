import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authguardGuard } from './authguard.guard';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent,canActivate:[authguardGuard] },
  { path: 'dashboard', component: DashboardComponent,canActivate:[authguardGuard] },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/' },
];

// export const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   {
//     path: '',
//     component: HomeComponent,
//     canActivate: [authguardGuard],
//     children: [
//       { path: 'profile', component: ProfileComponent },
//       { path: 'dashboard', component: DashboardComponent },
//       { path: '', redirectTo: '/', pathMatch: 'full' },
//       { path: '**', redirectTo: '/' },
//     ],
//   },
// ];