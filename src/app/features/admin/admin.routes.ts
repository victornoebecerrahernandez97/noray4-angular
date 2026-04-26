import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component')
      .then(m => m.AdminLoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./admin-layout/admin-layout.component')
      .then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
      },
      {
        path: 'salas',
        loadComponent: () => import('./salas/salas.component')
          .then(m => m.AdminSalasComponent),
      },
      {
        path: 'riders',
        loadComponent: () => import('./riders/riders.component')
          .then(m => m.AdminRidersComponent),
      },
    ],
  },
];
