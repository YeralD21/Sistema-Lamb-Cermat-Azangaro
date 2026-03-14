import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { TaskService, Assignment } from '@core/services/task.service';
import { AcademicService } from '@core/services/academic.service';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8">

      <app-back-button></app-back-button>

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Gestión de Tareas</h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Crea y gestiona tareas para tus cursos</p>
        </div>
        <button (click)="openCreateModal()"
                class="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva Tarea
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Curso</label>
          <select [(ngModel)]="selectedCourseId" (ngModelChange)="onCourseChange()"
                  class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option value="">Todos los cursos</option>
            <option *ngFor="let c of courses" [value]="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sección</label>
          <select [(ngModel)]="selectedSectionId" (ngModelChange)="loadAssignments()"
                  class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium">
            <option value="">Todas las secciones</option>
            <option *ngFor="let s of sections" [value]="s.id">Sección {{ s.section_letter }}</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading()" class="flex justify-center py-16">
        <div class="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Error -->
      <div *ngIf="error()" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{{ error() }}</div>

      <!-- Empty State -->
      <div *ngIf="!loading() && assignments().length === 0" class="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg class="w-8 h-8 text-blue-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <h3 class="text-slate-800 font-bold text-lg">No hay tareas registradas</h3>
        <p class="text-slate-400 text-sm mt-1.5 font-medium">Crea tu primera tarea con el botón "Nueva Tarea".</p>
      </div>

      <!-- Task Cards -->
      <div *ngIf="!loading() && assignments().length > 0" class="space-y-4">
        <div *ngFor="let task of assignments()"
             class="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm border-l-4 border-l-blue-900 hover:shadow-md transition-all">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-bold text-slate-900">{{ task.title }}</h3>
                <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight"
                      [class]="isOverdue(task.due_date) ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'">
                  {{ isOverdue(task.due_date) ? 'Vencida' : 'Activa' }}
                </span>
              </div>
              <p *ngIf="task.description" class="text-sm text-slate-500 font-medium">{{ task.description }}</p>
              <div class="flex flex-wrap items-center gap-5 pt-1">
                <div class="flex items-center gap-1.5 text-slate-400">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span class="text-xs font-semibold">Límite: {{ task.due_date | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <div *ngIf="task.max_score" class="flex items-center gap-1.5 text-slate-400">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span class="text-xs font-semibold">Puntaje máx: {{ task.max_score }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <button (click)="openEditModal(task)"
                      class="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-all active:scale-95">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                Editar
              </button>
              <button (click)="deleteTask(task)"
                      class="p-2.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════ MODAL ═══════════ -->
      <div *ngIf="showModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <div class="p-8 pb-0 flex justify-between items-center">
            <div>
              <h2 class="text-xl font-bold text-slate-900">{{ editingTask ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
              <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Completa los campos requeridos</p>
            </div>
            <button (click)="closeModal()" class="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <svg class="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <form (submit)="saveTask($event)" class="p-8 space-y-5">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Título *</label>
              <input [(ngModel)]="form.title" name="title" required placeholder="Ej: Resolución de ejercicios pág. 45-50"
                     class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descripción</label>
              <textarea [(ngModel)]="form.description" name="description" rows="3" placeholder="Descripción breve de la tarea..."
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Curso *</label>
                <select [(ngModel)]="form.course_id" name="course_id" required
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                  <option value="">Seleccionar...</option>
                  <option *ngFor="let c of courses" [value]="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sección *</label>
                <select [(ngModel)]="form.section_id" name="section_id" required
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                  <option value="">Seleccionar...</option>
                  <option *ngFor="let s of sections" [value]="s.id">Sección {{ s.section_letter }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fecha límite *</label>
                <input [(ngModel)]="form.due_date" name="due_date" type="datetime-local" required
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
              </div>
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Puntaje máx</label>
                <input [(ngModel)]="form.max_score" name="max_score" type="number" min="0" max="20" placeholder="20"
                       class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
              </div>
            </div>

            <div class="flex gap-4 pt-2">
              <button type="button" (click)="closeModal()"
                      class="flex-1 px-6 py-3 border-2 border-slate-100 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-widest hover:border-slate-200 transition-all">
                Cancelar
              </button>
              <button type="submit" [disabled]="submitting()"
                      class="flex-[2] px-6 py-3 bg-gradient-to-r from-blue-900 to-red-600 text-white text-xs font-bold rounded-xl uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-60">
                {{ submitting() ? 'Guardando...' : (editingTask ? 'Actualizar' : 'Crear Tarea') }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class TaskManagementComponent implements OnInit {
  private taskService = inject(TaskService);
  private academicService = inject(AcademicService);

  assignments = signal<Assignment[]>([]);
  loading = signal(false);
  error = signal('');
  showModal = signal(false);
  submitting = signal(false);

  courses: any[] = [];
  sections: any[] = [];
  selectedCourseId = '';
  selectedSectionId = '';
  editingTask: Assignment | null = null;

  form = {
    title: '',
    description: '',
    course_id: '',
    section_id: '',
    due_date: '',
    max_score: null as number | null
  };

  ngOnInit() {
    this.academicService.getCourses().subscribe({
      next: (res) => this.courses = res.data || res,
      error: () => { }
    });
    this.academicService.getSections().subscribe({
      next: (res) => this.sections = res.data || res,
      error: () => { }
    });
    this.loadAssignments();
  }

  onCourseChange() {
    this.selectedSectionId = '';
    this.loadAssignments();
  }

  loadAssignments() {
    this.loading.set(true);
    this.error.set('');
    const params: any = {};
    if (this.selectedCourseId) params.course_id = this.selectedCourseId;
    if (this.selectedSectionId) params.section_id = this.selectedSectionId;

    this.taskService.getAssignments(params).subscribe({
      next: (res) => {
        this.assignments.set(res.data || res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('No se pudieron cargar las tareas. Verifica la conexión.');
        this.loading.set(false);
      }
    });
  }

  openCreateModal() {
    this.editingTask = null;
    this.form = { title: '', description: '', course_id: this.selectedCourseId, section_id: this.selectedSectionId, due_date: '', max_score: null };
    this.showModal.set(true);
  }

  openEditModal(task: Assignment) {
    this.editingTask = task;
    // Format due_date to datetime-local format
    const dt = task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '';
    this.form = {
      title: task.title,
      description: task.description || '',
      course_id: task.course_id,
      section_id: task.section_id,
      due_date: dt,
      max_score: task.max_score || null
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingTask = null;
  }

  saveTask(event: Event) {
    event.preventDefault();
    if (this.submitting()) return;
    this.submitting.set(true);

    let payload: any;

    if (this.editingTask) {
      // For UPDATE: only send fields allowed by UpdateAssignmentRequest
      payload = {
        title: this.form.title,
        description: this.form.description || null,
        course_id: this.form.course_id,
        section_id: this.form.section_id,
        due_date: this.form.due_date || null,
      };
    } else {
      // For CREATE: include all fields
      payload = {
        title: this.form.title,
        description: this.form.description || null,
        course_id: this.form.course_id,
        section_id: this.form.section_id,
        due_date: this.form.due_date || null,
      };
      if (this.form.max_score) payload.max_score = this.form.max_score;
    }

    const request = this.editingTask
      ? this.taskService.updateAssignment(this.editingTask.id, payload)
      : this.taskService.createAssignment(payload);

    request.subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeModal();
        this.loadAssignments();
      },
      error: (err) => {
        this.submitting.set(false);
        alert('Error: ' + (err.error?.message || 'No se pudo guardar la tarea'));
      }
    });
  }

  deleteTask(task: Assignment) {
    if (!confirm(`¿Eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`)) return;
    this.taskService.deleteAssignment(task.id).subscribe({
      next: () => this.loadAssignments(),
      error: () => alert('Error al eliminar la tarea.')
    });
  }

  isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date();
  }
}
