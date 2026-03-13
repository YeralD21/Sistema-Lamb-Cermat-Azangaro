import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-assignments',
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
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Asignación Docente</h1>
          <p class="text-slate-500 text-sm font-medium">Gestiona la carga institucional de los docentes</p>
        </div>
        <button class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva asignación
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-blue-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Docentes</span>
          <span class="text-3xl font-black text-[#0F172A]">42</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-slate-200">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Carga Total</span>
          <span class="text-3xl font-black text-[#0F172A]">185</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-blue-100 border-l-4 border-l-blue-500">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Promedio</span>
          <span class="text-3xl font-black text-[#0E3A8A]">4.4</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default hover:border-orange-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Sin Asignar</span>
          <span class="text-3xl font-black text-orange-600">2</span>
        </div>
      </div>

      <!-- Filter Pill -->
      <div class="bg-white border border-slate-100/50 rounded-[2rem] p-4 shadow-sm flex items-center gap-4 px-6 md:max-w-md mx-auto">
        <div class="text-slate-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <input type="text" placeholder="Buscar por docente..." class="flex-1 bg-transparent border-none text-[10px] font-black text-[#0F172A] uppercase tracking-[0.1em] focus:ring-0 placeholder-slate-300 italic">
      </div>

      <!-- Teacher Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div *ngFor="let teacher of assignments" class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden">
          
          <div class="absolute -right-10 -top-10 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-blue-50 transition-colors"></div>

          <!-- Card Header: Teacher Profile -->
          <div class="flex items-start justify-between relative z-10">
            <div class="flex items-center gap-5">
              <div class="w-20 h-20 bg-gradient-to-br from-[#0E3A8A] to-[#1D4ED8] rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span class="text-3xl font-black text-white italic">{{ teacher.name.split(' ')[1].charAt(0) }}</span>
              </div>
              <div>
                <h3 class="text-2xl font-black text-[#0F172A] tracking-tighter uppercase italic leading-none">{{ teacher.name }}</h3>
                <div class="flex items-center gap-2 mt-2">
                   <span class="px-3 py-1 bg-blue-50 text-[#0E3A8A] rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">{{ teacher.assignments.length }} cursos asignados</span>
                </div>
              </div>
            </div>
            <div class="flex flex-col items-end">
               <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1 text-right">Límite Carga</span>
               <div class="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500" [style.width.%]="(teacher.assignments.length / 10) * 100"></div>
               </div>
            </div>
          </div>

          <!-- Card Body: Assignments -->
          <div class="mt-8 space-y-4 relative z-10">
            <div *ngFor="let item of teacher.assignments" class="bg-slate-50/50 p-4 rounded-2xl border border-slate-50 group/item hover:bg-white hover:shadow-md transition-all flex items-center justify-between">
               <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 text-[#0E3A8A] font-black text-[10px] italic shadow-sm group-hover/item:border-[#0E3A8A]">
                    {{ item.course.substring(0, 3).toUpperCase() }}
                  </div>
                  <div>
                    <h4 class="text-sm font-black text-[#0F172A] tracking-tighter italic uppercase leading-tight">{{ item.course }}</h4>
                    <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{{ item.grade }} - {{ item.section }}</p>
                  </div>
               </div>
               <button class="p-2 text-slate-400 hover:text-red-600 transition-colors">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
            </div>

            <div class="pt-6 border-t border-slate-50">
               <button class="w-full py-4 bg-white text-[#0E3A8A] border-2 border-slate-100 hover:border-[#0E3A8A] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Agregar curso a este docente
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
export class TeacherAssignmentsComponent {
  assignments = [
    {
      name: 'PABLO QUISPE',
      assignments: [
        { course: 'Matemática', grade: '5to Secundaria', section: 'Sección A' },
        { course: 'Física', grade: '5to Secundaria', section: 'Sección A' },
        { course: 'Aritmética', grade: '4to Secundaria', section: 'Sección B' },
      ]
    },
    {
      name: 'MARIA GARCIA',
      assignments: [
        { course: 'Comunicación', grade: '1ro Primaria', section: 'Sección A' },
        { course: 'Ortografía', grade: '1ro Primaria', section: 'Sección A' },
      ]
    }
  ];
}
