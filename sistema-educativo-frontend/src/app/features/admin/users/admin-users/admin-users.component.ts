import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      
      <!-- Back Link -->
      <div class="flex items-center gap-2 text-blue-900 font-medium text-sm cursor-pointer hover:underline">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver al Panel
      </div>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Gestión de Usuarios</h1>
          <p class="text-slate-500 text-sm mt-1">Administra usuarios, roles y permisos del sistema</p>
        </div>
        <button class="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="7" r="4"/><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
          Crear Usuario
        </button>
      </div>

      <!-- Filter Bar -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar por email o nombre..." 
                 class="w-full bg-white border border-slate-200 text-slate-700 placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm" />
        </div>
        <select class="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm">
          <option>Todos los roles</option>
          <option *ngFor="let role of roles.slice(1)" [value]="role">{{ role }}</option>
        </select>
        <select class="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm">
          <option>Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div *ngFor="let stat of stats" class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
          <h3 class="text-3xl font-black tracking-tight" [class]="stat.color">{{ stat.value }}</h3>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-50">
                <th class="text-left py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usuario</th>
                <th class="text-left py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rol</th>
                <th class="text-left py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</th>
                <th class="text-left py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha Creación</th>
                <th class="text-center py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let user of users" class="group hover:bg-slate-50/50 transition-colors">
                <td class="py-4 px-6">
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-slate-800">{{ user.name }}</span>
                    <span class="text-xs text-slate-500">{{ user.email }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <span class="px-3 py-1 rounded-full text-[10px] font-bold shadow-sm" [class]="getRoleBadgeClass(user.role)">
                    {{ user.role }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-1.5 text-green-600">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    <span class="text-xs font-bold uppercase tracking-tight">Activo</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-sm text-slate-500 font-medium">
                  {{ user.date }}
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center justify-center gap-3">
                    <button class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                    </button>
                    <button class="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </button>
                    <button class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminUsersComponent {
  roles = ['Todos', 'Admin', 'Director', 'Coordinador', 'Docente', 'Secretaría', 'Finanzas'];
  
  stats = [
    { label: 'Total Usuarios', value: 31, color: 'text-slate-900' },
    { label: 'Activos', value: 31, color: 'text-green-600' },
    { label: 'Inactivos', value: 0, color: 'text-red-600' },
    { label: 'Docentes', value: 1, color: 'text-blue-600' },
  ];

  users = [
    { name: 'Apoderado Cermat', email: 'apoderadocermat1@gmail.com', role: 'Apoderado', status: 'Activo', date: '12/3/2026' },
    { name: 'Estudiante Cermat', email: 'estudiantc.cermat@cermatschool.edu.pe', role: 'Estudiante', status: 'Activo', date: '12/3/2026' },
    { name: 'Administrador', email: 'admin@cermatschool.edu.pe', role: 'Administrador', status: 'Activo', date: '6/3/2026' },
    { name: 'Lorenzo Cuña', email: 'lorenzocuna@cermatschool.edu.pe', role: 'Docente', status: 'Activo', date: '5/3/2026' },
  ];

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Administrador': return 'bg-red-50 text-red-600';
      case 'Apoderado': return 'bg-orange-50 text-orange-600';
      case 'Estudiante': return 'bg-yellow-50 text-yellow-600';
      case 'Docente': return 'bg-blue-50 text-blue-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  }
}
