import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { AcademicService, Section, GradeLevel } from '@core/services/academic.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700 relative">
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Secciones</h1>
          <p class="text-slate-500 text-sm font-medium">Gestiona las secciones por grado académico</p>
        </div>
        <button 
          (click)="openModal()"
          class="px-6 py-3 bg-gradient-to-r from-[#0E3A8A] to-[#C026D3] hover:opacity-90 text-white text-sm font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva Sección
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all hover:border-blue-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Secciones</span>
          <span class="text-3xl font-black text-[#0F172A]">{{ totalSections }}</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all hover:border-slate-200">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Aforo Total</span>
          <span class="text-3xl font-black text-[#0F172A]">{{ totalCapacity }}</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all hover:border-green-100 border-l-4 border-l-green-500">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Vacantes Dispo.</span>
          <span class="text-3xl font-black text-green-600">--</span>
        </div>
        <div class="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-1 group transition-all hover:border-blue-100">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-1">Prom. Aforo/Secc</span>
          <span class="text-3xl font-black text-[#0E3A8A]">{{ avgCapacity | number:'1.0-1' }}</span>
        </div>
      </div>

      <!-- Filter Pill -->
      <div class="bg-white border border-slate-100/50 rounded-[2rem] p-4 shadow-sm flex items-center gap-4 px-6 md:max-w-md mx-auto">
        <div class="text-slate-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
        </div>
        <select 
          [ngModel]="selectedGradeFilter" 
          (ngModelChange)="filterByGrade($event)"
          class="flex-1 bg-transparent border-none text-[10px] font-black text-[#0F172A] uppercase tracking-[0.15em] focus:ring-0 cursor-pointer appearance-none italic">
          <option value="">Todos los grados</option>
          <option *ngFor="let g of gradeLevels" [value]="g.id">{{ g.name }} ({{ g.level }})</option>
        </select>
        <div class="text-slate-400">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center p-12">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
      </div>

      <!-- Grade Sections -->
      <div *ngIf="!loading" class="space-y-6">
        <div *ngFor="let gradeGroup of filteredGroupedSections" class="space-y-6">
          <h2 class="text-xl font-bold text-[#0F172A] flex items-center gap-3 border-l-[3px] border-blue-600 pl-4 tracking-tight uppercase leading-none italic">
            {{ gradeGroup.gradeName }} <span class="text-sm text-slate-400 no-italic ml-2 font-medium">({{gradeGroup.level}})</span>
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let section of gradeGroup.sections" class="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between relative overflow-hidden">
              
              <div class="space-y-6 relative z-10 w-full">
                <div class="flex items-center gap-5">
                  <div class="w-16 h-16 bg-gradient-to-br from-[#0E3A8A] to-[#1D4ED8] rounded-[1.25rem] flex items-center justify-center shadow-lg group-hover:rotate-6 transition-all shrink-0">
                    <span class="text-3xl font-black text-white italic tracking-tighter">{{ section.name }}</span>
                  </div>
                  <div class="overflow-hidden">
                    <h3 class="text-xl font-black text-[#0F172A] tracking-tighter uppercase italic truncate">Sección "{{ section.name }}"</h3>
                    <div class="flex gap-2 mt-1 flex-wrap">
                      <span class="px-2.5 py-1 bg-blue-50 text-[#0E3A8A] rounded-lg text-[8px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">Aforo: {{ section.capacity }}</span>
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                   <div class="flex justify-between items-end mb-1">
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Aforo / Vacantes</span>
                      <span class="text-xs font-black text-[#0F172A] italic leading-none">-- / {{ section.capacity }}</span>
                   </div>
                   <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full bg-slate-200 transition-all w-full"></div>
                   </div>
                </div>
              </div>

              <div class="mt-10 pt-6 border-t border-slate-50 flex gap-2 relative z-10">
                <button (click)="openModal(section)" class="flex-1 py-3.5 bg-white text-[#0E3A8A] border-2 border-slate-100 hover:border-[#0E3A8A] text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 px-2">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Editar
                </button>
                <button (click)="deleteSection(section.id)" class="px-4 py-3.5 bg-red-50 text-red-600 border-2 border-transparent hover:bg-red-600 hover:text-white rounded-2xl transition-all active:scale-95 flex items-center justify-center">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>

              <div class="absolute -right-10 -bottom-10 w-32 h-32 bg-slate-50 rounded-full blur-3xl group-hover:bg-blue-50 transition-colors pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Creation/Edit -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 animate-slide-up overflow-hidden border border-slate-100">
          <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 class="text-xl font-bold text-slate-800 tracking-tight">{{ isEditing ? 'Editar Sección' : 'Nueva Sección' }}</h2>
            <button (click)="closeModal()" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form [formGroup]="sectionForm" (ngSubmit)="saveSection()" class="p-8 space-y-5">
            
            <div class="space-y-1.5 focus-within:text-blue-600">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Grado Académico</label>
              <select formControlName="grade_level_id" class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-blue-500">
                <option value="">Selecciona un Grado...</option>
                <option *ngFor="let g of gradeLevels" [value]="g.id">{{ g.name }} ({{ g.level }})</option>
              </select>
            </div>

            <div class="space-y-1.5 focus-within:text-blue-600">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors">Letra de la Sección</label>
              <input type="text" formControlName="name" class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:border-blue-500 uppercase" placeholder="Ej: A, B, C" maxlength="5">
            </div>

            <div class="space-y-1.5 focus-within:text-blue-600">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors">Aforo Máximo (Capacidad)</label>
              <input type="number" formControlName="capacity" class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:border-blue-500" placeholder="Ej: 30">
            </div>

            <div class="pt-6 flex gap-3">
              <button type="button" (click)="closeModal()" class="flex-1 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95">
                Cancelar
              </button>
              <button type="submit" [disabled]="sectionForm.invalid || isSubmitting" class="flex-1 px-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                <span *ngIf="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ isEditing ? 'Guardar Cambios' : 'Registrar Sección' }}
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
export class SectionsComponent implements OnInit {
  sections: Section[] = [];
  gradeLevels: GradeLevel[] = [];
  groupedSections: { gradeId: string, gradeName: string, level: string, sections: Section[] }[] = [];
  filteredGroupedSections: any[] = [];
  
  loading = false;
  showModal = false;
  isEditing = false;
  isSubmitting = false;
  currentEditId: string | null = null;
  sectionForm: FormGroup;
  selectedGradeFilter: string = '';

  constructor(
    private fb: FormBuilder,
    private academicService: AcademicService
  ) {
    this.sectionForm = this.fb.group({
      grade_level_id: ['', Validators.required],
      name: ['', Validators.required],
      capacity: [30, [Validators.required, Validators.min(1)]]
    });
  }

  get totalSections() { return this.sections.length; }
  get totalCapacity() { return this.sections.reduce((sum, s) => sum + s.capacity, 0); }
  get avgCapacity() { return this.totalSections === 0 ? 0 : this.totalCapacity / this.totalSections; }

  ngOnInit() {
    this.loadData();
  }

  filterByGrade(val: string) {
    this.selectedGradeFilter = val;
    if (!val) {
      this.filteredGroupedSections = [...this.groupedSections];
    } else {
      this.filteredGroupedSections = this.groupedSections.filter(g => g.gradeId === val);
    }
  }

  loadData() {
    this.loading = true;
    this.academicService.getGradeLevels().subscribe((resG) => {
      this.gradeLevels = resG.data || resG;
      
      this.academicService.getSections().subscribe({
        next: (resS) => {
          this.sections = resS.data || resS;
          this.groupSections();
          this.filterByGrade(this.selectedGradeFilter);
          this.loading = false;
        },
        error: () => this.loading = false
      });
    });
  }

  groupSections() {
    const groups: { [key: string]: { gradeId: string, gradeName: string, level: string, sections: Section[] } } = {};
    
    this.gradeLevels.forEach(gl => {
      groups[gl.id] = { gradeId: gl.id, gradeName: gl.name, level: gl.level, sections: [] };
    });

    this.sections.forEach(sec => {
      if (groups[sec.grade_level_id]) {
        groups[sec.grade_level_id].sections.push(sec);
      }
    });

    // Remove empty groups and sort based on grade
    this.groupedSections = Object.values(groups)
      .filter(g => g.sections.length > 0)
      .map(g => {
        g.sections.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        return g;
      });
  }

  openModal(section?: Section) {
    this.isEditing = !!section;
    if (section) {
      this.currentEditId = section.id;
      this.sectionForm.patchValue(section);
    } else {
      this.currentEditId = null;
      this.sectionForm.reset({ grade_level_id: this.selectedGradeFilter || '', name: '', capacity: 30 });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveSection() {
    if (this.sectionForm.invalid) return;
    this.isSubmitting = true;
    const data = this.sectionForm.value;
    data.name = data.name.toUpperCase();

    const req$ = this.isEditing && this.currentEditId
      ? this.academicService.updateSection(this.currentEditId, data)
      : this.academicService.createSection(data);

    req$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Sección guardada',
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

  deleteSection(id: string) {
    Swal.fire({
      title: '¿Eliminar sección?',
      text: "Se eliminaría de manera irreversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.academicService.deleteSection(id).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Eliminada', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
            this.loadData();
          },
          error: (err) => Swal.fire('Error', err.error?.message || 'No se pudo eliminar, revisa las dependencias (ej. matrículas)', 'error')
        });
      }
    });
  }
}
