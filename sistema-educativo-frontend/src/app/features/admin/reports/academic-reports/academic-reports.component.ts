import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AcademicService, AcademicYear, GradeLevel, Section } from '@core/services/academic.service';

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

@Component({
  selector: 'app-academic-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BackButtonComponent],
  templateUrl: './academic-reports.component.html',
})
export class AcademicReportsComponent implements OnInit {
  private academicService = inject(AcademicService);

  activeTab: TabType = 'attendance';
  loading = false;
  error = '';

  // Data from backend
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

  // Data
  attendanceData: AttendanceRow[] = [];
  evaluationData: EvaluationRow[] = [];
  competenciesList: { id: string; description: string }[] = [];

  // KPIs attendance
  avgAttendance = 0;
  topAbsentees: string[] = [];
  totalAbsences = 0;

  // KPIs evaluation
  gradeDistribution = { AD: 0, A: 0, B: 0, C: 0 };
  studentsAtRisk = 0;

  ngOnInit() {
    this.loading = true;
    this.academicService.getAcademicYears().subscribe({
      next: (res) => {
        this.academicYears = res.data;
        this.selectedYear = this.academicYears.find(y => y.is_active)?.id || '';
        this.loading = false;
        this.loadInitialFilters();
      },
      error: () => this.loading = false
    });
  }

  loadInitialFilters() {
    this.academicService.getGradeLevels().subscribe(res => this.grades = res.data);
    this.academicService.getPeriods({ academic_year_id: this.selectedYear }).subscribe(res => this.periods = res.data);
  }

  setTab(tab: TabType) {
    this.activeTab = tab;
  }

  onGradeChange() {
    this.sections = [];
    this.selectedSection = '';
    if (this.selectedGrade) {
      this.academicService.getSections({ grade_level_id: this.selectedGrade }).subscribe(res => this.sections = res.data);
    }
  }

  onSectionChange() {
    this.courses = [];
    this.selectedCourse = '';
    if (this.selectedSection) {
      this.academicService.getCourses({ section_id: this.selectedSection }).subscribe(res => this.courses = res.data);
    }
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
    alert(`Exportación CSV de "${type}" — se habilitará al conectar el backend.`);
  }

  exportPDF(type: 'attendance' | 'evaluation') {
    alert(`Exportación PDF de "${type}" — se habilitará al conectar el backend.`);
  }

  exportSIAGIE(type: 'matricula' | 'asistencia' | 'evaluacion') {
    alert(`Exportación SIAGIE (${type}) — se habilitará al conectar el backend.`);
  }
}
