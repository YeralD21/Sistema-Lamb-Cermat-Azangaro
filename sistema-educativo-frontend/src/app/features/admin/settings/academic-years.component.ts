import { AcademicService } from '@core/services/academic.service';
import { AcademicYear } from '@core/models/AcademicYear';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { SettingMetricCardComponent } from '@shared/components/setting-metric-card/setting-metric-card.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-academic-years',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButtonComponent, SettingMetricCardComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700 relative">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
        <div class="flex items-center gap-4">
          <app-back-button></app-back-button>
          <div class="space-y-1">
            <h1 class="text-2xl sm:text-3xl font-medium text-[#0F172A] tracking-tight">Años Académicos</h1>
            <p class="text-slate-500 text-sm font-normal">Gestiona los años lectivos de la institución</p>
          </div>
        </div>
        <button
          (click)="openModal()"
          class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-medium rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Registrar Año
        </button>
      </div>

      <!-- Stats -->
      <!-- Stats -->
      <div class="flex flex-wrap gap-3 mt-2 mb-6">
        <app-setting-metric-card label="Total Años" [value]="academicYears.length"></app-setting-metric-card>
        <app-setting-metric-card label="Año Activo" [value]="activeYear ? activeYear.year : 'Ninguno'"></app-setting-metric-card>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="flex justify-center p-12">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Cards -->
      <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let year of academicYears"
          class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden">

          <div class="absolute -right-10 -top-10 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-blue-50 transition-colors"></div>

          <div class="flex items-start justify-between relative z-10 w-full">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-gradient-to-br from-[#0E3A8A] to-[#1D4ED8] rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border border-blue-200">
                <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div class="space-y-1">
                <h3 class="text-2xl font-medium text-[#0F172A] tracking-tight">{{ year.year }}</h3>
                <div class="text-xs text-slate-500 font-normal">
                  {{ year.start_date | date:'dd/MM/yyyy' }} — {{ year.end_date | date:'dd/MM/yyyy' }}
                </div>
                <span *ngIf="year.is_active"
                  class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-medium bg-green-50 text-green-600 border border-green-100 uppercase tracking-widest mt-0.5">
                  Activo
                </span>
                <span *ngIf="!year.is_active"
                  class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-widest mt-0.5">
                  Inactivo
                </span>
              </div>
            </div>

            <div class="flex-shrink-0 flex gap-2 pt-1 border border-slate-100 rounded-xl p-1 bg-slate-50/50">
              <button (click)="openModal(year)"
                class="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-white shadow-sm"
                title="Editar">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button (click)="deleteYear(year.id)"
                class="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-white shadow-sm"
                title="Eliminar">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="academicYears.length === 0"
          class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
          <svg class="w-16 h-16 mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <p class="text-sm font-semibold">No hay años académicos registrados</p>
          <p class="text-xs mt-1">Haz clic en "Registrar Año" para comenzar</p>
        </div>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 animate-slide-up overflow-hidden border border-slate-100">

          <!-- Modal header -->
          <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 class="text-xl font-bold text-slate-800 tracking-tight">
                {{ isEditing ? 'Editar Año Académico' : 'Nuevo Año Académico' }}
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                {{ isEditing ? 'Modifica los datos del año seleccionado' : 'Completa los datos para registrar un nuevo año' }}
              </p>
            </div>
            <button (click)="closeModal()"
              class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form [formGroup]="yearForm" (ngSubmit)="saveYear()" class="p-8 space-y-5">

            <!-- Año -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Año
              </label>
              <input
                type="number"
                formControlName="year"
                placeholder="Ej: 2025"
                class="w-full bg-slate-50 border text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-slate-300"
                [ngClass]="isFieldInvalid('year') ? 'border-red-400 bg-red-50' : 'border-slate-200'">
              <p *ngIf="isFieldInvalid('year')" class="text-[11px] text-red-500 font-semibold">
                Ingrese un año válido entre 1900 y 2100.
              </p>
            </div>

            <!-- Fechas en fila -->
            <div class="grid grid-cols-2 gap-4">

              <!-- Fecha inicio -->
              <div class="space-y-1.5">
                <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Fecha inicio
                </label>
                <input
                  type="date"
                  formControlName="start_date"
                  class="w-full bg-slate-50 border text-slate-800 rounded-xl px-3 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-slate-300"
                  [ngClass]="isFieldInvalid('start_date') ? 'border-red-400 bg-red-50' : 'border-slate-200'">
                <p *ngIf="isFieldInvalid('start_date')" class="text-[11px] text-red-500 font-semibold">
                  Requerida.
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
                  class="w-full bg-slate-50 border text-slate-800 rounded-xl px-3 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-slate-300"
                  [ngClass]="isFieldInvalid('end_date') ? 'border-red-400 bg-red-50' : 'border-slate-200'">
                <p *ngIf="isFieldInvalid('end_date')" class="text-[11px] text-red-500 font-semibold">
                  Requerida.
                </p>
              </div>

            </div>

            <!-- Estado activo -->
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p class="text-sm font-bold text-slate-700">Estado Activo</p>
                <p class="text-xs text-slate-400 mt-0.5">Solo puede haber un año activo a la vez</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" formControlName="is_active" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-200 rounded-full peer
                            peer-checked:after:translate-x-full peer-checked:after:border-white
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                            after:bg-white after:border-slate-300 after:border after:rounded-full
                            after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
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
                [disabled]="yearForm.invalid || isSubmitting"
                class="flex-1 px-4 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2">
                <span *ngIf="isSubmitting"
                  class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin">
                </span>
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
    .animate-fade-in  { animation: fadeIn  0.4s ease-out; }
    .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
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
      year: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
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

  // ─── HELPERS ──────────────────────────────────────────────────────────────

  /**
   * Normaliza cualquier formato de fecha del backend a "YYYY-MM-DD",
   * único formato válido para <input type="date">.
   *
   * Casos que maneja:
   *  "2024-03-15"            → "2024-03-15"   ya correcto
   *  "2024-03-15T00:00:00Z"  → "2024-03-15"   ISO con hora
   *  "15/03/2024"            → "2024-03-15"   formato d/m/Y de Laravel
   */
  private toInputDate(value: string | null | undefined): string {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    if (value.includes('T')) return value.split('T')[0];
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [day, month, year] = value.split('/');
      return `${year}-${month}-${day}`;
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
  }

  /** true si el campo fue tocado/enviado y tiene errores → muestra borde rojo */
  isFieldInvalid(field: string): boolean {
    const ctrl = this.yearForm.get(field);
    return !!(ctrl?.invalid && (ctrl.dirty || ctrl.touched));
  }

  /**
   * Traduce los errores de validación de Laravel al español.
   * El backend ya devuelve mensajes en español (messages()) pero
   * este método actúa como capa de seguridad extra.
   */
  private resolveErrorMessage(err: any): string {
    const errors = err?.error?.errors;

    if (!errors) {
      return err?.error?.message || 'Hubo un error inesperado. Intente nuevamente.';
    }

    const errorMap: Record<string, string> = {
      year: 'Ese año académico ya existe.',
      start_date: 'Debe ingresar la fecha de inicio.',
      end_date: 'Debe ingresar la fecha de fin.',
    };

    for (const field of Object.keys(errorMap)) {
      if (errors[field]?.length) {
        const raw: string = errors[field][0].toLowerCase();
        if (raw.includes('overlap') || raw.includes('superpone')) {
          return 'Las fechas se superponen con otro año académico.';
        }
        // Usa el mensaje que ya viene en español desde el backend
        return errors[field][0];
      }
    }

    const firstError = (Object.values(errors).flat()[0] as string);
    return firstError || 'Hubo un error inesperado. Intente nuevamente.';
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  loadYears(): void {
    this.loading = true;
    this.academicService.getAcademicYears({ per_page: 100 }).subscribe({
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
        year: year.year,
        start_date: this.toInputDate(year.start_date),  // ← normaliza la fecha
        end_date: this.toInputDate(year.end_date),    // ← normaliza la fecha
        is_active: year.is_active ?? false,
      });
    } else {
      this.yearForm.reset({
        year: new Date().getFullYear(),
        start_date: '',
        end_date: '',
        is_active: false,
      });
    }

    // Limpia estado de validación para que no aparezcan errores al abrir
    this.yearForm.markAsPristine();
    this.yearForm.markAsUntouched();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
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

    // Se captura antes del subscribe para que closeModal() no lo altere
    const isUpdate = this.isEditing && !!this.currentEditId;

    const request$ = isUpdate
      ? this.academicService.updateAcademicYear(this.currentEditId!, data)
      : this.academicService.createAcademicYear(data);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
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
          // Elimina localmente sin hacer una petición GET extra
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