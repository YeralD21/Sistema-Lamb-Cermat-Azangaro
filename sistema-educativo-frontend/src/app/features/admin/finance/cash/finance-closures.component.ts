import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';

@Component({
  selector: 'app-finance-closures',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Cierres de Caja</h1>
          <p class="text-slate-500 text-sm font-medium">Apertura y cierre de caja diaria</p>
        </div>
        <button class="px-6 py-2.5 border-2 border-blue-900 text-blue-900 text-sm font-semibold rounded-xl transition-all hover:bg-blue-50 active:scale-95 flex items-center gap-2 shadow-sm uppercase tracking-tight">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Cerrar Caja
        </button>
      </div>

      <!-- Active Box Card -->
      <div class="bg-white border-2 border-blue-500 rounded-2xl shadow-sm overflow-hidden animate-slide-up relative group">
        <div class="p-5 border-b border-blue-100 bg-blue-50/20 flex items-center justify-between">
          <div class="flex items-center gap-2 text-blue-600">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <h2 class="text-sm font-semibold tracking-tight uppercase">Caja Abierta</h2>
          </div>
          <span class="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-lg">
            En Operación
          </span>
        </div>
        <div class="p-8 space-y-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="space-y-1">
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Fecha de Apertura</p>
              <h3 class="text-base font-bold text-slate-800 tracking-tight">9/12/2025</h3>
            </div>
            <div class="space-y-1">
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Hora de Apertura</p>
              <h3 class="text-base font-bold text-slate-800 tracking-tight">7:38:19 p. m.</h3>
            </div>
            <div class="space-y-1">
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Cajero</p>
              <h3 class="text-base font-bold text-slate-800 tracking-tight">-</h3>
            </div>
          </div>

          <div class="py-10 text-center">
            <p class="text-slate-300 font-semibold text-sm uppercase tracking-widest">No hay pagos registrados aún</p>
          </div>
        </div>
      </div>

      <!-- History Section -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 flex items-center gap-2 bg-slate-50/10">
          <svg class="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          <h2 class="text-base font-semibold text-slate-800 tracking-tight uppercase">Historial de Cierres</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-50">
                <th class="py-5 px-8 text-left">Fecha</th>
                <th class="py-5 px-6 text-left">Cajero</th>
                <th class="py-5 px-6 text-center">Apertura</th>
                <th class="py-5 px-6 text-center">Cierre</th>
                <th class="py-5 px-6 text-center">Pagos</th>
                <th class="py-5 px-6 text-right">Total</th>
                <th class="py-5 px-6 text-center">Estado</th>
                <th class="py-5 px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let c of closures" class="group hover:bg-slate-50/50 transition-colors">
                <td class="py-5 px-8">
                  <span class="text-sm font-medium text-slate-500">{{ c.date }}</span>
                </td>
                <td class="py-5 px-6">
                  <span class="text-sm font-semibold text-slate-700">{{ c.user }}</span>
                </td>
                <td class="py-5 px-6 text-center text-sm font-medium text-slate-500">{{ c.opening }}</td>
                <td class="py-5 px-6 text-center text-sm font-medium text-slate-500">{{ c.closing }}</td>
                <td class="py-5 px-6 text-center text-sm font-semibold text-slate-700">{{ c.payments }}</td>
                <td class="py-5 px-6 text-right">
                  <span class="text-sm font-bold text-slate-900">S/ {{ c.total | number:'1.2-2' }}</span>
                </td>
                <td class="py-5 px-6 text-center">
                  <span class="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                    {{ c.status }}
                  </span>
                </td>
                <td class="py-5 px-8 text-right">
                  <button class="p-2 border border-slate-200 text-blue-900 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center mx-auto">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
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
export class FinanceClosuresComponent {
  closures = [
    { date: '10/12/2025', user: 'Director General', opening: '07:38 p. m.', closing: '-', payments: 0, total: 0, status: 'Abierto' }
  ];
}
