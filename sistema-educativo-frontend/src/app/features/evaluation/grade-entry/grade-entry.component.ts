import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grade-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      
      <!-- Back Link -->
      <div class="flex items-center gap-2 text-blue-900 font-medium text-sm cursor-pointer hover:underline">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver al Panel
      </div>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Registro de Evaluaciones</h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Califica a tus estudiantes por competencias</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-6 py-2.5 bg-white border border-blue-900 text-blue-900 text-sm font-bold rounded-xl transition-all hover:bg-blue-50 active:scale-95 flex items-center gap-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Guardar borrador
          </button>
          <button class="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Publicar calificaciones
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-end gap-6">
        <div class="flex-1 space-y-2">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Curso</label>
          <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option>MAT - MATEMATICA 1 (1ero de Primaria A)</option>
          </select>
        </div>
        <div class="flex-1 space-y-2">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Periodo</label>
          <select class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option>Bimestre 1</option>
          </select>
        </div>
        <div class="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 h-[50px]">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <span class="text-xs font-bold uppercase tracking-tight">Borrador</span>
        </div>
      </div>

      <!-- Grades Plate Section -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 bg-slate-50/20">
          <h2 class="text-lg font-bold text-slate-800 tracking-tight">Planilla de Calificaciones - Bimestre 1</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                <th class="py-5 px-6 text-center w-16">#</th>
                <th class="py-5 px-6 text-left">Estudiante</th>
                <th class="py-5 px-6 text-center">
                  <div class="flex flex-col items-center">
                    <span class="text-slate-500 font-medium">C1, C2, C3</span>
                    <span class="text-[8px] italic lowercase">cumplir</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let student of students; let i = index" class="group hover:bg-slate-50/50 transition-colors">
                <td class="py-6 px-6 text-center text-sm font-medium text-slate-400">{{ i + 1 }}</td>
                <td class="py-6 px-6">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xs">
                      {{ student.initials }}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-slate-800">{{ student.name }}</span>
                      <span class="text-[10px] font-mono text-slate-400 uppercase">{{ student.code }}</span>
                    </div>
                  </div>
                </td>
                <td class="py-6 px-6">
                  <div class="flex flex-col gap-3">
                    <div class="flex items-center justify-center gap-2">
                      <button *ngFor="let grade of ['AD', 'A', 'B', 'C']"
                              [class]="student.grade === grade ? getGradeSelectedClass(grade) : 'px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 text-xs font-bold hover:bg-slate-50 transition-all active:scale-95'">
                        {{ grade }}
                      </button>
                    </div>
                    <div class="relative max-w-xs mx-auto w-full">
                      <input type="text" placeholder="Observación..." 
                             class="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-1.5 text-[10px] italic text-slate-500 focus:outline-none focus:border-blue-300 transition-all" />
                    </div>
                  </div>
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
  `]
})
export class GradeEntryComponent {
  students = [
    { name: 'Avila, Johan', code: 'EST000008', initials: 'JA', grade: 'AD' },
    { name: 'Cuña, Emerson', code: 'EST000018', initials: 'EC', grade: null },
    { name: 'Cuña, Renzo', code: 'EST000017', initials: 'RC', grade: null },
  ];

  getGradeSelectedClass(grade: string): string {
    const base = 'px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-sm transition-all active:scale-95 ';
    switch (grade) {
      case 'AD': return base + 'bg-green-500';
      case 'A': return base + 'bg-blue-500';
      case 'B': return base + 'bg-yellow-400';
      case 'C': return base + 'bg-red-500';
      default: return 'px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 text-xs font-bold';
    }
  }
}
