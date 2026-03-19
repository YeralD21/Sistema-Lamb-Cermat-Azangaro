import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { Period } from '@core/services/academic.service';
import { AcademicService } from '@core/services/academic.service';
import { AcademicYear } from '@core/models/AcademicYear';
import { SettingMetricCardComponent } from '@shared/components/setting-metric-card/setting-metric-card.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-periods',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButtonComponent, SettingMetricCardComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700 relative">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
        <div class="flex items-center gap-4">
          <app-back-button></app-back-button>
          <div class="space-y-1">
            <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Periodos Académicos</h1>
            <p class="text-slate-500 text-sm font-medium">Gestiona los periodos (bimestres/trimestres) por año lectivo</p>
          </div>
        </div>
        <button 
          (click)="openModal()"
          class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Registrar Periodo
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="flex flex-wrap gap-3 mt-2">
        <app-setting-metric-card label="Total Periodos" [value]="totalPeriods"></app-setting-metric-card>
        <app-setting-metric-card label="Per. Abiertos" [value]="openPeriods"></app-setting-metric-card>
        <app-setting-metric-card label="Cerrados" [value]="closedPeriods"></app-setting-metric-card>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center p-12">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
      </div>

      <!-- Year Sections -->
      <div *ngIf="!loading" class="space-y-6">
        <div *ngFor="let yearGroup of groupedPeriods" class="space-y-6">
          <h2 class="text-xl font-semibold text-[#0F172A] flex items-center gap-3 border-l-[3px] border-blue-600 pl-4 tracking-tight uppercase leading-none">
            Año Lectivo {{ yearGroup.year }}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div *ngFor="let period of yearGroup.periods" class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden">
              
              <!-- Card Header -->
              <div class="flex items-start justify-between relative z-10 w-full mb-2">
                <div class="space-y-3 w-full">
                  <div class="flex items-center gap-4">
                    <div [ngClass]="period.is_closed ? 'from-slate-400 to-slate-500' : 'from-[#0E3A8A] to-[#1D4ED8]'" class="w-14 h-14 bg-gradient-to-br rounded-[1rem] flex items-center justify-center shadow-md group-hover:rotate-3 transition-all shrink-0">
                      <span class="text-2xl font-bold text-white leading-none">{{ period.period_number }}</span>
                    </div>
                    <div class="flex flex-col overflow-hidden">
                      <h3 class="text-lg font-bold text-[#0F172A] tracking-wide uppercase truncate">{{ period.name }}</h3>
                      <div class="mt-1">
                        <span *ngIf="period.is_closed" class="inline-flex items-center text-[10px] font-bold text-red-600 uppercase tracking-widest mt-0.5">Cerrado</span>
                        <span *ngIf="!period.is_closed" class="inline-flex items-center text-[10px] font-bold text-green-600 uppercase tracking-widest mt-0.5">Abierto</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Body -->
              <div class="mt-4 space-y-4 relative z-10 w-full">
                <div class="bg-slate-50/50 p-4 rounded-2xl border border-slate-50 space-y-3 group-hover:bg-blue-50/50 transition-colors">
                   <div class="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <span>Inicio</span>
                      <span>Fin</span>
                   </div>
                   <div class="flex justify-between items-center text-xs font-bold text-[#0F172A] tracking-tighter">
                      <span>{{ period.start_date | date:'dd/MM/yyyy' }}</span>
                      <svg class="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                      <span>{{ period.end_date | date:'dd/MM/yyyy' }}</span>
                   </div>
                </div>

                <div class="flex gap-2">
                  <button (click)="openModal(period)" class="flex-1 py-3 bg-white text-[#0E3A8A] border-2 border-slate-100 hover:border-[#0E3A8A] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1.5 px-2">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Editar
                  </button>
                  <button (click)="deletePeriod(period.id)" class="px-3 py-3 bg-red-50 text-red-600 border-2 border-transparent hover:bg-red-600 hover:text-white rounded-xl transition-all active:scale-95 flex items-center justify-center">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>

              <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-slate-50 rounded-full blur-2xl group-hover:bg-blue-50 transition-colors pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Creation/Edit -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg relative z-10 animate-slide-up overflow-hidden border border-slate-100">
          <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 class="text-xl font-bold text-slate-800 tracking-tight">{{ isEditing ? 'Editar Periodo' : 'Nuevo Periodo' }}</h2>
            <button (click)="closeModal()" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form [formGroup]="periodForm" (ngSubmit)="savePeriod()" class="p-8 space-y-5">
            
             <div class="space-y-1.5">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Año Académico</label>
              <select formControlName="academic_year_id" class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-blue-500">
                <option value="">Seleccione un Año</option>
                <option *ngFor="let year of academicYears" [value]="year.id">{{ year.year }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5 focus-within:text-blue-600">
                <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors">Nombre</label>
                <input type="text" formControlName="name" class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:border-blue-500" placeholder="Ej: Bimestre I">
              </div>

              <div class="space-y-1.5 focus-within:text-blue-600">
                <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors">Número de Periodo</label>
                <input type="number" formControlName="period_number" class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:border-blue-500" placeholder="Ej: 1">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5 focus-within:text-blue-600">
                <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors">Fecha de Inicio</label>
                <input type="date" formControlName="start_date" class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:border-blue-500">
              </div>

              <div class="space-y-1.5 focus-within:text-blue-600">
                <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors">Fecha de Fin</label>
                <input type="date" formControlName="end_date" class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:border-blue-500">
              </div>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" formControlName="is_closed" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 cursor-pointer"></div>
              </label>
              <span class="text-sm font-bold text-slate-700">Periodo Cerrado (No admite modificaciones)</span>
            </div>

            <div class="pt-6 flex gap-3">
              <button type="button" (click)="closeModal()" class="flex-1 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95">
                Cancelar
              </button>
              <button type="submit" [disabled]="periodForm.invalid || isSubmitting" class="flex-1 px-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                <span *ngIf="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ isEditing ? 'Guardar Cambios' : 'Registrar Periodo' }}
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
export class PeriodsComponent implements OnInit {
  periods: Period[] = [];
  academicYears: AcademicYear[] = [];
  groupedPeriods: { year: number | string, periods: Period[] }[] = [];

  loading = false;
  showModal = false;
  isEditing = false;
  isSubmitting = false;
  currentEditId: string | null = null;
  periodForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private academicService: AcademicService
  ) {
    this.periodForm = this.fb.group({
      academic_year_id: ['', Validators.required],
      name: ['', Validators.required],
      period_number: ['', [Validators.required, Validators.min(1)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      is_closed: [false]
    });
  }

  get totalPeriods() { return this.periods.length; }
  get openPeriods() { return this.periods.filter(p => !p.is_closed).length; }
  get closedPeriods() { return this.periods.filter(p => p.is_closed).length; }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    // Cargar periodos y años para el select
    this.academicService.getAcademicYears().subscribe((resY) => {
      this.academicYears = resY.data || resY;

      this.academicService.getPeriods().subscribe({
        next: (resP) => {
          const fetchedPeriods = resP.data || resP;
          this.periods = fetchedPeriods;
          this.groupPeriods();
          this.loading = false;
        },
        error: () => this.loading = false
      });
    });
  }

  groupPeriods() {
    const groups: { [key: string]: Period[] } = {};

    this.periods.forEach(period => {
      // Find year name
      const yearObj = this.academicYears.find(y => y.id === period.academic_year_id);
      const yearName = yearObj ? yearObj.year : 'Desconocido';

      if (!groups[yearName]) groups[yearName] = [];
      groups[yearName].push(period);
    });

    this.groupedPeriods = Object.keys(groups).map(key => ({
      year: key,
      periods: groups[key].sort((a, b) => a.period_number - b.period_number)
    })).sort((a, b) => Number(b.year) - Number(a.year)); // Sort years desc
  }

  openModal(period?: Period) {
    this.isEditing = !!period;
    if (period) {
      this.currentEditId = period.id;
      // Truncate time if exists
      const start = period.start_date.substring(0, 10);
      const end = period.end_date.substring(0, 10);

      this.periodForm.patchValue({
        ...period,
        start_date: start,
        end_date: end
      });
    } else {
      this.currentEditId = null;

      // Default to active year if possible
      const activeYear = this.academicYears.find(y => y.is_active);
      const yearId = activeYear ? activeYear.id : '';
      let nextNumber = 1;

      if (yearId) {
        const yearPeriods = this.periods.filter(p => p.academic_year_id === yearId);
        if (yearPeriods.length > 0) {
          nextNumber = Math.max(...yearPeriods.map(p => p.period_number)) + 1;
        }
      }

      this.periodForm.reset({
        academic_year_id: yearId,
        is_closed: false,
        name: `Periodo ${nextNumber}`,
        period_number: nextNumber
      });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  savePeriod() {
    if (this.periodForm.invalid) return;
    this.isSubmitting = true;
    const data = this.periodForm.value;

    const req$ = this.isEditing && this.currentEditId
      ? this.academicService.updatePeriod(this.currentEditId, data)
      : this.academicService.createPeriod(data);

    req$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Periodo guardado',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false
        });
        this.loadData();
      },
      error: (err) => {
        this.isSubmitting = false;
        Swal.fire('Error', err.error?.message || 'Hubo un error al guardar', 'error');
      }
    });
  }

  deletePeriod(id: string) {
    Swal.fire({
      title: '¿Eliminar periodo?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.academicService.deletePeriod(id).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Eliminado', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
            this.loadData();
          },
          error: (err) => Swal.fire('Error', err.error?.message || 'No se pudo eliminar', 'error')
        });
      }
    });
  }
}

