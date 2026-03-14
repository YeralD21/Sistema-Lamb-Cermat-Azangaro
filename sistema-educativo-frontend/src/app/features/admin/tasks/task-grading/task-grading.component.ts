import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { TaskService, TaskSubmission } from '@core/services/task.service';
import { AcademicService } from '@core/services/academic.service';

@Component({
  selector: 'app-task-grading',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8">

      <app-back-button></app-back-button>

      <!-- Header -->
      <div>
        <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Calificar Entregas</h1>
        <p class="text-slate-500 text-sm mt-1 font-medium">Revisa y califica los trabajos enviados por los estudiantes</p>
      </div>

      <!-- Filters -->
      <div class="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Curso</label>
          <select [(ngModel)]="selectedCourseId" (ngModelChange)="onCourseChange()"
                  class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option value="">Todos los cursos</option>
            <option *ngFor="let c of courses" [value]="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tarea</label>
          <select [(ngModel)]="selectedAssignmentId" (ngModelChange)="loadSubmissions()"
                  class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option value="">Todas las tareas</option>
            <option *ngFor="let a of assignments" [value]="a.id">{{ a.title }}</option>
          </select>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</label>
          <select [(ngModel)]="selectedStatus" (ngModelChange)="loadSubmissions()"
                  class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option value="">Todos los estados</option>
            <option value="submitted">Entregado</option>
            <option value="graded">Calificado</option>
          </select>
        </div>
      </div>

      <!-- Stats KPI Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm border-b-4 border-b-blue-900">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Entregas</p>
          <h3 class="text-3xl font-black text-slate-900 tracking-tighter">{{ submissions().length }}</h3>
        </div>
        <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm border-b-4 border-b-green-500">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Entregadas</p>
          <h3 class="text-3xl font-black text-slate-900 tracking-tighter">{{ submittedCount() }}</h3>
        </div>
        <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm border-b-4 border-b-amber-500">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Calificadas</p>
          <h3 class="text-3xl font-black text-slate-900 tracking-tighter">{{ gradedCount() }}</h3>
        </div>
        <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm border-b-4 border-b-red-500">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sin calificar</p>
          <h3 class="text-3xl font-black text-slate-900 tracking-tighter">{{ submittedCount() - gradedCount() }}</h3>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading()" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Submissions Table -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-800 tracking-tight">Lista de Entregas</h2>
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ submissions().length }} registros</span>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading() && submissions().length === 0" class="py-20 text-center">
          <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg class="w-10 h-10 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          </div>
          <h3 class="text-slate-700 font-semibold text-lg">No hay entregas disponibles</h3>
          <p class="text-slate-400 text-sm mt-1.5 font-medium max-w-xs mx-auto">Selecciona un curso o tarea específica para ver las entregas de los estudiantes.</p>
        </div>

        <!-- Table -->
        <div *ngIf="!loading() && submissions().length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                <th class="text-left py-4 px-6">Estudiante</th>
                <th class="text-left py-4 px-6">Tarea</th>
                <th class="text-center py-4 px-6">Fecha Entrega</th>
                <th class="text-center py-4 px-6">Estado</th>
                <th class="text-center py-4 px-6">Calificación</th>
                <th class="text-right py-4 px-6">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let sub of submissions()" class="hover:bg-slate-50/50 transition-colors">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-black text-sm uppercase">
                      {{ getInitials(sub.student?.first_name, sub.student?.last_name) }}
                    </div>
                    <div>
                      <p class="text-sm font-bold text-slate-800">{{ sub.student?.first_name }} {{ sub.student?.last_name }}</p>
                      <p class="text-[10px] text-slate-400 font-bold">{{ sub.student?.student_code || 'N/D' }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 text-sm font-medium text-slate-600">{{ sub.assignment?.title || '—' }}</td>
                <td class="py-4 px-6 text-center text-sm text-slate-500">{{ sub.submission_date | date:'dd/MM/yyyy HH:mm' }}</td>
                <td class="py-4 px-6 text-center">
                  <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight"
                        [class]="sub.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'">
                    {{ sub.status === 'graded' ? 'Calificado' : 'Entregado' }}
                  </span>
                </td>
                <td class="py-4 px-6 text-center">
                  <span *ngIf="sub.status === 'graded'" class="text-sm font-black text-blue-900">
                    {{ sub.grade || '—' }}{{ sub.grade_letter ? ' / ' + sub.grade_letter : '' }}
                  </span>
                  <span *ngIf="sub.status !== 'graded'" class="text-slate-300 font-bold text-sm">—</span>
                </td>
                <td class="py-4 px-6 text-right">
                  <button (click)="openGradeModal(sub)"
                          class="px-4 py-2 bg-blue-900 text-white text-[11px] font-bold rounded-lg hover:bg-blue-800 transition-all active:scale-95 shadow-sm">
                    {{ sub.status === 'graded' ? 'Actualizar' : 'Calificar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ═══════ GRADE MODAL ═══════ -->
      <div *ngIf="showGradeModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100">
          <div class="p-8 pb-0 flex justify-between items-center">
            <div>
              <h2 class="text-xl font-bold text-slate-900">Calificar Entrega</h2>
              <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                {{ gradingSubmission?.student?.first_name }} {{ gradingSubmission?.student?.last_name }}
              </p>
            </div>
            <button (click)="closeGradeModal()" class="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <svg class="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="p-8 space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nota (0–20)</label>
                <input [(ngModel)]="gradeForm.grade" type="number" min="0" max="20" step="0.5" placeholder="0"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calificación</label>
                <select [(ngModel)]="gradeForm.grade_letter"
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                  <option value="">Sin letra</option>
                  <option value="AD">AD — Muy bueno</option>
                  <option value="A">A — Bueno</option>
                  <option value="B">B — En proceso</option>
                  <option value="C">C — En inicio</option>
                </select>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Retroalimentación</label>
              <textarea [(ngModel)]="gradeForm.feedback" rows="3" placeholder="Escribe un comentario para el estudiante..."
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"></textarea>
            </div>

            <div class="flex gap-4 pt-2">
              <button (click)="closeGradeModal()"
                      class="flex-1 px-6 py-3 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-widest hover:border-slate-200 transition-all">
                Cancelar
              </button>
              <button (click)="submitGrade()" [disabled]="grading()"
                      class="flex-[2] px-6 py-3 bg-gradient-to-r from-blue-900 to-red-600 text-white text-xs font-bold rounded-xl uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-60">
                {{ grading() ? 'Guardando...' : 'Guardar Calificación' }}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class TaskGradingComponent implements OnInit {
  private taskService = inject(TaskService);
  private academicService = inject(AcademicService);

  submissions = signal<TaskSubmission[]>([]);
  loading = signal(false);
  showGradeModal = signal(false);
  grading = signal(false);

  courses: any[] = [];
  assignments: any[] = [];
  selectedCourseId = '';
  selectedAssignmentId = '';
  selectedStatus = '';
  gradingSubmission: TaskSubmission | null = null;

  gradeForm = { grade: null as number | null, grade_letter: '', feedback: '' };

  submittedCount() { return this.submissions().filter(s => s.status === 'submitted' || s.status === 'graded').length; }
  gradedCount() { return this.submissions().filter(s => s.status === 'graded').length; }

  ngOnInit() {
    this.academicService.getCourses().subscribe({
      next: (res) => this.courses = res.data || res,
      error: () => {}
    });
    this.loadSubmissions();
  }

  onCourseChange() {
    this.selectedAssignmentId = '';
    this.assignments = [];
    if (this.selectedCourseId) {
      this.taskService.getAssignments({ course_id: this.selectedCourseId }).subscribe({
        next: (res) => this.assignments = res.data || res,
        error: () => {}
      });
    }
    this.loadSubmissions();
  }

  loadSubmissions() {
    this.loading.set(true);
    const params: any = {};
    if (this.selectedAssignmentId) params.assignment_id = this.selectedAssignmentId;
    if (this.selectedStatus) params.status = this.selectedStatus;

    this.taskService.getSubmissions(params).subscribe({
      next: (res) => {
        this.submissions.set(res.data || res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openGradeModal(submission: TaskSubmission) {
    this.gradingSubmission = submission;
    this.gradeForm = {
      grade: submission.grade || null,
      grade_letter: submission.grade_letter || '',
      feedback: submission.feedback || ''
    };
    this.showGradeModal.set(true);
  }

  closeGradeModal() {
    this.showGradeModal.set(false);
    this.gradingSubmission = null;
  }

  submitGrade() {
    if (!this.gradingSubmission || this.grading()) return;
    this.grading.set(true);

    const payload: any = { status: 'graded' };
    if (this.gradeForm.grade !== null) payload.grade = this.gradeForm.grade;
    if (this.gradeForm.grade_letter) payload.grade_letter = this.gradeForm.grade_letter;
    if (this.gradeForm.feedback) payload.feedback = this.gradeForm.feedback;

    this.taskService.gradeSubmission(this.gradingSubmission.id, payload).subscribe({
      next: () => {
        this.grading.set(false);
        this.closeGradeModal();
        this.loadSubmissions();
      },
      error: (err) => {
        this.grading.set(false);
        alert('Error al calificar: ' + (err.error?.message || 'Inténtalo nuevamente'));
      }
    });
  }

  getInitials(firstName?: string, lastName?: string): string {
    const f = firstName?.charAt(0) || '';
    const l = lastName?.charAt(0) || '';
    return (f + l).toUpperCase() || 'E';
  }
}
