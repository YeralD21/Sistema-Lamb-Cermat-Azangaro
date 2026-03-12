import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finance-discounts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      <!-- Back Link -->
      <div class="flex items-center gap-2 text-blue-900 font-medium text-sm cursor-pointer hover:underline transition-all">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver al Panel
      </div>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Descuentos</h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Gestiona los descuentos aplicables a conceptos de cobro</p>
        </div>
        <button class="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-sm font-semibold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Descuento
        </button>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let kpi of kpis" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p class="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">{{ kpi.label }}</p>
            <h3 class="text-2xl font-bold text-slate-900 tracking-tight">{{ kpi.value }}</h3>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors" [class]="kpi.iconClass">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [innerHTML]="kpi.icon"></svg>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Tipo</label>
            <div class="relative group">
              <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer group-hover:bg-white">
                <option value="todos">Todos</option>
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="monto">Monto Fijo (S/)</option>
              </select>
              <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Alcance</label>
            <div class="relative group border-2 border-blue-500 rounded-xl">
              <select class="w-full bg-white border-none text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-medium appearance-none cursor-pointer">
                <option value="todos">Todos</option>
                <option value="pension">Pensión</option>
                <option value="matricula">Matrícula</option>
              </select>
              <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Estado</label>
            <div class="relative group">
              <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer group-hover:bg-white">
                <option value="todos">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 flex items-center justify-between">
           <h2 class="text-base font-semibold text-slate-800 tracking-tight transition-all">Descuentos (1)</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-50">
                <th class="py-5 px-8 text-left">Nombre</th>
                <th class="py-5 px-6 text-center">Tipo</th>
                <th class="py-5 px-6 text-center">Valor</th>
                <th class="py-5 px-6 text-center">Alcance</th>
                <th class="py-5 px-6 text-center">Estado</th>
                <th class="py-5 px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr class="group hover:bg-slate-50/50 transition-colors">
                <td class="py-5 px-8">
                  <span class="text-sm font-medium text-slate-700 group-hover:text-blue-900 transition-colors">descuetno por hermanos 10%</span>
                </td>
                <td class="py-5 px-6 text-center">
                  <span class="px-2 py-1 bg-blue-50 text-blue-600 text-[11px] font-semibold rounded-lg">%</span>
                </td>
                <td class="py-5 px-6 text-center">
                  <span class="text-sm font-semibold text-slate-800">10%</span>
                </td>
                <td class="py-5 px-6 text-center">
                  <span class="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-semibold rounded-full">Pensión</span>
                </td>
                <td class="py-5 px-6 text-center">
                  <span class="px-2.5 py-1 bg-green-50 text-green-600 text-[11px] font-semibold rounded-lg uppercase tracking-tight italic">Activo</span>
                </td>
                <td class="py-5 px-8 text-right grow-0">
                  <div class="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button class="p-1.5 text-slate-400 hover:text-blue-900 transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
                    <button class="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
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
    select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
  `]
})
export class FinanceDiscountsComponent {
  kpis = [
    { label: 'Total', value: '1', icon: '<path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/>', iconClass: 'text-blue-500' },
    { label: 'Activos', value: '1', icon: '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>', iconClass: 'text-green-500' },
    { label: 'Porcentaje', value: '1', icon: '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>', iconClass: 'text-slate-900' },
    { label: 'Monto Fijo', value: '0', icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>', iconClass: 'text-slate-900' },
  ];
}
