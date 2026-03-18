import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createIcons, icons } from 'lucide';
import { AcademicService, Period } from '@core/services/academic.service';
import { AcademicContextStudent, AuthService } from '@core/services/auth.service';
import { EvaluationSummary, EvaluationService } from '@core/services/evaluation.service';
import { ReportService } from '@core/services/report.service';

interface GuardianEvaluationRow {
  period: string;
  subject: string;
  competence: string;
  grade: string;
  comments?: string;
}

@Component({
  selector: 'app-apoderado-evaluation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apoderado-evaluation.component.html',
  styleUrls: ['./apoderado-evaluation.component.css']
})
export class ApoderadoEvaluationComponent implements OnInit, AfterViewInit {
  private authService = inject(AuthService);
  private academicService = inject(AcademicService);
  private evaluationService = inject(EvaluationService);
  private reportService = inject(ReportService);

  evaluations: GuardianEvaluationRow[] = [];
  students: AcademicContextStudent[] = [];
  periods: Period[] = [];
  selectedStudentId = '';
  selectedPeriod = 'all';
  activeAcademicYearId = '';
  summary: EvaluationSummary | null = null;
  error = '';
  loading = false;
  isDownloading = false;

  ngOnInit(): void {
    this.loadAcademicContext();
  }

  ngAfterViewInit(): void {
    this.refreshIcons();
  }

  loadEvaluationData() {
    if (!this.selectedStudentId) {
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.selectedPeriod === 'all') {
      this.evaluationService.getEvaluationSummary(this.activeAcademicYearId, this.selectedStudentId).subscribe({
        next: (summary) => {
          this.summary = summary;
          this.evaluations = this.mapSummaryRows(summary);
          this.loading = false;
          this.refreshIcons();
        },
        error: () => {
          this.error = 'No se pudo cargar el cierre anual del estudiante.';
          this.summary = null;
          this.evaluations = [];
          this.loading = false;
          this.refreshIcons();
        }
      });

      return;
    }

    this.reportService.getReportCard(this.selectedStudentId, this.selectedPeriod).subscribe({
      next: (response) => {
        this.summary = null;
        this.evaluations = this.mapReportRows(response);
        this.loading = false;
        this.refreshIcons();
      },
      error: () => {
        this.error = 'No se pudo cargar el reporte del periodo seleccionado.';
        this.evaluations = [];
        this.loading = false;
        this.refreshIcons();
      }
    });
  }

  downloadBoletin() {
    this.isDownloading = true;
    this.refreshIcons();

    setTimeout(() => {
      this.isDownloading = false;
      alert('La descarga PDF queda lista para el siguiente paso de integración.');
      this.refreshIcons();
    }, 1000);
  }

  getSelectedStudentName(): string {
    return this.students.find((student) => student.id === this.selectedStudentId)?.full_name || 'Estudiante';
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

  private loadAcademicContext() {
    this.loading = true;

    this.authService.getAcademicContext().subscribe({
      next: (context) => {
        this.students = context.students || [];
        this.selectedStudentId = this.students[0]?.id || '';
        this.activeAcademicYearId = context.active_academic_year?.id || '';

        if (!this.students.length) {
          this.error = 'Tu usuario no tiene estudiantes vinculados.';
          this.loading = false;
          this.refreshIcons();
          return;
        }

        if (!this.activeAcademicYearId) {
          this.error = 'No existe un año académico activo configurado.';
          this.loading = false;
          this.refreshIcons();
          return;
        }

        this.academicService.getPeriods({ academic_year_id: this.activeAcademicYearId }).subscribe({
          next: (response) => {
            this.periods = response.data || response || [];
            this.loadEvaluationData();
          },
          error: () => {
            this.error = 'No se pudieron cargar los periodos académicos.';
            this.loading = false;
            this.refreshIcons();
          }
        });
      },
      error: () => {
        this.error = 'No se pudo obtener el contexto académico del apoderado.';
        this.loading = false;
        this.refreshIcons();
      }
    });
  }

  private mapSummaryRows(summary: EvaluationSummary): GuardianEvaluationRow[] {
    return summary.final_results.map((result) => ({
      period: 'Cierre anual',
      subject: result.course?.name || 'Curso',
      competence: result.competency?.name || result.competency?.description || 'Competencia',
      grade: result.final_level || '-',
      comments: result.evidence_note || '',
    }));
  }

  private mapReportRows(response: any): GuardianEvaluationRow[] {
    const report = response?.report || [];

    return report.flatMap((course: any) => {
      const competencies = Array.isArray(course.competencies) ? course.competencies : [];

      return competencies.map((item: any) => ({
        period: course.period_name || 'Periodo',
        subject: course.course_name || 'Curso',
        competence: item.competency_name || 'Competencia',
        grade: item.grade || '-',
        comments: item.comments || '',
      }));
    });
  }

  private refreshIcons() {
    setTimeout(() => createIcons({ icons }), 0);
  }
}
