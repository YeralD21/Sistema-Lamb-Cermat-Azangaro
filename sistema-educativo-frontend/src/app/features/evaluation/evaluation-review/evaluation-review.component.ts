import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evaluation-review',
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
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Gestión de Evaluaciones</h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Revisa el avance y cierra periodos académicos</p>
        </div>
      </div>

      <!-- Period Selection Card -->
      <div class="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
        <div class="flex flex-col md:flex-row md:items-end gap-6">
          <div class="flex-1 space-y-2">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Periodo académico</label>
            <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
              <option>Bimestre 1 (2025-12-08 - 2026-01-01)</option>
            </select>
          </div>
          <div class="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl border border-green-100 h-[50px]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span class="text-xs font-bold uppercase tracking-tight">Periodo Abierto</span>
          </div>
        </div>

        <!-- KPI Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let kpi of kpis" class="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 group hover:border-blue-200 transition-all">
            <div class="flex items-start justify-between mb-4">
              <div class="p-2 bg-white rounded-lg shadow-sm">
                <svg class="w-5 h-5 text-blue-900" [innerHTML]="kpi.icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg>
              </div>
              <span class="text-2xl font-black text-slate-900 tracking-tighter">{{ kpi.value }}{{ kpi.suffix || '' }}</span>
            </div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ kpi.label }}</p>
          </div>
        </div>

        <!-- Close Period Action -->
        <div class="pt-6 border-t border-slate-100">
          <button class="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest cursor-not-allowed">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Cerrar Periodo
          </button>
        </div>
      </div>

      <!-- Warning Banner -->
      <div class="bg-red-50 border border-red-100 rounded-3xl p-8 flex items-start gap-5">
        <div class="p-3 bg-white rounded-full text-red-600 shadow-sm shrink-0">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="space-y-1">
          <h4 class="text-red-900 font-bold text-lg tracking-tight">No se puede cerrar el periodo</h4>
          <p class="text-red-700/70 text-sm font-medium leading-relaxed">Aún hay 2 curso(s) con evaluaciones pendientes de publicación. Todos los cursos deben tener sus calificaciones publicadas antes de cerrar el periodo.</p>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class EvaluationReviewComponent {
  kpis = [
    { label: 'Total de Cursos', value: '2', icon: '<path d="M3 3v18h18"/><path d="M7 16v-4"/><path d="M11 16V9"/><path d="M15 16V5"/><path d="M19 16v-7"/>' },
    { label: 'Cursos Completados', value: '0', icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' },
    { label: 'Cursos Pendientes', value: '2', icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
    { label: 'Avance General', value: '0', suffix: '%', icon: '<path d="M3 3v18h18"/><path d="M7 16v-4"/><path d="M11 16V9"/><path d="M15 16V5"/><path d="M19 16v-7"/>' },
  ];
}
