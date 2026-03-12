import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-students',
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
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Gestión de Estudiantes</h1>
          <p class="text-slate-500 text-sm font-medium">Administra matrículas y cambios de sección</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group hover:border-[#0E3A8A]/20 transition-all cursor-default">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Total Estudiantes</span>
          <span class="text-3xl font-black text-[#0F172A]">842</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group hover:border-green-100 transition-all cursor-default">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Activos</span>
          <span class="text-3xl font-black text-green-600">810</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group hover:border-yellow-100 transition-all cursor-default">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Inactivos</span>
          <span class="text-3xl font-black text-yellow-600">12</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group hover:border-red-100 transition-all cursor-default">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Retirados</span>
          <span class="text-3xl font-black text-red-600">20</span>
        </div>
      </div>

      <!-- Alert Card: Students without section -->
      <div class="bg-orange-50 border border-orange-100 rounded-[2rem] p-6 flex items-start gap-5 shadow-sm">
        <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-orange-100 flex-shrink-0 animate-pulse">
           <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div class="space-y-3 flex-1">
          <div>
            <h3 class="text-base font-black text-orange-900 tracking-tight uppercase italic leading-none mb-1">5 estudiante(s) sin sección asignada</h3>
            <p class="text-[11px] font-bold text-orange-700 italic">Estos estudiantes no pueden ver su horario ni cursos hasta que se les asigne una sección.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="px-3 py-1.5 bg-white border border-orange-200 text-orange-800 text-[10px] font-black uppercase tracking-tighter rounded-xl hover:bg-orange-100 transition-colors shadow-sm">JUAN PEREZ GARCIA</button>
            <button class="px-3 py-1.5 bg-white border border-orange-200 text-orange-800 text-[10px] font-black uppercase tracking-tighter rounded-xl hover:bg-orange-100 transition-colors shadow-sm">MARIA LOPEZ</button>
          </div>
        </div>
      </div>

      <!-- Filter Pill -->
      <div class="bg-white border border-slate-100/50 rounded-[2rem] p-4 shadow-sm flex flex-col lg:flex-row items-center gap-4 px-6">
        <div class="flex items-center gap-4 flex-1 w-full">
          <div class="text-slate-400">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input type="text" placeholder="Buscar por código, nombre o DNI..." class="flex-1 bg-transparent border-none text-sm font-bold text-[#0F172A] focus:ring-0 placeholder-slate-300">
        </div>
        <div class="flex items-center gap-3 w-full lg:w-auto">
          <select class="flex-1 lg:w-40 bg-slate-50 border-none rounded-xl text-[10px] font-black text-[#0F172A] uppercase tracking-tighter focus:ring-0 cursor-pointer py-2.5 px-4 italic">
            <option>Todos los estados</option>
          </select>
          <select class="flex-1 lg:w-40 bg-slate-50 border-none rounded-xl text-[10px] font-black text-[#0F172A] uppercase tracking-tighter focus:ring-0 cursor-pointer py-2.5 px-4 italic">
            <option>Todos los grados</option>
          </select>
        </div>
      </div>

      <!-- Students Table -->
      <div class="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Estudiante</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Sección</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Cursos</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Estado</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Matrícula</th>
                <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let student of students" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-8 py-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-white shadow-sm flex items-center justify-center text-[#0E3A8A] font-black text-xs">
                      {{ student.name.charAt(0) }}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-black text-[#0F172A] leading-tight tracking-tight uppercase italic">{{ student.name }}</span>
                      <span class="text-[10px] font-bold text-slate-400 italic">{{ student.code }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-5">
                   <div *ngIf="student.section; else noSection" class="flex flex-col">
                      <span class="text-sm font-black text-[#0F172A] tracking-tighter">{{ student.grade }}</span>
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Sección {{ student.section }}</span>
                   </div>
                   <ng-template #noSection>
                      <span class="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-red-100">Sin sección</span>
                   </ng-template>
                </td>
                <td class="px-8 py-5 text-center">
                  <button class="px-4 py-2 bg-white text-[#0E3A8A] border-2 border-slate-50 hover:border-[#0E3A8A] rounded-2xl text-[10px] font-black italic uppercase tracking-tighter transition-all shadow-sm">
                    {{ student.courses }} cursos
                  </button>
                </td>
                <td class="px-8 py-5">
                  <span [class]="'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ' + getStatusClass(student.status)">
                    {{ student.status }}
                  </span>
                </td>
                <td class="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter italic">
                  {{ student.enrollmentDate }}
                </td>
                <td class="px-8 py-5">
                  <div class="flex justify-end gap-2">
                    <button class="p-2.5 bg-white text-[#0E3A8A] border-2 border-slate-50 hover:border-[#0E3A8A] rounded-xl transition-all shadow-sm active:scale-95 group/edit">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="p-2.5 bg-red-50 text-red-600 border-2 border-transparent hover:bg-red-600 hover:text-white rounded-xl transition-all active:scale-95">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
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
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class StudentsComponent {
  students = [
    { name: 'PEDRO ALCANTARA', code: 'CRT-2024-001', grade: '5to Secundaria', section: 'A', courses: 14, status: 'activo', enrollmentDate: '10 Feb 2024' },
    { name: 'JUAN PEREZ GARCIA', code: 'CRT-2024-002', grade: '1ro Primaria', section: null, courses: 0, status: 'activo', enrollmentDate: '11 Feb 2024' },
    { name: 'MARIA LOPEZ SOSA', code: 'CRT-2024-003', grade: '3ro Primaria', section: 'B', courses: 10, status: 'inactivo', enrollmentDate: '12 Feb 2024' },
  ];

  getStatusClass(status: string) {
    const statuses: any = {
      'activo': 'bg-green-50 text-green-600 border-green-100',
      'inactivo': 'bg-yellow-50 text-yellow-600 border-yellow-100',
      'retirado': 'bg-red-50 text-red-600 border-red-100',
    };
    return statuses[status] || 'bg-slate-50 text-slate-600 border-slate-100';
  }
}
