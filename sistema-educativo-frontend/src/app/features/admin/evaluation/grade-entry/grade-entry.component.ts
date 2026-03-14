import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { FormsModule } from '@angular/forms';
import { AcademicService, Course, Period, Competency } from '@core/services/academic.service';
import { EvaluationService, Evaluation } from '@core/services/evaluation.service';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

interface EnrolledStudent {
  id: string;
  name: string;
  code: string;
  initials: string;
  grade: 'AD' | 'A' | 'B' | 'C' | null;
  observation: string;
  evaluation_id?: string;
  status?: string;
}

@Component({
  selector: 'app-grade-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 text-slate-700">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-semibold text-slate-900 tracking-tight">Registro de Evaluaciones</h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Califica a tus estudiantes por competencias</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="saveDraft()" [disabled]="!canSave() || saving" class="px-6 py-2.5 bg-white border border-blue-700 text-blue-700 text-sm font-bold rounded-xl transition-all hover:bg-blue-50 active:scale-95 flex items-center gap-2 disabled:opacity-50">
            <svg *ngIf="!saving" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <div *ngIf="saving" class="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
            Guardar borrador
          </button>
          <button (click)="publishAll()" [disabled]="!canPublish() || saving" class="px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-50">
            <svg *ngIf="!saving" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
            <div *ngIf="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Publicar calificaciones
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-end gap-6">
        <div class="flex-1 space-y-2 w-full">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Curso</label>
          <select [(ngModel)]="selectedCourseId" (change)="onFilterChange()" [disabled]="saving" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option value="">Seleccionar Curso</option>
            <option *ngFor="let c of courses" [value]="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="flex-2 space-y-2 w-full md:w-48">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Periodo</label>
          <select [(ngModel)]="selectedPeriodId" (change)="onFilterChange()" [disabled]="saving" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option value="">Seleccionar Periodo</option>
            <option *ngFor="let p of periods" [value]="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div class="flex-1 space-y-2 w-full">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Competencia</label>
          <select [(ngModel)]="selectedCompetencyId" (change)="onFilterChange()" [disabled]="saving" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option value="">Seleccionar Competencia</option>
            <option *ngFor="let comp of competencies" [value]="comp.id">{{ comp.name }}</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Grades Plate Section -->
      <div *ngIf="!loading && students.length > 0" class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 bg-slate-50/20 flex justify-between items-center">
          <h2 class="text-lg font-bold text-slate-800 tracking-tight">Planilla de Calificaciones</h2>
          <div *ngIf="saving" class="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest animate-pulse">
            <div class="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Sincronizando...
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
                <th class="py-5 px-6 text-center w-16">#</th>
                <th class="py-5 px-6 text-left">Estudiante</th>
                <th class="py-5 px-6 text-center">Calificación</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let student of students; let i = index" class="group hover:bg-slate-50/50 transition-colors">
                <td class="py-6 px-6 text-center text-sm font-medium text-slate-400">{{ i + 1 }}</td>
                <td class="py-6 px-6">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
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
                              (click)="setGrade(student, grade)"
                              [disabled]="student.status === 'publicada' || saving"
                              [class]="student.grade === grade ? getGradeSelectedClass(grade) : 'px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 text-xs font-bold hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'">
                        {{ grade }}
                      </button>
                    </div>
                    <div class="relative max-w-xs mx-auto w-full">
                      <input type="text" [(ngModel)]="student.observation" placeholder="Observación..." 
                             [disabled]="student.status === 'publicada' || saving"
                             class="w-full bg-slate-50/50 border border-slate-100 rounded-lg px-3 py-1.5 text-[10px] italic text-slate-500 focus:outline-none focus:border-blue-300 transition-all disabled:bg-transparent disabled:border-none" />
                    </div>
                    <div *ngIf="student.status" class="text-center">
                      <span class="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md" 
                            [class.bg-blue-50]="student.status === 'publicada'" [class.text-blue-500]="student.status === 'publicada'" 
                            [class.bg-slate-50]="student.status === 'borrador'" [class.text-slate-400]="student.status === 'borrador'">
                        {{ student.status }}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && students.length === 0 && selectedCourseId && selectedPeriodId && selectedCompetencyId" class="text-center py-12 bg-white rounded-3xl border border-slate-100">
        <p class="text-slate-400 font-medium">No se encontraron estudiantes para los filtros seleccionados.</p>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class GradeEntryComponent implements OnInit {
  private academicService = inject(AcademicService);
  private evaluationService = inject(EvaluationService);

  courses: Course[] = [];
  periods: Period[] = [];
  competencies: Competency[] = [];
  students: EnrolledStudent[] = [];

  selectedCourseId = '';
  selectedPeriodId = '';
  selectedCompetencyId = '';
  loading = false;
  saving = false;

  ngOnInit() {
    this.academicService.getAcademicYears().subscribe(res => {
      const data = res.data || res;
      const activeYear = data.find((y: any) => y.is_active);
      if (activeYear) {
        this.academicService.getPeriods({ academic_year_id: activeYear.id }).subscribe(res => {
          this.periods = res.data || res;
        });
      }
    });
    this.academicService.getCourses().subscribe(res => this.courses = res.data || res);
    this.academicService.getCompetencies().subscribe(res => this.competencies = res.data || res);
  }

  onFilterChange() {
    if (this.selectedCourseId && this.selectedPeriodId && this.selectedCompetencyId) {
      this.loadStudents();
    } else {
      this.students = [];
    }
  }

  loadStudents() {
    this.loading = true;
    this.academicService.getEnrolledStudents({ course_id: this.selectedCourseId }).subscribe({
      next: (res) => {
        const data = res.data || res;
        const enrolled = data.map((item: any) => ({
          id: item.student.id,
          name: item.student.full_name || 'N/A',
          code: item.student.student_code || 'N/A',
          initials: this.getInitials(item.student.full_name || 'N A'),
          grade: null,
          observation: '',
          status: ''
        }));

        this.evaluationService.getEvaluations({
          course_id: this.selectedCourseId,
          period_id: this.selectedPeriodId,
          competency_id: this.selectedCompetencyId
        }).subscribe({
          next: (evalRes) => {
            const evals = evalRes.data || evalRes;
            enrolled.forEach((student: EnrolledStudent) => {
              const existing = Array.isArray(evals) ? evals.find((e: any) => e.student_id === student.id) : null;
              if (existing) {
                student.grade = existing.grade as any;
                student.observation = existing.comments || '';
                student.evaluation_id = existing.id;
                student.status = existing.status;
              }
            });
            this.students = enrolled;
            this.loading = false;
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  setGrade(student: EnrolledStudent, grade: any) {
    if (student.status === 'publicada') return;
    student.grade = grade;
  }

  canSave(): boolean {
    return this.students.some(s => s.grade !== null && s.status !== 'publicada');
  }

  canPublish(): boolean {
    return this.students.some(s => s.grade !== null && s.status === 'borrador');
  }

  saveDraft() {
    const toSave = this.students.filter(s => s.grade !== null && s.status !== 'publicada');
    if (toSave.length === 0) return;

    this.saving = true;
    const requests = toSave.map(student => {
      const data: Partial<Evaluation> = {
        student_id: student.id,
        course_id: this.selectedCourseId,
        period_id: this.selectedPeriodId,
        competency_id: this.selectedCompetencyId,
        grade: student.grade || null,
        comments: student.observation,
        status: 'borrador'
      };
      return this.evaluationService.saveEvaluation(data).pipe(catchError(err => of(null)));
    });

    forkJoin(requests).pipe(
      finalize(() => {
        this.saving = false;
        this.loadStudents();
      })
    ).subscribe(() => {
      alert('Borradores sincronizados correctamente.');
    });
  }

  publishAll() {
    const toPublish = this.students.filter(s => s.status === 'borrador' && s.evaluation_id);
    if (toPublish.length === 0) return;

    this.saving = true;
    const requests = toPublish.map(student => {
      return this.evaluationService.publishEvaluation(student.evaluation_id!).pipe(catchError(err => of(null)));
    });

    forkJoin(requests).pipe(
      finalize(() => {
        this.saving = false;
        this.loadStudents();
      })
    ).subscribe(() => {
      alert('Calificaciones publicadas correctamente.');
    });
  }

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

  private getInitials(name: string): string {
    if (!name) return '??';
    return name.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}

