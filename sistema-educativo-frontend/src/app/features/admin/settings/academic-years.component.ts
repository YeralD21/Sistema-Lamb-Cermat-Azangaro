import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { AcademicService, AcademicYear } from '@core/services/academic.service';
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
            <div class="space-y-1.5 focus-within:text-blue-600">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors">Año (ej. 2024)</label>
              <div class="relative group">
                <input 
                  type="number" 
                  formControlName="year"
                  class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white hover:border-slate-300"
                  placeholder="Ej: 2024">
              </div>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" formControlName="is_active" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 cursor-pointer"></div>
              </label>
              <span class="text-sm font-bold text-slate-700">Estado Activo</span>
            </div>

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
      year: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
      is_active: [false]
    });
  }

  get activeYear() {
    return this.academicYears.find(y => y.is_active);
  }

  ngOnInit() {
    this.loadYears();
  }

  loadYears() {
    this.loading = true;
    this.academicService.getAcademicYears().subscribe({
      next: (res) => {
        this.academicYears = res.data || res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openModal(year?: AcademicYear) {
    this.isEditing = !!year;
    if (year) {
      this.currentEditId = year.id;
      this.yearForm.patchValue({
        year: year.year,
        is_active: year.is_active
      });
    } else {
      this.currentEditId = null;
      this.yearForm.reset({ year: new Date().getFullYear(), is_active: false });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveYear() {
    if (this.yearForm.invalid) return;
    this.isSubmitting = true;
    const data = this.yearForm.value;

    const req$ = this.isEditing && this.currentEditId
      ? this.academicService.updateAcademicYear(this.currentEditId, data)
      : this.academicService.createAcademicYear(data);

    req$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Guardado correctamente',
          toast: true,
          position: 'top-end',
          timer: 3000,
          showConfirmButton: false
        });
        this.loadYears();
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = err.error?.message || 'Hubo un error al guardar';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  deleteYear(id: string) {
    Swal.fire({
      title: '¿Eliminar año académico?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.academicService.deleteAcademicYear(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              toast: true,
              position: 'top-end',
              timer: 3000,
              showConfirmButton: false
            });
            this.loadYears();
          },
          error: (err) => {
             Swal.fire('Error', err.error?.message || 'No se pudo eliminar', 'error');
          }
        });
      }
    });
  }
}

