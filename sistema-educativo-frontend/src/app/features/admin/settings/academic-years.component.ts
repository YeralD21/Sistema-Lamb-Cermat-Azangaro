import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';

@Component({
  selector: 'app-academic-years',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Años Lectivos</h1>
          <p class="text-slate-500 text-sm font-medium">Gestiona los años académicos de la institución</p>
        </div>
        <button class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo año lectivo
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-blue-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Total Ciclos</span>
          <span class="text-3xl font-black text-[#0F172A]">5</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-green-100 border-l-4 border-l-green-500">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Ciclo Activo</span>
          <span class="text-3xl font-black text-green-600">2025</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-slate-200">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Inicia</span>
          <span class="text-lg font-black text-slate-600 uppercase tracking-tighter">01 MAR</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-slate-200">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Finaliza</span>
          <span class="text-lg font-black text-slate-600 uppercase tracking-tighter">22 DIC</span>
        </div>
      </div>

      <!-- Academic Years Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let year of academicYears" class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden">
          
          <div class="absolute -right-10 -top-10 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-blue-50 transition-colors"></div>

          <!-- Card Header -->
          <div class="flex items-start justify-between relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-gradient-to-br from-[#0E3A8A] to-[#1D4ED8] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div class="space-y-1">
                <h3 class="text-3xl font-black text-[#0F172A] tracking-tighter">{{ year.year }}</h3>
                <span *ngIf="year.isActive" class="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black bg-green-50 text-green-600 border border-green-100 uppercase tracking-widest">Activo</span>
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="mt-10 space-y-5 relative z-10">
            <div class="flex justify-between items-center text-sm">
              <div class="space-y-1">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Fecha Inicio</span>
                <p class="font-bold text-[#0F172A] tracking-tight uppercase leading-none">{{ year.startDate }}</p>
              </div>
              <div class="w-px h-8 bg-slate-100"></div>
              <div class="space-y-1 text-right">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Fecha Fin</span>
                <p class="font-bold text-[#0F172A] tracking-tight uppercase leading-none">{{ year.endDate }}</p>
              </div>
            </div>

            <div class="pt-6 flex gap-2">
              <button class="flex-2 py-3.5 bg-white text-[#0E3A8A] border-2 border-slate-100 hover:border-[#0E3A8A] text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 flex-grow">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar
              </button>
              <button class="px-4 py-3.5 bg-red-50 text-red-600 border-2 border-transparent hover:bg-red-600 hover:text-white rounded-2xl transition-all active:scale-95">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
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
export class AcademicYearsComponent {
  academicYears = [
    { year: 2025, startDate: '01 MAR 2025', endDate: '22 DIC 2025', isActive: true },
    { year: 2024, startDate: '01 MAR 2024', endDate: '20 DIC 2024', isActive: false },
    { year: 2023, startDate: '10 MAR 2023', endDate: '21 DIC 2023', isActive: false },
  ];
}
