import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses',
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
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Cursos</h1>
          <p class="text-slate-500 text-sm font-medium">Gestiona los cursos y sus colores</p>
        </div>
        <div class="flex gap-3">
           <button class="px-6 py-3 bg-white border-2 border-slate-100/50 text-[#0E3A8A] text-sm font-bold rounded-2xl transition-all hover:bg-slate-50 flex items-center justify-center gap-2 shadow-sm">
             <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
             Reasignar Colores
          </button>
          <button class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] via-[#1D4ED8] to-[#991B1B] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo curso
          </button>
        </div>
      </div>

      <!-- Filter Pill -->
      <div class="bg-white border border-slate-100/50 rounded-[2rem] p-4 shadow-sm flex items-center gap-4 px-6">
        <div class="text-slate-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
        </div>
        <select class="flex-1 bg-transparent border-none text-sm font-bold text-[#0F172A] focus:ring-0 cursor-pointer appearance-none">
          <option>Todos los grados</option>
          <option>1ero de Primaria</option>
        </select>
        <div class="text-slate-400">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

      <!-- Grade Section -->
      <div *ngFor="let gradeGroup of coursesGrouped" class="space-y-6">
        <h2 class="text-xl font-bold text-[#0F172A] flex items-center gap-3 border-l-[3px] border-blue-600 pl-4 tracking-tight">
          {{ gradeGroup.grade }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let course of gradeGroup.courses" class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col gap-6">
            
            <!-- Card Header: Icon + Info -->
            <div class="flex items-center gap-4">
              <div [style.backgroundColor]="course.color" class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
                <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <div class="space-y-1">
                <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] font-black bg-slate-50 text-slate-500 border border-slate-100 shadow-sm uppercase tracking-widest">{{ course.code }}</span>
                <h3 class="text-base font-black text-[#0F172A] tracking-tighter uppercase leading-tight">{{ course.name }}</h3>
              </div>
            </div>

            <!-- Card Body: Hours -->
            <div class="bg-slate-50/50 p-3 px-4 rounded-xl border border-slate-50 flex items-center gap-3">
              <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div class="flex items-baseline gap-1.5 text-xs font-bold">
                <span class="text-[#0F172A] italic">{{ course.hours }} horas</span>
                <span class="text-slate-400 uppercase tracking-tighter">/ semana</span>
              </div>
            </div>

            <!-- Card Footer: Actions -->
            <div class="flex gap-2">
              <button class="flex-1 py-3 bg-white text-[#0E3A8A] border-2 border-slate-100/50 hover:border-[#0E3A8A] text-[10px] font-black uppercase tracking-tight rounded-xl transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 group/btn">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar
              </button>
              <button class="w-12 h-12 bg-[#991B1B] text-white rounded-xl transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-red-100">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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
export class CoursesComponent {
  coursesGrouped = [
    {
      grade: '1ero de Primaria',
      courses: [
        { code: 'CIE-TEC-101', name: 'Ciencia y Tecnologia', hours: 4, color: '#84CC16' },
        { code: 'COM-101', name: 'Comunicacion', hours: 2, color: '#2563EB' },
        { code: 'ED.CIV-101', name: 'Educacion Civica', hours: 4, color: '#2563EB' },
        { code: 'EDU-REL-101', name: 'Educacion Religiosa', hours: 2, color: '#06B6D4' },
        { code: 'HIST-101', name: 'Historia del Peru', hours: 2, color: '#6366F1' },
        { code: 'MAT', name: 'Matematica 1', hours: 12, color: '#84CC16' },
      ]
    }
  ];
}
