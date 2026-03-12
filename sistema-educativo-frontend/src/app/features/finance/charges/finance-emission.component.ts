import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finance-emission',
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
      <div class="space-y-1">
        <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Emisión Masiva de Cargos</h1>
        <p class="text-slate-500 text-sm font-medium">Emite cargos a múltiples estudiantes de forma masiva</p>
      </div>

      <!-- Filters Section -->
      <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-50 bg-slate-50/20 flex items-center gap-2">
          <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
          <h2 class="text-sm font-semibold text-slate-700 tracking-tight">Filtros de Emisión</h2>
        </div>
        
        <div class="p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <!-- Academic Year -->
            <div class="space-y-2">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Año Académico <span class="text-red-500">*</span></label>
              <div class="relative group">
                <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer group-hover:bg-white">
                  <option value="">Selecciona un año</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
                <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <!-- Financial Plan -->
            <div class="space-y-2">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Plan Financiero <span class="text-red-500">*</span></label>
              <div class="relative group">
                <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer group-hover:bg-white">
                  <option value="">Selecciona un plan</option>
                  <option value="regular">Plan Primaria Regular</option>
                  <option value="pre">Plan Secundaria Pre</option>
                </select>
                <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <!-- Grade -->
            <div class="space-y-2">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Grado (opcional)</label>
              <div class="relative group border-2 border-blue-500 rounded-xl">
                <select class="w-full bg-white border-none text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-medium appearance-none cursor-pointer">
                  <option value="todos">Todos los grados</option>
                  <option value="1">1ro Primaria</option>
                  <option value="2">2do Primaria</option>
                </select>
                <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <!-- Section -->
            <div class="space-y-2">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Sección (opcional)</label>
              <div class="relative group">
                <select class="w-full bg-slate-50 border border-slate-100/50 text-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-medium appearance-none cursor-default" disabled>
                  <option value="todos">Todas las secciones</option>
                </select>
                <svg class="w-4 h-4 text-slate-200 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div class="pt-4">
            <button class="px-8 py-3 bg-gradient-to-r from-blue-400 to-red-400 hover:opacity-90 text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95">
              Generar Preview
            </button>
          </div>
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
export class FinanceEmissionComponent {}
