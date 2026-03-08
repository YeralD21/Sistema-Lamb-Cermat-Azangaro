import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/private-layout/private-layout.component').then(m => m.PrivateLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'CERMAT Portal - Panel de Administración'
      }
      // Add more lazy loaded routes here using roleGuard as needed
    ]
  }
];
