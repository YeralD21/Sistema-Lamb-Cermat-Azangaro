//src/app/features/admin/evaluation/grade-entry/grade-entry.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { AcademicService, Competency, Course, Period } from '@core/services/academic.service';
import { Evaluation, EvaluationService, SectionEvaluationDashboardStudent } from '@core/services/evaluation.service';

interface EnrolledStudent {
  id: string;
  name: string;
  code: string;
  initials: string;
  grade: 'AD' | 'A' | 'B' | 'C' | null;
  observation: string;
  evaluation_id?: string;
  status?: string;
  section_id?: string;
  section_label?: string;
  final_status?: string | null;
  pending_competencies_count?: number;
  recovery_required?: boolean;
  risk_count?: number;
  totals?: {
    competencies: number;
    ad: number;
    a: number;
    b: number;
    c: number;
  };
  summary?: SectionEvaluationDashboardStudent['academic_summary'] | null;
}

@Component({
  selector: 'app-grade-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  templateUrl: './grade-entry.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class GradeEntryComponent implements OnInit {
  private academicService = inject(AcademicService);
  private evaluationService = inject(EvaluationService);

  courses: Course[] = [];
  periods: Period[] = [];
  allCompetencies: Competency[] = [];
  competencies: Competency[] = [];
  students: EnrolledStudent[] = [];

  selectedCourseId = '';
  selectedPeriodId = '';
  selectedCompetencyId = '';
  selectedStudentId = '';
  activeAcademicYearId = '';
  activeAcademicYearLabel = '';
  currentSectionId = '';
  currentSectionLabel = '';
  loading = false;
  saving = false;
  recalculating = false;
  errorMessage = '';
  successMessage = '';

  sectionDecisionStats = {
    promociona: 0,
    recuperacion: 0,
    permanece: 0,
    pendiente: 0,
  };

  ngOnInit() {
    this.loadInitialData();
  }

  get selectedStudent(): EnrolledStudent | undefined {
    return this.students.find((student) => student.id === this.selectedStudentId);
  }

  get selectedCompetencyName(): string {
    const competency = this.competencies.find((item) => item.id === this.selectedCompetencyId);
    return competency?.name || competency?.description || '';
  }

  get selectedStudentConclusion(): string {
    const conclusions = this.selectedStudent?.summary?.descriptive_conclusions || [];
    const conclusion = conclusions.find((item) => {
      const sameCompetency = !this.selectedCompetencyId || item.competency_id === this.selectedCompetencyId;
      const samePeriod = !this.selectedPeriodId || item.period_id === this.selectedPeriodId;
      return sameCompetency && samePeriod;
    });

    return conclusion?.conclusion_text || conclusion?.recommendations || '';
  }

  get gradedCount(): number {
    return this.students.filter((student) => student.grade !== null).length;
  }

  get currentRiskCount(): number {
    return this.students.filter((student) => student.grade === 'B' || student.grade === 'C').length;
  }

  get publishedCount(): number {
    return this.students.filter((student) => student.status === 'publicada').length;
  }

  get sectionRiskStudents(): number {
    return this.students.filter((student) => ['recuperacion', 'permanece'].includes(student.final_status || '')).length;
  }

  loadInitialData() {
    this.academicService.getAcademicYears().subscribe({
      next: (response) => {
        const data = this.normalizeCollection(response);
        console.log('[grade-entry] academic years response:', response);
        console.log('[grade-entry] academic years normalized:', data);
        const activeYear = data.find((year: any) => year.is_active) || data[0];

        if (!activeYear) {
          console.warn('[grade-entry] no academic year returned');
          this.errorMessage = 'No se encontró un año académico activo.';
          return;
        }

        this.activeAcademicYearId = activeYear.id;
        this.activeAcademicYearLabel = String(activeYear.year || '');
        console.log('[grade-entry] active academic year:', activeYear);

        this.academicService.getPeriods({ academic_year_id: activeYear.id }).subscribe({
          next: (periodResponse) => {
            this.periods = this.normalizeCollection(periodResponse);
            console.log('[grade-entry] periods response:', periodResponse);
            console.log('[grade-entry] periods loaded:', this.periods);
          },
          error: (error) => {
            console.error('[grade-entry] periods error:', error);
            this.errorMessage = 'No se pudieron cargar los periodos.';
          }
        });
      },
      error: (error) => {
        console.error('[grade-entry] academic years error:', error);
        this.errorMessage = 'No se pudieron cargar los años académicos.';
      }
    });

    this.academicService.getCourses().subscribe({
      next: (response) => {
        this.courses = this.normalizeCollection(response);
        console.log('[grade-entry] courses response:', response);
        console.log('[grade-entry] courses loaded:', this.courses);
      },
      error: (error) => {
        console.error('[grade-entry] courses error:', error);
        this.errorMessage = 'No se pudieron cargar los cursos.';
      }
    });

    this.academicService.getCompetencies().subscribe({
      next: (response) => {
        this.allCompetencies = this.normalizeCollection(response);
        console.log('[grade-entry] competencies preload response:', response);
        console.log('[grade-entry] competencies preload loaded:', this.allCompetencies);
      },
      error: (error) => {
        console.error('[grade-entry] competencies preload error:', error);
      }
    });
  }

  onCourseChange() {
    this.selectedCompetencyId = '';
    this.competencies = [];
    console.log('[grade-entry] selected course:', this.selectedCourseId);

    if (!this.selectedCourseId) {
      this.onFilterChange();
      return;
    }

    this.academicService.getCompetencies({ course_id: this.selectedCourseId }).subscribe({
      next: (response) => {
        const filtered = this.normalizeCollection(response);
        this.competencies = filtered.length > 0
          ? filtered
          : this.allCompetencies.filter((item) => item.course_id === this.selectedCourseId);
        console.log('[grade-entry] competencies by course response:', response);
        console.log('[grade-entry] competencies loaded for course:', this.competencies);
        this.onFilterChange();
      },
      error: (error) => {
        console.error('[grade-entry] competencies by course error:', error);
        this.competencies = this.allCompetencies.filter((item) => item.course_id === this.selectedCourseId);
        this.onFilterChange();
      }
    });
  }

  onFilterChange() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.selectedCourseId && this.selectedPeriodId && this.selectedCompetencyId) {
      this.loadStudents();
      return;
    }

    this.students = [];
    this.selectedStudentId = '';
    this.currentSectionId = '';
    this.currentSectionLabel = '';
    this.sectionDecisionStats = { promociona: 0, recuperacion: 0, permanece: 0, pendiente: 0 };
  }

  loadStudents() {
    this.loading = true;
    this.errorMessage = '';

    this.academicService.getEnrolledStudents({
      course_id: this.selectedCourseId,
      academic_year_id: this.activeAcademicYearId,
      per_page: 200,
    }).subscribe({
      next: (response) => {
        const rawRows = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : [];

        const enrollmentsMap = new Map<string, EnrolledStudent>();
        const sectionIds = new Set<string>();
        let sectionLabel = '';

        rawRows.forEach((item: any) => {
          const student = item.student;
          if (!student?.id || enrollmentsMap.has(student.id)) {
            return;
          }

          if (item.section?.id) {
            sectionIds.add(item.section.id);
            sectionLabel = this.formatSectionLabel(item.section);
          }

          enrollmentsMap.set(student.id, {
            id: student.id,
            name: student.full_name || 'N/A',
            code: student.student_code || 'N/A',
            initials: this.getInitials(student.full_name || 'N A'),
            grade: null,
            observation: '',
            status: '',
            section_id: item.section?.id || '',
            section_label: this.formatSectionLabel(item.section),
          });
        });

        this.currentSectionId = sectionIds.size === 1 ? Array.from(sectionIds)[0] : '';
        this.currentSectionLabel = sectionIds.size === 1 ? sectionLabel : sectionIds.size > 1 ? 'Multiples secciones' : '';

        const enrolled = Array.from(enrollmentsMap.values());
        this.loadSectionDashboard(enrolled);
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los estudiantes inscritos.';
        this.loading = false;
      }
    });
  }

  loadSectionDashboard(enrolled: EnrolledStudent[]) {
    if (!this.activeAcademicYearId || !this.currentSectionId || enrolled.length === 0) {
      this.students = enrolled;
      this.selectedStudentId = enrolled[0]?.id || '';
      this.loading = false;
      return;
    }

    this.evaluationService.getSectionEvaluationDashboard(this.activeAcademicYearId, this.currentSectionId, {
      course_id: this.selectedCourseId,
      period_id: this.selectedPeriodId,
      competency_id: this.selectedCompetencyId,
    }).subscribe({
      next: (dashboard) => {
        enrolled.forEach((student) => {
          const dashboardStudent = dashboard.students.find((item) => item.id === student.id);

          if (!dashboardStudent) {
            student.summary = null;
            return;
          }

          student.grade = dashboardStudent.current_evaluation?.grade ?? student.grade;
          student.observation = dashboardStudent.current_evaluation?.comments || student.observation;
          student.evaluation_id = dashboardStudent.current_evaluation?.id || student.evaluation_id;
          student.status = dashboardStudent.current_evaluation?.status || student.status;
          student.summary = dashboardStudent.academic_summary;
          student.final_status = dashboardStudent.academic_summary.final_status || 'pendiente';
          student.pending_competencies_count = dashboardStudent.academic_summary.pending_competencies_count || 0;
          student.recovery_required = dashboardStudent.academic_summary.recovery_required || false;
          student.risk_count = (dashboardStudent.academic_summary.totals?.b || 0) + (dashboardStudent.academic_summary.totals?.c || 0);
          student.totals = dashboardStudent.academic_summary.totals;
        });

        this.currentSectionLabel = dashboard.section?.label || this.currentSectionLabel;
        this.sectionDecisionStats = dashboard.stats?.status_breakdown || this.sectionDecisionStats;
        this.students = enrolled;
        this.selectedStudentId = enrolled.find((student) => student.id === this.selectedStudentId)?.id || enrolled[0]?.id || '';
        this.loading = false;
      },
      error: () => {
        this.students = enrolled;
        this.selectedStudentId = enrolled[0]?.id || '';
        this.loading = false;
      }
    });
  }

  selectStudent(studentId: string) {
    this.selectedStudentId = studentId;
  }

  setGrade(student: EnrolledStudent, grade: any) {
    if (student.status === 'publicada') return;
    student.grade = grade;
    this.successMessage = '';
  }

  canSave(): boolean {
    return this.students.some((student) => student.grade !== null && student.status !== 'publicada');
  }

  canPublish(): boolean {
    return this.students.some((student) => student.grade !== null && student.status === 'borrador');
  }

  canRecalculate(): boolean {
    return !!this.activeAcademicYearId && !!this.currentSectionId && this.students.length > 0;
  }

  saveDraft() {
    const toSave = this.students.filter((student) => student.grade !== null && student.status !== 'publicada');
    if (toSave.length === 0) return;

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const requests = toSave.map((student) => {
      const data: Partial<Evaluation> = {
        student_id: student.id,
        course_id: this.selectedCourseId,
        period_id: this.selectedPeriodId,
        competency_id: this.selectedCompetencyId,
        grade: student.grade || null,
        comments: student.observation,
        status: 'borrador'
      };

      return this.evaluationService.saveEvaluation(data).pipe(catchError(() => of(null)));
    });

    forkJoin(requests).pipe(
      finalize(() => {
        this.saving = false;
      })
    ).subscribe(() => {
      this.successMessage = 'Borradores sincronizados correctamente.';
      this.loadStudents();
    });
  }

  publishAll() {
    const toPublish = this.students.filter((student) => student.status === 'borrador' && student.evaluation_id);
    if (toPublish.length === 0) return;

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const requests = toPublish.map((student) =>
      this.evaluationService.publishEvaluation(student.evaluation_id!).pipe(catchError(() => of(null)))
    );

    forkJoin(requests).pipe(
      switchMap(() => {
        if (this.canRecalculate()) {
          return this.evaluationService.recalculateSectionEvaluationSummary(this.activeAcademicYearId, this.currentSectionId).pipe(
            catchError(() => of(null))
          );
        }

        return of(null);
      }),
      finalize(() => {
        this.saving = false;
      })
    ).subscribe(() => {
      this.successMessage = 'Calificaciones publicadas correctamente y resumen academico actualizado.';
      this.loadStudents();
    });
  }

  recalculateAcademicSummary() {
    if (!this.canRecalculate()) return;

    this.recalculating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.evaluationService.recalculateSectionEvaluationSummary(this.activeAcademicYearId, this.currentSectionId).pipe(
      finalize(() => {
        this.recalculating = false;
      })
    ).subscribe({
      next: () => {
        this.successMessage = 'Resumen academico recalculado correctamente.';
        this.loadStudents();
      },
      error: () => {
        this.errorMessage = 'No se pudo recalcular el resumen academico de la seccion.';
      }
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

  getFinalStatusLabel(status?: string | null): string {
    const labels: Record<string, string> = {
      promociona: 'Promociona',
      recuperacion: 'Recuperacion',
      permanece: 'Permanece',
      pendiente: 'Pendiente',
    };

    return labels[status || 'pendiente'] || 'Pendiente';
  }

  getFinalStatusBadgeClass(status?: string | null): string {
    const classes: Record<string, string> = {
      promociona: 'bg-green-50 text-green-700 border-green-200',
      recuperacion: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      permanece: 'bg-red-50 text-red-700 border-red-200',
      pendiente: 'bg-slate-50 text-slate-600 border-slate-200',
    };

    return classes[status || 'pendiente'] || 'bg-slate-50 text-slate-600 border-slate-200';
  }

  getCurrentGradeBadgeClass(grade?: string | null): string {
    const classes: Record<string, string> = {
      AD: 'bg-green-50 text-green-700 border-green-200',
      A: 'bg-blue-50 text-blue-700 border-blue-200',
      B: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      C: 'bg-red-50 text-red-700 border-red-200',
    };

    return classes[grade || ''] || 'bg-slate-50 text-slate-600 border-slate-200';
  }

  private computeSectionDecisionStats() {
    const stats = {
      promociona: 0,
      recuperacion: 0,
      permanece: 0,
      pendiente: 0,
    };

    this.students.forEach((student) => {
      const status = student.final_status || 'pendiente';
      if (status in stats) {
        stats[status as keyof typeof stats]++;
        return;
      }
      stats.pendiente++;
    });

    this.sectionDecisionStats = stats;
  }

  private formatSectionLabel(section: any): string {
    if (!section) return '';
    const gradeName = section.grade_level?.name || '';
    const sectionLetter = section.section_letter || '';
    return [gradeName, sectionLetter].filter(Boolean).join(' ');
  }

  private getInitials(name: string): string {
    if (!name) return '??';
    return name.split(' ').filter((item) => item.length > 0).map((item) => item[0]).join('').substring(0, 2).toUpperCase();
  }

  private normalizeCollection<T = any>(response: any): T[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.data)) {
      return response.data.data;
    }

    if (Array.isArray(response?.items)) {
      return response.items;
    }

    console.warn('[grade-entry] could not normalize collection response:', response);
    return [];
  }
}
