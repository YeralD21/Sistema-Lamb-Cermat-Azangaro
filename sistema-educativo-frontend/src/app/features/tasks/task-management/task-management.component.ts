import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-management',
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
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Gestión de Tareas</h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Crea y gestiona tareas para tus cursos</p>
        </div>
        <button class="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva Tarea
        </button>
      </div>

      <!-- Course Selection -->
      <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div class="space-y-2 max-w-2xl">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Curso</label>
          <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option>MAT - MATEMATICA 1 (1ero de Primaria )</option>
          </select>
        </div>
      </div>

      <!-- Task List -->
      <div class="space-y-4">
        <div *ngFor="let task of tasks" class="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm border-l-4 border-l-blue-900 group hover:shadow-md transition-all">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-bold text-slate-900">{{ task.title }}</h3>
                <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight" 
                      [class]="task.status === 'Vencida' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'">
                  {{ task.status }}
                </span>
              </div>
              <p class="text-sm text-slate-500 font-medium">{{ task.description }}</p>
              
              <div class="flex flex-wrap items-center gap-5 pt-2">
                <div class="flex items-center gap-1.5 text-slate-400">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span class="text-xs font-semibold">Límite: {{ task.deadline }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-slate-400">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  <span class="text-xs font-semibold">{{ task.deliveries }} entregas</span>
                </div>
                <div class="flex items-center gap-1.5 text-slate-400">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span class="text-xs font-semibold">{{ task.graded }} calificadas</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <button class="px-5 py-2.5 bg-white border border-blue-900 text-blue-900 text-xs font-bold rounded-xl transition-all hover:bg-blue-50 flex items-center gap-2 shadow-sm">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M12 17v-10"/></svg>
                Ver entregas
              </button>
              <button class="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all hover:bg-slate-50 flex items-center gap-2 shadow-sm">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                Editar
              </button>
              <button class="p-2.5 text-slate-400 hover:text-red-500 transition-colors">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class TaskManagementComponent {
  tasks = [
    { 
      title: 'tareita', 
      status: 'Vencida', 
      description: 'nada', 
      deadline: '18/12/2025', 
      deliveries: '0/17', 
      graded: '0/0' 
    }
  ];
}
