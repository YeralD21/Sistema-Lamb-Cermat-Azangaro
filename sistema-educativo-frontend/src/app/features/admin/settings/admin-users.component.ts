import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, UserProfile } from '@core/services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Gestión de Usuarios</h1>
          <p class="text-slate-500 text-sm font-medium">Administra usuarios, roles y permisos del sistema</p>
        </div>
        <button (click)="openCreateModal()" 
                class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
          Crear Usuario
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group hover:border-[#0E3A8A]/20 transition-all cursor-default">
          <span class="text-xs font-black text-slate-400 uppercase tracking-widest italic leading-none mb-1">Total Usuarios</span>
          <span class="text-3xl font-black text-[#0F172A]">{{ stats().total }}</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group hover:border-green-100 transition-all cursor-default">
          <span class="text-xs font-black text-slate-400 uppercase tracking-widest italic leading-none mb-1">Activos</span>
          <span class="text-3xl font-black text-green-600">{{ stats().active }}</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group hover:border-red-100 transition-all cursor-default">
          <span class="text-xs font-black text-slate-400 uppercase tracking-widest italic leading-none mb-1">Inactivos</span>
          <span class="text-3xl font-black text-red-600">{{ stats().inactive }}</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group hover:border-blue-100 transition-all cursor-default">
          <span class="text-xs font-black text-slate-400 uppercase tracking-widest italic leading-none mb-1">Docentes</span>
          <span class="text-3xl font-black text-blue-600">{{ stats().teachers }}</span>
        </div>
      </div>

      <!-- Filter Pill -->
      <div class="bg-white border border-slate-100/50 rounded-[2rem] p-4 shadow-sm flex flex-col md:flex-row items-center gap-4 px-6">
        <div class="flex items-center gap-4 flex-1 w-full">
          <div class="text-slate-400">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input type="text" [(ngModel)]="filters.q" (input)="loadUsers()" placeholder="Buscar por email o nombre..." 
                 class="flex-1 bg-transparent border-none text-sm font-bold text-[#0F172A] focus:ring-0 placeholder-slate-300">
        </div>
        <div class="flex items-center gap-4 w-full md:w-auto">
          <select [(ngModel)]="filters.role" (change)="loadUsers()" 
                  class="w-full md:w-40 bg-slate-50 border-none rounded-xl text-xs font-black text-[#0F172A] uppercase tracking-tighter focus:ring-0 cursor-pointer py-2 px-4 italic">
            <option value="Todos">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="teacher">Docente</option>
            <option value="student">Estudiante</option>
            <option value="guardian">Apoderado</option>
          </select>
          <select [(ngModel)]="filters.isActive" (change)="loadUsers()" 
                  class="w-full md:w-40 bg-slate-50 border-none rounded-xl text-xs font-black text-[#0F172A] uppercase tracking-tighter focus:ring-0 cursor-pointer py-2 px-4 italic">
            <option [ngValue]="undefined">Todos los estados</option>
            <option [ngValue]="true">Activo</option>
            <option [ngValue]="false">Inactivo</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E3A8A]"></div>
      </div>

      <!-- Users Table -->
      <div *ngIf="!loading()" class="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
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
              <tr *ngFor="let user of users()" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-8 py-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-white shadow-sm flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                      {{ user.full_name.charAt(0) || 'U' }}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-black text-[#0F172A] leading-tight tracking-tight uppercase italic">{{ user.full_name }}</span>
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
                    <span [class]="'w-2 h-2 rounded-full ' + (user.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]')"></span>
                    <span class="text-[10px] font-black uppercase tracking-widest" [class]="user.is_active ? 'text-green-600' : 'text-red-600'">
                      {{ user.is_active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </td>
                <td class="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter italic">
                  {{ user.created_at | date:'dd MMM yyyy' }}
                </td>
                <td class="px-8 py-5">
                  <div class="flex justify-end gap-2">
                    <button class="p-2.5 bg-white text-[#0E3A8A] border-2 border-slate-50 hover:border-[#0E3A8A] rounded-xl transition-all shadow-sm active:scale-95 group/edit">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="p-2.5 bg-red-50 text-red-600 border-2 border-transparent hover:bg-red-600 hover:text-white rounded-xl transition-all active:scale-95" (click)="deleteUser(user)">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Empty State -->
          <div *ngIf="users().length === 0" class="p-12 text-center">
            <p class="text-slate-400 font-bold italic uppercase tracking-widest">No se encontraron usuarios</p>
          </div>
        </div>
      </div>

      <!-- Create User Modal -->
      <div *ngIf="showModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-100">
          <!-- Modal Header -->
          <div class="p-8 pb-0 flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-black text-[#0F172A] uppercase italic tracking-tight">Crear Nuevo Usuario</h2>
              <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Completa los datos del perfil</p>
            </div>
            <button (click)="closeModal()" class="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <svg class="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Modal Body -->
          <form (submit)="createUser($event)" class="p-8 space-y-5">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Nombre Completo</label>
              <input type="text" [(ngModel)]="newUser.name" name="name" required
                     placeholder="Ej: Juan Perez"
                     class="w-full bg-slate-50 border-none rounded-[1.25rem] px-5 py-3.5 text-sm font-bold text-[#0F172A] focus:ring-2 focus:ring-[#0E3A8A]/10 placeholder-slate-300 italic shadow-inner">
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Email Institucional</label>
              <input type="email" [(ngModel)]="newUser.email" name="email" required
                     placeholder="usuario@cermatschool.edu.pe"
                     class="w-full bg-slate-50 border-none rounded-[1.25rem] px-5 py-3.5 text-sm font-bold text-[#0F172A] focus:ring-2 focus:ring-[#0E3A8A]/10 placeholder-slate-300 italic shadow-inner">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Rol del Sistema</label>
                <select [(ngModel)]="newUser.role" name="role" required
                        class="w-full bg-slate-50 border-none rounded-[1.25rem] px-5 py-3.5 text-xs font-black text-[#0F172A] uppercase italic focus:ring-2 focus:ring-[#0E3A8A]/10 cursor-pointer shadow-inner">
                  <option value="admin">Administrador</option>
                  <option value="teacher">Docente</option>
                  <option value="student">Estudiante</option>
                  <option value="guardian">Apoderado</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Contraseña</label>
                <input type="password" [(ngModel)]="newUser.password" name="password" required
                       placeholder="••••••••"
                       class="w-full bg-slate-50 border-none rounded-[1.25rem] px-5 py-3.5 text-sm font-bold text-[#0F172A] focus:ring-2 focus:ring-[#0E3A8A]/10 placeholder-slate-300 italic shadow-inner">
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 pt-4">
              <button type="button" (click)="closeModal()"
                      class="flex-1 px-6 py-4 border-2 border-slate-50 rounded-[1.5rem] text-xs font-black text-slate-400 uppercase tracking-widest hover:border-slate-200 transition-all active:scale-95 italic">
                Cancelar
              </button>
              <button type="submit" [disabled]="submitting()"
                      class="flex-[2] px-6 py-4 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] text-white text-xs font-black rounded-[1.5rem] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50">
                {{ submitting() ? 'CREANDO...' : 'CONFIRMAR CREACIÓN' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminUsersComponent implements OnInit {
  userService = inject(UserService);
  router = inject(Router);

  users = signal<UserProfile[]>([]);
  loading = signal(false);
  showModal = signal(false);
  submitting = signal(false);
  
  newUser = {
    name: '',
    email: '',
    role: 'student',
    password: ''
  };

  stats = signal({
    total: 0,
    active: 0,
    inactive: 0,
    teachers: 0
  });

  filters = {
    role: 'Todos',
    isActive: undefined as boolean | undefined,
    q: ''
  };

  ngOnInit() {
    this.loadUsers();
    this.loadStats();
  }

  loadStats() {
    this.userService.getStats().subscribe({
      next: (res) => {
        // the backend returns { stats: { total: X, active: Y, ... } }
        const data = res.data || res;
        if (data && typeof data === 'object') {
            this.stats.set({
               total: data.total || 0,
               active: data.active || 0,
               inactive: data.inactive || 0,
               teachers: data.teachers || 0
            });
        }
      },
      error: (err) => console.error('Error loading stats:', err)
    });
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getProfiles({
      role: this.filters.role,
      is_active: this.filters.isActive,
      q: this.filters.q
    }).subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading.set(false);
      }
    });
  }

  updateStats(users: UserProfile[]) {
    this.stats.set({
      total: users.length,
      active: users.filter(u => u.is_active).length,
      inactive: users.filter(u => !u.is_active).length,
      teachers: users.filter(u => (u.role as string).toLowerCase() === 'teacher').length
    });
  }

  getRoleClass(role: string) {
    const r = role?.toLowerCase();
    switch (r) {
      case 'admin': return 'bg-red-50 text-red-600 border-red-100';
      case 'teacher': case 'docente': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'student': case 'estudiante': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'apoderado': case 'guardian': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  }

  openCreateModal() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.newUser = { name: '', email: '', role: 'student', password: '' };
  }

  createUser(event: Event) {
    event.preventDefault();
    if (this.submitting()) return;

    this.submitting.set(true);
    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeModal();
        this.loadUsers();
        this.loadStats();
        Swal.fire({
          icon: 'success', title: 'Usuario creado', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false
        });
      },
      error: (err) => {
        this.submitting.set(false);
        Swal.fire('Error', err.error?.message || 'Error al crear usuario', 'error');
      }
    });
  }

  deleteUser(user: UserProfile) {
    Swal.fire({
      title: `¿Eliminar a ${user.full_name}?`,
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.userService.deleteProfile(user.id).subscribe({
           next: () => {
             Swal.fire({ icon: 'success', title: 'Eliminado', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
             this.loadUsers();
             this.loadStats();
           },
           error: (err) => Swal.fire('Error', err.error?.message || 'No se pudo eliminar el usuario', 'error')
        });
      }
    });
  }
}
