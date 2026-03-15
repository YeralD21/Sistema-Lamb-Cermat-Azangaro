import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { AcademicService, GradeLevel } from '@core/services/academic.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grades-levels',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700 relative">
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Grados y Niveles</h1>
          <p class="text-slate-500 text-sm font-medium">Gestiona los grados por nivel educativo</p>
        </div>
        <button 
          (click)="openModal()"
          class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Registrar Grado
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all hover:border-blue-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Total Grados</span>
          <span class="text-3xl font-black text-[#0F172A]">{{ grades.length }}</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all hover:border-green-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Primaria</span>
          <span class="text-3xl font-black text-green-600">{{ countLevel('primaria') }}</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all hover:border-indigo-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Secundaria</span>
          <span class="text-3xl font-black text-indigo-600">{{ countLevel('secundaria') }}</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all hover:border-orange-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Inicial</span>
          <span class="text-3xl font-black text-orange-500">{{ countLevel('inicial') }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center p-12">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
      </div>

      <!-- Levels and Grade Cards -->
      <div *ngIf="!loading" class="space-y-6">
        <div *ngFor="let levelGroup of groupedGrades" class="space-y-6">
          <h2 class="text-xl font-bold text-[#0F172A] flex items-center gap-3 border-l-[3px] border-[#0E3A8A] pl-4 uppercase tracking-tighter italic">
            {{ levelGroup.level }} <span class="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full no-italic">{{ levelGroup.grades.length }}</span>
          </h2>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div *ngFor="let grade of levelGroup.grades" class="bg-white border border-slate-100 rounded-[2.2rem] p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center relative overflow-hidden">
              
              <div class="text-center w-full space-y-5 relative z-10">
                <div class="w-20 h-20 mx-auto bg-gradient-to-br from-[#0E3A8A] to-[#1D4ED8] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span class="text-4xl font-black text-white tracking-tighter italic">{{ grade.name.split('')[0] }}</span>
                </div>
                <div>
                  <h3 class="text-sm md:text-md font-black text-[#0F172A] tracking-tighter uppercase italic break-words">{{ grade.name }}</h3>
                </div>
              </div>

              <div class="mt-8 pt-5 border-t border-slate-50 flex gap-2 w-full relative z-10">
                <button (click)="openModal(grade)" class="flex-1 py-3 bg-white text-[#0E3A8A] border-2 border-slate-100 hover:border-[#0E3A8A] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1.5 px-2">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Editar
                </button>
                <button (click)="deleteGrade(grade.id)" class="px-3 py-3 bg-red-50 text-red-600 border-2 border-transparent hover:bg-red-600 hover:text-white rounded-xl transition-all active:scale-95 flex items-center justify-center">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>

              <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-slate-50 rounded-full blur-2xl group-hover:bg-blue-50 transition-colors pointer-events-none"></div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="grades.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400">
          <svg class="w-16 h-16 mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
          </svg>
          <p class="text-sm font-semibold">No hay grados registrados</p>
          <p class="text-xs mt-1">Haz clic en "Registrar Grado" para comenzar</p>
        </div>
      </div>

      <!-- Modal Creation/Edit -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 animate-slide-up overflow-hidden border border-slate-100">
          <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 class="text-xl font-bold text-slate-800 tracking-tight">{{ isEditing ? 'Editar Grado' : 'Nuevo Grado' }}</h2>
              <p class="text-xs text-slate-400 mt-0.5">{{ isEditing ? 'Modifica los datos del grado seleccionado' : 'Completa los datos para registrar un nuevo grado' }}</p>
            </div>
            <button (click)="closeModal()" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form [formGroup]="gradeForm" (ngSubmit)="saveGrade()" class="p-8 space-y-5">
            
            <!-- Nivel -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nivel Educativo</label>
              <select
                formControlName="level"
                class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                [ngClass]="isFieldInvalid('level') ? 'border-red-400 bg-red-50' : 'border-slate-200'">
                <option value="inicial">Inicial</option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
              </select>
            </div>

            <!-- Nombre -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nombre del Grado</label>
              <input
                type="text"
                formControlName="name"
                placeholder="Ej: 1ro Secundaria"
                class="w-full bg-slate-50 border text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-slate-300"
                [ngClass]="isFieldInvalid('name') ? 'border-red-400 bg-red-50' : 'border-slate-200'">
              <p *ngIf="isFieldInvalid('name')" class="text-[11px] text-red-500 font-semibold">
                El nombre del grado es requerido.
              </p>
            </div>

            <!-- Orden numérico -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Orden Numérico</label>
              <input
                type="number"
                formControlName="grade"
                placeholder="Ej: 1"
                class="w-full bg-slate-50 border text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-slate-300"
                [ngClass]="isFieldInvalid('grade') ? 'border-red-400 bg-red-50' : 'border-slate-200'">
              <p *ngIf="isFieldInvalid('grade')" class="text-[11px] text-red-500 font-semibold">
                El orden numérico debe ser mayor a 0.
              </p>

              <!-- ✅ Mensaje de error del servidor para campo 'grade' -->
              <p *ngIf="gradeServerError" class="text-[11px] text-red-500 font-semibold flex items-center gap-1 mt-1">
                <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {{ gradeServerError }}
              </p>
            </div>

            <!-- Botones -->
            <div class="pt-2 flex gap-3">
              <button
                type="button"
                (click)="closeModal()"
                class="flex-1 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95">
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="gradeForm.invalid || isSubmitting"
                class="flex-1 px-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <span *ngIf="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ isEditing ? 'Guardar Cambios' : 'Registrar Grado' }}
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class GradesLevelsComponent implements OnInit {
  grades: any[] = [];
  groupedGrades: { level: string; grades: any[] }[] = [];

  loading = false;
  showModal = false;
  isEditing = false;
  isSubmitting = false;
  currentEditId: string | null = null;

  // ✅ Almacena el error del campo 'grade' que viene del servidor
  gradeServerError: string | null = null;

  gradeForm: FormGroup;
  orderMap: Record<string, number> = { inicial: 1, primaria: 2, secundaria: 3 };

  constructor(
    private fb: FormBuilder,
    private academicService: AcademicService
  ) {
    this.gradeForm = this.fb.group({
      level: ['primaria', Validators.required],
      name: ['', Validators.required],
      grade: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  // ─── HELPERS ──────────────────────────────────────────────────────────────

  countLevel(lvl: string): number {
    return this.grades.filter(g => g.level === lvl).length;
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.gradeForm.get(field);
    return !!(ctrl?.invalid && (ctrl.dirty || ctrl.touched));
  }

  /**
   * Traduce los errores de validación de Laravel al español.
   *
   * Si el error viene en el campo 'grade' (orden numérico), lo muestra
   * directamente debajo del input en lugar de un Swal genérico.
   * Para cualquier otro error de validación, muestra un Swal de error.
   *
   * Retorna true  → el error ya fue manejado inline (no mostrar Swal)
   * Retorna false → mostrar Swal con el mensaje genérico
   */
  private handleServerErrors(err: any): boolean {
    const errors = err?.error?.errors;

    if (!errors) return false;

    if (errors['grade']?.length) {
      const raw: string = errors['grade'][0].toLowerCase();

      this.gradeServerError = raw.includes('taken') || raw.includes('already') || raw.includes('único') || raw.includes('tomado')
        ? 'Ese orden numérico ya existe en este nivel. Usa uno diferente.'
        : errors['grade'][0]; // Si el backend ya manda mensaje en español, úsalo directo

      // Marca el campo con error visual
      this.gradeForm.get('grade')?.setErrors({ serverError: true });
      return true; // Ya fue manejado inline
    }

    // Error en campo 'name'
    if (errors['name']?.length) {
      this.gradeForm.get('name')?.setErrors({ serverError: true });
      return false; // Deja que el Swal muestre el mensaje
    }

    return false;
  }

  private resolveErrorMessage(err: any): string {
    const errors = err?.error?.errors;
    if (!errors) return err?.error?.message || 'Hubo un error inesperado. Intente nuevamente.';

    const errorMap: Record<string, string> = {
      grade: 'Ese orden numérico ya existe en este nivel.',
      name: 'El nombre del grado ya existe.',
      level: 'El nivel educativo no es válido.',
    };

    for (const field of Object.keys(errorMap)) {
      if (errors[field]?.length) return errorMap[field];
    }

    return (Object.values(errors).flat()[0] as string) || 'Hubo un error inesperado.';
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  loadData(): void {
    this.loading = true;
    this.academicService.getGradeLevels().subscribe({
      next: (res) => {
        this.grades = res.data ?? res;
        this.groupGrades();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  groupGrades(): void {
    const groups: Record<string, any[]> = {};

    this.grades.forEach(g => {
      if (!groups[g.level]) groups[g.level] = [];
      groups[g.level].push(g);
    });

    this.groupedGrades = Object.keys(groups)
      .map(key => ({
        level: key,
        grades: groups[key].sort((a, b) => a.grade - b.grade),
      }))
      .sort((a, b) => (this.orderMap[a.level] ?? 99) - (this.orderMap[b.level] ?? 99));
  }

  openModal(grade?: any): void {
    this.isEditing = !!grade;
    this.currentEditId = grade?.id ?? null;
    this.gradeServerError = null;

    if (grade) {
      this.gradeForm.patchValue({
        level: grade.level,
        name: grade.name,
        grade: grade.grade,
      });
    } else {
      this.gradeForm.reset({ level: 'primaria', name: '', grade: 1 });
    }

    this.gradeForm.markAsPristine();
    this.gradeForm.markAsUntouched();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditing = false;
    this.currentEditId = null;
    this.isSubmitting = false;
    this.gradeServerError = null;
  }

  saveGrade(): void {
    if (this.gradeForm.invalid) {
      this.gradeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.gradeServerError = null;
    const data = this.gradeForm.value;
    const isUpdate = this.isEditing && !!this.currentEditId;

    const req$ = isUpdate
      ? this.academicService.updateGradeLevel(this.currentEditId!, data)
      : this.academicService.createGradeLevel(data);

    req$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal();
        this.loadData();

        Swal.fire({
          icon: 'success',
          title: isUpdate ? 'Grado actualizado' : 'Grado registrado',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false,
        });
      },

      error: (err) => {
        this.isSubmitting = false;


        const handledInline = this.handleServerErrors(err);

        if (!handledInline) {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo guardar',
            text: this.resolveErrorMessage(err),
          });
        }
      },
    });
  }

  deleteGrade(id: string): void {
    Swal.fire({
      title: '¿Eliminar grado?',
      text: 'Se podrían eliminar secciones dependientes.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.academicService.deleteGradeLevel(id).subscribe({
        next: () => {
          this.grades = this.grades.filter(g => g.id !== id);
          this.groupGrades();

          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false,
          });
        },
        error: (err) => {
          Swal.fire('Error', err.error?.message || 'No se pudo eliminar, verifica dependencias', 'error');
        }
      });
    });
  }
}