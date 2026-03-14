import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';

@Component({
  selector: 'app-periods',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Periodos Académicos</h1>
          <p class="text-slate-500 text-sm font-medium">Gestiona los periodos (bimestres/trimestres) por año lectivo</p>
        </div>
        <button class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo periodo
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-blue-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Periodos 2025</span>
          <span class="text-3xl font-black text-[#0F172A]">4</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-green-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">En Curso</span>
          <span class="text-3xl font-black text-green-600">I-B</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-red-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Cerrados</span>
          <span class="text-3xl font-black text-red-600">0</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-slate-200">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Próximo</span>
          <span class="text-lg font-black text-slate-600 uppercase tracking-tighter italic leading-none mt-1">12 MAY</span>
        </div>
      </div>

      <!-- Year Sections -->
      <div *ngFor="let yearGroup of periodsByYear" class="space-y-6">
        <h2 class="text-xl font-bold text-[#0F172A] flex items-center gap-3 border-l-[3px] border-blue-600 pl-4 tracking-tight uppercase leading-none italic">
          Año {{ yearGroup.year }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let period of yearGroup.periods" class="bg-white border border-slate-100 rounded-[2.2rem] p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden">
            
            <!-- Card Header -->
            <div class="flex items-start justify-between relative z-10">
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-[#0E3A8A] to-[#1D4ED8] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-all">
                    <span class="text-2xl font-black text-white italic">{{ period.id }}</span>
                  </div>
                  <div class="flex flex-col">
                    <h3 class="text-lg font-black text-[#0F172A] leading-tight tracking-tighter uppercase italic">{{ period.name }}</h3>
                    <span *ngIf="period.isClosed" class="inline-flex items-center text-[8px] font-black text-red-600 uppercase tracking-[0.2em] italic mt-0.5">Cerrado</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="mt-8 space-y-4 relative z-10">
              <div class="bg-slate-50/50 p-4 rounded-2xl border border-slate-50 space-y-3 group-hover:bg-blue-50/50 transition-colors">
                 <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                    <span>Inicio</span>
                    <span>Fin</span>
                 </div>
                 <div class="flex justify-between items-center text-xs font-bold text-[#0F172A] tracking-tighter">
                    <span>{{ period.start }}</span>
                    <svg class="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                    <span>{{ period.end }}</span>
                 </div>
              </div>

              <div class="flex gap-2">
                <button class="flex-1 py-3 bg-white text-[#0E3A8A] border-2 border-slate-100 hover:border-[#0E3A8A] text-[10px] font-black uppercase tracking-tight rounded-xl transition-all active:scale-95 shadow-sm group/edit flex items-center justify-center gap-1.5 px-2">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Editar
                </button>
                <button class="px-3 py-3 bg-red-50 text-red-600 border-2 border-transparent hover:bg-red-600 hover:text-white rounded-xl transition-all active:scale-95 flex items-center justify-center">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>

            <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-slate-50 rounded-full blur-2xl group-hover:bg-blue-50 transition-colors"></div>
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
export class PeriodsComponent {
  periodsByYear = [
    {
      year: 2025,
      periods: [
        { id: '1', name: 'Bimestre I', start: '01 MAR', end: '10 MAY', isClosed: false },
        { id: '2', name: 'Bimestre II', start: '12 MAY', end: '25 JUL', isClosed: false },
        { id: '3', name: 'Bimestre III', start: '11 AGO', end: '17 OCT', isClosed: false },
        { id: '4', name: 'Bimestre IV', start: '20 OCT', end: '22 DIC', isClosed: false },
      ]
    }
  ];
}
