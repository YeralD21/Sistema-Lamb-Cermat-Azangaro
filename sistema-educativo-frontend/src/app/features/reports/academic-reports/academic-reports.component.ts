import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './academic-reports.component.html',
})
export class AcademicReportsComponent implements OnInit {
  activeTab: TabType = 'attendance';
  loading = false;
  error = '';

  // Filters (placeholder values for now — will connect to backend)
  academicYears = [{ id: '2025', year: '2025' }];
  periods = [
    { id: 'b1', name: 'Bimestre 1' },
    { id: 'b2', name: 'Bimestre 2' },
    { id: 'b3', name: 'Bimestre 3' },
    { id: 'b4', name: 'Bimestre 4' },
  ];
  grades = [
    { id: '1p', name: '1ro Primaria' },
    { id: '2p', name: '2do Primaria' },
    { id: '3p', name: '3ro Primaria' },
    { id: '1s', name: '1ro Secundaria' },
    { id: '2s', name: '2do Secundaria' },
    { id: '3s', name: '3ro Secundaria' },
  ];
  sections: { id: string; name: string }[] = [];
  courses: { id: string; name: string }[] = [];

  selectedYear = '2025';
  selectedPeriod = 'b1';
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

  ngOnInit() {}

  setTab(tab: TabType) {
    this.activeTab = tab;
  }

  onGradeChange() {
    this.sections = [];
    this.selectedSection = '';
    if (this.selectedGrade) {
      // Placeholder: sections per grade
      this.sections = [
        { id: `${this.selectedGrade}-a`, name: 'A' },
        { id: `${this.selectedGrade}-b`, name: 'B' },
      ];
    }
  }

  onSectionChange() {
    this.courses = [];
    this.selectedCourse = '';
    if (this.selectedSection) {
      this.courses = [
        { id: 'c1', name: 'Matemática' },
        { id: 'c2', name: 'Comunicación' },
        { id: 'c3', name: 'Ciencias' },
        { id: 'c4', name: 'Historia' },
      ];
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
    // placeholder
    alert(`Exportación CSV de "${type}" — se habilitará al conectar el backend.`);
  }

  exportPDF(type: 'attendance' | 'evaluation') {
    alert(`Exportación PDF de "${type}" — se habilitará al conectar el backend.`);
  }

  exportSIAGIE(type: 'matricula' | 'asistencia' | 'evaluacion') {
    alert(`Exportación SIAGIE (${type}) — se habilitará al conectar el backend.`);
  }
}
