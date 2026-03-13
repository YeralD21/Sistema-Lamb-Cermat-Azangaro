import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <!-- Back Link -->
      <div class="flex items-center gap-2 text-[#0E3A8A] font-medium text-sm cursor-pointer hover:underline transition-all">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver al Panel
      </div>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Secciones</h1>
          <p class="text-slate-500 text-sm font-medium">Gestiona las secciones por grado académico</p>
        </div>
        <button class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva sección
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-blue-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Secciones</span>
          <span class="text-3xl font-black text-[#0F172A]">25</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-slate-200">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Aforo Total</span>
          <span class="text-3xl font-black text-[#0F172A]">750</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-green-100 border-l-4 border-l-green-500">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Vacantes</span>
          <span class="text-3xl font-black text-green-600">40</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-blue-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Promedio</span>
          <span class="text-3xl font-black text-[#0E3A8A]">28.4</span>
        </div>
      </div>

      <!-- Filter Pill -->
      <div class="bg-white border border-slate-100/50 rounded-[2rem] p-4 shadow-sm flex items-center gap-4 px-6 md:max-w-md mx-auto">
        <div class="text-slate-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
        </div>
        <select class="flex-1 bg-transparent border-none text-[10px] font-black text-[#0F172A] uppercase tracking-[0.15em] focus:ring-0 cursor-pointer appearance-none italic">
          <option>Todos los grados</option>
          <option>1ro Secundaria</option>
          <option>5to Secundaria</option>
        </select>
        <div class="text-slate-400">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

      <!-- Grade Sections -->
      <div *ngFor="let gradeGroup of sectionsByGrade" class="space-y-6">
        <h2 class="text-xl font-bold text-[#0F172A] flex items-center gap-3 border-l-[3px] border-blue-600 pl-4 tracking-tight uppercase leading-none italic">
          {{ gradeGroup.grade }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let section of gradeGroup.sections" class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between relative overflow-hidden">
            
            <div class="space-y-6 relative z-10">
              <div class="flex items-center gap-5">
                <div class="w-16 h-16 bg-gradient-to-br from-[#0E3A8A] to-[#1D4ED8] rounded-[1.25rem] flex items-center justify-center shadow-lg group-hover:rotate-6 transition-all">
                  <span class="text-3xl font-black text-white italic tracking-tighter">{{ section.letter }}</span>
                </div>
                <div>
                  <h3 class="text-xl font-black text-[#0F172A] tracking-tighter uppercase italic">Sección "{{ section.letter }}"</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="px-2.5 py-1 bg-blue-50 text-[#0E3A8A] rounded-lg text-[8px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">{{ section.year }}</span>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                 <div class="flex justify-between items-end mb-1">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Aforo / Vacantes</span>
                    <span class="text-xs font-black text-[#0F172A] italic leading-none">{{ (section.capacity - section.vacancies) }}/{{ section.capacity }}</span>
                 </div>
                 <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:from-blue-600 group-hover:to-indigo-600 transition-all" 
                         [style.width.%]="((section.capacity - section.vacancies) / section.capacity) * 100"></div>
                 </div>
              </div>
            </div>

            <div class="mt-10 pt-6 border-t border-slate-50 flex gap-2 relative z-10">
              <button class="flex-1 py-3.5 bg-white text-[#0E3A8A] border-2 border-slate-100 hover:border-[#0E3A8A] text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 px-2">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar
              </button>
              <button class="px-4 py-3.5 bg-red-50 text-red-600 border-2 border-transparent hover:bg-red-600 hover:text-white rounded-2xl transition-all active:scale-95 flex items-center justify-center">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>

            <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-blue-50 transition-colors"></div>
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
export class SectionsComponent {
  sectionsByGrade = [
    {
      grade: '1ro Secundaria',
      sections: [
        { letter: 'A', year: 2025, capacity: 30, vacancies: 2 },
        { letter: 'B', year: 2025, capacity: 25, vacancies: 5 },
        { letter: 'C', year: 2025, capacity: 30, vacancies: 0 },
      ]
    },
    {
      grade: '5to Secundaria',
      sections: [
        { letter: 'A', year: 2025, capacity: 25, vacancies: 10 },
      ]
    }
  ];
}
