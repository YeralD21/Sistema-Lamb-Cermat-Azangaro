import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { AcademicService, GradeLevel, Section, Course } from '@core/services/academic.service';
import { ScheduleService } from '@core/services/schedule.service';
import Swal from 'sweetalert2';
import { AdminBackButtonComponent } from "@shared/components/back-button/admin-back-button.component";

@Component({
  selector: 'app-admin-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AdminBackButtonComponent],
  template: `
    <div class="print:m-0 print:p-0 min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-[1400px] mx-auto space-y-8 text-slate-700">
      
      <div class="print:hidden">
  <app-admin-back-button></app-admin-back-button>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm print:hidden">
            <svg class="w-6 h-6 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <h1 class="text-3xl font-semibold text-slate-900 tracking-tight">Horario Semanal</h1>
            <p class="text-slate-500 text-sm font-medium print:hidden">Visualiza y organiza los bloques horarios</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="printSchedule()" *ngIf="schedules.length > 0" class="px-5 py-2.5 bg-white border-2 border-slate-200 hover:border-blue-700 text-slate-600 hover:text-blue-700 text-sm font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Imprimir PDF
          </button>
          <button (click)="openModal()" [disabled]="!selectedSectionId" class="px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Agregar Bloque
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm inline-flex gap-4 flex-wrap print:hidden">
        <div class="flex flex-col gap-1 w-full sm:w-64">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Grado</label>
          <select 
            [(ngModel)]="selectedGradeId" 
            (change)="onGradeChange()"
            class="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-all cursor-pointer">
            <option value="">Seleccionar Grado</option>
            <option *ngFor="let g of grades" [value]="g.id">{{ g.name || g.level + ' ' + g.grade + '°' }}</option>
          </select>
        </div>
        
        <div class="flex flex-col gap-1 w-full sm:w-64">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Sección</label>
          <select 
            [(ngModel)]="selectedSectionId" 
            (change)="loadSchedules()"
            [disabled]="!selectedGradeId"
            class="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-all cursor-pointer disabled:opacity-50">
            <option value="">Seleccionar Sección</option>
            <option *ngFor="let s of sections" [value]="s.id">Sección {{ s.section_letter }}</option>
          </select>
        </div>
      </div>

      <!-- Schedule Printer Header -->
      <div class="hidden print:block mb-8 text-center pb-6 border-b-2 border-slate-200">
        <h2 class="text-2xl font-black text-slate-900 uppercase tracking-widest">{{ getSelectedGradeName() }} - Sección {{ getSelectedSectionLetter() }}</h2>
        <p class="text-slate-500 mt-1 font-medium">Horario de Clases</p>
      </div>

      <!-- Current Schedule View -->
      <div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm relative print:border-none print:shadow-none" *ngIf="selectedSectionId">
        <div *ngIf="loading" class="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center print:hidden">
           <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <!-- Render main grid -->
        <ng-container *ngTemplateOutlet="scheduleGrid; context: { isPreview: false }"></ng-container>
      </div>

      <div *ngIf="!selectedSectionId && selectedGradeId" class="text-center py-16 bg-white border border-slate-100 rounded-3xl print:hidden">
        <p class="text-slate-400 font-medium">Selecciona una sección para ver o editar el horario.</p>
      </div>

      <!-- Add/Edit Modal (Expands up to 1300px for a wide editing view) -->
      <div *ngIf="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-[1300px] h-[90vh] relative z-10 overflow-hidden border border-slate-100 flex flex-col md:flex-row">
          
          <!-- Compact Form Panel -->
          <div class="w-full md:w-[320px] p-6 bg-slate-50 border-r border-slate-200 flex flex-col justify-between overflow-y-auto shrink-0 z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
            <div>
              <h2 class="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M12 16v-4"/><path d="M8 12h8"/></svg>
                {{ editingBlockId ? 'Editar' : 'Agregar' }} Bloque
              </h2>
              <p class="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-3 mb-1" *ngIf="overlapError">
                ⚠️ Conflicto detectado
              </p>
            </div>
            
            <form [formGroup]="scheduleForm" (ngSubmit)="saveBlock()" class="space-y-3.5 flex-grow mt-3">
              
              <div class="space-y-1 focus-within:text-blue-600">
                <label class="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">Curso <span class="text-red-500">*</span></label>
                <select formControlName="course_id" class="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 shadow-sm transition-all focus:ring-4 focus:ring-blue-500/10 h-10">
                  <option value="">Seleccionar curso</option>
                  <option *ngFor="let c of courses" [value]="c.id">{{ c.name }}</option>
                </select>
                <p *ngIf="courses.length === 0" class="text-xs text-orange-500 mt-1 leading-tight">No hay cursos registrados en el grado.</p>
              </div>

              <div class="space-y-1 focus-within:text-blue-600">
                <label class="text-[9px] font-bold uppercase tracking-widest text-slate-400">Docente (Opcional)</label>
                <select formControlName="teacher_id" class="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 shadow-sm transition-all focus:ring-4 focus:ring-blue-500/10 h-10">
                  <option value="">Sin docente asignado</option>
                  <option *ngFor="let t of teachers" [value]="t.id">{{ t.first_name }} {{ t.last_name }}</option>
                </select>
              </div>

              <div class="space-y-1 focus-within:text-blue-600">
                <label class="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">Día <span class="text-red-500">*</span></label>
                <select formControlName="day_of_week" class="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 shadow-sm transition-all focus:ring-4 focus:ring-blue-500/10 h-10">
                  <option *ngFor="let d of days" [value]="d.id">{{ d.name }}</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div class="space-y-1 focus-within:text-blue-600">
                  <label class="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">Inicio <span class="text-red-500">*</span></label>
                  <input type="time" formControlName="start_time" class="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-2 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 shadow-sm transition-all focus:ring-4 focus:ring-blue-500/10 h-10">
                </div>
                <div class="space-y-1 focus-within:text-blue-600">
                  <label class="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">Fin <span class="text-red-500">*</span></label>
                  <input type="time" formControlName="end_time" class="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-2 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 shadow-sm transition-all focus:ring-4 focus:ring-blue-500/10 h-10">
                </div>
              </div>

              <div class="space-y-1 focus-within:text-blue-600 pb-3">
                <label class="text-[9px] font-bold uppercase tracking-widest text-slate-400">Aula (Opcional)</label>
                <input type="text" formControlName="room_number" placeholder="Ej: A-101" class="w-full bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500 shadow-sm transition-all focus:ring-4 focus:ring-blue-500/10 h-10">
              </div>

              <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                <button type="button" (click)="closeModal()" class="py-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-sm active:scale-95 text-center">
                  Cancelar
                </button>
                <button type="submit" [disabled]="scheduleForm.invalid || saving" class="py-3 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-md shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-1.5 text-center">
                  <span *ngIf="saving" class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {{ editingBlockId ? 'Editar' : 'Guardar' }}
                </button>
              </div>

              <div class="mt-2 text-center" *ngIf="editingBlockId">
                 <button type="button" (click)="resetFormToNew()" class="text-[9px] font-bold text-blue-500 uppercase hover:underline">Volver a Agregar</button>
              </div>

            </form>
          </div>

          <!-- Extended Scale 100% Live Preview in Modal -->
          <div class="hidden md:flex flex-1 bg-white relative overflow-hidden flex-col">
            <div class="absolute inset-0 p-6 overflow-auto bg-slate-50 pb-[100px]">
              <div class="flex justify-between items-center mb-4 sticky left-0 right-0">
                <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 backdrop-blur-sm bg-slate-50/80 rounded block">Simulador de Horario Interactivo</h3>
                <span class="text-[9px] font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded-full">Las vistas se ajustan al 100% (Click para editar bloques)</span>
              </div>
              
              <!-- Scale 100%, Native Width. Looks stunning and usable. -->
              <div class="w-full shadow-lg rounded-3xl border border-slate-200 overflow-hidden bg-white">
                <ng-container *ngTemplateOutlet="scheduleGrid; context: { isPreview: true }"></ng-container>
              </div>
            </div>
          </div>
          
        </div>
      </div>

    </div>

    <!-- Reusable Grid Template -->
    <ng-template #scheduleGrid let-isPreview="isPreview">
      <div class="overflow-x-auto print:overflow-visible overflow-y-hidden h-full">
          <div class="min-w-[800px] w-full relative bg-white">
            
            <!-- Table Header -->
            <div class="grid grid-cols-[80px_repeat(6,1fr)] bg-[#0E3A8A] border-b border-[#0A265B] print:bg-slate-100 print:border-slate-300">
              <div class="py-4 text-center text-[10px] font-black text-blue-100 uppercase tracking-widest print:text-slate-800">Hora</div>
              <div *ngFor="let day of days" class="py-4 text-center text-xs font-black text-white uppercase tracking-widest border-l border-blue-800/50 print:text-slate-800 print:border-slate-300 relative z-10">
                {{ day.name }}
              </div>
            </div>
            
            <!-- Body Grid -->
            <!-- We push background down 16px to give 07:00 a bit of margin so it isn't clipped by the header -->
            <!-- We tie the background-size directly to rowHeightPixels -->
            <div class="grid grid-cols-[80px_repeat(6,1fr)] relative" 
                 [style.height.px]="gridHeightPixels + 30" 
                 [style.background-size]="'100% ' + rowHeightPixels + 'px'"
                 style="background-image: linear-gradient(to bottom, #f1f5f9 1px, transparent 1px); background-position: 0 16px;">
                 
              <!-- Time scale lines -->
              <div class="col-span-1 border-r border-slate-100 print:border-slate-300 pt-4">
                <div *ngFor="let time of timeScale" [style.height.px]="rowHeightPixels" class="relative text-right pr-3 -mt-3 hidden sm:block">
                  <span class="text-[10px] font-bold text-slate-400 select-none print:text-slate-600 bg-white px-1 relative z-10">{{ time }}</span>
                </div>
                <div *ngFor="let time of timeScale" [style.height.px]="rowHeightPixels" class="relative text-right pr-3 -mt-3 sm:hidden">
                  <span class="text-[9px] font-bold text-slate-400 select-none bg-white px-px relative z-10">{{ time.substring(0, 5) }}</span>
                </div>
              </div>

              <!-- Content Columns -->
              <div *ngFor="let day of days" class="relative col-span-1 border-r border-slate-100 border-dashed print:border-solid print:border-slate-300 last:border-r-0 h-full pt-4">
                
                <!-- Recorded Blocks -->
                <ng-container *ngFor="let block of getSchedulesByDay(day.id)">
                  <div [style.top.px]="getBlockTop(block) + 16" 
                       [style.height.px]="getBlockHeight(block)"
                       (click)="editBlock(block)"
                       class="absolute left-1 right-1 rounded-xl p-3 flex flex-col overflow-y-auto shadow-sm transition-all border border-black/5 print:border-slate-400 print:shadow-none print:break-inside-avoid print:static print:h-auto print:mb-2 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:z-20 group-grid-item hide-scrollbar"
                       [class.ring-2]="editingBlockId === block.id && isPreview"
                       [class.ring-black]="editingBlockId === block.id && isPreview"
                       [class.opacity-40]="editingBlockId && editingBlockId !== block.id && isPreview"
                       [ngClass]="getCourseColor(block.course_id)">
                    
                    <div class="flex justify-between items-start gap-1">
                      <h4 class="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-normal leading-tight drop-shadow-sm print:text-slate-900 print:drop-shadow-none cursor-pointer">{{ block.course?.name || getCourseName(block.course_id) }}</h4>
                      <button (click)="deleteBlock(block.id, $event)" class="opacity-0 hover:opacity-100 text-white/80 hover:text-white transition-opacity print:hidden !opacity-100 md:!opacity-0 md:group-hover:!opacity-100 focus:opacity-100 mt-0.5 z-10 p-1">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                    
                    <span class="text-[9px] sm:text-[10px] font-bold text-white/95 mt-1 drop-shadow-sm flex items-center gap-1 print:text-slate-700">
                      {{ formatTime(block.start_time) }} - {{ formatTime(block.end_time) }}
                    </span>
                    
                    <div class="mt-auto pt-2 grid gap-1">
                      <span *ngIf="block.room_number" class="text-[9px] sm:text-[10px] font-bold text-white/95 inline-block bg-white/20 px-1.5 py-0.5 rounded print:text-slate-700 print:bg-slate-100 print:border print:border-slate-200 w-max">
                        Aula {{ block.room_number }}
                      </span>
                      <span *ngIf="block.teacher" class="text-[9px] sm:text-[10px] font-medium text-white/95 truncate print:text-slate-600 block w-full leading-tight" [title]="block.teacher.first_name + ' ' + block.teacher.last_name">
                        <span class="font-bold print:hidden opacity-70">Doc:</span> {{ block.teacher.first_name }} {{ block.teacher.last_name }}
                      </span>
                    </div>
                  </div>
                </ng-container>

                <!-- Ghost Block for Preview (Only when NOT editing an existing block, so we see "NUEVO") -->
                <ng-container *ngIf="isPreview && !editingBlockId && isLiveBlockValid(day.id)">
                  <div [style.top.px]="getLiveBlockTop() + 16" 
                       [style.height.px]="getLiveBlockHeight()"
                       class="absolute left-1 right-1 rounded-xl p-3 flex flex-col overflow-y-auto shadow-2xl z-30 border-[3px] border-blue-400 bg-blue-500/95 backdrop-blur-md animate-pulse hide-scrollbar pointer-events-none">
                    
                    <h4 class="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-normal leading-tight drop-shadow-md">
                      <span class="text-blue-200">[NUEVO]</span> {{ getCourseName(scheduleForm.get('course_id')?.value) || 'Seleccione Curso' }}
                    </h4>
                    
                    <span class="text-[9px] sm:text-[10px] font-bold text-white/95 mt-1 drop-shadow-sm flex items-center gap-1">
                      {{ formatTime(scheduleForm.get('start_time')?.value) }} - {{ formatTime(scheduleForm.get('end_time')?.value) }}
                    </span>
                    
                    <div class="mt-auto pt-2 grid gap-1">
                      <span *ngIf="scheduleForm.get('room_number')?.value" class="text-[9px] sm:text-[10px] font-bold text-white/95 inline-block bg-white/20 px-1.5 py-0.5 rounded w-max">
                        Aula {{ scheduleForm.get('room_number')?.value }}
                      </span>
                    </div>
                  </div>
                </ng-container>

                <!-- Edited Block Preview Indicator (When Editing) -->
                <ng-container *ngIf="isPreview && editingBlockId && isLiveBlockValid(day.id)">
                  <div [style.top.px]="getLiveBlockTop() + 16" 
                       [style.height.px]="getLiveBlockHeight()"
                       class="absolute left-1 right-1 rounded-xl border-[4px] border-black/80 shadow-[0_0_20px_rgba(0,0,0,0.3)] z-30 pointer-events-none transition-all duration-300 bg-black/10 backdrop-blur-[1px] flex items-center justify-center">
                       <span class="text-white font-black uppercase text-[10px] tracking-widest bg-black/80 px-2 py-1 rounded">Moviendo...</span>
                  </div>
                </ng-container>

              </div>
            </div>
          </div>
        </div>
    </ng-template>
  `,
  styles: [`
    :host { display: block; }
    .group-grid-item:hover button { opacity: 1 !important; }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    @media print {
      @page { size: landscape; margin: 0.5cm; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
      .print\\:border-none { border: none !important; }
      .print\\:shadow-none { box-shadow: none !important; }
      .print\\:bg-slate-100 { background-color: #f1f5f9 !important; }
      .print\\:text-slate-800 { color: #1e293b !important; }
      .print\\:overflow-visible { overflow: visible !important; height: auto !important; max-height: none !important; }
      .bg-\\[\\#0E3A8A\\] { background-color: #0e3a8a !important; }
      /* Reset widths for printing so grid expands visually instead of scrolling */
      .min-w-\\[800px\\] { min-width: 100% !important; }
    }
  `]
})
export class AdminScheduleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private academicService = inject(AcademicService);
  private scheduleService = inject(ScheduleService);

  days = [
    { id: 1, name: 'Lunes' },
    { id: 2, name: 'Martes' },
    { id: 3, name: 'Miércoles' },
    { id: 4, name: 'Jueves' },
    { id: 5, name: 'Viernes' },
    { id: 6, name: 'Sábado' }
  ];

  /* 07:45 intervals */
  timeScale = [
    '07:00', '07:45', '08:30', '09:15', '10:00', '10:45', '11:30',
    '12:15', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45',
    '17:30', '18:15'
  ];
  startMinutes = 7 * 60; // 07:00
  endMinutes = 18 * 60 + 15; // 18:15
  rowHeightPixels = 90; // Height of each 45-minute block
  pixelsPerMinute = this.rowHeightPixels / 45; // 2 pixels per minute
  gridHeightPixels = (this.endMinutes - this.startMinutes) * this.pixelsPerMinute;

  colorPalette = [
    'bg-[#8B5CF6]', 'bg-[#10B981]', 'bg-[#00A1DE]', 'bg-[#84CC16]', // Matching image 2 colors: Purple, Green, Blue, Light Green
    'bg-[#EC4899]', 'bg-[#F59E0B]', 'bg-[#EF4444]', 'bg-[#06B6D4]', 'bg-[#6366F1]'
  ];
  courseColorMap: { [key: string]: string } = {};

  grades: GradeLevel[] = [];
  sections: Section[] = [];
  courses: Course[] = [];
  teachers: any[] = [];
  schedules: any[] = [];

  selectedGradeId = '';
  selectedSectionId = '';
  activeAcademicYearId = '';

  loading = false;
  showModal = false;
  saving = false;
  overlapError = false;
  editingBlockId: string | null = null;
  scheduleForm: FormGroup;

  constructor() {
    this.scheduleForm = this.fb.group({
      course_id: ['', Validators.required],
      teacher_id: [''],
      day_of_week: [1, Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      room_number: ['']
    });
  }

  ngOnInit() {
    this.academicService.getAcademicYears().subscribe(res => {
      const data = res.data?.data || res.data || res;
      if (Array.isArray(data)) {
        const active = data.find((y: any) => y.is_active);
        if (active) this.activeAcademicYearId = active.id;
      }
    });

    this.academicService.getGradeLevels().subscribe(res => {
      let data = res.data?.data || res.data || res;
      this.grades = Array.isArray(data) ? data : [];
    });

    this.academicService.getTeachers().subscribe(res => {
      let data = res.data?.data || res.data || res;
      this.teachers = Array.isArray(data) ? data : [];
    });
  }

  onGradeChange() {
    this.sections = [];
    this.selectedSectionId = '';
    this.courses = [];
    this.schedules = [];
    if (this.selectedGradeId) {
      this.academicService.getSections({ grade_level_id: this.selectedGradeId }).subscribe(res => {
        let items = res.data?.data || res.data || res;
        this.sections = Array.isArray(items) ? items : [];
      });
      this.academicService.getCourses({ grade_level_id: this.selectedGradeId }).subscribe(res => {
        let items = res.data?.data || res.data || res;
        this.courses = Array.isArray(items) ? items : [];
      });
    }
  }

  loadSchedules() {
    if (!this.selectedSectionId || !this.activeAcademicYearId) return;
    this.loading = true;
    this.scheduleService.getSchedules({
      academic_year_id: this.activeAcademicYearId,
      section_id: this.selectedSectionId
    }).subscribe({
      next: (res) => {
        let items = res.data?.data || res.data || res;
        this.schedules = Array.isArray(items) ? items : [];
        this.assignColors();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  private sortCoursesInOrder() {
    const courseIds = this.schedules.map(s => s.course_id);
    const uniqueIds = [...new Set(courseIds)];
    const ordered = uniqueIds.sort((a, b) => {
      const aTime = Math.min(...this.schedules.filter(s => s.course_id === a).map(s => this.timeToMinutes(s.start_time)));
      const bTime = Math.min(...this.schedules.filter(s => s.course_id === b).map(s => this.timeToMinutes(s.start_time)));
      return aTime - bTime;
    });
    return ordered;
  }

  assignColors() {
    let colorIndex = 0;
    const uniqueCourseIds = this.sortCoursesInOrder();
    uniqueCourseIds.forEach(id => {
      if (!this.courseColorMap[id as string]) {
        this.courseColorMap[id as string] = this.colorPalette[colorIndex % this.colorPalette.length];
        colorIndex++;
      }
    });
  }

  getSchedulesByDay(dayId: number) {
    return Array.isArray(this.schedules) ? this.schedules.filter(s => Number(s.day_of_week) === dayId) : [];
  }

  openModal() {
    this.resetFormToNew();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.overlapError = false;
    this.editingBlockId = null;
  }

  editBlock(block: any) {
    this.overlapError = false;
    this.editingBlockId = block.id;
    this.scheduleForm.patchValue({
      course_id: block.course_id,
      teacher_id: block.teacher_id || '',
      day_of_week: Number(block.day_of_week),
      start_time: this.formatTime(block.start_time),
      end_time: this.formatTime(block.end_time),
      room_number: block.room_number || ''
    });
    this.showModal = true;
  }

  resetFormToNew() {
    this.overlapError = false;
    this.editingBlockId = null;
    this.scheduleForm.reset({ day_of_week: 1, start_time: '07:00', end_time: '08:00', room_number: '' });
  }

  saveBlock() {
    if (this.scheduleForm.invalid) return;
    this.saving = true;
    this.overlapError = false;

    const payload = {
      ...this.scheduleForm.value,
      academic_year_id: this.activeAcademicYearId,
      section_id: this.selectedSectionId
    };

    if (this.editingBlockId) {
      // Editing Mode
      this.scheduleService.updateSchedule(this.editingBlockId, payload).subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
          Swal.fire({ icon: 'success', title: 'Bloque actualizado', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
          this.loadSchedules();
        },
        error: (err: any) => {
          this.saving = false;
          this.overlapError = true;
        }
      });
    } else {
      // Creation Mode
      this.scheduleService.createSchedule(payload).subscribe({
        next: () => {
          this.saving = false;
          this.closeModal();
          Swal.fire({ icon: 'success', title: 'Bloque guardado', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
          this.loadSchedules();
        },
        error: (err: any) => {
          this.saving = false;
          this.overlapError = true;
        }
      });
    }
  }

  deleteBlock(id: string, event: Event) {
    event.stopPropagation(); // Prevents activating the edit click handler
    Swal.fire({
      title: '¿Eliminar bloque?',
      text: "No podrás revertir esta acción.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.scheduleService.deleteSchedule(id).subscribe({
          next: () => {
            if (this.editingBlockId === id) this.resetFormToNew();
            Swal.fire({ icon: 'success', title: 'Eliminado', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
            this.loadSchedules();
          },
          error: (err: any) => Swal.fire('Error', 'No se pudo eliminar', 'error')
        });
      }
    });
  }

  printSchedule() {
    window.print();
  }

  private timeToMinutes(timeStr: string): number {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1] || '0', 10);
  }

  getBlockTop(block: any): number {
    if (!block || !block.start_time) return 0;
    const m = this.timeToMinutes(block.start_time);
    const offset = Math.max(0, m - this.startMinutes);
    return offset * this.pixelsPerMinute;
  }

  getBlockHeight(block: any): number {
    if (!block || !block.start_time || !block.end_time) return 60;
    const s = this.timeToMinutes(block.start_time);
    const e = this.timeToMinutes(block.end_time);
    const duration = Math.max(15, e - s);
    return duration * this.pixelsPerMinute;
  }

  formatTime(timeStr: string): string {
    if (!timeStr) return '';
    return timeStr.substring(0, 5);
  }

  getCourseColor(courseId: string): string {
    return this.courseColorMap[courseId] || 'bg-slate-400';
  }

  getCourseName(courseId: string): string {
    return this.courses.find(c => c.id === courseId)?.name || '';
  }

  getSelectedGradeName() {
    const g = this.grades.find(g => g.id === this.selectedGradeId);
    return g ? (g.name || `${g.level} ${g.grade}°`) : '';
  }

  getSelectedSectionLetter() {
    return this.sections.find(s => s.id === this.selectedSectionId)?.section_letter || '';
  }

  isLiveBlockValid(dayId: number): boolean {
    if (!this.scheduleForm) return false;
    const formDay = Number(this.scheduleForm.get('day_of_week')?.value);
    const formStart = this.scheduleForm.get('start_time')?.value;
    const formEnd = this.scheduleForm.get('end_time')?.value;
    return formDay === dayId && !!formStart && !!formEnd && (this.timeToMinutes(formEnd) > this.timeToMinutes(formStart));
  }

  getLiveBlockTop(): number {
    return this.getBlockTop({ start_time: this.scheduleForm.get('start_time')?.value });
  }

  getLiveBlockHeight(): number {
    return this.getBlockHeight({ start_time: this.scheduleForm.get('start_time')?.value, end_time: this.scheduleForm.get('end_time')?.value });
  }
}
