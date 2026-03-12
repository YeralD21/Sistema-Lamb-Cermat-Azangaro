import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finance-reports',
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
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Reportes Financieros</h1>
          <p class="text-slate-500 text-sm font-medium">Análisis de morosidad, recaudación y efectividad</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-5 py-2.5 bg-white border-2 border-blue-900 text-blue-900 text-xs font-semibold rounded-xl transition-all hover:bg-blue-50 active:scale-95 flex items-center gap-2 shadow-sm uppercase tracking-tight">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Exportar a Excel
          </button>
          <button class="px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-400 text-xs font-semibold rounded-xl transition-all hover:bg-slate-50 active:scale-95 flex items-center gap-2 shadow-sm uppercase tracking-tight">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            Exportar a PDF
          </button>
        </div>
      </div>

      <!-- Specialized Tabs Navigation -->
      <div class="flex items-center gap-10 border-b border-slate-100 overflow-x-auto pb-px scrollbar-hide">
        <button (click)="activeTab = 'Morosidad'"
          [class]="activeTab === 'Morosidad' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-600'"
          class="pb-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap px-1">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          Análisis de Morosidad
        </button>
        <button (click)="activeTab = 'Recaudación'"
          [class]="activeTab === 'Recaudación' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-600'"
          class="pb-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap px-1">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/></svg>
          Recaudación Mensual
        </button>
        <button (click)="activeTab = 'Efectividad'"
          [class]="activeTab === 'Efectividad' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-600'"
          class="pb-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap px-1">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
          Efectividad de Cobranza
        </button>
      </div>

      <!-- Comprehensive Filters Card -->
      <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="space-y-2">
            <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Año Académico</label>
            <div class="relative group">
              <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                <option>2025</option>
                <option>2024</option>
              </select>
              <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Grado</label>
            <div class="relative group">
              <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                <option>Todos los grados</option>
                <option>1ro Primaria</option>
                <option>2do Primaria</option>
              </select>
              <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Sección</label>
            <div class="relative group">
              <select class="w-full bg-slate-50 border border-slate-200 text-slate-400 rounded-xl px-4 py-2.5 text-sm font-medium appearance-none cursor-not-allowed" disabled>
                <option>Todas las secciones</option>
              </select>
              <svg class="w-4 h-4 text-slate-300 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Mes</label>
            <div class="relative group">
              <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                <option>Todos los meses</option>
                <option>Marzo</option>
                <option>Abril</option>
              </select>
              <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <div class="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm group hover:scale-[1.02] transition-all border-t-4 border-orange-400">
           <div class="flex items-center justify-between mb-2">
             <h3 class="text-3xl font-bold text-slate-900 tracking-tighter">S/ 0.00</h3>
             <svg class="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
           </div>
           <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Total Adeudado</p>
        </div>
        
        <div class="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm group hover:scale-[1.02] transition-all border-t-4 border-red-500">
           <div class="flex items-center justify-between mb-2">
             <h3 class="text-3xl font-bold text-slate-900 tracking-tighter">S/ 0.00</h3>
             <svg class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
           </div>
           <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Total Vencido</p>
        </div>

        <div class="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm group hover:scale-[1.02] transition-all border-t-4 border-blue-500">
           <div class="flex items-center justify-between mb-2">
             <h3 class="text-3xl font-bold text-slate-900 tracking-tighter">0.0%</h3>
             <div class="flex items-center justify-center p-1.5 border-2 border-blue-500 rounded-full text-blue-500">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             </div>
           </div>
           <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">% de Morosidad</p>
        </div>
      </div>

      <!-- Detail Table Section -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm animate-slide-up">
        <div class="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
          <h2 class="text-base font-semibold text-slate-800 tracking-tight">Alumnos con Deuda Vencida (0)</h2>
        </div>

        <div class="py-24 text-center">
          <p class="text-slate-300 font-semibold text-sm uppercase tracking-widest">No hay deudas vencidas con los filtros seleccionados</p>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class FinanceReportsComponent {
  activeTab = 'Morosidad';
}
