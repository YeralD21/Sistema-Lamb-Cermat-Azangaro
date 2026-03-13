import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-grading',
  standalone: true,
  imports: [CommonModule],
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
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Calificar Entregas</h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Revisa y califica los trabajos enviados por tus estudiantes</p>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-2">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Curso</label>
          <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option>Todos los cursos</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Tarea</label>
          <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option>Todas las tareas</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Sección</label>
          <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option>Todas las secciones</option>
          </select>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let stat of stats" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm border-b-4" [style.border-bottom-color]="stat.borderColor">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{{ stat.label }}</p>
          <h3 class="text-3xl font-black text-slate-900 tracking-tighter">{{ stat.value }}</h3>
        </div>
      </div>

      <!-- Deliveries Grid -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-800 tracking-tight">Lista de Entregas</h2>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">0 registros encontrados</span>
        </div>
        <div class="py-20 text-center">
          <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
          <h3 class="text-slate-900 font-semibold text-xl mb-2">No hay entregas pendientes</h3>
          <p class="text-slate-500 text-sm max-w-xs mx-auto font-medium leading-relaxed">Las entregas de los estudiantes aparecerán aquí una vez que comiencen a subir sus trabajos.</p>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class TaskGradingComponent {
  stats = [
    { label: 'Total Estudiantes', value: '0', borderColor: '#1e3a8a' },
    { label: 'Entregados', value: '0', borderColor: '#10b981' },
    { label: 'Calificados', value: '0', borderColor: '#f59e0b' },
    { label: 'Pendientes', value: '0', borderColor: '#ef4444' },
  ];
}
