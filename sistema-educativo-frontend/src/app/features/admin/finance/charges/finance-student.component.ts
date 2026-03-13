import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finance-student',
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
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Cuenta Corriente Estudiante</h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Consulta el estado de cuenta y cargos individuales</p>
        </div>
      </div>

      <!-- Student Search Card -->
      <div class="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8">
        <div class="flex flex-col md:flex-row items-end gap-6">
          <div class="flex-1 space-y-2">
            <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Estudiante</label>
            <div class="relative">
              <input type="text" placeholder="Buscar por DNI o Apellidos..." class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-10 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
              <svg class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
          <button class="px-8 py-3.5 bg-blue-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/10 h-[50px]">
            Consultar
          </button>
        </div>

        <!-- Empty State Placeholder -->
        <div class="py-20 border-2 border-dashed border-slate-50 rounded-3xl text-center">
          <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
             <svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h4 class="text-slate-900 font-semibold text-xl mb-2">Selecciona un estudiante</h4>
          <p class="text-slate-400 text-sm max-w-xs mx-auto font-medium">Ingresa el nombre o DNI del estudiante para ver su historial de pagos y deudas pendientes.</p>
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
export class FinanceStudentComponent {}
