import { Component, OnInit, inject } from '@angular/core';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GradeLevel, Section, AcademicService } from '@core/services/academic.service';
import { AcademicYear } from '@core/models/AcademicYear';
import { ReportService } from '@core/services/report.service';
import { EvaluationSummary, FinalCompetencyResult, EvaluationService } from '@core/services/evaluation.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

type TabType = 'attendance' | 'evaluation' | 'siagie';

interface AttendanceRow {
  student_id: string;
  student_code: string;
  student_name: string;
  attendance_percentage: number;
  total_absences: number;
  total_tardies: number;
  total_justifications: number;
}

interface EvaluationRow {
  student_id: string;
  student_code: string;
  student_name: string;
  competencies: Record<string, string>;
  final_grade: string;
}

interface SectionStudent {
  id: string;
  student_code: string;
  full_name: string;
}

@Component({
  selector: 'app-academic-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BackButtonComponent],
  templateUrl: './academic-reports.component.html',
})
export class AcademicReportsComponent implements OnInit {
  private academicService = inject(AcademicService);
  private reportService = inject(ReportService);
  private evaluationService = inject(EvaluationService);

  activeTab: TabType = 'attendance';
  loading = false;
  error = '';

  academicYears: AcademicYear[] = [];
  periods: any[] = [];
  grades: GradeLevel[] = [];
  sections: Section[] = [];
  courses: any[] = [];

  selectedYear = '';
  selectedPeriod = '';
  selectedGrade = '';
  selectedSection = '';
  selectedCourse = '';

  attendanceData: AttendanceRow[] = [];
  evaluationData: EvaluationRow[] = [];
  competenciesList: { id: string; description: string }[] = [];

  avgAttendance = 0;
  topAbsentees: string[] = [];
  totalAbsences = 0;

  gradeDistribution = { AD: 0, A: 0, B: 0, C: 0 };
  studentsAtRisk = 0;

  ngOnInit() {
    this.loading = true;
    this.academicService.getAcademicYears().subscribe({
      next: (res) => {
        this.academicYears = res.data || res || [];
        this.selectedYear = this.academicYears.find((year) => year.is_active)?.id || '';
        this.loading = false;
        this.loadInitialFilters();
      },
      error: () => {
        this.error = 'No se pudieron cargar los años académicos.';
        this.loading = false;
      }
    });
  }

  loadInitialFilters() {
    this.academicService.getGradeLevels().subscribe({
      next: (res) => this.grades = res.data || res || [],
      error: () => this.error = 'No se pudieron cargar los grados.'
    });

    this.loadPeriods();
  }

  setTab(tab: TabType) {
    this.activeTab = tab;
    this.loadTabData();
  }

  onYearChange() {
    this.selectedPeriod = '';
    this.resetReportData();
    this.loadPeriods();
  }

  onPeriodChange() {
    this.loadTabData();
  }

  onGradeChange() {
    this.sections = [];
    this.selectedSection = '';
    this.selectedCourse = '';
    this.courses = [];
    this.resetReportData();

    if (this.selectedGrade) {
      this.academicService.getSections({ grade_level_id: this.selectedGrade }).subscribe({
        next: (res) => this.sections = res.data || res || [],
        error: () => this.error = 'No se pudieron cargar las secciones.'
      });
    }
  }

  onSectionChange() {
    this.selectedCourse = '';
    this.courses = [];
    this.resetReportData();

    if (this.selectedSection) {
      this.academicService.getCourses({ section_id: this.selectedSection }).subscribe({
        next: (res) => {
          this.courses = res.data || res || [];
          this.loadTabData();
        },
        error: () => this.error = 'No se pudieron cargar los cursos.'
      });
      return;
    }

    this.loadTabData();
  }

  onCourseChange() {
    this.loadTabData();
  }

  attendanceBadgeClass(pct: number): string {
    if (pct >= 90) return 'bg-green-100 text-green-800 border border-green-200';
    if (pct >= 75) return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    return 'bg-red-100 text-red-800 border border-red-200';
  }

  gradeBadgeClass(grade: string): string {
    const map: Record<string, string> = {
      AD: 'bg-green-100 text-green-800 border border-green-200',
      A: 'bg-blue-100 text-blue-800 border border-blue-200',
      B: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      C: 'bg-red-100 text-red-800 border border-red-200',
    };
    return map[grade] ?? 'bg-slate-100 text-slate-600 border border-slate-200';
  }

  exportCSV(type: 'attendance' | 'evaluation') {
    alert(`Exportación CSV de "${type}" queda como siguiente paso de integración.`);
  }

  exportPDF(type: 'attendance' | 'evaluation') {
    alert(`Exportación PDF de "${type}" queda como siguiente paso de integración.`);
  }

  exportSIAGIE(type: 'matricula' | 'asistencia' | 'evaluacion') {
    alert(`Exportación SIAGIE (${type}) queda como siguiente paso de integración.`);
  }

  private loadPeriods() {
    if (!this.selectedYear) {
      this.periods = [];
      return;
    }

    this.academicService.getPeriods({ academic_year_id: this.selectedYear }).subscribe({
      next: (res) => {
        this.periods = res.data || res || [];
        this.loadTabData();
      },
      error: () => this.error = 'No se pudieron cargar los periodos.'
    });
  }

  private loadTabData() {
    if (this.activeTab === 'attendance') {
      this.loadAttendanceReport();
      return;
    }

    if (this.activeTab === 'evaluation') {
      this.loadEvaluationReport();
    }
  }

  private loadAttendanceReport() {
    if (!this.selectedYear || !this.selectedSection) {
      this.attendanceData = [];
      this.avgAttendance = 0;
      this.totalAbsences = 0;
      this.topAbsentees = [];
      return;
    }

    this.loading = true;
    this.error = '';

    this.loadSectionStudents((students) => {
      if (!students.length) {
        this.attendanceData = [];
        this.avgAttendance = 0;
        this.totalAbsences = 0;
        this.topAbsentees = [];
        this.loading = false;
        return;
      }

      const period = this.periods.find((item) => item.id === this.selectedPeriod);
      const dateFrom = period?.start_date;
      const dateTo = period?.end_date;

      const requests = students.map((student) =>
        this.reportService.getAttendanceSummary(student.id, dateFrom, dateTo).pipe(catchError(() => of(null)))
      );

      forkJoin(requests).subscribe({
        next: (responses) => {
          const rows = responses.map((response, index) => this.mapAttendanceRow(students[index], response)).filter(Boolean) as AttendanceRow[];

          this.attendanceData = rows;
          this.avgAttendance = rows.length ? rows.reduce((sum, row) => sum + row.attendance_percentage, 0) / rows.length : 0;
          this.totalAbsences = rows.reduce((sum, row) => sum + row.total_absences, 0);
          this.topAbsentees = rows
            .slice()
            .sort((a, b) => b.total_absences - a.total_absences)
            .slice(0, 3)
            .map((row) => row.student_name);
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar el consolidado de asistencia.';
          this.loading = false;
        }
      });
    });
  }

  private loadEvaluationReport() {
    if (!this.selectedYear || !this.selectedSection) {
      this.evaluationData = [];
      this.competenciesList = [];
      this.gradeDistribution = { AD: 0, A: 0, B: 0, C: 0 };
      this.studentsAtRisk = 0;
      return;
    }

    this.loading = true;
    this.error = '';

    this.loadSectionStudents((students) => {
      if (!students.length) {
        this.evaluationData = [];
        this.competenciesList = [];
        this.gradeDistribution = { AD: 0, A: 0, B: 0, C: 0 };
        this.studentsAtRisk = 0;
        this.loading = false;
        return;
      }

      if (this.selectedPeriod) {
        this.loadPeriodEvaluationRows(students);
        return;
      }

      this.evaluationService.recalculateSectionEvaluationSummary(this.selectedYear, this.selectedSection).pipe(
        catchError(() => of(null))
      ).subscribe(() => this.loadYearEvaluationRows(students));
    });
  }

  private loadYearEvaluationRows(students: SectionStudent[]) {
    const requests = students.map((student) =>
      this.evaluationService.getEvaluationSummary(this.selectedYear, student.id).pipe(catchError(() => of(null)))
    );

    forkJoin(requests).subscribe({
      next: (responses) => {
        const summaries = responses.filter((response): response is EvaluationSummary => !!response);
        this.buildEvaluationStateFromSummaries(students, summaries);
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el consolidado anual de evaluación.';
        this.loading = false;
      }
    });
  }

  private loadPeriodEvaluationRows(students: SectionStudent[]) {
    const requests = students.map((student) =>
      this.reportService.getReportCard(student.id, this.selectedPeriod).pipe(catchError(() => of(null)))
    );

    forkJoin(requests).subscribe({
      next: (responses) => {
        this.buildEvaluationStateFromReports(students, responses);
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el reporte de evaluación del periodo.';
        this.loading = false;
      }
    });
  }

  private buildEvaluationStateFromSummaries(students: SectionStudent[], summaries: EvaluationSummary[]) {
    const competencyMap = new Map<string, { id: string; description: string }>();
    const rows: EvaluationRow[] = [];
    const allLevels: string[] = [];
    let atRisk = 0;

    students.forEach((student) => {
      const summary = summaries.find((item) => item.student.id === student.id);
      const filteredResults = (summary?.final_results || []).filter((result) => !this.selectedCourse || result.course_id === this.selectedCourse);
      const competencies: Record<string, string> = {};

      filteredResults.forEach((result) => {
        const competencyId = result.competency?.id || result.competency_id;
        competencies[competencyId] = result.final_level || '-';
        allLevels.push(result.final_level || '');
        competencyMap.set(competencyId, {
          id: competencyId,
          description: result.competency?.name || result.competency?.description || 'Competencia',
        });
      });

      const riskCount = filteredResults.filter((result) => ['B', 'C'].includes(result.final_level || '')).length;
      if (riskCount >= 2) {
        atRisk++;
      }

      rows.push({
        student_id: student.id,
        student_code: student.student_code,
        student_name: student.full_name,
        competencies,
        final_grade: this.aggregateLevels(filteredResults.map((result) => result.final_level || '')),
      });
    });

    this.competenciesList = Array.from(competencyMap.values()).sort((a, b) => a.description.localeCompare(b.description));
    this.evaluationData = rows;
    this.gradeDistribution = this.calculateDistribution(allLevels);
    this.studentsAtRisk = atRisk;
  }

  private buildEvaluationStateFromReports(students: SectionStudent[], responses: any[]) {
    const competencyMap = new Map<string, { id: string; description: string }>();
    const rows: EvaluationRow[] = [];
    const allLevels: string[] = [];
    let atRisk = 0;

    students.forEach((student, index) => {
      const response = responses[index];
      const report = response?.report || [];
      const filteredCourses = report.filter((course: any) => !this.selectedCourse || course.course_id === this.selectedCourse);
      const competencies: Record<string, string> = {};
      const studentLevels: string[] = [];

      filteredCourses.forEach((course: any) => {
        const items = Array.isArray(course.competencies) ? course.competencies : [];
        items.forEach((item: any) => {
          const competencyId = item.competency_id || item.evaluation_id;
          competencies[competencyId] = item.grade || '-';
          studentLevels.push(item.grade || '');
          allLevels.push(item.grade || '');
          competencyMap.set(competencyId, {
            id: competencyId,
            description: item.competency_name || 'Competencia',
          });
        });
      });

      const riskCount = studentLevels.filter((level) => ['B', 'C'].includes(level)).length;
      if (riskCount >= 2) {
        atRisk++;
      }

      rows.push({
        student_id: student.id,
        student_code: student.student_code,
        student_name: student.full_name,
        competencies,
        final_grade: this.aggregateLevels(studentLevels),
      });
    });

    this.competenciesList = Array.from(competencyMap.values()).sort((a, b) => a.description.localeCompare(b.description));
    this.evaluationData = rows;
    this.gradeDistribution = this.calculateDistribution(allLevels);
    this.studentsAtRisk = atRisk;
  }

  private loadSectionStudents(callback: (students: SectionStudent[]) => void) {
    this.academicService.getEnrolledStudents({
      section_id: this.selectedSection,
      academic_year_id: this.selectedYear,
      per_page: 200,
    }).subscribe({
      next: (response) => {
        const data = Array.isArray(response?.data) ? response.data : Array.isArray(response?.data?.data) ? response.data.data : [];
        const uniqueStudents = new Map<string, SectionStudent>();

        data.forEach((item: any) => {
          const student = item.student;
          if (!student?.id || uniqueStudents.has(student.id)) {
            return;
          }

          uniqueStudents.set(student.id, {
            id: student.id,
            student_code: student.student_code || 'SIN-COD',
            full_name: student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Estudiante',
          });
        });

        callback(Array.from(uniqueStudents.values()));
      },
      error: () => {
        this.error = 'No se pudo cargar la matrícula de la sección seleccionada.';
        this.loading = false;
      }
    });
  }

  private mapAttendanceRow(student: SectionStudent, response: any): AttendanceRow | null {
    if (!student) {
      return null;
    }

    const counts = Array.isArray(response?.counts_by_status) ? response.counts_by_status : [];
    const totals = counts.reduce((acc: Record<string, number>, item: any) => {
      acc[item.status] = Number(item.total || 0);
      return acc;
    }, {});

    const present = totals['presente'] || 0;
    const justified = totals['justificado'] || 0;
    const absences = totals['falta'] || 0;
    const tardies = totals['tarde'] || 0;
    const total = present + justified + absences + tardies;
    const attendancePercentage = total > 0 ? ((present + justified) / total) * 100 : 0;

    return {
      student_id: student.id,
      student_code: student.student_code,
      student_name: student.full_name,
      attendance_percentage: attendancePercentage,
      total_absences: absences,
      total_tardies: tardies,
      total_justifications: justified,
    };
  }

  private calculateDistribution(levels: string[]) {
    if (!levels.length) {
      return { AD: 0, A: 0, B: 0, C: 0 };
    }

    const counts = levels.reduce((acc, level) => {
      if (level === 'AD' || level === 'A' || level === 'B' || level === 'C') {
        acc[level]++;
      }

      return acc;
    }, { AD: 0, A: 0, B: 0, C: 0 });

    return {
      AD: Math.round((counts.AD / levels.length) * 100),
      A: Math.round((counts.A / levels.length) * 100),
      B: Math.round((counts.B / levels.length) * 100),
      C: Math.round((counts.C / levels.length) * 100),
    };
  }

  private aggregateLevels(levels: string[]): string {
    const filtered = levels.filter(Boolean);
    const order: Record<string, number> = { C: 1, B: 2, A: 3, AD: 4 };

    if (!filtered.length) {
      return '-';
    }

    return filtered.reduce((lowest, current) => ((order[current] || 0) < (order[lowest] || 0) ? current : lowest));
  }

  private resetReportData() {
    this.attendanceData = [];
    this.evaluationData = [];
    this.competenciesList = [];
    this.avgAttendance = 0;
    this.topAbsentees = [];
    this.totalAbsences = 0;
    this.gradeDistribution = { AD: 0, A: 0, B: 0, C: 0 };
    this.studentsAtRisk = 0;
  }
}
