import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';

@Component({
  selector: 'app-competencies',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Competencias</h1>
          <p class="text-slate-500 text-sm font-medium">Gestiona las competencias curriculares por curso</p>
        </div>
        <button class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva competencia
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-blue-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Total Cursos</span>
          <span class="text-3xl font-black text-[#0F172A]">45</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-slate-200">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Competencias</span>
          <span class="text-3xl font-black text-[#0F172A]">120</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-blue-100 border-l-4 border-l-blue-500">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Cursos Config.</span>
          <span class="text-3xl font-black text-[#0E3A8A]">42</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-orange-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Pendientes</span>
          <span class="text-3xl font-black text-orange-600">3</span>
        </div>
      </div>

      <!-- Filter Pill -->
      <div class="bg-white border border-slate-100/50 rounded-[2rem] p-4 shadow-sm flex items-center gap-4 px-6 md:max-w-xl mx-auto">
        <div class="text-slate-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
        </div>
        <select class="flex-1 bg-transparent border-none text-[10px] font-black text-[#0F172A] uppercase tracking-[0.15em] focus:ring-0 cursor-pointer appearance-none italic">
          <option>Todos los cursos</option>
          <option>MAT-1 - Matemática (1ro Primaria)</option>
        </select>
        <div class="text-slate-400">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

      <!-- Competencies by Course -->
      <div *ngFor="let courseGroup of competenciesByCourse" class="space-y-6">
        <h2 class="text-xl font-bold text-[#0F172A] flex items-center gap-3 border-l-[3px] border-[#0E3A8A] pl-4 italic tracking-tight uppercase leading-none">
          {{ courseGroup.courseName }}
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">({{ courseGroup.grade }})</span>
        </h2>
        
        <div class="space-y-4">
          <div *ngFor="let competency of courseGroup.competencies; let i = index" class="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-lg transition-all flex items-center gap-8 group relative overflow-hidden">
            
            <div class="absolute -right-6 -bottom-6 w-20 h-20 bg-slate-50 rounded-full blur-2xl group-hover:bg-blue-50 transition-colors"></div>

            <!-- Reorder Buttons -->
            <div class="flex flex-col gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
              <button class="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-[#0E3A8A] transition-colors">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
              </button>
              <button class="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-[#0E3A8A] transition-colors">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>

            <!-- Number Square -->
            <div class="w-16 h-16 bg-gradient-to-br from-[#0E3A8A] to-[#1D4ED8] rounded-[1.25rem] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all flex-shrink-0 relative z-10">
              <span class="text-2xl font-black text-white italic">{{ competency.order }}</span>
            </div>

            <!-- Content -->
            <div class="flex-1 space-y-2 relative z-10">
              <div class="px-3 py-1 bg-blue-50 text-[#0E3A8A] border border-blue-100 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block shadow-sm">
                {{ competency.code }}
              </div>
              <p class="text-sm font-bold text-[#0F172A] leading-relaxed line-clamp-2 italic tracking-tight">
                {{ competency.description }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 relative z-10">
              <button class="p-3.5 bg-white text-[#0E3A8A] border-2 border-slate-50 hover:border-[#0E3A8A] rounded-2xl transition-all active:scale-95 shadow-sm group/edit">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="p-3.5 bg-red-50 text-red-600 border-2 border-transparent hover:bg-red-600 hover:text-white rounded-2xl transition-all active:scale-95">
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
export class CompetenciesComponent {
  competenciesByCourse = [
    {
      courseName: 'Matemática',
      grade: '1ro Primaria',
      competencies: [
        { order: 1, code: 'C1', description: 'Resuelve problemas de cantidad y regularidad en contextos reales.' },
        { order: 2, code: 'C2', description: 'Resuelve problemas de forma, movimiento y localización.' },
        { order: 3, code: 'C3', description: 'Resuelve problemas de gestión de datos e incertidumbre.' },
      ]
    },
    {
      courseName: 'Comunicación',
      grade: '1ro Primaria',
      competencies: [
        { order: 1, code: 'C1', description: 'Se comunica oralmente en su lengua materna.' },
        { order: 2, code: 'C2', description: 'Lee diversos tipos de textos escritos en su lengua materna.' },
      ]
    }
  ];
}
