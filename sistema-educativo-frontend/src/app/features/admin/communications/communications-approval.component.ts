import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-communications-approval',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <!-- Back Link -->
      <div class="flex items-center gap-2 text-blue-900 font-medium text-sm cursor-pointer hover:underline transition-all">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver al Panel
      </div>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Revisión de Comunicados</h1>
          <p class="text-slate-500 text-sm font-medium">Panel de aprobación para anuncios institucionales</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="px-4 py-2 bg-orange-50 text-orange-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-orange-100 italic">
            2 Pendientes de Revisión
          </div>
        </div>
      </div>

      <!-- Filters Card -->
      <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden animate-slide-up">
        <div class="p-5 border-b border-slate-50 bg-slate-50/10 flex items-center gap-2 px-6">
          <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <h2 class="text-sm font-semibold text-slate-700 tracking-tight">Filtros</h2>
        </div>
        <div class="p-6 md:p-8">
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Estado</label>
            <div class="relative group">
              <select class="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                <option>Pendiente Aprobación</option>
                <option>Publicados</option>
                <option>Archivados</option>
                <option>Todos</option>
              </select>
              <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let stat of stats" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm group hover:shadow-md transition-all relative overflow-hidden">
          <div class="flex items-start justify-between relative z-10">
            <div class="space-y-1">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">{{ stat.label }}</p>
              <h3 class="text-2xl font-bold text-slate-900 tracking-tighter">{{ stat.value }}</h3>
            </div>
            <div [class]="'p-3 rounded-xl transition-colors ' + stat.bgColor">
              <svg class="w-6 h-6" [class]="stat.iconColor" [innerHTML]="stat.icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Approval List -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/10 px-8">
          <h2 class="text-base font-bold text-slate-800 tracking-tight uppercase">Comunicados en Espera (0)</h2>
        </div>

        <div class="p-16 flex flex-col items-center justify-center text-center space-y-6">
          <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500">
            <svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-900 tracking-tight">Todo al día</h3>
            <p class="text-slate-500 text-sm mt-2 max-w-sm mx-auto font-medium leading-relaxed">
              No hay comunicados pendientes de aprobación en este momento. Los docentes recibirán notificaciones cuando publiques nuevos avisos.
            </p>
          </div>
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
export class CommunicationsApprovalComponent {
  stats = [
    { label: 'Pendientes', value: 0, iconColor: 'text-blue-500', bgColor: 'bg-blue-50', icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
    { label: 'Publicados', value: 5, iconColor: 'text-green-500', bgColor: 'bg-green-50', icon: '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' },
    { label: 'Archivados', value: 2, iconColor: 'text-slate-400', bgColor: 'bg-slate-50', icon: '<path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/>' },
  ];
}
