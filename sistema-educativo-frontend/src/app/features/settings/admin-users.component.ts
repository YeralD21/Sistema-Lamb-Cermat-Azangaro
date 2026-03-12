import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <!-- Back Link -->
      <div class="flex items-center gap-2 text-[#0E3A8A] font-medium text-sm cursor-pointer hover:underline transition-all">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver al Panel
      </div>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Gestión de Usuarios</h1>
          <p class="text-slate-500 text-sm font-medium">Administra usuarios, roles y permisos del sistema</p>
        </div>
        <button class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
          Crear Usuario
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group hover:border-[#0E3A8A]/20 transition-all cursor-default">
          <span class="text-xs font-black text-slate-400 uppercase tracking-widest italic leading-none mb-1">Total Usuarios</span>
          <span class="text-3xl font-black text-[#0F172A]">156</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group hover:border-green-100 transition-all cursor-default">
          <span class="text-xs font-black text-slate-400 uppercase tracking-widest italic leading-none mb-1">Activos</span>
          <span class="text-3xl font-black text-green-600">148</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group hover:border-red-100 transition-all cursor-default">
          <span class="text-xs font-black text-slate-400 uppercase tracking-widest italic leading-none mb-1">Inactivos</span>
          <span class="text-3xl font-black text-red-600">8</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group hover:border-blue-100 transition-all cursor-default">
          <span class="text-xs font-black text-slate-400 uppercase tracking-widest italic leading-none mb-1">Docentes</span>
          <span class="text-3xl font-black text-blue-600">42</span>
        </div>
      </div>

      <!-- Filter Pill -->
      <div class="bg-white border border-slate-100/50 rounded-[2rem] p-4 shadow-sm flex flex-col md:flex-row items-center gap-4 px-6">
        <div class="flex items-center gap-4 flex-1 w-full">
          <div class="text-slate-400">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input type="text" placeholder="Buscar por email o nombre..." class="flex-1 bg-transparent border-none text-sm font-bold text-[#0F172A] focus:ring-0 placeholder-slate-300">
        </div>
        <div class="flex items-center gap-4 w-full md:w-auto">
          <select class="w-full md:w-40 bg-slate-50 border-none rounded-xl text-xs font-black text-[#0F172A] uppercase tracking-tighter focus:ring-0 cursor-pointer py-2 px-4 italic">
            <option>Todos los roles</option>
            <option>Administrador</option>
            <option>Docente</option>
          </select>
          <select class="w-full md:w-40 bg-slate-50 border-none rounded-xl text-xs font-black text-[#0F172A] uppercase tracking-tighter focus:ring-0 cursor-pointer py-2 px-4 italic">
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Usuario</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Rol</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Estado</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Fecha Creación</th>
                <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let user of users" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-8 py-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-white shadow-sm flex items-center justify-center text-slate-500 font-bold text-xs">
                      {{ user.name.charAt(0) }}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-black text-[#0F172A] leading-tight tracking-tight uppercase italic">{{ user.name }}</span>
                      <span class="text-[10px] font-bold text-slate-400 italic lowercase">{{ user.email }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-5 text-sm font-medium">
                  <span [class]="'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ' + getRoleClass(user.role)">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-8 py-5">
                  <div class="flex items-center gap-2">
                    <span [class]="'w-2 h-2 rounded-full ' + (user.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]')"></span>
                    <span class="text-[10px] font-black uppercase tracking-widest" [class]="user.isActive ? 'text-green-600' : 'text-red-600'">
                      {{ user.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </td>
                <td class="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter italic">
                  {{ user.createdAt }}
                </td>
                <td class="px-8 py-5">
                  <div class="flex justify-end gap-2">
                    <button class="p-2.5 bg-white text-[#0E3A8A] border-2 border-slate-50 hover:border-[#0E3A8A] rounded-xl transition-all shadow-sm active:scale-95 group/edit">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="p-2.5 bg-orange-50 text-orange-600 border-2 border-transparent hover:border-orange-200 rounded-xl transition-all active:scale-95" title="Resetear contraseña">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </button>
                    <button class="p-2.5 bg-red-50 text-red-600 border-2 border-transparent hover:bg-red-600 hover:text-white rounded-xl transition-all active:scale-95">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminUsersComponent {
  users = [
    { name: 'Admin Principal', email: 'admin@lamb.edu.pe', role: 'admin', isActive: true, createdAt: '10 Mar 2024' },
    { name: 'Juan Perez', email: 'juan.perez@lamb.edu.pe', role: 'docente', isActive: true, createdAt: '11 Mar 2024' },
    { name: 'Maria Garcia', email: 'maria.garcia@lamb.edu.pe', role: 'secretaria', isActive: false, createdAt: '12 Mar 2024' },
  ];

  getRoleClass(role: string) {
    const roles: any = {
      'admin': 'bg-red-50 text-red-600 border-red-100',
      'docente': 'bg-blue-50 text-blue-600 border-blue-100',
      'secretaria': 'bg-pink-50 text-pink-600 border-pink-100',
    };
    return roles[role] || 'bg-slate-50 text-slate-600 border-slate-100';
  }
}
