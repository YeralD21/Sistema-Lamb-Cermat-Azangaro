import { Routes } from '@angular/router';

/**
 * Rutas principales de la aplicación
 * Lazy loading para optimizar la carga inicial
 */
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./public.routes').then(m => m.PUBLIC_ROUTES)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];