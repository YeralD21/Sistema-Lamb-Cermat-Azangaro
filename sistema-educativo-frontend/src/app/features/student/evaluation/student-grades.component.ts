import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { ICONS } from '@core/constants/icons';
import { AcademicService, Period } from '@core/services/academic.service';
import { AcademicContextStudent, AuthService } from '@core/services/auth.service';
import { EvaluationSummary, FinalCompetencyResult, EvaluationService } from '@core/services/evaluation.service';
import { ReportService } from '@core/services/report.service';

interface CourseGradeItem {
  id: string;
  name: string;
  grade: string;
  description: string;
  periodLabel: string;
}

interface CourseGrade {
  id: string;
  course_name: string;
  course_code: string;
  color: string;
  evaluations: CourseGradeItem[];
  average: string;
}

@Component({
  selector: 'app-grades-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <app-back-button link="/app/dashboard/student"></app-back-button>

      <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div class="space-y-3">
          <div>
            <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">Mis Calificaciones</h1>
            <p class="text-slate-500 text-lg font-medium">Seguimiento real por competencias y cierre anual</p>
          </div>

          <div *ngIf="studentContext" class="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-widest">
            <span class="px-3 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700">
              {{ studentContext.full_name }}
            </span>
            <span *ngIf="studentContext.section?.grade_level" class="px-3 py-2 rounded-2xl bg-slate-100 text-slate-600">
              {{ studentContext.section?.grade_level?.grade }}° {{ studentContext.section?.grade_level?.level }}
              {{ studentContext.section?.section_letter ? '- ' + studentContext.section?.section_letter : '' }}
            </span>
            <span *ngIf="summary?.student_final_status && selectedPeriod === 'all'" class="px-3 py-2 rounded-2xl border" [class]="getFinalStatusClass(summary?.student_final_status?.final_status)">
              {{ getFinalStatusLabel(summary?.student_final_status?.final_status) }}
            </span>
          </div>
        </div>

        <button class="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-100 hover:border-indigo-300 hover:bg-slate-50 rounded-2xl transition-all duration-300 shadow-sm font-black text-[11px] uppercase tracking-widest disabled:opacity-50">
          <div [innerHTML]="getSafeIcon('download')" class="w-5 h-5"></div>
          Boleta digital
        </button>
      </div>

      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 rounded-3xl px-5 py-4 text-sm font-medium">
        {{ error }}
      </div>

      <div *ngIf="summary && selectedPeriod === 'all'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Competencias</p>
          <p class="text-4xl font-black text-slate-900">{{ summary.totals.competencies }}</p>
          <p class="text-sm text-slate-500 font-medium mt-2">Registradas en el cierre anual</p>
        </div>

        <div class="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Pendientes de apoyo</p>
          <p class="text-4xl font-black text-slate-900">{{ (summary.totals.b || 0) + (summary.totals.c || 0) }}</p>
          <p class="text-sm text-slate-500 font-medium mt-2">Competencias en nivel B o C</p>
        </div>

        <div class="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Recuperación</p>
          <p class="text-4xl font-black text-slate-900">
            {{ summary.recovery_process?.results?.length || 0 }}
          </p>
          <p class="text-sm text-slate-500 font-medium mt-2">
            {{ summary.recovery_process ? 'Competencias con seguimiento' : 'Sin proceso activo' }}
          </p>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm relative overflow-hidden">
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">Filtrar por periodo</label>
          <div class="relative group max-w-2xl">
            <select [(ngModel)]="selectedPeriod" (change)="loadGrades()"
                    class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer group-hover:border-slate-300">
              <option value="all">Cierre anual</option>
              <option *ngFor="let p of periods" [value]="p.id">{{ p.name }}</option>
            </select>
            <div class="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-600 transition-colors">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
      </div>

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
          <h3 class="text-2xl font-black text-slate-900 mb-3 tracking-tight">No hay calificaciones disponibles</h3>
          <p class="text-slate-500 font-medium leading-relaxed">Aún no existen datos publicados para el periodo seleccionado.</p>
        </div>
      </div>

      <div *ngIf="!loading && courses.length > 0" class="space-y-8">
        <div *ngFor="let course of courses; let i = index" class="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-700 hover:-translate-y-1">
          <div class="p-8 border-b border-slate-100 bg-slate-50/30 group-hover:bg-white transition-colors">
            <div class="flex items-center gap-6">
              <div [class]="'w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg text-white transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ' + course.color">
                <div [innerHTML]="getSafeIcon('bookOpen')" class="w-8 h-8"></div>
              </div>
              <div class="flex-1">
                <h2 class="text-2xl font-black text-slate-900 leading-tight mb-1">{{ course.course_name }}</h2>
                <div class="flex items-center gap-4">
                  <span class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{{ course.course_code || ('CURSO-' + (i + 1)) }}</span>
                  <div class="w-1 h-1 bg-slate-200 rounded-full"></div>
                  <p class="text-sm font-bold text-slate-400">{{ course.evaluations.length }} competencias registradas</p>
                </div>
              </div>
              <div class="hidden sm:flex flex-col items-end gap-1 px-6 border-l border-slate-100">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resultado</span>
                <span class="text-2xl font-black text-slate-900">{{ course.average }}</span>
              </div>
            </div>
          </div>

          <div class="p-8 space-y-4">
            <div *ngFor="let evaluation of course.evaluations"
                 class="p-6 border-2 border-slate-100 rounded-[32px] hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-500 group/item bg-white flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pointer-events-auto">

              <div class="flex-1 w-full space-y-4">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-500 tracking-widest border border-slate-200/50">
                    {{ evaluation.id }}
                  </span>
                  <span class="px-3 py-1 bg-indigo-50 rounded-lg text-[10px] font-black uppercase text-indigo-600 tracking-widest border border-indigo-100/50">
                    {{ evaluation.periodLabel }}
                  </span>
                </div>
                <p class="text-base font-black text-slate-900 leading-tight group-hover/item:text-indigo-600 transition-colors">{{ evaluation.name }}</p>
                <p class="text-sm font-medium text-slate-500 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 italic" *ngIf="evaluation.description">
                  "{{ evaluation.description }}"
                </p>
              </div>

              <div class="flex flex-col items-center gap-2 shrink-0">
                <div [class]="'w-20 h-20 rounded-[28px] flex items-center justify-center font-black text-3xl shadow-lg transform group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-500 ' + getGradeColorClass(evaluation.grade)">
                  {{ evaluation.grade }}
                </div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ getGradeLabel(evaluation.grade) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">{{ s.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background: #F8FAFC; min-height: 100vh; }
    select::-ms-expand { display: none; }
  `]
})
export class GradesStudentComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private authService = inject(AuthService);
  private academicService = inject(AcademicService);
  private evaluationService = inject(EvaluationService);
  private reportService = inject(ReportService);

  loading = false;
  error = '';
  selectedPeriod = 'all';
  periods: Period[] = [];
  courses: CourseGrade[] = [];
  summary: EvaluationSummary | null = null;
  studentContext: AcademicContextStudent | null = null;
  activeAcademicYearId = '';

  scale = [
    { grade: 'AD', label: 'Logro Destacado', color: 'bg-green-500', description: 'Desempeño sobresaliente' },
    { grade: 'A', label: 'Logro Esperado', color: 'bg-blue-600', description: 'Cumple con lo esperado' },
    { grade: 'B', label: 'En Proceso', color: 'bg-yellow-500', description: 'Está cerca del logro' },
    { grade: 'C', label: 'En Inicio', color: 'bg-red-500', description: 'Requiere apoyo' },
  ];

  ngOnInit() {
    this.loadAcademicContext();
  }

  loadGrades() {
    if (!this.studentContext?.id || !this.activeAcademicYearId) {
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.selectedPeriod === 'all') {
      this.evaluationService.getEvaluationSummary(this.activeAcademicYearId, this.studentContext.id).subscribe({
        next: (summary) => {
          this.summary = summary;
          this.courses = this.mapSummaryCourses(summary);
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar el cierre anual de evaluaciones.';
          this.summary = null;
          this.courses = [];
          this.loading = false;
        }
      });

      return;
    }

    this.reportService.getReportCard(this.studentContext.id, this.selectedPeriod).subscribe({
      next: (response) => {
        this.summary = null;
        this.courses = this.mapReportCourses(response);
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el reporte del periodo seleccionado.';
        this.courses = [];
        this.loading = false;
      }
    });
  }

  getSafeIcon(name: string): SafeHtml {
    const svg = (ICONS as any)[name] || ICONS.calendar;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getGradeColorClass(grade: string): string {
    const map: Record<string, string> = {
      AD: 'text-green-600 bg-green-50 border-green-200',
      A: 'text-blue-600 bg-blue-50 border-blue-200',
      B: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      C: 'text-red-600 bg-red-50 border-red-200',
    };

    return map[grade] || 'text-slate-400 bg-slate-50 border-slate-200';
  }

  getGradeLabel(grade: string): string {
    const map: Record<string, string> = {
      AD: 'Logro Destacado',
      A: 'Logro Esperado',
      B: 'En Proceso',
      C: 'En Inicio',
    };

    return map[grade] || 'Sin nivel';
  }

  getFinalStatusLabel(status?: string | null): string {
    const map: Record<string, string> = {
      promociona: 'Promoción directa',
      recuperacion: 'En recuperación',
      permanece: 'Permanencia',
      pendiente: 'Pendiente',
    };

    return map[status || 'pendiente'] || 'Pendiente';
  }

  getFinalStatusClass(status?: string | null): string {
    const map: Record<string, string> = {
      promociona: 'bg-green-50 text-green-700 border-green-200',
      recuperacion: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      permanece: 'bg-red-50 text-red-700 border-red-200',
      pendiente: 'bg-slate-100 text-slate-600 border-slate-200',
    };

    return map[status || 'pendiente'] || 'bg-slate-100 text-slate-600 border-slate-200';
  }

  private loadAcademicContext() {
    this.loading = true;
    this.error = '';

    this.authService.getAcademicContext().subscribe({
      next: (context) => {
        this.studentContext = context.students?.[0] || null;
        this.activeAcademicYearId = context.active_academic_year?.id || '';

        if (!this.studentContext) {
          this.error = 'Tu usuario no tiene un estudiante vinculado.';
          this.loading = false;
          return;
        }

        if (!this.activeAcademicYearId) {
          this.error = 'No existe un año académico activo configurado.';
          this.loading = false;
          return;
        }

        this.academicService.getPeriods({ academic_year_id: this.activeAcademicYearId }).subscribe({
          next: (response) => {
            this.periods = response.data || response || [];
            this.loadGrades();
          },
          error: () => {
            this.error = 'No se pudo cargar la lista de periodos académicos.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'No se pudo obtener el contexto académico del usuario.';
        this.loading = false;
      }
    });
  }

  private mapSummaryCourses(summary: EvaluationSummary): CourseGrade[] {
    const grouped = summary.final_results.reduce((acc, item) => {
      if (!acc[item.course_id]) {
        acc[item.course_id] = [];
      }

      acc[item.course_id].push(item);
      return acc;
    }, {} as Record<string, FinalCompetencyResult[]>);

    return Object.entries(grouped).map(([courseId, results], index) => {
      const first = results[0];

      return {
        id: courseId,
        course_name: first?.course?.name || `Curso ${index + 1}`,
        course_code: first?.course?.code || '',
        color: this.getCourseColor(index),
        average: this.aggregateLevels(results.map(result => result.final_level || 'C')),
        evaluations: results
          .slice()
          .sort((a, b) => (a.competency?.name || '').localeCompare(b.competency?.name || ''))
          .map((result) => ({
            id: result.competency?.id || result.competency_id,
            name: result.competency?.name || result.competency?.description || 'Competencia',
            grade: result.final_level || '-',
            description: result.evidence_note || result.competency?.description || '',
            periodLabel: 'Cierre anual',
          })),
      };
    });
  }

  private mapReportCourses(response: any): CourseGrade[] {
    const report = response?.report || [];

    return report.map((course: any, index: number) => {
      const competencies = Array.isArray(course.competencies) ? course.competencies : [];

      return {
        id: course.course_id,
        course_name: course.course_name || `Curso ${index + 1}`,
        course_code: course.course_code || '',
        color: this.getCourseColor(index),
        average: this.aggregateLevels(competencies.map((item: any) => item.grade || 'C')),
        evaluations: competencies.map((item: any) => ({
          id: item.competency_id || item.evaluation_id,
          name: item.competency_name || 'Competencia',
          grade: item.grade || '-',
          description: item.comments || '',
          periodLabel: course.period_name || 'Periodo',
        })),
      };
    });
  }

  private aggregateLevels(levels: string[]): string {
    const order: Record<string, number> = { C: 1, B: 2, A: 3, AD: 4 };

    return levels.reduce((lowest, level) => {
      if (!lowest) {
        return level;
      }

      return (order[level] || 0) < (order[lowest] || 0) ? level : lowest;
    }, '');
  }

  private getCourseColor(index: number): string {
    const palette = [
      'bg-blue-600',
      'bg-rose-600',
      'bg-emerald-600',
      'bg-amber-600',
      'bg-violet-600',
      'bg-cyan-600',
    ];

    return palette[index % palette.length];
  }
}
