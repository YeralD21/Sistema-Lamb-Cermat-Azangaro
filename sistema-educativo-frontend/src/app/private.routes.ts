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
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'CERMAT Portal - Dashboard'
      }
      // Add more lazy loaded routes here using roleGuard as needed
    ]
  }
];
