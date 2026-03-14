import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { AcademicService, GradeLevel, Section } from '@core/services/academic.service';
import { ScheduleService } from '@core/services/schedule.service';

@Component({
  selector: 'app-admin-schedule',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 text-slate-700">
      <app-back-button></app-back-button>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm">
            <svg class="w-6 h-6 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <h1 class="text-3xl font-semibold text-slate-900 tracking-tight">Gestión de Horarios</h1>
            <p class="text-slate-500 text-sm font-medium">Planificación y asignación horaria para el periodo académico</p>
          </div>
        </div>
        <button class="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Asignar Sesión
        </button>
      </div>

      <!-- Grade/Section filter -->
      <div class="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm inline-flex gap-3 flex-wrap">
        <div class="flex flex-col gap-1">
          <label class="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">Grado</label>
          <select 
            [(ngModel)]="selectedGradeId" 
            (change)="onGradeChange()"
            class="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer">
            <option value="">Seleccionar Grado</option>
            <option *ngFor="let g of grades" [value]="g.id">{{ g.level }} {{ g.grade }}°</option>
          </select>
        </div>
        
        <div class="flex flex-col gap-1">
          <label class="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">Sección</label>
          <select 
            [(ngModel)]="selectedSectionId" 
            (change)="loadSchedules()"
            [disabled]="!selectedGradeId"
            class="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer disabled:opacity-50">
            <option value="">Seleccionar Sección</option>
            <option *ngFor="let s of sections" [value]="s.id">Sección {{ s.section_letter }}</option>
          </select>
        </div>
      </div>

      <!-- Schedule grid -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-slate-50/50">
                <th class="py-5 px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-center border-b border-slate-100 w-24">Hora</th>
                <th *ngFor="let day of days" class="py-5 px-4 text-[11px] font-semibold text-slate-600 uppercase tracking-widest text-center border-b border-l border-slate-100">
                  {{ day }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let slot of timeSlots" class="group">
                <td class="py-4 px-4 text-[11px] font-bold text-slate-400 text-center border-b border-slate-50 bg-slate-50/20">{{ slot }}</td>
                <td *ngFor="let day of days" class="p-2 border-b border-l border-slate-50 min-h-[5rem] group-hover:bg-slate-50/30 transition-colors">
                  <div class="w-full h-16 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-100 text-[10px] font-bold text-slate-300 uppercase tracking-tighter hover:border-blue-200 hover:text-blue-300 transition-all cursor-pointer">
                    Sin asignar
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminScheduleComponent implements OnInit {
  private academicService = inject(AcademicService);
  private scheduleService = inject(ScheduleService);

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  timeSlots = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

  grades: GradeLevel[] = [];
  sections: Section[] = [];
  selectedGradeId = '';
  selectedSectionId = '';
  schedules: any[] = [];

  ngOnInit() {
    this.academicService.getGradeLevels().subscribe(res => this.grades = res.data);
  }

  onGradeChange() {
    this.sections = [];
    this.selectedSectionId = '';
    if (this.selectedGradeId) {
      this.academicService.getSections({ grade_level_id: this.selectedGradeId }).subscribe(res => this.sections = res.data);
    }
  }

  loadSchedules() {
    if (this.selectedSectionId) {
      this.scheduleService.getSchedules({ section_id: this.selectedSectionId }).subscribe(res => {
        this.schedules = res.data;
        // Logic to map schedules to the grid would go here
      });
    }
  }
}
