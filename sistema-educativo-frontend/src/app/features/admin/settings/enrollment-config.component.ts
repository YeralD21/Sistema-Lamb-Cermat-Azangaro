import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';

@Component({
  selector: 'app-enrollment-config',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Gestión de Matrículas</h1>
          <p class="text-slate-500 text-sm font-medium">Administra las matrículas de estudiantes a secciones</p>
        </div>
        <button class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
          Matricular Estudiante
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Total</span>
          <span class="text-3xl font-black text-[#0F172A]">842</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Activos</span>
          <span class="text-3xl font-black text-green-600">810</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Inactivos</span>
          <span class="text-3xl font-black text-yellow-600">12</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all cursor-default">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Retirados</span>
          <span class="text-3xl font-black text-red-600">20</span>
        </div>
      </div>

      <!-- Filter Pill -->
      <div class="bg-white border border-slate-100/50 rounded-[2rem] p-4 shadow-sm flex flex-col lg:flex-row items-center gap-4 px-6">
        <div class="flex items-center gap-4 flex-1 w-full">
          <div class="text-slate-400">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input type="text" placeholder="Buscar estudiante..." class="flex-1 bg-transparent border-none text-sm font-bold text-[#0F172A] focus:ring-0 placeholder-slate-300">
        </div>
        <div class="flex flex-wrap lg:flex-nowrap items-center gap-2 w-full lg:w-auto">
          <select class="flex-1 lg:w-32 bg-slate-50 border-none rounded-xl text-[10px] font-black text-[#0F172A] uppercase tracking-tighter focus:ring-0 cursor-pointer py-2 px-3 italic">
            <option>Estados</option>
          </select>
          <select class="flex-1 lg:w-32 bg-slate-50 border-none rounded-xl text-[10px] font-black text-[#0F172A] uppercase tracking-tighter focus:ring-0 cursor-pointer py-2 px-3 italic">
            <option>Grados</option>
          </select>
          <select class="flex-1 lg:w-32 bg-slate-50 border-none rounded-xl text-[10px] font-black text-[#0F172A] uppercase tracking-tighter focus:ring-0 cursor-pointer py-2 px-3 italic">
            <option>Secciones</option>
          </select>
          <button class="px-4 py-2 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-[#0E3A8A] transition-colors">Limpiar</button>
        </div>
      </div>

      <!-- Enrollments Table -->
      <div class="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Código</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Estudiante</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Sección</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Cursos</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Estado</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Matrícula</th>
                <th class="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let enrollment of enrollments" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-8 py-5">
                   <span class="text-sm font-black text-[#0F172A] tracking-tighter">{{ enrollment.code }}</span>
                </td>
                <td class="px-8 py-5">
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-[#0F172A] leading-tight tracking-tight uppercase italic">{{ enrollment.student }}</span>
                    <span class="text-[10px] font-bold text-slate-400 italic">DNI: {{ enrollment.dni }}</span>
                  </div>
                </td>
                <td class="px-8 py-5">
                  <div class="flex flex-col">
                    <span class="text-sm font-black text-[#0F172A] tracking-tighter">{{ enrollment.grade }}</span>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{{ enrollment.section }}</span>
                  </div>
                </td>
                <td class="px-8 py-5 text-center">
                  <button class="px-4 py-2 text-blue-600 hover:text-blue-800 text-[10px] font-black italic uppercase tracking-tighter flex items-center justify-center gap-1 mx-auto">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    {{ enrollment.courses }} cursos
                  </button>
                </td>
                <td class="px-8 py-5">
                  <span [class]="'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ' + getStatusClass(enrollment.status)">
                    {{ enrollment.status }}
                  </span>
                </td>
                <td class="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-tighter italic">
                  {{ enrollment.date }}
                </td>
                <td class="px-8 py-5">
                  <div class="flex justify-end gap-2 text-slate-400">
                    <button class="p-2.5 hover:text-blue-600 transition-colors">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="p-2.5 hover:text-red-600 transition-colors">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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
export class EnrollmentConfigComponent {
  enrollments = [
    { code: 'CRT-001', student: 'PEDRO ALCANTARA', dni: '72839401', grade: '5to Secundaria', section: 'Sección A', courses: 14, status: 'Activo', date: '10/02/2024' },
    { code: 'CRT-005', student: 'MARIA SOSA', dni: '72839405', grade: '1ro Primaria', section: 'Sección B', courses: 12, status: 'Activo', date: '12/02/2024' },
  ];

  getStatusClass(status: string) {
    const statuses: any = {
      'Activo': 'bg-green-50 text-green-600 border-green-100',
      'Inactivo': 'bg-yellow-50 text-yellow-600 border-yellow-100',
    };
    return statuses[status] || 'bg-slate-50 text-slate-600 border-slate-100';
  }
}
