import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';

@Component({
  selector: 'app-grades-levels',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Grados y Niveles</h1>
          <p class="text-slate-500 text-sm font-medium">Gestiona los grados por nivel educativo</p>
        </div>
        <button class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo grado
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-blue-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Niveles</span>
          <span class="text-3xl font-black text-[#0F172A]">3</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-slate-200">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Total Grados</span>
          <span class="text-3xl font-black text-[#0F172A]">14</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-green-100 border-l-4 border-l-green-500">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Total Vacantes</span>
          <span class="text-3xl font-black text-green-600">350</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-blue-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Ocupadas</span>
          <span class="text-3xl font-black text-[#0E3A8A]">310</span>
        </div>
      </div>

      <!-- Levels and Grade Cards -->
      <div *ngFor="let levelGroup of levels" class="space-y-6">
        <h2 class="text-xl font-bold text-[#0F172A] flex items-center gap-3 border-l-[3px] border-[#0E3A8A] pl-4 uppercase tracking-tighter italic">
          {{ levelGroup.label }}
        </h2>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div *ngFor="let grade of levelGroup.grades" class="bg-white border border-slate-100 rounded-[2.2rem] p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center relative overflow-hidden">
            
            <div class="text-center w-full space-y-5 relative z-10">
              <div class="w-20 h-20 mx-auto bg-gradient-to-br from-[#0E3A8A] to-[#1D4ED8] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span class="text-4xl font-black text-white tracking-tighter italic">{{ grade.number }}</span>
              </div>
              <div>
                <h3 class="text-lg font-black text-[#0F172A] tracking-tighter uppercase italic">{{ grade.name }}</h3>
                <div class="flex items-center justify-center gap-2 mt-2">
                   <span class="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-slate-100">{{ levelGroup.label }}</span>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-5 border-t border-slate-50 flex gap-2 w-full relative z-10">
              <button class="flex-1 py-3 bg-white text-[#0E3A8A] border-2 border-slate-100 hover:border-[#0E3A8A] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1.5 px-2">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar
              </button>
              <button class="px-3 py-3 bg-red-50 text-red-600 border-2 border-transparent hover:bg-red-600 hover:text-white rounded-xl transition-all active:scale-95 flex items-center justify-center">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
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
export class GradesLevelsComponent {
  levels = [
    {
      label: 'Inicial',
      grades: [
        { number: 3, name: '3 Años' },
        { number: 4, name: '4 Años' },
        { number: 5, name: '5 Años' },
      ]
    },
    {
      label: 'Primaria',
      grades: [
        { number: 1, name: '1ro Primaria' },
        { number: 2, name: '2do Primaria' },
        { number: 3, name: '3ro Primaria' },
        { number: 4, name: '4to Primaria' },
        { number: 5, name: '5to Primaria' },
        { number: 6, name: '6to Primaria' },
      ]
    },
    {
      label: 'Secundaria',
      grades: [
        { number: 1, name: '1ro Secundaria' },
        { number: 2, name: '2do Secundaria' },
        { number: 3, name: '3ro Secundaria' },
        { number: 4, name: '4to Secundaria' },
        { number: 5, name: '5to Secundaria' },
      ]
    }
  ];
}
