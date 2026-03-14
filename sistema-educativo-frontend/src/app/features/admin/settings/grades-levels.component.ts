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
      </div>

      <!-- Modal Creation/Edit -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 animate-slide-up overflow-hidden border border-slate-100">
          <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 class="text-xl font-bold text-slate-800 tracking-tight">{{ isEditing ? 'Editar Grado' : 'Nuevo Grado' }}</h2>
            <button (click)="closeModal()" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form [formGroup]="gradeForm" (ngSubmit)="saveGrade()" class="p-8 space-y-5">
            
            <div class="space-y-1.5 focus-within:text-blue-600">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nivel Educativo</label>
              <select formControlName="level" class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-blue-500">
                <option value="inicial">Inicial</option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
              </select>
            </div>

            <div class="space-y-1.5 focus-within:text-blue-600">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors">Nombre del Grado (Ej: 1ro de Primaria)</label>
              <input type="text" formControlName="name" class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:border-blue-500" placeholder="Ej: 1ro Secundaria">
            </div>

            <div class="space-y-1.5 focus-within:text-blue-600">
              <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors">Orden Numérico (Nivel)</label>
              <input type="number" formControlName="grade" class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:border-blue-500" placeholder="Ej: 1">
            </div>

            <div class="pt-6 flex gap-3">
              <button type="button" (click)="closeModal()" class="flex-1 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95">
                Cancelar
              </button>
              <button type="submit" [disabled]="gradeForm.invalid || isSubmitting" class="flex-1 px-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
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
  groupedGrades: { level: string, grades: any[] }[] = [];
  
  loading = false;
  showModal = false;
  isEditing = false;
  isSubmitting = false;
  currentEditId: string | null = null;
  gradeForm: FormGroup;

  orderMap: any = { 'inicial': 1, 'primaria': 2, 'secundaria': 3 };

  constructor(
    private fb: FormBuilder,
    private academicService: AcademicService
  ) {
    this.gradeForm = this.fb.group({
      level: ['primaria', Validators.required],
      name: ['', Validators.required],
      grade: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  countLevel(lvl: string) {
    return this.grades.filter(g => g.level === lvl).length;
  }

  loadData() {
    this.loading = true;
    this.academicService.getGradeLevels().subscribe({
      next: (res) => {
        this.grades = res.data || res;
        this.groupGrades();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  groupGrades() {
    const groups: { [key: string]: any[] } = {};
    
    this.grades.forEach(g => {
      const lvl = g.level;
      if (!groups[lvl]) groups[lvl] = [];
      groups[lvl].push(g);
    });

    this.groupedGrades = Object.keys(groups).map(key => ({
      level: key,
      grades: groups[key].sort((a, b) => a.grade - b.grade)
    })).sort((a, b) => (this.orderMap[a.level] || 99) - (this.orderMap[b.level] || 99)); 
  }

  openModal(grade?: any) {
    this.isEditing = !!grade;
    if (grade) {
      this.currentEditId = grade.id;
      this.gradeForm.patchValue(grade);
    } else {
      this.currentEditId = null;
      this.gradeForm.reset({ level: 'primaria', name: '', grade: 1 });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveGrade() {
    if (this.gradeForm.invalid) return;
    this.isSubmitting = true;
    const data = this.gradeForm.value;

    const req$ = this.isEditing && this.currentEditId
      ? this.academicService.updateGradeLevel(this.currentEditId, data)
      : this.academicService.createGradeLevel(data);

    req$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Grado guardado',
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

  deleteGrade(id: string) {
    Swal.fire({
      title: '¿Eliminar grado?',
      text: "Se podrían eliminar secciones dependientes.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.academicService.deleteGradeLevel(id).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Eliminado', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
            this.loadData();
          },
          error: (err) => Swal.fire('Error', err.error?.message || 'No se pudo eliminar, verifica dependencias', 'error')
        });
      }
    });
  }
}

