import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout.component')
      .then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/landing/landing.component')
          .then(m => m.LandingComponent),
      },
      {
        path: 'explorar',
        loadComponent: () => import('./features/public/explorar/explorar.component')
          .then(m => m.ExplorarComponent),
      },
      {
        path: 'salida/:id',
        loadComponent: () => import('./features/public/salida-detalle/salida-detalle.component')
          .then(m => m.SalidaDetalleComponent),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
