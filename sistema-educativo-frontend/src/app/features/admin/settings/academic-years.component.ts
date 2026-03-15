import { AcademicService } from '@core/services/academic.service';
import { AcademicYear } from '@core/models/AcademicYear';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-academic-years',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700 relative">
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Años Académicos</h1>
          <p class="text-slate-500 text-sm font-medium">Gestiona los años lectivos de la institución</p>
        </div>
        <button
          (click)="openModal()"
          class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Registrar Año
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all hover:border-blue-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Total Años</span>
          <span class="text-3xl font-black text-[#0F172A]">{{ academicYears.length }}</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all hover:border-green-100 border-l-4 border-l-green-500">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Año Activo</span>
          <span class="text-3xl font-black text-green-600">{{ activeYear ? activeYear.year : 'Ninguno' }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center p-12">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
      </div>

      <!-- Academic Years Cards -->
      <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let year of academicYears" class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden">

          <div class="absolute -right-10 -top-10 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-blue-50 transition-colors"></div>

          <!-- Card Header -->
          <div class="flex items-start justify-between relative z-10 w-full">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-gradient-to-br from-[#0E3A8A] to-[#1D4ED8] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div class="space-y-1">
                <h3 class="text-3xl font-black text-[#0F172A] tracking-tighter">{{ year.year }}</h3>
                <div class="text-xs text-slate-500 font-semibold">{{ year.start_date | date:'dd/MM/yyyy' }} - {{ year.end_date | date:'dd/MM/yyyy' }}</div>
                <span *ngIf="year.is_active" class="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black bg-green-50 text-green-600 border border-green-100 uppercase tracking-widest">Activo</span>
                <span *ngIf="!year.is_active" class="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-widest">Inactivo</span>
              </div>
            </div>

            <div class="flex-shrink-0 flex gap-2 pt-1 border border-slate-100 rounded-xl p-1 bg-slate-50/50">
              <button (click)="openModal(year)" class="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-white shadow-sm">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button (click)="deleteYear(year.id)" class="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-white shadow-sm">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Creation/Edit -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 animate-slide-up overflow-hidden border border-slate-100">
          <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 class="text-xl font-bold text-slate-800 tracking-tight">{{ isEditing ? 'Editar Año Académico' : 'Nuevo Año Académico' }}</h2>
            <button (click)="closeModal()" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form [formGroup]="yearForm" (ngSubmit)="saveYear()" class="p-8 space-y-6">

            <!-- Año -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Año (ej. 2024)
              </label>
              <input
                type="number"
                formControlName="year"
                class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-slate-300"
                [class.border-red-400]="isFieldInvalid('year')"
                placeholder="Ej: 2024">
              <p *ngIf="isFieldInvalid('year')" class="text-[11px] text-red-500 font-semibold mt-1">
                Ingrese un año válido (1900–2100).
              </p>
            </div>

            <!-- Fecha inicio -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Fecha inicio
              </label>
              <input
                type="date"
                formControlName="start_date"
                class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-slate-300"
                [class.border-red-400]="isFieldInvalid('start_date')">
              <p *ngIf="isFieldInvalid('start_date')" class="text-[11px] text-red-500 font-semibold mt-1">
                La fecha de inicio es requerida.
              </p>
            </div>

            <!-- Fecha fin -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Fecha fin
              </label>
              <input
                type="date"
                formControlName="end_date"
                class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-slate-300"
                [class.border-red-400]="isFieldInvalid('end_date')">
              <p *ngIf="isFieldInvalid('end_date')" class="text-[11px] text-red-500 font-semibold mt-1">
                La fecha de fin es requerida.
              </p>
            </div>

            <!-- Estado activo -->
            <!--
              BUG FIX: el patrón <label><input sr-only><div peer></div></label>
              rompe la relación CSS "peer" porque Tailwind peer requiere
              hermanos directos bajo el mismo padre, no anidados dentro de label.
              Solución: toggle manual con (click) que lee y escribe el control
              directamente, sin depender del peer de Tailwind.
            -->
            <div class="flex items-center gap-3 pt-2">
              <button
                type="button"
                (click)="toggleActive()"
                class="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                [class.bg-green-500]="yearForm.get('is_active')?.value"
                [class.bg-slate-200]="!yearForm.get('is_active')?.value"
                [attr.aria-checked]="yearForm.get('is_active')?.value"
                role="switch">
                <span
                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                  [class.translate-x-5]="yearForm.get('is_active')?.value"
                  [class.translate-x-0]="!yearForm.get('is_active')?.value">
                </span>
              </button>
              <span class="text-sm font-bold text-slate-700">Estado Activo</span>
            </div>

            <!-- Botones -->
            <div class="pt-6 flex gap-3">
              <button
                type="button"
                (click)="closeModal()"
                class="flex-1 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95">
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="yearForm.invalid || isSubmitting"
                class="flex-1 px-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2">
                <span *ngIf="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ isEditing ? 'Guardar Cambios' : 'Crear Año' }}
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
export class AcademicYearsComponent implements OnInit {
  academicYears: AcademicYear[] = [];
  loading = false;
  showModal = false;
  isEditing = false;
  isSubmitting = false;
  currentEditId: string | null = null;
  yearForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private academicService: AcademicService
  ) {
    this.yearForm = this.fb.group({
      // BUG FIX: el valor inicial es null (no '') para que Validators.min/max
      // trabajen sobre número, no sobre string. Angular convierte type="number"
      // a number solo cuando el valor proviene del usuario; patchValue con un
      // número ya evita la comparación string vs number que causaba el error.
      year: [null, [Validators.required, Validators.min(1900), Validators.max(2100)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      is_active: [false],
    });
  }

  get activeYear(): AcademicYear | undefined {
    return this.academicYears.find(y => y.is_active);
  }

  ngOnInit(): void {
    this.loadYears();
  }

  // ─── HELPERS ────────────────────────────────────────────────────────────────

  /**
   * Convierte cualquier formato de fecha del backend a "YYYY-MM-DD",
   * que es el único formato que acepta <input type="date">.
   * Ejemplos que maneja:
   *   "2024-03-15"              → "2024-03-15"  (ya correcto)
   *   "2024-03-15T00:00:00Z"   → "2024-03-15"  (ISO con hora)
   *   "15/03/2024"             → "2024-03-15"  (formato d/m/Y de Laravel)
   */
  private toInputDate(value: string | null | undefined): string {
    if (!value) return '';

    // Si ya viene en formato YYYY-MM-DD, devolverlo directo
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    // Si viene con hora (ISO 8601): "2024-03-15T00:00:00..."
    if (value.includes('T')) return value.split('T')[0];

    // Si viene en formato DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [day, month, year] = value.split('/');
      return `${year}-${month}-${day}`;
    }

    // Último recurso: dejar que Date lo parsee
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }

    return '';
  }

  /** Devuelve true si el campo fue tocado y tiene errores (para resaltar en rojo). */
  isFieldInvalid(field: string): boolean {
    const control = this.yearForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * BUG FIX: invierte el valor booleano de is_active en el FormControl.
   * Reemplaza el patrón <input sr-only peer> que rompía en Tailwind
   * standalone porque CSS peer exige hermanos directos, no elementos anidados.
   */
  toggleActive(): void {
    const ctrl = this.yearForm.get('is_active')!;
    ctrl.setValue(!ctrl.value);
    ctrl.markAsDirty();
  }

  /** Resuelve un mensaje amigable en español desde el error HTTP de Laravel. */
  private resolveErrorMessage(err: any): string {
    const errors = err?.error?.errors;

    if (!errors) {
      return err?.error?.message || 'Hubo un error inesperado. Intente nuevamente.';
    }

    const errorMap: Record<string, string> = {
      year: 'Ese año académico ya existe.',
      start_date: 'Debe ingresar la fecha de inicio.',
      end_date: 'Debe ingresar la fecha de fin.',
      dates: 'Las fechas se superponen con otro año académico.',
    };

    for (const field of Object.keys(errorMap)) {
      if (errors[field]?.length) {
        const raw: string = errors[field][0].toLowerCase();
        if (raw.includes('overlap') || raw.includes('superpone')) {
          return errorMap['dates'];
        }
        return errorMap[field];
      }
    }

    const firstError = Object.values(errors).flat()[0] as string;
    return firstError || 'Hubo un error inesperado. Intente nuevamente.';
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  loadYears(): void {
    this.loading = true;
    this.academicService.getAcademicYears().subscribe({
      next: (res) => {
        this.academicYears = res.data ?? res;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  openModal(year?: AcademicYear): void {
    this.isEditing = !!year;
    this.currentEditId = year?.id ?? null;

    if (year) {
      this.yearForm.patchValue({
        // BUG FIX: forzar Number() para que Validators.min/max comparen
        // número vs número. Si llegara como string "2024", min/max fallaría.
        year: Number(year.year),
        start_date: this.toInputDate(year.start_date),
        end_date: this.toInputDate(year.end_date),
        // BUG FIX: normalizar a boolean estricto. Laravel puede devolver
        // is_active como 1/0 (integer) en lugar de true/false. El checkbox
        // formControlName solo reacciona a boolean real.
        is_active: Boolean(year.is_active),
      });
    } else {
      this.yearForm.reset({
        year: new Date().getFullYear(),
        start_date: '',
        end_date: '',
        is_active: false,
      });
    }

    // BUG FIX: limpiar estado de validación anterior para que los campos
    // editados no aparezcan en rojo al abrir el modal.
    this.yearForm.markAsPristine();
    this.yearForm.markAsUntouched();

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;

    // BUG FIX: resetear flags de edición al cerrar, para que una apertura
    // posterior de "Nuevo Año" no herede el estado de la edición anterior.
    this.isEditing = false;
    this.currentEditId = null;
    this.isSubmitting = false;
  }

  saveYear(): void {
    if (this.yearForm.invalid) {
      this.yearForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const data = {
      year: Number(this.yearForm.value.year),
      start_date: this.yearForm.value.start_date,
      end_date: this.yearForm.value.end_date,
      is_active: this.yearForm.value.is_active,
    };

    // BUG FIX: capturar isUpdate antes del subscribe para que el valor
    // no cambie si closeModal() lo resetea antes de que dispare el Swal.
    const isUpdate = this.isEditing && !!this.currentEditId;

    const request$ = isUpdate
      ? this.academicService.updateAcademicYear(this.currentEditId!, data)
      : this.academicService.createAcademicYear(data);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;

        // BUG FIX: cerrar modal y recargar DESPUÉS del Swal para que el
        // toast no sea interrumpido por la re-renderización de la lista.
        this.closeModal();
        this.loadYears();

        Swal.fire({
          icon: 'success',
          title: isUpdate ? 'Año actualizado' : 'Año creado',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false,
        });
      },

      error: (err) => {
        this.isSubmitting = false;

        Swal.fire({
          icon: 'error',
          title: 'No se pudo guardar',
          text: this.resolveErrorMessage(err),
        });
      },
    });
  }

  deleteYear(id: string): void {
    Swal.fire({
      title: '¿Eliminar año académico?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.academicService.deleteAcademicYear(id).subscribe({
        next: () => {
          // BUG FIX: eliminar localmente en vez de recargar toda la lista,
          // así la UI responde de inmediato sin una petición extra.
          this.academicYears = this.academicYears.filter(y => y.id !== id);

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
          Swal.fire('Error', err.error?.message || 'No se pudo eliminar', 'error');
        }
      });
    });
  }
}
