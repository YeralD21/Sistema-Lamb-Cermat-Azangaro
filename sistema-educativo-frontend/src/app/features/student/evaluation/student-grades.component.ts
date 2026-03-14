import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { ICONS } from '@core/constants/icons';

interface CourseGrade {
  id: string;
  course_name: string;
  course_code: string;
  teacher_name: string;
  color: string;
  colorCode: string; // Hex code for specific border styling
  evaluations: {
    id: string;
    name: string;
    grade: string;
    weight: number;
    description: string;
  }[];
  average: string;
}

@Component({
  selector: 'app-grades-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <app-back-button link="/app/dashboard/student"></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">Mis Calificaciones</h1>
          <p class="text-slate-500 text-lg font-medium">Revisa tu rendimiento académico</p>
        </div>
        
        <button class="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-300 hover:bg-slate-50 rounded-2xl transition-all duration-300 shadow-sm font-black text-[11px] uppercase tracking-widest disabled:opacity-50">
          <div [innerHTML]="getSafeIcon('download')" class="w-5 h-5"></div>
          Descargar Boleta (Próximamente)
        </button>
      </div>

      <!-- Filter Section -->
      <div class="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Filtrar por periodo</label>
          <div class="relative group max-w-2xl">
            <select [(ngModel)]="selectedPeriod" (change)="loadGrades()"
                    class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer group-hover:border-slate-300">
              <option value="all">Todos los periodos</option>
              <option *ngFor="let p of periods" [value]="p.id">{{ p.name }}</option>
            </select>
            <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-600 transition-colors">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div *ngIf="loading" class="flex flex-col items-center justify-center py-32 gap-6">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Cargando calificaciones...</p>
      </div>

      <div *ngIf="!loading && courses.length === 0" class="text-center py-32 bg-white rounded-[50px] border border-slate-200 shadow-sm overflow-hidden relative group">
        <div class="absolute inset-0 bg-slate-50/30 group-hover:bg-indigo-50/20 transition-colors duration-700"></div>
        <div class="relative z-10 max-w-md mx-auto">
          <div class="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl border border-slate-100 transform group-hover:rotate-12 transition-transform duration-500">
             <div [innerHTML]="getSafeIcon('bookOpen')" class="w-12 h-12 text-slate-300"></div>
          </div>
          <h3 class="text-2xl font-black text-slate-900 mb-3 tracking-tight">No hay calificaciones publicadas</h3>
          <p class="text-slate-500 font-medium leading-relaxed">Tus docentes aún no han publicado calificaciones para el periodo seleccionado.</p>
        </div>
      </div>

      <div *ngIf="!loading && courses.length > 0" class="space-y-8">
        <div *ngFor="let course of courses" class="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-700 hover:-translate-y-1">
          <!-- Course Header -->
          <div class="p-8 border-b border-slate-100 bg-slate-50/30 group-hover:bg-white transition-colors">
            <div class="flex items-center gap-6">
              <div [class]="'w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg text-white transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ' + course.color">
                <div [innerHTML]="getSafeIcon('bookOpen')" class="w-8 h-8"></div>
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-black text-slate-900 leading-tight mb-1">{{ course.course_name }}</h2>
                <div class="flex items-center gap-4">
                  <span class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{{ course.course_code }}</span>
                  <div class="w-1 h-1 bg-slate-200 rounded-full"></div>
                  <p class="text-sm font-bold text-slate-400">{{ course.evaluations.length }} competencias evaluadas</p>
                </div>
              </div>
              <!-- Summary Badge (Optional but nice) -->
              <div class="hidden sm:flex flex-col items-end gap-1 px-6 border-l border-slate-100">
                 <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">PROMEDIO</span>
                 <span class="text-2xl font-black text-slate-900">{{ course.average }}</span>
              </div>
            </div>
          </div>

          <!-- Evaluations Area -->
          <div class="p-8 space-y-4">
            <div *ngFor="let eval of course.evaluations" 
                 class="p-6 border-2 border-slate-100 rounded-[32px] hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-500 group/item bg-white flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pointer-events-auto">
              
              <div class="flex-1 w-full space-y-4">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-500 tracking-widest border border-slate-200/50">{{ eval.id.toUpperCase() }}</span>
                  <span class="px-3 py-1 bg-indigo-50 rounded-lg text-[10px] font-black uppercase text-indigo-600 tracking-widest border border-indigo-100/50">{{ selectedPeriod === 'all' ? '1° BIM' : periods[0].name }}</span>
                </div>
                <p class="text-base font-black text-slate-900 leading-tight group-hover/item:text-indigo-600 transition-colors">{{ eval.name }}</p>
                <p class="text-sm font-medium text-slate-500 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 italic" *ngIf="eval.description">
                  "{{ eval.description }}"
                </p>
              </div>

              <div class="flex flex-col items-center gap-2 shrink-0">
                <div [class]="'w-20 h-20 rounded-[28px] flex items-center justify-center font-black text-3xl shadow-lg transform group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-500 ' + getGradeColorClass(eval.grade)">
                  {{ eval.grade }}
                </div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ getGradeLabel(eval.grade) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grade Scale Card (Bottom, React style) -->
      <div class="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
        <h3 class="text-lg font-black text-slate-900 mb-8 flex items-center gap-4">
          Escala de Calificación
          <div class="flex-1 h-px bg-slate-100"></div>
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let s of scale" class="flex items-center gap-4 p-5 bg-slate-50/50 rounded-3xl border border-slate-50 hover:bg-white hover:shadow-xl transition-all duration-500 group/legend">
            <div [class]="'w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transform group-hover/legend:scale-110 transition-transform ' + s.color">
              {{ s.grade }}
            </div>
            <div>
              <p class="text-base font-black text-slate-900 leading-none mb-1.5">{{ s.label }}</p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80" *ngIf="s.grade === 'AD'">Desempeño sobresaliente</p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80" *ngIf="s.grade === 'A'">Cumple con lo esperado</p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80" *ngIf="s.grade === 'B'">Está cerca del logro</p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80" *ngIf="s.grade === 'C'">Requiere apoyo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background: #F8FAFC; min-h: 100vh; }
    select::-ms-expand { display: none; }
  `]
})
export class GradesStudentComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  
  loading = false;
  selectedPeriod = 'all';
  periods = [
    { id: 'b1', name: '1° BIM' },
    { id: 'b2', name: '2° BIM' },
    { id: 'b3', name: '3° BIM' },
    { id: 'b4', name: '4° BIM' },
  ];

  scale = [
    { grade: 'AD', label: 'Logro Destacado', color: 'bg-green-500' },
    { grade: 'A', label: 'Logro Esperado', color: 'bg-blue-600' },
    { grade: 'B', label: 'En Proceso', color: 'bg-yellow-500' },
    { grade: 'C', label: 'En Inicio', color: 'bg-red-500' },
  ];

  courses: CourseGrade[] = [];

  ngOnInit() {
    this.loadGrades();
  }

  loadGrades() {
    this.loading = true;
    setTimeout(() => {
      this.courses = [
        {
          id: '1',
          course_name: 'MATEMÁTICA AVANZADA',
          course_code: 'MAT-301',
          teacher_name: 'Dr. Roberto Sánchez',
          color: 'bg-blue-600',
          colorCode: '#2563eb',
          average: 'A',
          evaluations: [
            { id: 'e1', name: 'Resuelve problemas de cantidad', weight: 25, grade: 'AD', description: 'Uso de números reales y complejos' },
            { id: 'e2', name: 'Resuelve problemas de regularidad', weight: 25, grade: 'A', description: 'Álgebra y funciones cuadráticas' },
            { id: 'e3', name: 'Resuelve problemas de forma y movimiento', weight: 25, grade: 'A', description: 'Trigonometría y geometría plana' },
            { id: 'e4', name: 'Resuelve problemas de gestión de datos', weight: 25, grade: 'B', description: 'Estadística y probabilidades' }
          ]
        },
        {
          id: '2',
          course_name: 'COMUNICACIÓN Y LITERATURA',
          course_code: 'COM-301',
          teacher_name: 'Lic. Martha Espinoza',
          color: 'bg-rose-600',
          colorCode: '#e11d48',
          average: 'AD',
          evaluations: [
            { id: 'e5', name: 'Se comunica oralmente', weight: 33, grade: 'AD', description: 'Debates y exposiciones académicas' },
            { id: 'e6', name: 'Lee diversos tipos de textos', weight: 33, grade: 'AD', description: 'Análisis literario de obras clásicas' },
            { id: 'e7', name: 'Escribe textos en su lengua materna', weight: 34, grade: 'A', description: 'Ensayo argumentativo y redacción' }
          ]
        },
        {
          id: '3',
          course_name: 'CIENCIA Y TECNOLOGÍA',
          course_code: 'CYT-302',
          teacher_name: 'Ing. Carlos Ruiz',
          color: 'bg-emerald-600',
          colorCode: '#059669',
          average: 'A',
          evaluations: [
            { id: 'e8', name: 'Indaga mediante métodos científicos', weight: 33, grade: 'A', description: 'Experimentación de laboratorio' },
            { id: 'e9', name: 'Explica el mundo físico', weight: 33, grade: 'B', description: 'Leyes de la física y química celular' },
            { id: 'e10', name: 'Diseña y construye soluciones', weight: 34, grade: 'AD', description: 'Proyectos de ingeniería sostenible' }
          ]
        },
        {
          id: '4',
          course_name: 'DESARROLLO PERSONAL Y CÍVICO',
          course_code: 'DPCC-301',
          teacher_name: 'Dra. Elena Ramos',
          color: 'bg-amber-600',
          colorCode: '#d97706',
          average: 'B',
          evaluations: [
            { id: 'e11', name: 'Construye su identidad', weight: 50, grade: 'B', description: 'Autoconocimiento y ética personal' },
            { id: 'e12', name: 'Convive y participa democráticamente', weight: 50, grade: 'A', description: 'Cultura de paz y derechos humanos' }
          ]
        }
      ];
      this.loading = false;
    }, 1000);
  }

  getSafeIcon(name: string): SafeHtml {
    const svg = (ICONS as any)[name] || ICONS.calendar;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getGradeColorClass(grade: string): string {
    const map: Record<string, string> = {
      'AD': 'text-green-600 bg-green-50 border-green-200',
      'A': 'text-blue-600 bg-blue-50 border-blue-200',
      'B': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'C': 'text-red-600 bg-red-50 border-red-200',
    };
    return map[grade] || 'text-slate-400 bg-slate-50 border-slate-200';
  }

  getGradeLabel(grade: string): string {
    const map: Record<string, string> = {
      'AD': 'Logro Destacado',
      'A': 'Logro Esperado',
      'B': 'En Proceso',
      'C': 'En Inicio',
    };
    return map[grade] || '';
  }
}
