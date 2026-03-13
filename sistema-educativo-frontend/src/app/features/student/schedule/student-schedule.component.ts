import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ICONS } from '@core/constants/icons';

interface DaySchedule {
  day: string;
  slots: {
    startTime: string;
    endTime: string;
    course: string;
    teacher: string;
    room: string;
    color: string;
    colorBg: string;
  }[];
}

@Component({
  selector: 'app-schedule-student',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      <!-- Go Back Button -->
      <a routerLink="/app/dashboard/student" class="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium group">
        <div class="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:bg-slate-50 transition-colors shadow-sm">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </div>
        Volver al Panel
      </a>

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Mi Horario Escolar</h1>
          <p class="text-slate-500 mt-1">Organización semanal de tus clases y actividades</p>
        </div>
        
        <div class="flex items-center gap-4 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
           <div class="flex items-center gap-2 px-3 py-1 border-r border-slate-100">
             <div class="w-3 h-3 rounded-full bg-indigo-600"></div>
             <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Activo</span>
           </div>
           <p class="text-xs font-black text-slate-900 pr-2">Bimestre IV - 2026</p>
        </div>
      </div>

      <!-- Schedule Grid -->
      <div class="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden overflow-x-auto">
        <div class="min-w-[1000px] grid grid-cols-5 divide-x divide-slate-100">
          <!-- Days Filter/Header -->
          <div *ngFor="let day of weekSchedule" class="flex flex-col divide-y divide-slate-50">
            <div class="p-6 bg-slate-50/50 text-center">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Día</p>
              <h3 class="text-lg font-black text-slate-900">{{ day.day | uppercase }}</h3>
            </div>
            
            <!-- Slots -->
            <div class="p-4 space-y-4 min-h-[600px] hover:bg-slate-50/20 transition-colors">
              <div *ngFor="let slot of day.slots" 
                   [class]="'group p-5 rounded-3xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ' + slot.colorBg + ' ' + (slot.colorBg.includes('slate') ? 'border-slate-100 opacity-60' : 'border-transparent')">
                
                <div class="flex flex-col h-full gap-4">
                  <div class="flex items-start justify-between">
                    <div class="p-2 bg-white/40 backdrop-blur-md rounded-xl shadow-sm">
                       <div [innerHTML]="getSafeIcon('clock')" class="w-4 h-4 text-slate-600"></div>
                    </div>
                    <span class="text-[10px] font-black text-slate-600/60 tracking-wider">{{ slot.startTime }} - {{ slot.endTime }}</span>
                  </div>

                  <div>
                    <h4 class="text-sm font-black text-slate-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">{{ slot.course }}</h4>
                    <p class="text-[10px] font-bold text-slate-600/70 uppercase tracking-tight">{{ slot.teacher }}</p>
                  </div>

                  <div class="mt-auto flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full [class]='slot.color'"></div>
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ slot.room }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Empty State for Day -->
              <div *ngIf="day.slots.length === 0" class="flex flex-col items-center justify-center py-20 opacity-20">
                 <div [innerHTML]="getSafeIcon('calendar')" class="w-12 h-12 text-slate-400"></div>
                 <span class="text-[10px] font-black uppercase mt-4">Sin clases</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend & Info -->
      <div class="flex flex-wrap items-center justify-between gap-6 p-6 bg-slate-900 rounded-[32px] text-white">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2 text-xs font-bold">
            <span class="w-3 h-3 rounded-full bg-blue-500"></span>
            Cs. Básicas
          </div>
          <div class="flex items-center gap-2 text-xs font-bold">
            <span class="w-3 h-3 rounded-full bg-rose-500"></span>
            Letras
          </div>
          <div class="flex items-center gap-2 text-xs font-bold">
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            Tecnología
          </div>
          <div class="flex items-center gap-2 text-xs font-bold">
            <span class="w-3 h-3 rounded-full bg-amber-500"></span>
            Otros
          </div>
        </div>
        
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
          * Los cambios en el horario serán comunicados con 24h de anticipación.
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background: #F8FAFC; min-h: 100vh; }
  `]
})
export class ScheduleStudentComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  
  weekSchedule: DaySchedule[] = [
    {
      day: 'Lunes',
      slots: [
        { startTime: '08:00', endTime: '09:30', course: 'MATEMÁTICA', teacher: 'Dr. Roberto Sánchez', room: 'Aula 301', color: 'bg-blue-500', colorBg: 'bg-blue-50' },
        { startTime: '09:45', endTime: '11:15', course: 'COMUNICACIÓN', teacher: 'Lic. Martha Espinoza', room: 'Aula 205', color: 'bg-rose-500', colorBg: 'bg-rose-50' },
        { startTime: '11:30', endTime: '13:00', course: 'RECESO / ALMUERZO', teacher: '-', room: 'Cafetería', color: 'bg-slate-400', colorBg: 'bg-slate-50' },
        { startTime: '13:00', endTime: '14:30', course: 'CIENCIA Y TECNOLOGÍA', teacher: 'Ing. Carlos Ruiz', room: 'Laboratorio A', color: 'bg-emerald-500', colorBg: 'bg-emerald-50' }
      ]
    },
    {
      day: 'Martes',
      slots: [
        { startTime: '08:00', endTime: '09:30', course: 'INGLÉS TÉCNICO', teacher: 'Prof. John Doe', room: 'Aula 102', color: 'bg-indigo-500', colorBg: 'bg-indigo-50' },
        { startTime: '09:45', endTime: '11:15', course: 'DPCC', teacher: 'Dra. Elena Ramos', room: 'Aula 301', color: 'bg-amber-500', colorBg: 'bg-amber-50' },
        { startTime: '11:30', endTime: '13:00', course: 'RECESO / ALMUERZO', teacher: '-', room: 'Cafetería', color: 'bg-slate-400', colorBg: 'bg-slate-50' },
        { startTime: '13:00', endTime: '14:30', course: 'EDUCACIÓN FÍSICA', teacher: 'Prof. Mario Bross', room: 'Campo Dep.', color: 'bg-green-500', colorBg: 'bg-green-50' }
      ]
    },
    {
      day: 'Miércoles',
      slots: [
        { startTime: '08:00', endTime: '09:30', course: 'MATEMÁTICA', teacher: 'Dr. Roberto Sánchez', room: 'Aula 301', color: 'bg-blue-500', colorBg: 'bg-blue-50' },
        { startTime: '09:45', endTime: '11:15', course: 'CIENCIA Y TECNOLOGÍA', teacher: 'Ing. Carlos Ruiz', room: 'Laboratorio A', color: 'bg-emerald-500', colorBg: 'bg-emerald-50' },
        { startTime: '11:30', endTime: '13:00', course: 'RECESO / ALMUERZO', teacher: '-', room: 'Cafetería', color: 'bg-slate-400', colorBg: 'bg-slate-50' },
        { startTime: '13:00', endTime: '14:30', course: 'HISTORIA Y GEOG.', teacher: 'Lic. Jaime Pardo', room: 'Aula 205', color: 'bg-orange-500', colorBg: 'bg-orange-50' }
      ]
    },
    {
      day: 'Jueves',
      slots: [
        { startTime: '08:00', endTime: '09:30', course: 'ARTE Y CULTURA', teacher: 'Pintor Velásquez', room: 'Taller 1', color: 'bg-pink-500', colorBg: 'bg-pink-50' },
        { startTime: '09:45', endTime: '11:15', course: 'COMUNICACIÓN', teacher: 'Lic. Martha Espinoza', room: 'Aula 205', color: 'bg-rose-500', colorBg: 'bg-rose-50' },
        { startTime: '11:30', endTime: '13:00', course: 'RECESO / ALMUERZO', teacher: '-', room: 'Cafetería', color: 'bg-slate-400', colorBg: 'bg-slate-50' },
        { startTime: '13:00', endTime: '14:30', course: 'FÍSICA AVANZADA', teacher: 'Ing. Carlos Ruiz', room: 'Laboratorio B', color: 'bg-blue-600', colorBg: 'bg-blue-50' }
      ]
    },
    {
      day: 'Viernes',
      slots: [
        { startTime: '08:00', endTime: '09:30', course: 'INGLÉS TÉCNICO', teacher: 'Prof. John Doe', room: 'Aula 102', color: 'bg-indigo-500', colorBg: 'bg-indigo-50' },
        { startTime: '09:45', endTime: '11:15', course: 'TALLER DE LECTURA', teacher: 'Lic. Martha Espinoza', room: 'Biblionteca', color: 'bg-rose-400', colorBg: 'bg-rose-50' },
        { startTime: '11:30', endTime: '13:00', course: 'RECESO / ALMUERZO', teacher: '-', room: 'Cafetería', color: 'bg-slate-400', colorBg: 'bg-slate-50' },
        { startTime: '13:00', endTime: '14:30', course: 'TALLER DE ROBÓTICA', teacher: 'Ing. Carlos Ruiz', room: 'Sala Tech', color: 'bg-cyan-500', colorBg: 'bg-cyan-50' }
      ]
    }
  ];

  ngOnInit() {}

  getSafeIcon(name: string): SafeHtml {
    const svg = (ICONS as any)[name] || ICONS.calendar;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
