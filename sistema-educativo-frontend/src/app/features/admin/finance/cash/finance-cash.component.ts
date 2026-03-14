import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';

@Component({
  selector: 'app-finance-cash',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Caja Diaria</h1>
          <p class="text-slate-500 text-sm font-medium">Registro de ingresos y egresos de la caja actual</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-6 py-2.5 bg-white border border-slate-200 text-slate-500 text-sm font-semibold rounded-xl transition-all hover:bg-slate-50 active:scale-95 flex items-center gap-2 shadow-sm uppercase tracking-tight">
            <svg class="w-5 h-5 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Movimiento Caja
          </button>
          <button class="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/10 active:scale-95 flex items-center gap-2 uppercase tracking-tight">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Cerrar Caja
          </button>
        </div>
      </div>

      <!-- Search Student Card -->
      <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden animate-slide-up">
        <div class="p-5 border-b border-slate-50 bg-slate-50/10 flex items-center gap-2">
          <svg class="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <h2 class="text-sm font-semibold text-slate-700 tracking-tight">Buscar Alumno</h2>
        </div>
        <div class="p-8">
          <div class="flex flex-col md:flex-row items-center gap-4">
            <div class="flex-1 w-full relative group">
              <input type="text" placeholder="Nombre, código o DNI del alumno..." 
                class="w-full bg-white border-2 border-slate-100 text-slate-700 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium placeholder:text-slate-300" />
            </div>
            <button class="w-full md:w-auto px-10 py-3.5 bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-sm font-semibold rounded-xl transition-all shadow-lg active:scale-95">
              Buscar
            </button>
          </div>
        </div>
      </div>

      <!-- Cash Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let stat of cashStats" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm group hover:shadow-md transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
              <svg class="w-6 h-6" [class]="stat.iconColor" [innerHTML]="stat.icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg>
            </div>
          </div>
          <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
          <h3 class="text-2xl font-bold text-slate-900 tracking-tighter">S/ {{ stat.value | number:'1.2-2' }}</h3>
        </div>
      </div>

      <!-- Movements Section -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/10">
          <div class="flex items-center gap-3">
            <h2 class="text-base font-semibold text-slate-800 tracking-tight">Movimientos de Hoy</h2>
            <span class="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 italic">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Caja Abierta
            </span>
          </div>
          <div class="relative w-full md:w-64 group">
            <input type="text" placeholder="Buscar movimiento..." class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-10 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium group-hover:bg-white" />
            <svg class="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-50">
                <th class="py-5 px-8 text-left">Hora</th>
                <th class="py-5 px-6 text-left">Concepto / Descripción</th>
                <th class="py-5 px-6 text-center">Tipo</th>
                <th class="py-5 px-6 text-center">Referencia</th>
                <th class="py-5 px-6 text-right">Monto</th>
                <th class="py-5 px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let m of movements" class="group hover:bg-slate-50/50 transition-colors">
                <td class="py-5 px-8">
                  <span class="text-[11px] font-semibold text-slate-400 uppercase">{{ m.time }}</span>
                </td>
                <td class="py-5 px-6">
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-slate-700">{{ m.description }}</span>
                    <span class="text-[10px] text-slate-400 font-medium">{{ m.category }}</span>
                  </div>
                </td>
                <td class="py-5 px-6 text-center">
                  <span [class]="m.type === 'ING' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'" 
                    class="px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                    {{ m.type === 'ING' ? 'Ingreso' : 'Egreso' }}
                  </span>
                </td>
                <td class="py-5 px-6 text-center text-[11px] font-mono text-slate-400">{{ m.ref }}</td>
                <td class="py-5 px-6 text-right">
                  <span [class]="m.type === 'ING' ? 'text-green-600' : 'text-red-600'" class="text-sm font-bold tracking-tight">
                    {{ m.type === 'ING' ? '+' : '-' }} S/ {{ m.amount | number:'1.2-2' }}
                  </span>
                </td>
                <td class="py-5 px-8 text-right grow-0">
                  <button class="p-1.5 text-slate-300 hover:text-blue-900 transition-colors">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </button>
                </td>
              </tr>
              <!-- Empty state if no movements -->
              <tr *ngIf="movements.length === 0">
                <td colspan="6" class="py-20 text-center opacity-60">
                   <svg class="w-16 h-16 text-slate-100 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                   <p class="text-slate-400 font-semibold text-sm uppercase tracking-widest">Sin movimientos registrados aún</p>
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
    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class FinanceCashComponent {
  cashStats = [
    { label: 'Saldo Inicial', value: 250, icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>', iconColor: 'text-slate-400' },
    { label: 'Ingresos Totales', value: 1250.50, icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>', iconColor: 'text-green-600' },
    { label: 'Egresos Totales', value: 120.00, icon: '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>', iconColor: 'text-red-600' },
    { label: 'Efectivo en Caja', value: 1380.50, icon: '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>', iconColor: 'text-blue-900' },
  ];

  movements = [
    { time: '08:30 am', description: 'Pago de Matrícula - Juan Pérez', category: 'Matrícula', type: 'ING', ref: 'REC-001', amount: 500 },
    { time: '09:15 am', description: 'Mensualidad Marzo - María García', category: 'Pensión', type: 'ING', ref: 'REC-002', amount: 450 },
    { time: '10:00 am', description: 'Compra de material de oficina', category: 'Gasto Admin', type: 'EGR', ref: 'EGR-001', amount: 120 },
    { time: '11:45 am', description: 'Seguro Estudiantil - Luis Torres', category: 'Seguros', type: 'ING', ref: 'REC-003', amount: 300.50 },
  ];
}
